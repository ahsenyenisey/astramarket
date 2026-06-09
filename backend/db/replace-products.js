// DummyJSON'dan gercek urunler cekip mevcut 100 urunu UPDATE eder.
// ID'ler degismedigi icin siparisler ve yorumlar bozulmaz.
// Calistirma: node db/replace-products.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// DummyJSON kategorileri -> AstraMarket kategori_id eslemesi
const KATEGORI_MAP = {
  // Elektronik (1) - 17 urun
  1: ['smartphones', 'laptops', 'tablets', 'mobile-accessories', 'mens-watches'],
  // Giyim (2) - 17 urun
  2: ['mens-shirts', 'mens-shoes', 'womens-dresses', 'womens-shoes', 'tops', 'sunglasses', 'womens-bags'],
  // Ev & Yasam (3) - 17 urun
  3: ['furniture', 'home-decoration', 'kitchen-accessories', 'groceries'],
  // Kitap (4) - 16 urun - DummyJSON'da kitap yok, mevcutta kalacak
  4: null,
  // Spor (5) - 16 urun
  5: ['sports-accessories', 'motorcycle'],
  // Kozmetik (6) - 17 urun
  6: ['beauty', 'fragrances', 'skin-care'],
};

const KAT_URUN_SAYISI = { 1: 17, 2: 17, 3: 17, 4: 16, 5: 16, 6: 17 };
const USD_TO_TL = 32; // 2026 yaklasik kur

// Kitaplar icin manuel liste (DummyJSON'da yok)
const KITAPLAR = [
  { ad: 'Suç ve Ceza', fiyat: 89, ac: 'Dostoyevski - klasik Rus romanı' },
  { ad: 'Yapay Zekaya Giriş', fiyat: 149, ac: 'Yapay zeka temel kavramları kitabı' },
  { ad: 'Sefiller', fiyat: 119, ac: 'Victor Hugo - Fransız edebiyatı klasiği' },
  { ad: '1984', fiyat: 79, ac: 'George Orwell - distopya romanı' },
  { ad: 'Sapiens', fiyat: 129, ac: 'Yuval Noah Harari - insanlığın tarihi' },
  { ad: 'Atomik Alışkanlıklar', fiyat: 99, ac: 'James Clear - kişisel gelişim' },
  { ad: 'Küçük Prens', fiyat: 49, ac: 'Antoine de Saint-Exupéry - klasik' },
  { ad: 'Tutunamayanlar', fiyat: 139, ac: 'Oğuz Atay - Türk edebiyatı' },
  { ad: 'Şeker Portakalı', fiyat: 59, ac: 'José Mauro de Vasconcelos' },
  { ad: 'Çocuk Boyama Kitabı', fiyat: 39, ac: '64 sayfa, hayvanlar serisi' },
  { ad: 'JavaScript Modern Web', fiyat: 199, ac: 'ES6+ ile modern JavaScript' },
  { ad: 'Veri Yapıları ve Algoritmalar', fiyat: 249, ac: 'Bilgisayar mühendisliği ders kitabı' },
  { ad: 'Yemek Tarifleri Kitabı', fiyat: 189, ac: 'Türk mutfağından 200 tarif' },
  { ad: 'Tarih Atlası', fiyat: 299, ac: 'Renkli haritalarla dünya tarihi' },
  { ad: 'Çocuk Masalları Seti', fiyat: 159, ac: '5 kitaplık klasik masallar seti' },
  { ad: 'Felsefe Tarihi', fiyat: 249, ac: 'Antik çağdan günümüze felsefe' },
];

// Kitap gorselleri Pixabay'den
const KITAP_GORSELLERI = [
  'https://cdn.pixabay.com/photo/2016/11/23/15/40/old-books-1853890_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/08/10/03/47/people-2616588_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/03/27/22/16/book-1284980_1280.jpg',
  'https://cdn.pixabay.com/photo/2014/05/02/21/49/home-office-336377_1280.jpg',
];

async function dummyJsonCek(slug) {
  const res = await fetch(`https://dummyjson.com/products/category/${slug}?limit=30`);
  const data = await res.json();
  return data.products || [];
}

async function main() {
  console.log('DummyJSON\'dan ürünler çekiliyor...');

  const urunHavuzu = {};
  for (const [katId, sluglar] of Object.entries(KATEGORI_MAP)) {
    if (!sluglar) continue;
    urunHavuzu[katId] = [];
    for (const slug of sluglar) {
      const liste = await dummyJsonCek(slug);
      urunHavuzu[katId].push(...liste);
    }
    console.log(`  Kategori ${katId}: ${urunHavuzu[katId].length} ürün havuzda`);
  }

  // Veritabanına bağlan
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'eticaret_db',
  });

  // Mevcut urunleri ID + kategori sirasiyla al
  const [mevcut] = await conn.query('SELECT id, kategori_id FROM urunler ORDER BY id');
  console.log(`\n${mevcut.length} mevcut ürün güncelleniyor...`);

  // Her kategoriye yeni urunler dagit
  const kategoriPointerlar = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  let guncellenen = 0;
  let kitapGuncellenen = 0;

  for (const m of mevcut) {
    const katId = m.kategori_id;
    if (!katId) continue;

    let ad, fiyat, foto, ac;

    if (katId === 4) {
      // Kitap: manuel listeden cek
      const idx = kategoriPointerlar[4]++;
      const k = KITAPLAR[idx % KITAPLAR.length];
      ad = k.ad;
      fiyat = k.fiyat;
      foto = KITAP_GORSELLERI[idx % KITAP_GORSELLERI.length];
      ac = k.ac;
      kitapGuncellenen++;
    } else {
      // Diger kategoriler: DummyJSON'dan cek
      const havuz = urunHavuzu[katId];
      if (!havuz || havuz.length === 0) continue;
      const idx = kategoriPointerlar[katId]++;
      const p = havuz[idx % havuz.length];
      ad = p.title;
      fiyat = Math.round(p.price * USD_TO_TL);
      foto = p.thumbnail || p.images?.[0];
      ac = p.description?.substring(0, 250) || '';
    }

    await conn.query(
      'UPDATE urunler SET ad=?, fiyat=?, resim_url=?, aciklama=? WHERE id=?',
      [ad, fiyat, foto, ac, m.id]
    );
    guncellenen++;
  }

  console.log(`\n✓ ${guncellenen} ürün güncellendi`);
  console.log(`  - Kitap (manuel): ${kitapGuncellenen}`);
  console.log(`  - DummyJSON: ${guncellenen - kitapGuncellenen}`);

  // Ornek kontrol
  const [ornekler] = await conn.query(
    'SELECT id, ad, fiyat, kategori_id FROM urunler WHERE id IN (1, 18, 35, 52, 68, 84) ORDER BY id'
  );
  console.log('\nÖrnek (her kategoriden 1 ürün):');
  ornekler.forEach((u) => console.log(`  #${u.id} [kat ${u.kategori_id}] ${u.ad} - ${u.fiyat} TL`));

  await conn.end();
}

main().catch((e) => { console.error('HATA:', e); process.exit(1); });
