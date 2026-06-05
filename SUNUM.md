# AstraMarket — Sunum Rehberi

> 5 dakikalık demo akışı + jüri/hoca soru cevap çantası. Sunum öncesi mutlaka 1 kez prova yap.

## Sunum Öncesi Hazırlık (15 dakika önce)

### 1. Servisleri başlat
- **XAMPP Control Panel** → Apache + MySQL **Start** (her ikisi de yeşil)
- Proje klasöründe:
  - **Windows:** `start.bat` çift tık
  - **Mac/Linux:** `./start.sh`
- **http://localhost:5173** açıldı mı kontrol et

### 2. Hazırlıklı tarayıcı sekmeleri (sıra önemli)
| Sekme | URL | Niye |
|---|---|---|
| 1 | `http://localhost:5173` | Site — anasayfa |
| 2 | `http://localhost/phpmyadmin` | Veritabanı yapısı + sorgular |
| 3 | Kod editörü (VS Code) | Gerekirse kodu göster |

### 3. Veritabanını sıfırla (temiz demo için)
Demo öncesi `npm run init-db` çalıştırırsan yorum/sipariş verisi temiz olur ve "ekle, sil" demosu daha net görünür.

---

## 5 Dakikalık Demo Akışı

> Sözüne dikkat: kısa, eyleme dayalı, **ders gereksinimlerini sırayla göstermeyi** unutma.

### 🎬 0:00–0:30 — Açılış (30 sn)
> *"Merhaba, ben [isim]. Grubumuzla AstraMarket adlı Hepsiburada benzeri bir e-ticaret otomasyonu geliştirdik. React frontend, Node.js + Express backend ve MySQL veritabanı kullandık. 6 tablo, 8 sayfa ve 15+ React-Bootstrap componenti içeriyor. Şimdi size demo edeceğim."*

**Ekran:** AstraMarket anasayfası — partikül arka plan, hero, ürün kartları.

### 🛍 0:30–1:30 — Müşteri Akışı (1 dk)

1. **Anasayfa:**
   > *"Anasayfada 100 ürün var. Kategori filtreleri (pill butonlar), arama ve sayfa numaralandırma çalışıyor."*
   - Kategori pill'lerinden **"Elektronik"** seç → ürünler filtrelenir
   - Arama kutusuna **"iPhone"** yaz → tek ürün kalır

2. **Login:**
   > *"Login sayfası tam ekran sinematik tasarım. JWT ile giriş yapılıyor."*
   - Sağ üstte **Giriş / Kayıt** → Login sayfası açılır
   - `ayse@mail.com` / `musteri123` ile giriş
   - Anasayfaya yönlendirilir, sağ üstte "Ayşe Yılmaz" görünür

3. **Ürün Detay + Yorum:**
   - Bir ürüne tıkla (örn. iPhone 15 Pro)
   - Yıldız puanı, yorumlar, açıklama gösterilir
   > *"Giriş yapmış kullanıcı yorum ekleyebilir, kendi yorumunu silebilir."*
   - **Yorum ekle**: puan 5, "Harika ürün!" → Gönder
   - Yorum listede en üste düşer, "Sizin yorumunuz" badge'i ile + **Sil** butonu görünür

4. **Sepete Ekle:**
   - Adet 2 yap → "Sepete Ekle" butonu
   - Navbar'daki sepet badge'i bounce animasyonu ile 2 olur

### 🛒 1:30–2:00 — Sepet + Sipariş (30 sn)
1. **Sepet sayfası:**
   - Toplam tutar, kargo bilgisi, "X TL daha ekle, kargo ücretsiz olsun!" uyarısı
   - Adet azalt/artır, kaldır butonları çalışıyor
2. **"Siparişi Tamamla":**
   > *"Sipariş oluşturulduğunda MySQL transaction içinde `siparisler` ve `siparis_detaylari` tablolarına kayıt eklenir, ilgili ürünlerin stoğu düşürülür. Stok yetersizse rollback yapar."*
   - Buton → "Siparişiniz oluşturuldu" → otomatik **Siparişlerim** sayfasına gider
3. **Siparişlerim:**
   - Sipariş kartını aç (accordion) → ürün detayları + durum chip'i

### 👨‍💼 2:00–3:30 — Admin Paneli + CRUD (1.5 dk)

1. **Çıkış yap → Admin olarak giriş:**
   - Sağ üst → Çıkış Yap → Login → `admin@eticaret.com` / `admin123`
   - **Admin paneline otomatik yönlendirilir**

2. **Yetki koruması (önemli):**
   > *"Admin sayfalarına müşteri rolü erişemez. ProtectedRoute ile koruyoruz."*
   - URL'i manuel `/sepet` yap → sepet açılır (müşteri sayfası)
   - Çıkış yapıp `ayse@mail.com` ile gir, sonra **manuel** URL'e `/admin/urunler` yaz → Login'e yönlendirir, "Bu sayfaya erişim yetkiniz yok" uyarısı

3. **Admin tekrar gir → Ürün CRUD demo:**
   - **Ürün Yönetimi** sekmesi (sol sidebar)
   - **+ Yeni Ürün** → modal aç
     - Ad: "Demo Ürün"
     - Fiyat: 999
     - Stok: 10
     - Kategori: Elektronik
     - Resim URL: (boş bırak — placeholder gelir)
     - Açıklama: "Sunum için demo ürün"
     - **Kaydet** → tablonun en üstünde yeni ürün
   - **Düzenle** → fiyatı 799 yap → Kaydet
   - **Sil** → onay modal'ı → Evet, Sil → tablodan kaybolur

4. **Kullanıcı & Kategori CRUD (kısa):**
   - Sol sidebar → Kullanıcı & Kategori
   - **Kullanıcılar** sekmesi → liste
   - **Kategoriler** sekmesinde **+ Yeni Kategori** → "Test Kategorisi" → Kaydet → tabloya eklenir
   - Sil

### 📊 3:30–4:30 — Raporlar (Gelişmiş SQL — Ders Kritik Bölümü) (1 dk)

> *"Şimdi ders gereksinimi olan 4 gelişmiş SQL sorgusunu göstereceğim. Bu sayfa raporlar.js backend dosyamızdan veri çekiyor, sorgular yorum satırlarıyla açıklanmış."*

1. **Admin → Raporlar** sayfasına git
2. Yukarıdan aşağıya geç:
   - **Özet kartlar** (toplam ürün, sipariş, ciro, müşteri)
   - **Sorgu 1: GROUP BY + JOIN** — Kategori bazında satışlar tablosu
   - **Sorgu 2: Subquery** — Ortalama fiyat üzeri ürünler
   - **Sorgu 3: GROUP BY + HAVING** — Aktif müşteriler
   - **Sorgu 4: Subquery + JOIN** — En çok yorum alanlar

> *"Her kartta önce sorgunun ne yaptığını, sonra SQL kodunu, sonra canlı sonucu görüyorsunuz."*

### 🗄 4:30–5:00 — phpMyAdmin'de Veritabanı (30 sn)

> *"Veritabanını da göstereyim — XAMPP'ta phpMyAdmin kullanıyoruz."*

1. Tarayıcıda phpMyAdmin sekmesine geç (`localhost/phpmyadmin`)
2. **Sol panel → eticaret_db** seç → 6 tablo görünür
3. **urunler** tablosuna tıkla → 100 satır gösterilir
4. **Designer** sekmesine geç (üst menü) → tabloların ER diyagramı (foreign key okları)
5. Üst menüden **SQL** sekmesine geç → `queries.sql` dosyasından bir sorguyu yapıştır → **Git** → sonuç

**Kapanış:**
> *"Toplam 6 tablo, 8 sayfa, 15+ Bootstrap componenti, JWT auth, transaction'lı stok yönetimi, 4 gelişmiş SQL sorgusu ve dark/light mode ile tüm gereksinimleri karşılıyoruz. Sorularınız?"*

---

## CRUD Demo Senaryosu (Adım Adım)

> Yukarıdaki akışta hızlıca gösterdik, soruda istenirse daha detay:

### CREATE (Ekle)
| Tablo | Sayfa | Adım |
|---|---|---|
| Ürün | Admin → Ürünler | + Yeni Ürün → form doldur → Kaydet |
| Kategori | Admin → Kullanıcı & Kategori → Kategoriler | + Yeni Kategori → Kaydet |
| Kullanıcı | Admin → Kullanıcı & Kategori → Kullanıcılar | + Yeni Kullanıcı → Kaydet |
| Sipariş | Müşteri olarak Sepet → Siparişi Tamamla | (transaction ile) |
| Yorum | Ürün Detay → Yorum formu | Puan + metin → Gönder |
| Müşteri kayıt | Login → Kayıt Ol | Form → Kayıt |

### READ (Listele)
- Tüm sayfalarda otomatik (anasayfa, ürün detay, sepet, sipariş, admin tabloları)

### UPDATE (Güncelle)
| Tablo | Yer | Adım |
|---|---|---|
| Ürün | Admin → Ürünler | Düzenle → form → Kaydet |
| Kategori | Admin → Kategoriler | Düzenle → Kaydet |
| Kullanıcı | Admin → Kullanıcılar | Düzenle (rol değiştir) → Kaydet |
| Sepet | Müşteri Sepet | Adet artır/azalt — otomatik kayıt |

### DELETE (Sil)
| Tablo | Yer | Adım |
|---|---|---|
| Ürün | Admin → Ürünler | Sil → onay → Evet |
| Kategori | Admin → Kategoriler | Sil → onay → Evet |
| Kullanıcı | Admin → Kullanıcılar | Sil → onay |
| Yorum | Ürün Detay | Kendi yorumunda Sil butonu (admin tümünü silebilir) |
| Sepet | Müşteri Sepet | "Kaldır" linki |

---

## phpMyAdmin'de Tablolar ve İlişkiler

### Tabloları Göster
1. **eticaret_db** seç
2. Her tabloya çift tık → **Yapı** sekmesi (kolon tipleri) ve **Gözat** sekmesi (veri)
3. Tablolar:
   - `kullanicilar` (5 satır)
   - `kategoriler` (6 satır)
   - `urunler` (100 satır)
   - `siparisler` (30 satır)
   - `siparis_detaylari` (~30 satır)
   - `yorumlar` (~150 satır)

### Designer Sekmesi (Foreign Key Diyagramı)
1. **eticaret_db** seç
2. Üst menüden **Designer**
3. Karşına 6 tablo + aralarındaki ilişkileri gösteren oklar gelir:
   ```
   kategoriler ◄── urunler ◄── siparis_detaylari ──► siparisler ──► kullanicilar
                      ▲                                                    ▲
                      └──── yorumlar ──────────────────────────────────────┘
   ```
4. PDF / PNG indir: **Tablo Boyutu**'nu uygun yap → Sayfa olarak kaydet

### SQL Sorgu Çalıştırma (Sunumun Kritik Bölümü)
1. Üst menüden **SQL** sekmesi
2. `queries.sql` dosyasını aç (kodu kopyala)
3. SQL kutusuna yapıştır → **Git**
4. Sonuçlar altta tablo halinde

> Demo için sadece 1-2 sorgu çalıştırmak yeter. Sorgu 1 (kategori satışları) ve Sorgu 3 (aktif müşteriler) en görsel olanlardır.

---

## Olası Hoca/Jüri Soruları + Cevaplar

**S: Şifreler nasıl saklanıyor?**
- bcrypt ile hash'leniyor (10 round). `kullanicilar.sifre` kolonu hash içerir. Login'de bcrypt.compare ile doğruluyoruz.

**S: Stok yönetimi nasıl?**
- Sipariş oluşturulurken `START TRANSACTION ... COMMIT/ROLLBACK` ile atomik. `SELECT ... FOR UPDATE` ile satırı kilitliyoruz, stok yetersizse `ROLLBACK` ile sipariş iptal olur.

**S: Foreign key ne işe yarıyor?**
- Sipariş silindiğinde detayları otomatik silinsin (`ON DELETE CASCADE`), kategori silindiğinde ürün `kategori_id` NULL'a düşsün (`ON DELETE SET NULL`).

**S: JOIN ile subquery'nin farkı?**
- JOIN: tabloları yan yana koyup ilişkili satırları getirir, GROUP BY ile gruplamak için kullanılır.
- Subquery: tek sayı / liste döner; WHERE içinde filtreleme için veya SELECT içinde hesaplama için kullanılır.

**S: HAVING ile WHERE'in farkı?**
- WHERE satırları filtreler (gruplamadan önce). HAVING grupları filtreler (gruplamadan sonra). Örn. `HAVING COUNT(s.id) > 3` çünkü COUNT bir aggregate, WHERE'de kullanılamaz.

**S: Veriler kim ekledi?**
- Kullanıcılar (5 kişi) + kategoriler (6) + ürünler (100) + sipariş (30) + yorumlar (150) — hepsi `backend/db/seed.js` içinde programatik tanımlı. `npm run init-db` ile sıfırlanıp tekrar yüklenir. Şifreler bcrypt ile hash'lenir.

**S: Frontend'de hangi Bootstrap component'leri var?**
- Navbar, Card, Table, Modal, Form, Button, Alert, Badge, Pagination, Dropdown, Spinner, Carousel, Accordion, Tabs, ListGroup, Container, Row, Col, Image → 18 farklı çeşit (ders gereksinimi: en az 10).

**S: Sayfa sayısı?**
- Login, Anasayfa, Ürün Detay, Sepet, Siparişlerim, Admin Ürünler, Admin Kullanıcı/Kategori, Admin Raporlar → 8 sayfa (ders gereksinimi: en az 7).

**S: Neden dark/light mode?**
- Accessibility ve kullanıcı tercihi. Sistem temasını okuyor (`prefers-color-scheme`), tercih localStorage'da saklanıyor.

**S: Responsive mi?**
- Evet. Bootstrap grid + custom media queries (768px, 992px). Mobilde admin sidebar üst alta geçer, bloblar azaltılır.
