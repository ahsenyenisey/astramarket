require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const urunlerRoutes = require('./routes/urunler');
const kategorilerRoutes = require('./routes/kategoriler');
const kullanicilarRoutes = require('./routes/kullanicilar');
const siparislerRoutes = require('./routes/siparisler');
const yorumlarRoutes = require('./routes/yorumlar');
const raporlarRoutes = require('./routes/raporlar');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/saglik', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/urunler', urunlerRoutes);
app.use('/api/kategoriler', kategorilerRoutes);
app.use('/api/kullanicilar', kullanicilarRoutes);
app.use('/api/siparisler', siparislerRoutes);
app.use('/api/yorumlar', yorumlarRoutes);
app.use('/api/raporlar', raporlarRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend ${PORT} portunda çalışıyor`));
