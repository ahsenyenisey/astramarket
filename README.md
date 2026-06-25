# AstraMarket — Web Tabanlı E-Ticaret Otomasyonu

Hepsiburada benzeri, **React + Node.js/Express + MySQL** kullanan tam yığın bir
e-ticaret uygulaması. Ders projesi olarak hazırlanmıştır.

## Ders Gereksinimleri (Saglanan)
- 6 tablolu MySQL veritabani (kullanicilar, kategoriler, urunler, siparisler, siparis_detaylari, yorumlar)
- 8 sayfa: Login, Anasayfa, Urun Detay, Sepet, Siparislerim, Admin Urunler, Admin Kullanici/Kategori, Admin Raporlar
- 15+ farkli React-Bootstrap component'i (Navbar, Card, Table, Modal, Form, Button, Alert, Badge, Pagination, Dropdown, Spinner, Carousel, Accordion, Tabs, ListGroup ...)
- Tum tablolar icin CRUD + JWT login/register
- 4 gelismis SQL sorgusu (Raporlar sayfasinda yorumlu olarak gosterilir):
  1. **GROUP BY + JOIN** — Kategori bazinda satislar
  2. **Subquery** — Ortalama fiyatin uzerindeki urunler
  3. **GROUP BY + HAVING** — Aktif musteriler (3+ siparis)
  4. **Subquery + JOIN** — En cok yorum alan urunler
  - Bonus 5. sorgu: NOT IN ile hic siparis edilmemis urunler

## Tasarim
- Bordo (#9f1239) ana renk, pudra pembesi (#fda4af) vurgu, krem (#fff7f5) arka plan
- Poppins fontu, yuvarlatilmis koseler, yumusak golgeler ve transition'lar
- Sticky bordo navbar, pudra pembesi sepet badge'i
- Admin paneli: sol tarafta koyu bordo sidebar
- Responsive (mobil/tablet/masaustu)

## Gereksinimler
- **Node.js 18+**
- **MySQL 8.x** (XAMPP/MAMP/Docker ile yerel MySQL da olur)

## ⚡ Hızlı Başlangıç (Tek Komut)

İlk kurulumdan sonra (MySQL ve bağımlılıklar yüklü, veritabanı seed'lendi)
her şeyi tek komutla başlatabilirsin:

```bash
./start.sh           # MySQL + backend + frontend hepsini başlatır
./start.sh --stop    # üçünü de durdurur
./start.sh --restart # hepsini durdurup yeniden başlatır
./start.sh --status  # servislerin durumunu (yeşil/kırmızı) gösterir
```

Script şunları otomatik yapar:
- MySQL zaten çalışıyorsa atlar; değilse `mysqld`'yi `nohup` ile başlatır
- Backend `node_modules` yoksa `npm install` çalıştırır
- `.env` yoksa `.env.example`'dan kopyalar
- Backend ve frontend'i arka planda başlatır, sağlık kontrolü yapar
- Loglar `.logs/` dizinine, PID'ler `.pids/` dizinine yazılır

Tüm üç servis sağlıklı çıkarsa şöyle bir görünür:
```
═══════════════════════════════════════════
         ASTRAMARKET SERVIS DURUMU
═══════════════════════════════════════════
✓ MySQL    -> localhost:3306
✓ Backend  -> http://localhost:4000
✓ Frontend -> http://localhost:5173
═══════════════════════════════════════════
```

Sorun çıkarsa log'ları kontrol et:
- `.logs/mysql.log`
- `.logs/backend.log`
- `.logs/frontend.log`

## 1. MySQL'i Hazirla

Eger MySQL kurulu degilse:
- **macOS:** `brew install mysql && brew services start mysql`
- **Windows/Linux:** XAMPP veya resmi MySQL installer ile kurun.

MySQL'e root sifreniz varsa, asagida `backend/.env` icinde belirtin.

## 2. Backend Kurulumu

```bash
cd backend
cp .env.example .env
# .env dosyasini acip DB_PASSWORD ve JWT_SECRET'i kendi degerlerinizle doldurun

npm install
npm run init-db        # Veritabani + tablolari + ornek veriyi olusturur (bcrypt ile hashlenmis sifreler)
npm run dev            # Backend http://localhost:4000 adresinde calisir
```

Beklenen ciktilar:
```
Veritabani siliniyor (varsa) ve yeniden olusturuluyor...
Kullanicilar ekleniyor (bcrypt ile hashlenmis sifreler)...
Kategoriler, urunler, siparisler ve yorumlar ekleniyor...

Kurulum tamamlandi!
Giris bilgileri:
  Admin    -> admin@eticaret.com  / admin123
  Musteri  -> ayse@mail.com       / musteri123
```

## 3. Frontend Kurulumu (Yeni terminal)

```bash
cd frontend
npm install
npm run dev            # Frontend http://localhost:5173 adresinde calisir
```

Tarayicidan **http://localhost:5173** acin.

## 4. Test Hesaplari

| Rol     | E-posta                | Sifre        |
|---------|------------------------|--------------|
| Admin   | admin@eticaret.com     | admin123     |
| Musteri | ayse@mail.com          | musteri123   |
| Musteri | mehmet@mail.com        | musteri123   |
| Musteri | fatma@mail.com         | musteri123   |
| Musteri | ali@mail.com           | musteri123   |

## 5. Test Akisi (Sirayla deneyin)

1. **Musteri olarak giris** (ayse@mail.com / musteri123)
2. Anasayfada urunleri gez, kategori filtresi ve arama kutusunu dene
3. Bir urune tikla → urun detay sayfasinda yorumlari gor, yorum ekle
4. "Sepete Ekle" → Sepet sayfasinda adet degistir, kaldir
5. "Siparisi Tamamla" → Otomatik olarak "Siparislerim" sayfasina yonlendirilirsin
6. Cikis yap → **Admin olarak giris** (admin@eticaret.com / admin123)
7. Admin panelinde:
   - **Urunler**: Yeni urun ekle, duzenle, sil
   - **Kullanici & Kategori**: Iki sekmede tum yonetim islemleri
   - **Raporlar**: 5 gelismis SQL sorgusunun sonucunu gor (SQL kodu da gosterilir)

## Proje Yapisi

```
web_prog/
├── backend/
│   ├── db/
│   │   ├── schema.sql       # 6 tablo (DROP & CREATE)
│   │   ├── seed.sql         # Ornek veriler
│   │   └── seed.js          # Sema + bcrypt'li kullanici + seed verisi (npm run init-db)
│   ├── middleware/auth.js   # JWT dogrulama
│   ├── routes/              # auth, urunler, kategoriler, kullanicilar, siparisler, yorumlar, raporlar
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/         # AuthContext, CartContext (localStorage)
│   │   ├── components/      # Navbar, ProductCard, AdminLayout, ProtectedRoute, EmptyState
│   │   ├── pages/           # 8 sayfa
│   │   └── styles/theme.css # Ozel bordo/pudra teması
│   └── vite.config.js
└── README.md
```

## Kullanilan Bootstrap / React-Bootstrap Component'leri (15+)

Navbar, Container, Row, Col, Card, Button, Form, Form.Control, Form.Select,
Form.Label, Modal, Table, Badge, Alert, Spinner, Pagination, Dropdown,
Carousel, Tabs/Tab, Accordion, ListGroup, Image, Toast (gosterim icin).

## Backend Endpoint'leri (Ozet)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/urunler           ?kategoriId=&q=
GET    /api/urunler/:id       (yorumlar dahil)
POST   /api/urunler           (admin)
PUT    /api/urunler/:id       (admin)
DELETE /api/urunler/:id       (admin)
GET    /api/kategoriler
POST   /api/kategoriler       (admin)
PUT    /api/kategoriler/:id   (admin)
DELETE /api/kategoriler/:id   (admin)
GET    /api/kullanicilar      (admin)
POST   /api/kullanicilar      (admin)
PUT    /api/kullanicilar/:id  (admin)
DELETE /api/kullanicilar/:id  (admin)
POST   /api/siparisler        (giris gerekir, transaction ile stok dusurur)
GET    /api/siparisler/benim  (giris gerekir)
GET    /api/siparisler        (admin)
POST   /api/yorumlar          (giris gerekir)
DELETE /api/yorumlar/:id      (giris gerekir, sahibi veya admin)
GET    /api/raporlar/ozet                    (admin)
GET    /api/raporlar/kategori-satislari      (admin)
GET    /api/raporlar/ortalama-uzeri-urunler  (admin)
GET    /api/raporlar/aktif-musteriler        (admin)
GET    /api/raporlar/cok-yorumlu-urunler     (admin)
GET    /api/raporlar/satilmayan-urunler      (admin)
```

## Sorun Giderme

- **MySQL baglanti hatasi:** `.env` dosyasindaki DB_USER ve DB_PASSWORD bilgilerini kontrol edin. MySQL servisinin calistigindan emin olun.
- **Port 4000/5173 dolu:** `.env` icinde `PORT=4001` deneyin (frontend vite.config.js icindeki proxy de gunceleyin).
- **CORS hatasi:** Server'da `cors()` aktif. Frontend port'unu degistirdiyseniz proxy ayarini kontrol edin.
- **Seed'i tekrar calistirmak:** `npm run init-db` veritabanini siler ve yeniden olusturur.

## Lisans
Egitim amaclidir.
