# AstraMarket Sunum Rehberi
### 3 kişilik takım, 15-20 dakika hocaya sunum

> **🖱 KLIK** = tıklanacak şey · **💬 SÖYLE** = birebir cümle · **📁 DOSYA** = açılacak dosya · **📍 SATIR** = satır numarası · **🔍 KOD** = vurgulanacak kod

---

## ⚙️ Sunumdan 15 Dakika Önce Hazırlık

### 1. Servisleri başlat
```bash
cd ~/Desktop/web_prog
./start.sh
```
Yeşil ✓ MySQL, ✓ Backend, ✓ Frontend çıkmalı.

### 2. Veritabanını temizle (sıfır verisi için)
```bash
cd backend
npm run init-db && node db/add-fake-users.js
```

### 3. VS Code'da açık olması gereken dosyalar (alttaki tablardan sıralı)
1. `frontend/src/components/Navbar.jsx`
2. `frontend/src/pages/Home.jsx`
3. `frontend/src/components/LogoBackground.jsx`
4. `frontend/src/components/ProtectedRoute.jsx`
5. `backend/middleware/auth.js`
6. `backend/routes/auth.js`
7. `backend/routes/siparisler.js`
8. `backend/db/schema.sql`
9. `backend/routes/raporlar.js`
10. `queries.sql` (proje kökü)

### 4. Tarayıcı sekme sırası
1. `http://localhost:5173` (site)
2. `http://localhost/phpmyadmin` veya DBeaver
3. VS Code (alt+tab ile geçiş)

### 5. sessionStorage temizle (intro tekrar gözüksün)
F12 console'da: `sessionStorage.clear()` → sayfayı kapa.

---

## 👥 Rol Dağılımı

| Kişi | Bölüm | Süre |
|---|---|---|
| **Kişi 1** | Açılış + Müşteri akışı + Checkout | ~6 dk |
| **Kişi 2** | Admin Paneli + CRUD + Frontend kodu | ~5 dk |
| **Kişi 3** | Veritabanı + 4 SQL sorgusu + Transaction | ~7 dk |

---

# 🎬 KİŞİ 1 — Açılış + Müşteri Akışı (6 dk)

## 0:00–0:45 — Açılış Konuşması

> 💬 *"Merhaba hocam, ben [isim]. Grupça **AstraMarket** adlı, Hepsiburada benzeri bir e-ticaret otomasyonu geliştirdik. Sunumumuzda önce müşteri tarafını, sonra admin panelini, en sonda da veritabanı + SQL tarafını göstereceğiz."*

> 💬 *"Teknolojiler: Frontend için **React + Vite + React-Bootstrap**, backend için **Node.js + Express**, veritabanı **MySQL/MariaDB**. Authentication için **JWT**, şifreler **bcryptjs** ile hash'leniyor."*

> 💬 *"6 tablomuz, 12 sayfamız, 18'den fazla Bootstrap componentimiz, tüm tablolarda CRUD ve 4 gelişmiş SQL sorgumuz var."*

## 0:45–1:30 — Intro Loader + Arka Plan Logoları

> 🖱 **Tarayıcı sekmesi 1** (`localhost:5173`)
> İntro açıksa beklesin, harf-harf gelen tagline'ı işaret et.

> 💬 *"Site ilk açılışta sinematik bir intro ile karşılıyor. 3 seçenek var: Giriş Yap, Kayıt Ol, Misafir olarak Devam Et."*

> 🖱 **"Misafir olarak devam et"** tıkla → Anasayfa açılır.

> 💬 *"Arka planda gördüğünüz 14 logo, **mouse hareketine tepki veriyor** — yaklaşınca uzaklaşıyor ve parlıyor. Hepsi tamamen CSS + canvas, three.js gibi ağır kütüphaneler yok."*

> 🖱 **Mouse'u logolardan birinin üzerine götür** — parlamayı göster.

#### 📁 KOD GÖSTERİMİ (Opsiyonel, kısa)
> 📁 VS Code: **`frontend/src/components/LogoBackground.jsx`**
> 📍 **Satır 51-83**: Mouse listener
> 🔍 Şu kısmı vurgula:
> ```js
> const ESIK = 220;       // piksel - bu mesafede etki baslar
> const KUVVET_MAX = 60;  // piksel - max kacma mesafesi
> ...
> const yakinlik = 1 - d / ESIK;
> el.style.setProperty('--isik', yakinlik.toFixed(3));
> ```
> 💬 *"Mouse'a olan mesafeyi her frame'de hesaplayıp CSS variable olarak yazıyoruz, CSS de ona göre glow ve scale uyguluyor."*

## 1:30–2:30 — Kategori Dropdown + Filtreleme

> 🖱 Navbar'da **"Kategoriler ▾"** tıkla.

> 💬 *"6 kategoriyi listeleyen custom dropdown. React-Bootstrap'in Dropdown component'i CSS spesifiklik sorunu çıkarınca kendi custom dropdown'umuzu yazdık."*

#### 📁 KOD GÖSTERİMİ (Hızlı)
> 📁 **`frontend/src/components/Navbar.jsx`**
> 📍 **Satır 10-39**: `CustomDropdown` componenti
> 📍 **Satır 81-92**: Kategoriler kullanımı
> 🔍 Şu kısmı vurgula:
> ```jsx
> <CustomDropdown label="Kategoriler">
>   {kategoriler.map((k) => (
>     <Link key={k.id} to={`/?kategori=${k.id}`} className="custom-dropdown-item">
>       {k.ad}
>     </Link>
>   ))}
> </CustomDropdown>
> ```

> 🖱 **"Elektronik"** seç.

> 💬 *"URL `?kategori=1` parametresi alıyor, anasayfaya yönlendiriyor ve otomatik filtre uyguluyor."*

#### 📁 KOD GÖSTERİMİ
> 📁 **`frontend/src/pages/Home.jsx`**
> 📍 **Satır 52-71**: `useSearchParams` ile URL filtreleme
> 🔍
> ```jsx
> useEffect(() => {
>   const kat = searchParams.get('kategori');
>   if (kat === 'tum') { setSecili(null); ... }
>   else if (kat) {
>     const id = Number(kat);
>     setSecili(id);
>     ...
>     document.getElementById('urunler-bolum')?.scrollIntoView({ behavior: 'smooth' });
>   }
> }, [searchParams]);
> ```

## 2:30–3:15 — Ürün Detay + Yorum

> 🖱 Bir ürüne tıkla (örn. **iPhone**).

> 💬 *"Ürün detay sayfası: gerçek DummyJSON görseli, yıldız puanı, açıklama, stok bilgisi, adet kontrolü ve yorumlar var."*

> 💬 *"Yorum eklemek için giriş yapmak lazım. Şimdi giriş yapayım."*

> 🖱 Sağ üstte **"Giriş / Kayıt"** → `ayse@mail.com` / `musteri123` ile giriş.

> 💬 *"JWT token alıp localStorage'a kaydetti."*

#### 📁 KOD GÖSTERİMİ (Hızlı)
> 📁 **`frontend/src/context/AuthContext.jsx`**
> 📍 **Satır 13-19**: Login fonksiyonu
> 🔍
> ```js
> const login = async (email, sifre) => {
>   const { data } = await api.post('/auth/login', { email, sifre });
>   localStorage.setItem('token', data.token);
>   localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
>   setUser(data.kullanici);
> };
> ```

> 🖱 Tekrar aynı ürüne git → yorum yaz "Harika ürün" + 5 yıldız → **Gönder**.

> 💬 *"Yorum eklendi. **Sizin yorumunuz** badge'i ve silme butonu çıktı. Müşteri sadece kendi yorumunu silebilir, admin tümünü silebilir."*

## 3:15–4:30 — Sepet → Checkout → Sipariş

> 🖱 Ürüne **+ butonuyla adet 2** yap → **Sepete Ekle**.

> 💬 *"Navbar'daki sepet badge'i bounce animasyonuyla 2 oldu."*

> 🖱 **Sepet**'e tıkla.

> 💬 *"Sepette ürün, adet kontrolü, ara toplam, kargo ve **'500 TL üzeri ücretsiz kargo' uyarısı** var."*

> 🖱 **"Ödemeye Geç →"** butonu.

> 💬 *"Çok adımlı checkout sayfasına geçti. Üstte stepper var: Sepet → Teslimat → Ödeme → Onay."*

### Adım 1: Teslimat
Formu doldur:
- Ad: `Ayşe`, Soyad: `Yılmaz`, Telefon: `0532 111 22 33`
- Adres: `Bağdat Caddesi No: 42`
- Şehir: `İstanbul`, İlçe: `Kadıköy`, Posta: `34710`

> 🖱 **"Ödemeye Geç →"**

### Adım 2: Ödeme

> 💬 *"3 ödeme yöntemi var: Kredi kartı, havale, kapıda nakit. Kart seçiliyse form çıkıyor."*

Kart bilgileri (sahte):
- İsim: `AYŞE YILMAZ`
- No: `4444 4444 4444 4444`
- SKT: `12/28`
- CVV: `123`

> 💬 *"Sarı uyarıda 'Bu bir demo projesidir, gerçek ödeme alınmaz' yazıyor."*

> 🖱 **"Siparişi Onayla →"**

> 💬 *"Backend'de **MySQL transaction** çalıştı. Stok kilitlendi, sipariş ve detayları eklendi, stok düşürüldü. Otomatik olarak Sipariş Tamamlandı sayfasına yönlendirildi."*

### Sipariş Tamamlandı sayfası
Konfeti yağıyor, büyük yeşil tik, sipariş no, toplam, tahmini teslimat.

> 💬 *"Animasyonlu başarı sayfası. Konfeti efekti CSS keyframe ile, hafif."*

> 🖱 **"Siparişlerimi Görüntüle"** tıkla.

> 💬 *"Az önce verilen sipariş listenin başında, accordion'la detayları açabiliyoruz."*

## 4:30–5:30 — Diğer Sayfalar (kısa tur)

> 🖱 Navbar'da **"🔥 Süper Fiyat, Süper Teklif"**

> 💬 *"İndirimli ürünler 3 kategoride: %40+, %30-39, %20-29. Geri sayım sayacı var."*

> 🖱 **"Kampanyalar"** → 6 renkli kart.
> 🖱 **"Müşteri Hizmetleri ▾"** → **"⭐ AstraMarket Premium"** → altın hero göster.
> 🖱 Geri → **"Sıkça Sorulan Sorular"** → 5 kategori, accordion'lar.

> 💬 *"Şimdi [Kişi 2 ismi] admin panelini gösterecek."*

---

# 👨‍💼 KİŞİ 2 — Admin Paneli + CRUD (5 dk)

## 5:30–6:15 — Admin Girişi + Route Koruması

> 🖱 Sağ üstte **ahsen ▾** dropdown → **"Çıkış Yap"**.
> 🖱 **"Giriş / Kayıt"** → `admin@eticaret.com` / `admin123`.

> 💬 *"Admin olarak girdiğim için sistem otomatik admin paneline yönlendirdi."*

> 💬 *"Güvenlik açısından önemli nokta: admin sayfalarına müşteri rolü erişemez."*

#### 📁 KOD GÖSTERİMİ (Kritik!)
> 📁 **`frontend/src/components/ProtectedRoute.jsx`**
> 📍 **Tüm dosya, ~13 satır**:
> ```jsx
> export default function ProtectedRoute({ children, adminOnly = false }) {
>   const { user } = useAuth();
>   const loc = useLocation();
>   if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
>   if (adminOnly && user.rol !== 'admin')
>     return <Navigate to="/login" state={{ yetki: 'Bu sayfaya erişim yetkiniz yok' }} replace />;
>   return children;
> }
> ```
> 💬 *"İki kontrol: giriş yapmamışsa login'e, admin değilse uyarı mesajıyla yine login'e atıyor."*

> 📁 **`frontend/src/App.jsx`**
> 📍 **Satır 53**: Route koruması
> 🔍
> ```jsx
> <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
> ```

> 📁 **`backend/middleware/auth.js`** — backend tarafında da kontrol
> 📍 **Satır 16-21**: `adminRequired`
> 🔍
> ```js
> function adminRequired(req, res, next) {
>   authRequired(req, res, () => {
>     if (req.user.rol !== 'admin') return res.status(403).json({ hata: 'Admin yetkisi gerekli' });
>     next();
>   });
> }
> ```
> 💬 *"Frontend kontrolüne güvenmiyoruz, backend de admin endpoint'lerini bu middleware ile koruyor."*

## 6:15–7:30 — Ürün CRUD (Create + Update + Delete)

> 🖱 Sol sidebar **"Ürün Yönetimi"**

> 💬 *"Tabloda 100 ürün listeleniyor."*

### CREATE
> 🖱 **"+ Yeni Ürün"** → Modal açılır.

Form doldur:
- Ad: `Demo Ürün`, Fiyat: `999`, Stok: `10`, Kategori: Elektronik, Açıklama: `Sunum için demo`

> 🖱 **Kaydet**

> 💬 *"`POST /api/urunler` çağrıldı. Veritabanına eklendi."*

#### 📁 KOD GÖSTERİMİ
> 📁 **`backend/routes/urunler.js`**
> 📍 **Satır 36-43**: POST endpoint
> 🔍
> ```js
> router.post('/', adminRequired, async (req, res) => {
>   const { ad, fiyat, stok, kategori_id, resim_url, aciklama } = req.body;
>   const [r] = await pool.query(
>     'INSERT INTO urunler (ad, fiyat, stok, kategori_id, resim_url, aciklama) VALUES (?, ?, ?, ?, ?, ?)',
>     [ad, fiyat, stok, kategori_id || null, resim_url || null, aciklama || null]
>   );
>   res.json({ id: r.insertId });
> });
> ```
> 💬 *"`adminRequired` middleware'i ile başlıyor — JWT kontrolü + admin rol kontrolü zincirde. Sonra prepared statement (`?` parametreleri) ile SQL injection'a karşı korumalı INSERT."*

### UPDATE
> 🖱 Yeni ürünün **Düzenle** butonu → Fiyatı `799` yap → **Kaydet**.
> 💬 *"`PUT /api/urunler/:id` ile güncellendi."*

### DELETE
> 🖱 Aynı ürünün **Sil** → Onay modal → **Evet, Sil**.
> 💬 *"`DELETE /api/urunler/:id` ile silindi."*

## 7:30–9:00 — Kullanıcı & Kategori CRUD + Yorum Silme

> 🖱 Sol sidebar **"Kullanıcı & Kategori"** → **Kullanıcılar** sekmesi.

> 💬 *"20 kullanıcı listeleniyor — 1 admin + 19 müşteri."*

> 🖱 **Kategoriler** sekmesi → **+ Yeni Kategori** → `Test` → Kaydet → Sil.

> 💬 *"Tüm tablolarda CRUD çalışıyor."*

### Yorum CRUD
> 🖱 Müşteri tarafına dön → herhangi bir ürünün detayına git.
> Admin olduğun için **her yorumda Sil butonu** var.

#### 📁 KOD GÖSTERİMİ
> 📁 **`backend/routes/yorumlar.js`**
> 📍 **Satır 20-31**: Sahip veya admin kontrolü
> 🔍
> ```js
> router.delete('/:id', authRequired, async (req, res) => {
>   const [rows] = await pool.query('SELECT kullanici_id FROM yorumlar WHERE id = ?', [req.params.id]);
>   if (!rows.length) return res.status(404).json({ hata: 'Yorum bulunamadı' });
>   if (rows[0].kullanici_id !== req.user.id && req.user.rol !== 'admin') {
>     return res.status(403).json({ hata: 'Yetkiniz yok' });
>   }
>   await pool.query('DELETE FROM yorumlar WHERE id = ?', [req.params.id]);
>   res.json({ ok: true });
> });
> ```
> 💬 *"Yorum sahibi veya admin değilse 403 dönüyor. Aksi halde siliyor."*

## 9:00–10:30 — Tasarım Detayları + Tema

> 🖱 Tema toggle **☀ / ☾** butonuna bas.
> 💬 *"Dark/light mode toggle. Sistem tercihini okuyor, localStorage'da kalıcı."*

#### 📁 KOD GÖSTERİMİ (Hızlı)
> 📁 **`frontend/src/context/ThemeContext.jsx`**
> 📍 **Satır 8-15**: İlk tema seçimi
> 🔍
> ```js
> function ilkTema() {
>   const kayitli = localStorage.getItem('astra-tema');
>   if (kayitli === 'light' || kayitli === 'dark') return kayitli;
>   return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
> }
> ```

> 🖱 Tekrar dark moda dön.

> 💬 *"Tüm sayfalar responsive. Şimdi [Kişi 3 ismi] en teknik bölümü, veritabanı tarafını gösterecek."*

---

# 🗄 KİŞİ 3 — Veritabanı + SQL (7 dk) ⭐ EN TEKNİK

## 10:30–11:00 — DB Bağlantı + Tablo Yapısı

> 🖱 **phpMyAdmin sekmesi** (sekme 2) → **`eticaret_db`** seç.

> 💬 *"Veritabanımız MySQL/MariaDB üzerinde. 6 tablomuz var:"*

| Tablo | Satır |
|---|---|
| kullanicilar | 20 |
| kategoriler | 6 |
| urunler | 100 |
| siparisler | 30+ |
| siparis_detaylari | 30+ |
| yorumlar | 150 |

> 💬 *"Tüm tablolar utf8mb4 charset kullanıyor, Türkçe karakter sorunu olmadan çalışıyor."*

## 11:00–12:00 — Schema (CREATE TABLE'lar)

> 📁 VS Code: **`backend/db/schema.sql`**

### A) Database oluşturma
> 📍 **Satır 1-4**:
> 🔍
> ```sql
> DROP DATABASE IF EXISTS eticaret_db;
> CREATE DATABASE eticaret_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> USE eticaret_db;
> ```
> 💬 *"utf8mb4 — emoji dahil tüm Unicode karakterleri destekler."*

### B) kullanicilar tablosu
> 📍 **Satır 7-14**:
> 🔍
> ```sql
> CREATE TABLE kullanicilar (
>     id INT AUTO_INCREMENT PRIMARY KEY,
>     ad VARCHAR(100) NOT NULL,
>     email VARCHAR(150) NOT NULL UNIQUE,
>     sifre VARCHAR(255) NOT NULL,
>     rol ENUM('admin', 'musteri') DEFAULT 'musteri',
>     olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
> ) ENGINE=InnoDB;
> ```
> 💬 *"Email UNIQUE — aynı mail ile iki kayıt olamaz. Şifre VARCHAR(255) çünkü bcrypt hash'i 60 karakter. Rol ENUM — sadece admin veya musteri."*

### C) urunler tablosu + Foreign Key
> 📍 **Satır 23-34**:
> 🔍
> ```sql
> CREATE TABLE urunler (
>     ...
>     FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE SET NULL
> ) ENGINE=InnoDB;
> ```
> 💬 *"Foreign key kullandık. Kategori silindiğinde, o kategorideki ürünlerin `kategori_id` alanı NULL oluyor — ürün silinmiyor."*

### D) siparisler tablosu + CASCADE
> 📍 **Satır 36-44**:
> 🔍
> ```sql
> FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
> ```
> 💬 *"Burada ON DELETE CASCADE — bir kullanıcı silinirse onun tüm siparişleri de silinir."*

### E) yorumlar — CHECK constraint
> 📍 **Satır 58-67**:
> 🔍
> ```sql
> puan INT CHECK (puan BETWEEN 1 AND 5),
> ```
> 💬 *"CHECK constraint ile puan 1-5 arası garanti. MariaDB 10.2+ destekliyor."*

## 12:00–12:30 — Designer'da ER Diyagramı

> 🖱 phpMyAdmin → `eticaret_db` → üst menü **"Designer"**.

> 💬 *"İşte ilişkilerin görsel hali. 6 tablo, foreign key okları açıkça görünüyor."*

> 💬 *"kullanicilar → siparisler (1-N), siparisler → siparis_detaylari (1-N), siparis_detaylari → urunler (N-1), urunler → kategoriler (N-1), yorumlar → urunler & kullanicilar."*

## 12:30–15:30 — 4 GELİŞMİŞ SQL SORGUSU ⭐

> 📁 VS Code: **`queries.sql`** (proje kökü)
> 🖱 phpMyAdmin → **"SQL"** sekmesi.

### 🔹 SORGU 1: GROUP BY + JOIN
**Amaç:** Her kategorideki ürün sayısı ve toplam satış

> 📍 `queries.sql` **satır 28-34**:
> 🔍
> ```sql
> SELECT k.ad AS kategori,
>        COUNT(DISTINCT u.id) AS urun_sayisi,
>        COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
> FROM kategoriler k
> LEFT JOIN urunler u           ON u.kategori_id = k.id
> LEFT JOIN siparis_detaylari sd ON sd.urun_id    = u.id
> GROUP BY k.id, k.ad
> ORDER BY toplam_satis DESC;
> ```

> 💬 *"İki LEFT JOIN ile 3 tabloyu birleştiriyor. LEFT JOIN kullandık çünkü hiç ürünü olmayan kategoriler de listelensin. `COUNT(DISTINCT u.id)` — aynı ürün birden fazla siparişte olsa bile bir kez sayılıyor. `COALESCE` — NULL'ları 0'a çeviriyor."*

> 🖱 **Sorguyu kopyala** → phpMyAdmin SQL → **Git**.

> 💬 *"6 kategori, satış tutarına göre sıralı."*

### 🔹 SORGU 2: SUBQUERY (İÇ İÇE SORGU)
**Amaç:** Ortalama fiyatın üzerindeki ürünler

> 📍 `queries.sql` **satır 50-54**:
> 🔍
> ```sql
> SELECT id, ad, fiyat,
>        (SELECT ROUND(AVG(fiyat), 2) FROM urunler) AS genel_ortalama
> FROM urunler
> WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
> ORDER BY fiyat DESC;
> ```

> 💬 *"WHERE içindeki parantezli SELECT bir 'subquery' — önce iç sorgu çalışıp tüm ürünlerin ortalamasını hesaplıyor. Sonra dış sorgu bu değerden büyük ürünleri filtreliyor. SELECT içine de subquery koyduk — sonuç tablosunda ortalamayı da gösteriyoruz."*

> 🖱 Çalıştır.

### 🔹 SORGU 3: GROUP BY + HAVING
**Amaç:** 3+ siparişi olan müşteriler

> 📍 `queries.sql` **satır 73-80**:
> 🔍
> ```sql
> SELECT k.id, k.ad, k.email,
>        COUNT(s.id) AS siparis_sayisi,
>        SUM(s.toplam_tutar) AS toplam_harcama
> FROM kullanicilar k
> INNER JOIN siparisler s ON s.kullanici_id = k.id
> GROUP BY k.id, k.ad, k.email
> HAVING COUNT(s.id) > 3
> ORDER BY toplam_harcama DESC;
> ```

> 💬 *"**WHERE ile HAVING farkı önemli**. WHERE satırları gruplamadan ÖNCE filtreler. HAVING gruplandıktan SONRA filtreler. `COUNT(s.id)` aggregate fonksiyon — WHERE'de kullanılamaz, HAVING gerekli."*

> 🖱 Çalıştır.

> 💬 *"Mesela Ayşe Yılmaz en aktif müşteri."*

### 🔹 SORGU 4: KORELASYONLU SUBQUERY + JOIN
**Amaç:** En çok yorum alan ürünler

> 📍 `queries.sql` **satır 99-104**:
> 🔍
> ```sql
> SELECT u.id, u.ad, u.fiyat,
>        (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
>        (SELECT ROUND(AVG(puan), 2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
> FROM urunler u
> WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
> ORDER BY yorum_sayisi DESC, ortalama_puan DESC
> LIMIT 10;
> ```

> 💬 *"**Korelasyonlu subquery** — `WHERE y.urun_id = u.id` ile iç sorgu dış sorgudaki her ürün için ayrı ayrı çalışıyor. SELECT içine 2 subquery: yorum sayısı ve ortalama puan."*

> 🖱 Çalıştır.

## 15:30–17:00 — TRANSACTION (Sipariş Mantığı) ⭐

> 📁 VS Code: **`backend/routes/siparisler.js`**

> 💬 *"En önemli backend mantığımız: sipariş verme. **MySQL transaction** kullanıyoruz. Ya hepsi başarılı olur ya hiçbiri."*

### A) Transaction başlatma
> 📍 **Satır 13-14**:
> 🔍
> ```js
> const conn = await pool.getConnection();
> try {
>   await conn.beginTransaction();
> ```
> 💬 *"Connection alıp transaction başlatıyoruz."*

### B) SELECT FOR UPDATE — satır kilitleme
> 📍 **Satır 18-22**:
> 🔍
> ```js
> const [rows] = await conn.query(
>   `SELECT id, ad, fiyat, stok FROM urunler WHERE id IN (${placeholders}) FOR UPDATE`,
>   ids
> );
> ```
> 💬 *"`FOR UPDATE` ile bu satırları **kilitliyoruz**. Başka bir sipariş aynı ürünlere aynı anda gelirse bekliyor. **Race condition'a karşı koruma**."*

### C) Stok kontrolü
> 📍 **Satır 25-30**:
> 🔍
> ```js
> for (const item of urunler) {
>   const u = urunMap.get(item.urun_id);
>   if (!u) throw new Error(`Ürün bulunamadı: ${item.urun_id}`);
>   if (u.stok < item.adet) throw new Error(`${u.ad} için yeterli stok yok`);
>   toplam += Number(u.fiyat) * item.adet;
> }
> ```
> 💬 *"Stok yetersizse hata atıyoruz — catch'e düşüp rollback olacak."*

### D) Sipariş ve detaylar ekleme + Stok düşürme
> 📍 **Satır 33-47**:
> 🔍
> ```js
> const [siparisR] = await conn.query(
>   'INSERT INTO siparisler (kullanici_id, toplam_tutar, durum) VALUES (?, ?, ?)',
>   [req.user.id, toplam, 'hazirlaniyor']
> );
> const siparisId = siparisR.insertId;
> for (const item of urunler) {
>   await conn.query(
>     'INSERT INTO siparis_detaylari (siparis_id, urun_id, adet, birim_fiyat) VALUES (?, ?, ?, ?)',
>     [siparisId, item.urun_id, item.adet, u.fiyat]
>   );
>   await conn.query('UPDATE urunler SET stok = stok - ? WHERE id = ?', [item.adet, item.urun_id]);
> }
> ```
> 💬 *"3 işlem: siparişi ekle, her ürün için detay ekle, her ürünün stoğunu düşür. Hepsi aynı transaction içinde."*

### E) Commit veya Rollback
> 📍 **Satır 49-55**:
> 🔍
> ```js
> await conn.commit();
> res.json({ siparis_id: siparisId, toplam_tutar: toplam });
> } catch (e) {
>   await conn.rollback();
>   res.status(400).json({ hata: e.message });
> } finally {
>   conn.release();
> }
> ```
> 💬 *"Her şey başarılıysa COMMIT. Bir hata varsa ROLLBACK — tüm değişiklikler geri alınıyor, **yarım kalmış kayıt olmaz**."*

## 17:00–18:00 — Raporlar Sayfasında Canlı Demo

> 🖱 Site sekmesine geç → Admin → **"Raporlar & SQL"**.

> 💬 *"Tüm bu sorgular admin panelimizin Raporlar sayfasında **canlı çalışıyor**. Her birinin altında SQL kodu da gösterilir."*

> 🖱 Sayfayı yukarıdan aşağı kaydır.

> 💬 *"Toplam: 4 zorunlu gelişmiş sorgu + 1 bonus NOT IN sorgusu."*

---

## 18:00–20:00 — Kapanış + Soru-Cevap

> 💬 **(Kişi 3 son)** *"Özetle: 6 tablo, 12 sayfa, 18+ React-Bootstrap component'i, JWT auth, bcryptjs hash, MySQL transaction, 4 gelişmiş SQL sorgusu, çok adımlı checkout, dark/light mode ve responsive tasarımla tüm ders gereksinimlerini karşıladık. Sorularınız?"*

---

# 🆘 Olası Hoca Soruları + Cevaplar

| Soru | Cevap | Dosya Referansı |
|---|---|---|
| Şifreler nasıl korunuyor? | bcryptjs **10 round** hash. Plaintext yok. | `backend/routes/auth.js:13` |
| JWT nasıl çalışıyor? | jsonwebtoken ile 7 gün geçerli token. Backend her istekte verify. | `backend/middleware/auth.js:5-14` |
| WHERE vs HAVING farkı? | WHERE gruplamadan önce, HAVING sonra. Aggregate fonk. WHERE'de kullanılamaz. | `queries.sql:73-80` |
| JOIN vs Subquery farkı? | JOIN tabloları yan yana, daha hızlı. Subquery iç içe, esnek. | `queries.sql:28, 50` |
| Foreign key olmasaydı? | Veri tutarlılığı bozulurdu. Bizde CASCADE / SET NULL kullanıyoruz. | `backend/db/schema.sql:33, 43` |
| Stok yönetimi nasıl? | SELECT FOR UPDATE + Transaction. Race condition koruması. | `backend/routes/siparisler.js:18-22, 49-53` |
| Bu kadar görsel nereden? | DummyJSON API + Pixabay. UPDATE ile ürünler değiştirildi, ID'ler kaldı. | `backend/db/replace-products.js` |
| Frontend Bootstrap component'leri? | 18 farklı: Navbar, Card, Table, Modal, Form, Button, Alert, Badge, Pagination, Dropdown, Spinner, Carousel, Tabs, Accordion, ListGroup, Container, Row, Col, Image. | Tüm `frontend/src/pages/` |
| Responsive mi? | Evet. Bootstrap grid + custom media queries (600px, 768px, 992px, 1200px). | `frontend/src/styles/theme.css` |
| Veritabanı backup? | `npm run init-db` ile sıfırdan kurar. Grup arkadaşları aynı veriyi alabilir. | `backend/db/seed.js` |

---

# 🚨 Acil Durum (sunum sırasında bir şey çökse)

| Sorun | Çözüm |
|---|---|
| Frontend açılmıyor | Terminal: `cd frontend && npm run dev` |
| Backend cevap vermiyor | Terminal: `cd backend && npm run dev` |
| MySQL kapalı | `brew services start mysql` veya `nohup /opt/homebrew/opt/mysql/bin/mysqld --datadir=/opt/homebrew/var/mysql > /tmp/mysql.log 2>&1 &` |
| Port 4000/5173 dolu | `lsof -ti :4000 \| xargs kill -9` (veya 5173) |
| Veriler kayboldu | `cd backend && npm run init-db && node db/add-fake-users.js && node db/replace-products.js` |
| İntro çıkmıyor | F12 → konsol: `sessionStorage.clear()` → yenile |
| phpMyAdmin yok | XAMPP Control Panel → Apache + MySQL Start |

---

# 📋 Provayı Yap!

Bu rehberi en az 1 kez **baştan sona** kendiniz çalıştırın. Süre tutun. Geçişler smooth olsun.

**Başarılar! 🚀**
