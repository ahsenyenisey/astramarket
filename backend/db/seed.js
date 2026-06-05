// Veritabanini sifirdan kurar ve ornek veri ekler.
// Calistirma: npm run init-db
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ============================================================
// FOTO HAVUZU - her kategori icin Unsplash photo URL'leri.
// Urunler kendi index'lerine gore bu havuzdan rotate ile alir.
// ============================================================
const F = {
  // Elektronik
  1: [
    'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=400',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
  ],
  // Giyim
  2: [
    'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
  ],
  // Ev & Yasam
  3: [
    'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
    'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400',
    'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  ],
  // Kitap
  4: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
  ],
  // Spor
  5: [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    'https://images.unsplash.com/photo-1554290712-e640351074bd?w=400',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
  ],
  // Kozmetik
  6: [
    'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
    'https://images.unsplash.com/photo-1631214507738-32ee7b48bee1?w=400',
    'https://images.unsplash.com/photo-1583209814509-d2ff43e22ca7?w=400',
  ],
};

const foto = (kat, idx) => F[kat][idx % F[kat].length];

// ============================================================
// URUN LISTESI - 100 urun, 6 kategoriye dagitilmis
// Her satir: [ad, fiyat, stok, aciklama]
// ============================================================
const URUNLER = [
  // ELEKTRONIK (1) - 17 urun
  { k: 1, ad: 'iPhone 15 Pro', fiyat: 54999, stok: 25, ac: 'Apple iPhone 15 Pro 256 GB Titanium gri' },
  { k: 1, ad: 'Samsung Galaxy S24 Ultra', fiyat: 49999, stok: 30, ac: 'Samsung Galaxy S24 Ultra 256 GB siyah' },
  { k: 1, ad: 'MacBook Air M3 13"', fiyat: 44999, stok: 15, ac: 'Apple MacBook Air 13 inç M3 çipli, 8GB/256GB' },
  { k: 1, ad: 'Sony WH-1000XM5 Kulaklık', fiyat: 12999, stok: 50, ac: 'Kablosuz gürültü engelleyici premium kulaklık' },
  { k: 1, ad: 'Apple Watch SE', fiyat: 4499, stok: 35, ac: 'Su geçirmez akıllı saat, fitness takibi' },
  { k: 1, ad: 'JBL Flip 6 Hoparlör', fiyat: 1599, stok: 80, ac: 'Bluetooth taşınabilir hoparlör, 12 saat pil' },
  { k: 1, ad: 'iPad Air M2', fiyat: 24999, stok: 22, ac: 'Apple iPad Air 11" M2 çipli, 128GB' },
  { k: 1, ad: 'AirPods Pro 2', fiyat: 7999, stok: 60, ac: 'Aktif gürültü engelleme, MagSafe şarj' },
  { k: 1, ad: 'Dell XPS 13 Laptop', fiyat: 38999, stok: 12, ac: '13.4 inç FHD, i7 işlemci, 16GB RAM' },
  { k: 1, ad: 'Samsung 55" QLED TV', fiyat: 21999, stok: 18, ac: '4K Smart TV, HDR10+, oyun modu' },
  { k: 1, ad: 'DJI Mini 4 Pro Drone', fiyat: 32999, stok: 8, ac: '4K kamera, 34 dakika uçuş, çarpışma sensörü' },
  { k: 1, ad: 'Canon EOS R6 Mark II', fiyat: 89999, stok: 5, ac: 'Aynasız fotoğraf makinesi, 24.2 MP, 4K video' },
  { k: 1, ad: 'Logitech MX Master 3S', fiyat: 2299, stok: 90, ac: 'Ergonomik kablosuz mouse, sessiz tıklama' },
  { k: 1, ad: 'Keychron K2 Mekanik Klavye', fiyat: 3499, stok: 40, ac: '75% düzen, hot-swap, RGB aydınlatma' },
  { k: 1, ad: 'Samsung Galaxy Tab S9', fiyat: 17999, stok: 25, ac: '11" tablet, S Pen dahil, 256GB' },
  { k: 1, ad: 'Anker 20000mAh Powerbank', fiyat: 899, stok: 120, ac: 'Hızlı şarj, USB-C PD 30W, çift port' },
  { k: 1, ad: 'Xiaomi Redmi Note 13 Pro', fiyat: 8999, stok: 65, ac: '200MP kamera, 5G, 256GB depolama' },

  // GIYIM (2) - 17 urun
  { k: 2, ad: 'Erkek Polo Tişört', fiyat: 299, stok: 150, ac: 'Pamuklu erkek polo yaka tişört, lacivert' },
  { k: 2, ad: 'Kadın Trençkot', fiyat: 1499, stok: 40, ac: 'Bej rengi klasik kadın trençkot, su geçirmez' },
  { k: 2, ad: 'Erkek Slim Fit Kot Pantolon', fiyat: 599, stok: 80, ac: 'Mavi slim fit kot pantolon, esnek kumaş' },
  { k: 2, ad: 'Erkek Klasik Gömlek', fiyat: 449, stok: 100, ac: 'Beyaz, ütü gerektirmez, %100 pamuk' },
  { k: 2, ad: 'Kadın İpek Bluz', fiyat: 379, stok: 70, ac: 'V yaka, kısa kollu, beyaz' },
  { k: 2, ad: 'Kadın Yazlık Elbise', fiyat: 899, stok: 50, ac: 'Çiçekli desen, midi boy, yazlık' },
  { k: 2, ad: 'Erkek Kışlık Mont', fiyat: 2499, stok: 35, ac: 'Kapüşonlu, su geçirmez, iç astar' },
  { k: 2, ad: 'Kadın Şişme Mont', fiyat: 2799, stok: 28, ac: 'Hafif, sıcak tutan, kapüşonlu mont' },
  { k: 2, ad: 'Erkek Spor Ayakkabı', fiyat: 1899, stok: 60, ac: 'Hafif, rahat, günlük spor ayakkabı' },
  { k: 2, ad: 'Kadın Topuklu Ayakkabı', fiyat: 1299, stok: 40, ac: 'Stiletto topuklu, deri, 8cm' },
  { k: 2, ad: 'Unisex Bot', fiyat: 1799, stok: 45, ac: 'Su geçirmez, kürk astarlı kışlık bot' },
  { k: 2, ad: 'Kadın Triko Kazak', fiyat: 649, stok: 75, ac: 'Yumuşak yün karışım kazak, krem' },
  { k: 2, ad: 'Basic Beyaz Tişört', fiyat: 199, stok: 200, ac: 'Pamuk basic tişört, bisiklet yaka' },
  { k: 2, ad: 'Erkek Şort', fiyat: 299, stok: 90, ac: 'Diz boyu, pamuklu yazlık şort' },
  { k: 2, ad: 'Kadın Midi Etek', fiyat: 549, stok: 55, ac: 'A kesim, çift kat astar, siyah' },
  { k: 2, ad: 'Eşofman Takımı', fiyat: 999, stok: 65, ac: 'Pamuk-poliester karışım, gri' },
  { k: 2, ad: 'Çorap 5\'li Set', fiyat: 149, stok: 250, ac: 'Pamuklu erkek çorap 5\'li paket' },

  // EV & YASAM (3) - 17 urun
  { k: 3, ad: 'Ahşap Yemek Masası', fiyat: 4999, stok: 10, ac: '6 kişilik meşe masa, doğal kaplama' },
  { k: 3, ad: 'Çift Kişilik Yatak Örtüsü Seti', fiyat: 899, stok: 60, ac: 'Pamuklu, nevresim + 2 yastık + lastik' },
  { k: 3, ad: 'Espresso Kahve Makinesi', fiyat: 2799, stok: 30, ac: 'Otomatik öğütücülü, 15 bar basınç' },
  { k: 3, ad: '3\'lü Çekyat', fiyat: 8999, stok: 8, ac: 'Yataklı çekyat, modern tasarım, gri kumaş' },
  { k: 3, ad: 'TV Sehpası', fiyat: 1899, stok: 25, ac: '180cm genişlik, raflı, ceviz renk' },
  { k: 3, ad: 'Yatak Odası Takımı', fiyat: 24999, stok: 4, ac: 'Karyola + 2 komodin + makyaj masası' },
  { k: 3, ad: 'Çocuk Odası Set', fiyat: 12999, stok: 6, ac: 'Yatak + dolap + çalışma masası' },
  { k: 3, ad: 'Bulaşık Makinesi', fiyat: 11999, stok: 15, ac: 'Bosch 12 kişilik, A++ enerji sınıfı' },
  { k: 3, ad: 'Mikrodalga Fırın', fiyat: 2299, stok: 35, ac: '25L, ızgaralı, dijital ekran' },
  { k: 3, ad: 'Karaca Çaydanlık Seti', fiyat: 599, stok: 90, ac: 'Çelik çaydanlık, demlikli, indüksiyon uyumlu' },
  { k: 3, ad: 'Tencere Seti 10 Parça', fiyat: 1499, stok: 50, ac: 'Granit kaplama, indüksiyon uyumlu' },
  { k: 3, ad: 'Modern Halı 170x230', fiyat: 3499, stok: 20, ac: 'Akrilik, geometrik desen, gri/beyaz' },
  { k: 3, ad: 'Çift Kişilik Yatak', fiyat: 5999, stok: 18, ac: 'Yaylı yatak, ortopedik, 160x200' },
  { k: 3, ad: 'Modern Avize', fiyat: 1299, stok: 30, ac: 'LED, kristal sarkaç, 80cm çap' },
  { k: 3, ad: 'Bahçe Mobilya Seti', fiyat: 7999, stok: 12, ac: 'Rattan, masa + 4 sandalye + minder' },
  { k: 3, ad: 'Buhar Kazanı', fiyat: 999, stok: 40, ac: 'Tencere altına, 1500W, dikey' },
  { k: 3, ad: 'Dyson V11 Süpürge', fiyat: 14999, stok: 10, ac: 'Şarjlı, kablosuz, 60 dk pil ömrü' },

  // KITAP (4) - 16 urun
  { k: 4, ad: 'Suç ve Ceza', fiyat: 89, stok: 200, ac: 'Dostoyevski - klasik Rus romanı' },
  { k: 4, ad: 'Yapay Zekaya Giriş', fiyat: 149, stok: 80, ac: 'Yapay zeka temel kavramları kitabı' },
  { k: 4, ad: 'Sefiller', fiyat: 119, stok: 150, ac: 'Victor Hugo - Fransız edebiyatı klasiği' },
  { k: 4, ad: '1984', fiyat: 79, stok: 180, ac: 'George Orwell - distopya romanı' },
  { k: 4, ad: 'Sapiens', fiyat: 129, stok: 110, ac: 'Yuval Noah Harari - insanlığın tarihi' },
  { k: 4, ad: 'Atomik Alışkanlıklar', fiyat: 99, stok: 140, ac: 'James Clear - kişisel gelişim' },
  { k: 4, ad: 'Küçük Prens', fiyat: 49, stok: 250, ac: 'Antoine de Saint-Exupéry - klasik' },
  { k: 4, ad: 'Tutunamayanlar', fiyat: 139, stok: 65, ac: 'Oğuz Atay - Türk edebiyatı' },
  { k: 4, ad: 'Şeker Portakalı', fiyat: 59, stok: 130, ac: 'José Mauro de Vasconcelos' },
  { k: 4, ad: 'Çocuk Boyama Kitabı', fiyat: 39, stok: 300, ac: '64 sayfa, hayvanlar serisi' },
  { k: 4, ad: 'JavaScript Modern Web', fiyat: 199, stok: 70, ac: 'ES6+ ile modern JavaScript' },
  { k: 4, ad: 'Veri Yapıları ve Algoritmalar', fiyat: 249, stok: 50, ac: 'Bilgisayar mühendisliği ders kitabı' },
  { k: 4, ad: 'Yemek Tarifleri Kitabı', fiyat: 189, stok: 95, ac: 'Türk mutfağından 200 tarif' },
  { k: 4, ad: 'Tarih Atlası', fiyat: 299, stok: 40, ac: 'Renkli haritalarla dünya tarihi' },
  { k: 4, ad: 'Çocuk Masalları Seti', fiyat: 159, stok: 110, ac: '5 kitaplık klasik masallar seti' },
  { k: 4, ad: 'Felsefe Tarihi', fiyat: 249, stok: 55, ac: 'Antik çağdan günümüze felsefe' },

  // SPOR (5) - 16 urun
  { k: 5, ad: 'Nike Air Zoom Pegasus 40', fiyat: 1899, stok: 70, ac: 'Profesyonel koşu ayakkabısı' },
  { k: 5, ad: 'Kaymaz Yoga Matı', fiyat: 399, stok: 120, ac: 'Kalın 6mm TPE, taşıma kayışlı' },
  { k: 5, ad: 'Dambıl Seti 2x5 kg', fiyat: 599, stok: 60, ac: 'Vinil kaplama, çift dambıl' },
  { k: 5, ad: 'Spor Çantası 35L', fiyat: 449, stok: 90, ac: 'Su geçirmez, ayakkabı bölmesi' },
  { k: 5, ad: 'Direnç Lastiği Seti', fiyat: 199, stok: 200, ac: '5 farklı dirençte lastik + tutamaç' },
  { k: 5, ad: 'Pilates Topu 65cm', fiyat: 249, stok: 80, ac: 'Patlamaya dayanıklı, pompalı' },
  { k: 5, ad: 'Şehir Bisikleti', fiyat: 8999, stok: 12, ac: '28 inç, 21 vites, çamurluk + bagajlı' },
  { k: 5, ad: 'Fitness Eldiveni', fiyat: 199, stok: 150, ac: 'Yarım parmak, bilek destekli' },
  { k: 5, ad: 'Dry-Fit Spor Tişörtü', fiyat: 299, stok: 110, ac: 'Nefes alan, ter çeken kumaş' },
  { k: 5, ad: 'Spor Eşofman Altı', fiyat: 449, stok: 95, ac: 'Slim fit, esnek kumaş, cep detaylı' },
  { k: 5, ad: 'Termos Su Şişesi 1L', fiyat: 89, stok: 280, ac: 'Çelik, BPA içermez, 12 saat soğuk' },
  { k: 5, ad: 'Spor Şortu', fiyat: 199, stok: 130, ac: 'Hafif kumaş, iç astar, cepli' },
  { k: 5, ad: 'Kros Ayakkabı', fiyat: 1599, stok: 55, ac: 'Off-road koşu, çamur tutmaz taban' },
  { k: 5, ad: 'Yüzücü Şortu', fiyat: 299, stok: 70, ac: 'Çabuk kuruyan, klorürle dayanıklı' },
  { k: 5, ad: 'Wilson Tenis Raketi', fiyat: 1899, stok: 25, ac: 'Yarışma raketi, başlangıç-orta seviye' },
  { k: 5, ad: 'Mikasa Voleybol Topu', fiyat: 349, stok: 100, ac: 'Sentetik deri, kapalı saha' },

  // KOZMETIK (6) - 17 urun
  { k: 6, ad: 'Unisex Parfüm 100ml', fiyat: 1299, stok: 50, ac: 'Eau de parfum, kalıcı oryantal koku' },
  { k: 6, ad: 'Hyaluronic Nemlendirici', fiyat: 249, stok: 180, ac: '50ml, tüm cilt tipleri için' },
  { k: 6, ad: 'Vücut Şampuanı 500ml', fiyat: 89, stok: 300, ac: 'Lavanta kokulu, doğal içerikli' },
  { k: 6, ad: '2-in-1 Şampuan + Saç Kremi', fiyat: 79, stok: 250, ac: '400ml, boyalı saçlar için' },
  { k: 6, ad: 'Argan Yağlı Saç Maskesi', fiyat: 199, stok: 130, ac: '250ml, kuru ve yıpranmış saçlar' },
  { k: 6, ad: 'Komple Cilt Bakım Seti', fiyat: 899, stok: 45, ac: 'Tonik + serum + krem + temizleyici' },
  { k: 6, ad: 'Profesyonel Makyaj Seti', fiyat: 1499, stok: 30, ac: 'Far + ruj + maskara + 5 fırça' },
  { k: 6, ad: 'Mat Bitişli Ruj', fiyat: 199, stok: 220, ac: '8 saat kalıcı, kuru hissi vermez' },
  { k: 6, ad: 'Hacimli Maskara', fiyat: 149, stok: 200, ac: 'Su geçirmez, kalınlaştırıcı' },
  { k: 6, ad: '24 Renk Far Paleti', fiyat: 549, stok: 80, ac: 'Nude + parlak tonlar, yüksek pigment' },
  { k: 6, ad: 'Yüz Yıkama Jeli', fiyat: 119, stok: 240, ac: '200ml, yağlı ciltler için' },
  { k: 6, ad: 'Vücut Losyonu 400ml', fiyat: 159, stok: 190, ac: 'Shea yağı, 24 saat nemlendirme' },
  { k: 6, ad: 'Erkek Tıraş Köpüğü', fiyat: 99, stok: 280, ac: '250ml, hassas ciltlere uygun' },
  { k: 6, ad: 'Philips OneBlade Tıraş Makinesi', fiyat: 1799, stok: 35, ac: 'Şarjlı, ıslak/kuru kullanım' },
  { k: 6, ad: 'Florürlü Diş Macunu', fiyat: 49, stok: 400, ac: '100ml, beyazlatıcı formül' },
  { k: 6, ad: 'Klasik Limon Kolonyası', fiyat: 79, stok: 220, ac: '400ml, 80 derece, cam şişe' },
  { k: 6, ad: 'Saç Boyası Set', fiyat: 99, stok: 160, ac: 'Doğal koyu kahve, amonyak içermez' },
];

// Foto URL'leri ekle
URUNLER.forEach((u, i) => { u.foto = foto(u.k, i); });

// ============================================================
// SIPARISLER - kullanici_id [2..6], 1-3 urun, durum cesitli
// ============================================================
function siparisOlustur() {
  // [kullanici_id, [urun_id'leri], durum, tarih_offset_gun]
  const sablon = [
    [2, [1], 'teslim_edildi', -35],
    [2, [4], 'teslim_edildi', -30],
    [2, [20], 'teslim_edildi', -28],
    [2, [22, 23], 'kargolandi', -10],
    [2, [50, 51], 'teslim_edildi', -25],
    [2, [62], 'teslim_edildi', -22],
    [2, [17, 18, 19], 'hazirlaniyor', -2],
    [2, [85, 86], 'teslim_edildi', -18],

    [3, [2], 'teslim_edildi', -33],
    [3, [25], 'teslim_edildi', -27],
    [3, [69], 'kargolandi', -8],
    [3, [40, 41], 'teslim_edildi', -20],
    [3, [73], 'teslim_edildi', -15],
    [3, [88, 89], 'teslim_edildi', -12],

    [4, [3], 'teslim_edildi', -29],
    [4, [12], 'teslim_edildi', -19],
    [4, [37], 'teslim_edildi', -14],
    [4, [55, 56], 'kargolandi', -5],
    [4, [80], 'teslim_edildi', -11],

    [5, [37, 38], 'teslim_edildi', -24],
    [5, [70], 'teslim_edildi', -17],
    [5, [84], 'kargolandi', -6],
    [5, [10, 11], 'teslim_edildi', -16],
    [5, [95, 96], 'teslim_edildi', -9],

    [2, [99], 'teslim_edildi', -7],
    [3, [60, 61], 'teslim_edildi', -4],
    [4, [44], 'kargolandi', -3],
    [5, [76], 'teslim_edildi', -8],
    [2, [33, 34], 'teslim_edildi', -6],
    [3, [91], 'teslim_edildi', -13],
  ];
  return sablon;
}

// ============================================================
// YORUMLAR - cogu urunde 1-2 yorum, deterministik
// ============================================================
const YORUM_METINLERI = [
  { puan: 5, m: 'Harika ürün, çok memnunum!' },
  { puan: 5, m: 'Beklediğimden çok daha kaliteli, tavsiye ederim.' },
  { puan: 4, m: 'İyi ürün ama biraz pahalı.' },
  { puan: 5, m: 'Tam aradığım gibi, hızlı kargo için teşekkürler.' },
  { puan: 4, m: 'Kalitesi iyi, fiyat performans dengeli.' },
  { puan: 3, m: 'Fena değil ama daha iyisi olabilirdi.' },
  { puan: 5, m: 'Mükemmel! Herkese tavsiye ederim.' },
  { puan: 4, m: 'Beklentilerimi karşıladı, memnunum.' },
  { puan: 5, m: 'Çok kullanışlı, alın pişman olmazsınız.' },
  { puan: 5, m: 'Süper ürün, gönderim hızlı, paketleme kaliteli.' },
  { puan: 4, m: 'Genel olarak iyi ama bir iki detay eksik.' },
  { puan: 5, m: 'Yıllardır aradığım kalitede bir ürün.' },
  { puan: 3, m: 'Vasat, fiyatına göre kabul edilebilir.' },
  { puan: 5, m: 'Resimdeki gibi geldi, çok beğendim.' },
  { puan: 4, m: 'Güzel ama kargoda biraz hasarlı geldi.' },
];

function yorumOlustur() {
  const yorumlar = [];
  // urun ID 1..100 arasi her urune 0-3 yorum
  for (let urunId = 1; urunId <= 100; urunId++) {
    const sayi = (urunId * 7) % 4; // 0, 1, 2 veya 3 yorum (deterministik)
    for (let i = 0; i < sayi; i++) {
      const kullaniciId = ((urunId + i) % 4) + 2; // 2..5
      const yorumIdx = (urunId * 3 + i * 5) % YORUM_METINLERI.length;
      const y = YORUM_METINLERI[yorumIdx];
      yorumlar.push([urunId, kullaniciId, y.puan, y.m]);
    }
  }
  return yorumlar;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const dbName = process.env.DB_NAME || 'eticaret_db';

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Veritabanı siliniyor (varsa) ve yeniden oluşturuluyor...');
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await connection.query(schemaSql);
  await connection.query(`USE ${dbName}`);

  console.log('Kullanıcılar ekleniyor (bcrypt ile hashlenmiş şifreler)...');
  const adminHash = await bcrypt.hash('admin123', 10);
  const musteriHash = await bcrypt.hash('musteri123', 10);

  await connection.query(
    `INSERT INTO kullanicilar (ad, email, sifre, rol) VALUES ?`,
    [[
      ['Admin Kullanıcı', 'admin@eticaret.com', adminHash, 'admin'],
      ['Ayşe Yılmaz', 'ayse@mail.com', musteriHash, 'musteri'],
      ['Mehmet Demir', 'mehmet@mail.com', musteriHash, 'musteri'],
      ['Fatma Kaya', 'fatma@mail.com', musteriHash, 'musteri'],
      ['Ali Çelik', 'ali@mail.com', musteriHash, 'musteri'],
    ]]
  );

  console.log('Kategoriler ekleniyor...');
  await connection.query(
    `INSERT INTO kategoriler (ad, aciklama) VALUES ?`,
    [[
      ['Elektronik', 'Telefon, bilgisayar, televizyon ve diğer elektronik ürünler'],
      ['Giyim', 'Erkek, kadın ve çocuk giyim ürünleri'],
      ['Ev & Yaşam', 'Mobilya, dekorasyon, mutfak ürünleri'],
      ['Kitap', 'Roman, ders kitabı, çocuk kitapları'],
      ['Spor', 'Spor giyim, ekipman ve aksesuarlar'],
      ['Kozmetik', 'Bakım, makyaj ve parfüm ürünleri'],
    ]]
  );

  console.log(`${URUNLER.length} ürün ekleniyor...`);
  const urunRows = URUNLER.map((u) => [u.ad, u.fiyat, u.stok, u.k, u.foto, u.ac]);
  await connection.query(
    `INSERT INTO urunler (ad, fiyat, stok, kategori_id, resim_url, aciklama) VALUES ?`,
    [urunRows]
  );

  console.log('Siparişler ve sipariş detayları ekleniyor...');
  const siparisler = siparisOlustur();
  for (const [kid, urunIdler, durum, gunOffset] of siparisler) {
    const tarih = new Date();
    tarih.setDate(tarih.getDate() + gunOffset);
    const tarihStr = tarih.toISOString().slice(0, 19).replace('T', ' ');

    // Toplam tutar
    let toplam = 0;
    const detaylar = [];
    for (const uid of urunIdler) {
      const u = URUNLER[uid - 1];
      const adet = 1; // basitlik icin 1
      toplam += u.fiyat * adet;
      detaylar.push({ uid, adet, fiyat: u.fiyat });
    }

    const [r] = await connection.query(
      `INSERT INTO siparisler (kullanici_id, toplam_tutar, durum, tarih) VALUES (?, ?, ?, ?)`,
      [kid, toplam, durum, tarihStr]
    );
    const sid = r.insertId;

    for (const d of detaylar) {
      await connection.query(
        `INSERT INTO siparis_detaylari (siparis_id, urun_id, adet, birim_fiyat) VALUES (?, ?, ?, ?)`,
        [sid, d.uid, d.adet, d.fiyat]
      );
    }
  }

  console.log('Yorumlar ekleniyor...');
  const yorumlar = yorumOlustur();
  if (yorumlar.length) {
    await connection.query(
      `INSERT INTO yorumlar (urun_id, kullanici_id, puan, yorum_metni) VALUES ?`,
      [yorumlar]
    );
  }

  await connection.end();
  console.log('\n═══════════════════════════════════════════');
  console.log('  Kurulum tamamlandı!');
  console.log('═══════════════════════════════════════════');
  console.log(`  Kategoriler: 6`);
  console.log(`  Ürünler:     ${URUNLER.length}`);
  console.log(`  Siparişler:  ${siparisler.length}`);
  console.log(`  Yorumlar:    ${yorumlar.length}`);
  console.log('═══════════════════════════════════════════');
  console.log('  Giriş bilgileri:');
  console.log('  Admin   -> admin@eticaret.com  / admin123');
  console.log('  Müşteri -> ayse@mail.com       / musteri123');
  console.log('═══════════════════════════════════════════\n');
}

main().catch((err) => {
  console.error('HATA:', err);
  process.exit(1);
});
