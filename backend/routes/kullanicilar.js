const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();

// Tum kullanicilari listele (admin)
router.get('/', adminRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, ad, email, rol, olusturma_tarihi FROM kullanicilar ORDER BY id');
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Yeni kullanici (admin)
router.post('/', adminRequired, async (req, res) => {
  const { ad, email, sifre, rol } = req.body;
  try {
    const hash = await bcrypt.hash(sifre || 'sifre123', 10);
    const [r] = await pool.query(
      'INSERT INTO kullanicilar (ad, email, sifre, rol) VALUES (?, ?, ?, ?)',
      [ad, email, hash, rol || 'musteri']
    );
    res.json({ id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ hata: 'Bu e-posta zaten kayıtlı' });
    res.status(500).json({ hata: e.message });
  }
});

// Guncelle (admin)
router.put('/:id', adminRequired, async (req, res) => {
  const { ad, email, rol } = req.body;
  try {
    await pool.query('UPDATE kullanicilar SET ad=?, email=?, rol=? WHERE id=?', [ad, email, rol, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

// Sil (admin)
router.delete('/:id', adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM kullanicilar WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
