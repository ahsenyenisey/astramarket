const express = require('express');
const pool = require('../db/pool');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// Sepetten siparis olustur (transaction ile stok dusur)
router.post('/', authRequired, async (req, res) => {
  const { urunler } = req.body; // [{ urun_id, adet }]
  if (!Array.isArray(urunler) || !urunler.length) {
    return res.status(400).json({ hata: 'Sepet boş' });
  }
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Urunleri kilitleyerek getir, stok yeterli mi kontrol et
    const ids = urunler.map(u => u.urun_id);
    const placeholders = ids.map(() => '?').join(',');
    const [rows] = await conn.query(
      `SELECT id, ad, fiyat, stok FROM urunler WHERE id IN (${placeholders}) FOR UPDATE`,
      ids
    );
    const urunMap = new Map(rows.map(r => [r.id, r]));
    let toplam = 0;
    for (const item of urunler) {
      const u = urunMap.get(item.urun_id);
      if (!u) throw new Error(`Ürün bulunamadı: ${item.urun_id}`);
      if (u.stok < item.adet) throw new Error(`${u.ad} için yeterli stok yok`);
      toplam += Number(u.fiyat) * item.adet;
    }

    // Siparis kaydi
    const [siparisR] = await conn.query(
      'INSERT INTO siparisler (kullanici_id, toplam_tutar, durum) VALUES (?, ?, ?)',
      [req.user.id, toplam, 'hazirlaniyor']
    );
    const siparisId = siparisR.insertId;

    // Detaylar + stok guncelle
    for (const item of urunler) {
      const u = urunMap.get(item.urun_id);
      await conn.query(
        'INSERT INTO siparis_detaylari (siparis_id, urun_id, adet, birim_fiyat) VALUES (?, ?, ?, ?)',
        [siparisId, item.urun_id, item.adet, u.fiyat]
      );
      await conn.query('UPDATE urunler SET stok = stok - ? WHERE id = ?', [item.adet, item.urun_id]);
    }

    await conn.commit();
    res.json({ siparis_id: siparisId, toplam_tutar: toplam });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ hata: e.message });
  } finally {
    conn.release();
  }
});

// Kendi siparislerim
router.get('/benim', authRequired, async (req, res) => {
  try {
    const [siparisler] = await pool.query(
      'SELECT * FROM siparisler WHERE kullanici_id = ? ORDER BY tarih DESC',
      [req.user.id]
    );
    if (!siparisler.length) return res.json([]);

    const ids = siparisler.map(s => s.id);
    const placeholders = ids.map(() => '?').join(',');
    const [detaylar] = await pool.query(
      `SELECT sd.*, u.ad AS urun_ad, u.resim_url
       FROM siparis_detaylari sd
       JOIN urunler u ON u.id = sd.urun_id
       WHERE sd.siparis_id IN (${placeholders})`,
      ids
    );
    const detayMap = new Map();
    for (const d of detaylar) {
      if (!detayMap.has(d.siparis_id)) detayMap.set(d.siparis_id, []);
      detayMap.get(d.siparis_id).push(d);
    }
    res.json(siparisler.map(s => ({ ...s, detaylar: detayMap.get(s.id) || [] })));
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Admin: tum siparisler
router.get('/', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, k.ad AS musteri_ad, k.email
       FROM siparisler s JOIN kullanicilar k ON k.id = s.kullanici_id
       ORDER BY s.tarih DESC`
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
