const express = require('express');
const pool = require('../db/pool');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/kategori-satislari', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT k.ad AS kategori,
             COUNT(DISTINCT u.id) AS urun_sayisi,
             COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
      FROM kategoriler k
      LEFT JOIN urunler u ON u.kategori_id = k.id
      LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
      GROUP BY k.id, k.ad
      ORDER BY toplam_satis DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.get('/ortalama-uzeri-urunler', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, ad, fiyat
      FROM urunler
      WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
      ORDER BY fiyat DESC
    `);
    const [avg] = await pool.query('SELECT AVG(fiyat) AS ortalama FROM urunler');
    res.json({ ortalama: avg[0].ortalama, urunler: rows });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.get('/aktif-musteriler', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT k.id, k.ad, k.email,
             COUNT(s.id) AS siparis_sayisi,
             SUM(s.toplam_tutar) AS toplam_harcama
      FROM kullanicilar k
      JOIN siparisler s ON s.kullanici_id = k.id
      GROUP BY k.id, k.ad, k.email
      HAVING COUNT(s.id) > 3
      ORDER BY toplam_harcama DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.get('/cok-yorumlu-urunler', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.ad, u.fiyat,
             (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
             (SELECT ROUND(AVG(puan), 2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
      FROM urunler u
      WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
      ORDER BY yorum_sayisi DESC, ortalama_puan DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.get('/satilmayan-urunler', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT u.id, u.ad, u.fiyat, u.stok, k.ad AS kategori
      FROM urunler u
      LEFT JOIN kategoriler k ON k.id = u.kategori_id
      WHERE u.id NOT IN (SELECT DISTINCT urun_id FROM siparis_detaylari)
      ORDER BY u.fiyat DESC
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.get('/ozet', adminRequired, async (req, res) => {
  try {
    const [[a]] = await pool.query('SELECT COUNT(*) AS toplam_urun FROM urunler');
    const [[b]] = await pool.query('SELECT COUNT(*) AS toplam_siparis FROM siparisler');
    const [[c]] = await pool.query('SELECT COALESCE(SUM(toplam_tutar),0) AS toplam_ciro FROM siparisler');
    const [[d]] = await pool.query("SELECT COUNT(*) AS toplam_musteri FROM kullanicilar WHERE rol='musteri'");
    res.json({ ...a, ...b, ...c, ...d });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
