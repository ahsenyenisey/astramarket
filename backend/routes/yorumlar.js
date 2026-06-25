const express = require('express');
const pool = require('../db/pool');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/', authRequired, async (req, res) => {
  const { urun_id, puan, yorum_metni } = req.body;
  if (!urun_id || !puan) return res.status(400).json({ hata: 'Ürün ve puan zorunlu' });
  try {
    const [r] = await pool.query(
      'INSERT INTO yorumlar (urun_id, kullanici_id, puan, yorum_metni) VALUES (?, ?, ?, ?)',
      [urun_id, req.user.id, puan, yorum_metni || null]
    );
    res.json({ id: r.insertId });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT kullanici_id FROM yorumlar WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ hata: 'Yorum bulunamadı' });
    if (rows[0].kullanici_id !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ hata: 'Yetkiniz yok' });
    }
    await pool.query('DELETE FROM yorumlar WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
