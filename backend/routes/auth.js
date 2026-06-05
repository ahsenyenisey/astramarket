const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { ad, email, sifre } = req.body;
  if (!ad || !email || !sifre) return res.status(400).json({ hata: 'Tüm alanlar gereklidir' });
  try {
    const hash = await bcrypt.hash(sifre, 10);
    const [r] = await pool.query(
      'INSERT INTO kullanicilar (ad, email, sifre, rol) VALUES (?, ?, ?, ?)',
      [ad, email, hash, 'musteri']
    );
    const token = jwt.sign({ id: r.insertId, ad, email, rol: 'musteri' }, SECRET, { expiresIn: '7d' });
    res.json({ token, kullanici: { id: r.insertId, ad, email, rol: 'musteri' } });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ hata: 'Bu e-posta zaten kayıtlı' });
    res.status(500).json({ hata: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, sifre } = req.body;
  if (!email || !sifre) return res.status(400).json({ hata: 'E-posta ve şifre gereklidir' });
  try {
    const [rows] = await pool.query('SELECT * FROM kullanicilar WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ hata: 'Kullanıcı bulunamadı' });
    const k = rows[0];
    const ok = await bcrypt.compare(sifre, k.sifre);
    if (!ok) return res.status(401).json({ hata: 'Şifre yanlış' });
    const token = jwt.sign({ id: k.id, ad: k.ad, email: k.email, rol: k.rol }, SECRET, { expiresIn: '7d' });
    res.json({ token, kullanici: { id: k.id, ad: k.ad, email: k.email, rol: k.rol } });
  } catch (e) {
    res.status(500).json({ hata: e.message });
  }
});

module.exports = router;
