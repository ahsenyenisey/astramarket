const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const FAKE_USERS = [
  { ad: 'Zeynep Aydın',     email: 'zeynep@mail.com' },
  { ad: 'Emre Şahin',       email: 'emre@mail.com' },
  { ad: 'Selin Kara',       email: 'selin@mail.com' },
  { ad: 'Burak Öztürk',     email: 'burak@mail.com' },
  { ad: 'Elif Doğan',       email: 'elif@mail.com' },
  { ad: 'Can Polat',        email: 'can@mail.com' },
  { ad: 'Merve Aksoy',      email: 'merve@mail.com' },
  { ad: 'Kerem Yıldız',     email: 'kerem@mail.com' },
  { ad: 'Deniz Çetin',      email: 'deniz@mail.com' },
  { ad: 'Ece Erdoğan',      email: 'ece@mail.com' },
  { ad: 'Tolga Aslan',      email: 'tolga@mail.com' },
  { ad: 'Buse Kurt',        email: 'buse@mail.com' },
  { ad: 'Murat Koç',        email: 'murat@mail.com' },
  { ad: 'İrem Şimşek',      email: 'irem@mail.com' },
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eticaret_db',
  });

  const [[{ mevcut }]] = await conn.query('SELECT COUNT(*) AS mevcut FROM kullanicilar');
  console.log(`Mevcut kullanici sayisi: ${mevcut}`);

  const hash = await bcrypt.hash('musteri123', 10);
  const rows = FAKE_USERS.map((u) => [u.ad, u.email, hash, 'musteri']);

  console.log(`${FAKE_USERS.length} fake kullanici ekleniyor...`);
  let eklenen = 0;
  for (const r of rows) {
    try {
      await conn.query(
        'INSERT INTO kullanicilar (ad, email, sifre, rol) VALUES (?, ?, ?, ?)',
        r
      );
      eklenen++;
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        console.log(`  ! ${r[1]} zaten kayitli, atlandi`);
      } else {
        throw e;
      }
    }
  }

  const [[{ toplam }]] = await conn.query('SELECT COUNT(*) AS toplam FROM kullanicilar');
  console.log(`\n+${eklenen} kullanici eklendi. Toplam: ${toplam}`);
  console.log('Sifreleri: musteri123');

  await conn.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
