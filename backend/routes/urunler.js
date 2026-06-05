const express = require('express');
const pool = require('../db/pool');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();

// Liste (opsiyonel kategori filtresi ve arama)
router.get('/', async (req, res) => {
  const { kategoriId, q } = req.query;
  let sql = `SELECT u.*, k.ad AS kategori_ad
             FROM urunler u
             LEFT JOIN kategoriler k ON k.id = u.kategori_id`;
  const params = [];
  const where = [];
  if (kategoriId) { where.push('u.kategori_id = ?'); params.push(kategoriId); }
  if (q) { where.push('u.ad LIKE ?'); params.push(`%${q}%`); }
  if (where.length) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY u.id DESC';
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Detay (yorumlar dahil)
router.get('/:id', async (req, res) => {
  try {
    const [urunRows] = await pool.query(
      `SELECT u.*, k.ad AS kategori_ad
       FROM urunler u
       LEFT JOIN kategoriler k ON k.id = u.kategori_id
       WHERE u.id = ?`, [req.params.id]);
    if (!urunRows.length) return res.status(404).json({ hata: 'Ürün bulunamadı' });
    const [yorumRows] = await pool.query(
      `SELECT y.*, ku.ad AS kullanici_ad
       FROM yorumlar y
       JOIN kullanicilar ku ON ku.id = y.kullanici_id
       WHERE y.urun_id = ?
       ORDER BY y.tarih DESC`, [req.params.id]);
    res.json({ ...urunRows[0], yorumlar: yorumRows });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Yeni urun (admin)
router.post('/', adminRequired, async (req, res) => {
  const { ad, fiyat, stok, kategori_id, resim_url, aciklama } = req.body;
  try {
    const [r] = await pool.query(
      'INSERT INTO urunler (ad, fiyat, stok, kategori_id, resim_url, aciklama) VALUES (?, ?, ?, ?, ?, ?)',
      [ad, fiyat, stok, kategori_id || null, resim_url || null, aciklama || null]
    );
    res.json({ id: r.insertId });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Guncelle (admin)
router.put('/:id', adminRequired, async (req, res) => {
  const { ad, fiyat, stok, kategori_id, resim_url, aciklama } = req.body;
  try {
    await pool.query(
      'UPDATE urunler SET ad=?, fiyat=?, stok=?, kategori_id=?, resim_url=?, aciklama=? WHERE id=?',
      [ad, fiyat, stok, kategori_id || null, resim_url || null, aciklama || null, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Sil (admin)
router.delete('/:id', adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM urunler WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
