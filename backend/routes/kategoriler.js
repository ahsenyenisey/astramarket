const express = require('express');
const pool = require('../db/pool');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategoriler ORDER BY ad');
    res.json(rows);
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.post('/', adminRequired, async (req, res) => {
  const { ad, aciklama } = req.body;
  try {
    const [r] = await pool.query('INSERT INTO kategoriler (ad, aciklama) VALUES (?, ?)', [ad, aciklama || null]);
    res.json({ id: r.insertId });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.put('/:id', adminRequired, async (req, res) => {
  const { ad, aciklama } = req.body;
  try {
    await pool.query('UPDATE kategoriler SET ad=?, aciklama=? WHERE id=?', [ad, aciklama || null, req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

router.delete('/:id', adminRequired, async (req, res) => {
  try {
    await pool.query('DELETE FROM kategoriler WHERE id=?', [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ hata: e.message }); }
});

module.exports = router;
