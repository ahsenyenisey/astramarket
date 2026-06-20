# AstraMarket Sunum Rehberi
### 3 kişilik takım, 15-20 dakika hocaya sunum

> Bu dokümandaki her cümleyi **birebir** okuyabilir veya kendine uyarlayabilirsin.
> **🖱 KLIK** = ekranda ne tıklanacak. **💬 SÖYLE** = ne söyleneceği. **📁 GÖSTER** = hangi dosya/kod gösterilecek.

---

## ⚙️ Sunumdan 15 Dakika Önce Hazırlık

### 1. Servisleri Başlat
Terminal aç, projenin köküne git:
```bash
cd ~/Desktop/web_prog
./start.sh
```
Yeşil 3 ✓ görünmeli (MySQL, Backend, Frontend).

### 2. Veritabanını Sıfırla (temiz demo için)
```bash
cd backend
npm run init-db && node db/add-fake-users.js
```
Bu temiz veri verir: **20 kullanıcı, 6 kategori, 100 ürün, 30 sipariş, 150 yorum**.

### 3. Tarayıcıyı Hazırla (sıra önemli — sekmeler bu sırada açık olsun)
| # | Sekme | Adres | Niye |
|---|---|---|---|
| 1 | AstraMarket | `http://localhost:5173` | Ana site |
| 2 | phpMyAdmin VEYA DBeaver | `http://localhost/phpmyadmin` veya app | DB göster |
| 3 | VS Code | proje açık | Kod göstermek için |

### 4. VS Code'da Açık Dosyalar (alttaki tablardan sırayla erişebilesin)
- `backend/db/schema.sql`
- `backend/routes/raporlar.js`
- `queries.sql` (proje kökünde)
- `backend/routes/siparisler.js`
- `frontend/src/pages/Home.jsx`

### 5. Çıkış Yap
Tarayıcıda hesabın varsa çıkış yap, **intro loader** ilk kez gibi görünsün.
Konsol açıp: `sessionStorage.clear()` yaz → sayfayı kapat.

---

## 👥 Rol Dağılımı

| Kişi | Bölüm | Süre | İçerik |
|---|---|---|---|
| **Kişi 1** | Açılış + Müşteri tarafı | ~5 dk | Tasarım, navigasyon, sepet, sipariş |
| **Kişi 2** | Admin Paneli + CRUD | ~5 dk | Ürün/kullanıcı/kategori yönetimi |
| **Kişi 3** | Veritabanı + SQL (TEKNİK) | ~7 dk | Şema, 4 gelişmiş sorgu, transaction |

> Sırayla konuşun, kimin sırası geldiğini şu cümle ile geçin: *"Şimdi [isim] devralacak, veritabanı tarafını gösterecek."*

---

# 🎬 KİŞİ 1 — Açılış + Müşteri Akışı (5 dk)

## 0:00–0:45 — Açılış Konuşması

> 💬 *"Merhaba hocam, ben [isim]. Grupça **AstraMarket** adlı, Hepsiburada benzeri bir e-ticaret otomasyonu geliştirdik. Sunumumuzda önce müşteri tarafını, sonra admin panelini, en son veritabanı tarafını göstereceğiz."*

> 💬 *"Teknolojik olarak: **React + Vite** frontend, **Node.js + Express** backend, **MySQL/MariaDB** veritabanı. JWT ile authentication, bcryptjs ile şifre hash'leme kullanıyoruz."*

> 💬 *"Hızlı bir gereksinim özeti: 6 tablolu MySQL şeması, 8'den fazla sayfa, 15'ten fazla React-Bootstrap component'i, tüm tablolarda CRUD ve 4 gelişmiş SQL sorgusu içeriyor."*

## 0:45–1:30 — Intro Loader + Anasayfa

> 🖱 **Tarayıcı'ya geç** (sekme 1: localhost:5173)
> Eğer intro loader açıksa beklesin — **2 saniye** harf-harf gelen tagline'ı işaret et.

> 💬 *"Site ilk açılışta sinematik bir intro ile karşılıyor. Tasarım dili **sci-fi/uzay temasında** — koyu zemin, neon mor/pembe vurgular, glassmorphism cam efektler, partikül arka plan."*

> 🖱 **"Misafir olarak devam et"** butonuna tıkla

> 💬 *"Misafir olarak devam ettim. Şimdi anasayfaya geçti."*

Anasayfada şunlara işaret et:
- 💬 *"Arka planda gördüğünüz **14 logo**, mouse hareketine tepki veriyor — yaklaşınca uzaklaşıyor ve parlıyor."* (mouse'u logoya yaklaştır, parlamayı göster)
- 💬 *"Bunlar tamamen CSS + JS ile yapıldı, three.js gibi ağır kütüphaneler yok."*

## 1:30–2:30 — Kategoriler + Filtreleme + Ürün Detay

> 🖱 **Navbar'da "Kategoriler ▾"** tıkla
> 💬 *"Kategoriler dropdown'ı 6 kategoriyi listeliyor. Her kategorinin pages açılışı animasyonlu."*

> 🖱 **"Elektronik"** seç
> 💬 *"URL `?kategori=1` parametresi alıyor, anasayfaya otomatik yönlendiriyor ve sadece elektronik ürünleri gösteriyor. Tüm 100 ürün **DummyJSON API**'sinden çekilmiş gerçek ürün isimleri ve görseller."*

> 🖱 Bir ürüne tıkla (örn. **iPhone**)
> 💬 *"Ürün detay sayfasında: yıldız puanı, açıklama, stok bilgisi, adet seçici ve yorumlar var."*

> 💬 *"Giriş yapan kullanıcı yorum ekleyip silebiliyor. Şimdi giriş yapmadığım için yorum kısmında uyarı çıkıyor."* (yorumlar bölümünü göster)

## 2:30–3:30 — Login + Yorum + Sepet

> 🖱 Sağ üstte **"Giriş / Kayıt"** → `ayse@mail.com` / `musteri123` ile giriş

> 💬 *"JWT token alıp localStorage'a kaydediyor. Giriş yaptım."*

> 🖱 **Aynı ürüne tekrar git** → Yorum formuna **5 yıldız + "Harika ürün"** yaz → **Gönder**
> 💬 *"Yorum eklendi. 'Sizin yorumunuz' badge'i ve silme butonu çıktı."*

> 🖱 **Adet 2** yap → **"Sepete Ekle"**
> 💬 *"Navbar'daki sepet badge'i bounce animasyonuyla 2 oldu."*

## 3:30–4:30 — Sepet + Sipariş

> 🖱 **Sepet**'e tıkla
> 💬 *"Sepet sayfasında ürün, adet kontrolü, ara toplam, kargo bilgisi var. 500 TL üzeri ücretsiz kargo, altıysa 'X TL daha ekle, kargo ücretsiz olsun' uyarısı çıkıyor."*

> 🖱 **"Siparişi Tamamla"**
> 💬 *"Bu buton **MySQL TRANSACTION** başlatıyor. Önce stok kontrolü yapıyor, yeterli stoğu kilitliyor (`SELECT FOR UPDATE`), sonra `siparisler` ve `siparis_detaylari` tablolarına kayıt atıyor, en son ilgili ürünlerin stoğunu düşürüyor. Hata olursa rollback yapıyor."*

> 💬 *"Otomatik olarak Siparişlerim sayfasına yönlendirildi."*

## 4:30–5:00 — Diğer Sayfalar (kısa tur)

> 🖱 Navbar'da **"🔥 Süper Fiyat, Süper Teklif"**
> 💬 *"İndirimli ürünleri yüzdeye göre kategorize ediyor, geri sayım var."*

> 🖱 **"Kampanyalar"**
> 💬 *"6 farklı kampanya kartı, renkli gradient'ler."*

> 🖱 **"Müşteri Hizmetleri ▾"** → **"⭐ AstraMarket Premium"**
> 💬 *"Premium üyelik sayfası — altın gradient hero, 6 avantaj, 3 üyelik planı."*

> 💬 *"Şimdi [Kişi 2 ismi] admin panelini gösterecek."*

---

# 👨‍💼 KİŞİ 2 — Admin Paneli + CRUD (5 dk)

## 5:00–5:30 — Admin Girişi + Route Koruması

> 🖱 Sağ üstte **kullanıcı adı dropdown** → **"Çıkış Yap"**
> 🖱 **Giriş / Kayıt** → `admin@eticaret.com` / `admin123` ile giriş

> 💬 *"Admin hesabıyla girdim. Sistem otomatik olarak admin paneline yönlendirdi."*

> 💬 *"Önemli güvenlik: admin sayfaları **`ProtectedRoute adminOnly`** ile korunuyor. Müşteri rolündeki biri URL'i manuel yazsa bile login sayfasına atılıyor 'yetkiniz yok' uyarısıyla."*

> 🖱 URL'i manuel olarak **`/admin/raporlar`** yap (zaten admin olarak girdiğin için sorun olmaz, route koruması çalıştığını göstermek için anlatabilirsin)

## 5:30–6:30 — Ürün CRUD (Create + Update + Delete)

> 🖱 Sol sidebar'dan **"Ürün Yönetimi"**
> 💬 *"Tabloda 100 ürün listeleniyor. Düzenle ve sil butonları var."*

### CREATE
> 🖱 **"+ Yeni Ürün"** butonu
> 💬 *"Modal açıldı. Form Bootstrap'in `Modal` ve `Form` componentleri kullanıyor."*

Form doldur:
- **Ad:** `Demo Ürün`
- **Fiyat:** `999`
- **Stok:** `10`
- **Kategori:** Elektronik
- **Açıklama:** `Sunum için demo`

> 🖱 **Kaydet**
> 💬 *"`POST /api/urunler` çağrıldı, JWT token kontrol edildi (admin mi diye), veritabanına eklendi. Tablonun en üstünde yeni ürün."*

### UPDATE
> 🖱 Yeni eklenen ürünün **Düzenle** butonu
> Fiyatı `799` yap
> 🖱 **Kaydet**
> 💬 *"`PUT /api/urunler/:id` çağrıldı, güncellendi."*

### DELETE
> 🖱 Aynı ürünün **Sil** butonu → Onay modal'ı → **Evet, Sil**
> 💬 *"`DELETE /api/urunler/:id` çağrıldı. Sipariş detaylarına bağlı değildi, silindi."*

## 6:30–7:30 — Kullanıcı & Kategori CRUD

> 🖱 Sol sidebar **"Kullanıcı & Kategori"**
> 💬 *"İki sekme var. Kullanıcılar sekmesinde 20 kullanıcı (1 admin + 19 müşteri)."*

> 🖱 **Kategoriler** sekmesi
> 🖱 **+ Yeni Kategori** → `Test Kategori` → Kaydet
> 💬 *"Eklendi."*
> 🖱 Sil → Onay → Evet
> 💬 *"Silindi. Tüm tablolarda CRUD işlemleri çalışıyor."*

## 7:30–8:30 — Sipariş & Yorum Yönetimi (göster ama tıklama)

> 🖱 Müşteri tarafına geri dön — bir ürün detayına git
> Yorum varsa — admin olduğun için **her yorumda Sil butonu** görünür
> 💬 *"Admin tüm yorumları silebiliyor. Müşteri ise sadece kendi yorumunu silebiliyor — `routes/yorumlar.js` içinde kontrol var."*

> 📁 İstersen VS Code'a geç:
> - **`backend/routes/yorumlar.js` satır 22-27** — sahip veya admin kontrolü
> 💬 *"Bu kod parçası ya kendi yorumu ya da admin değilse 403 dönüyor."*

## 8:30–10:00 — Tasarım Detayları

> 🖱 Tema toggle butonu (☀ / ☾)
> 💬 *"Dark/Light mode toggle var, localStorage'da kalıcı."*

> 🖱 Light moda geç → kısa göster → tekrar dark moda dön

> 💬 *"Tüm sayfalar responsive. Mobil için arka plan logoları azalır, navbar collapse olur."*

> 💬 *"Şimdi [Kişi 3 ismi] veritabanı tarafını gösterecek."*

---

# 🗄 KİŞİ 3 — Veritabanı + SQL (7 dk) **EN TEKNİK BÖLÜM**

## 10:00–10:30 — DB Bağlantısı + Genel Görünüm

> 🖱 **phpMyAdmin sekmesine geç** (veya DBeaver)
> 🖱 Sol panelden **`eticaret_db`** seç

> 💬 *"Veritabanımızı **MySQL/MariaDB**'de tuttuk. Tüm tablolar `utf8mb4` charset ile, Türkçe karakter sorunu yaşamadık."*

> 💬 *"6 tablomuz var:"*
- `kullanicilar` (20 satır)
- `kategoriler` (6 satır)
- `urunler` (100 satır)
- `siparisler` (30 satır)
- `siparis_detaylari` (~30 satır)
- `yorumlar` (~150 satır)

## 10:30–11:30 — Tablo Yapısı (schema.sql)

> 📁 VS Code'a geç → **`backend/db/schema.sql`** aç

### Anlatılacak Satırlar
**Satır 1-5** (DB oluşturma):
```sql
CREATE DATABASE eticaret_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
> 💬 *"utf8mb4 kullandık çünkü emoji ve tüm Türkçe karakterleri destekliyor."*

**Satır 7-14** (kullanicilar):
```sql
CREATE TABLE kullanicilar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'musteri') DEFAULT 'musteri',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```
> 💬 *"Email UNIQUE — aynı mail ile kayıt yapılamaz. Şifreyi bcrypt hash'iyle saklıyoruz, VARCHAR(255). Rol ENUM kullandık — sadece 'admin' veya 'musteri' olabilir."*

**Satır 23-34** (urunler tablosu):
```sql
FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE SET NULL
```
> 💬 *"Foreign key kullandık. Kategori silindiğinde, o kategorideki ürünlerin `kategori_id` alanı `NULL` oluyor — ürün silinmiyor."*

**Satır 36-44** (siparisler):
```sql
FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
```
> 💬 *"Burada `ON DELETE CASCADE` — bir kullanıcı silinirse tüm siparişleri otomatik siliniyor."*

**Satır 58-67** (yorumlar — CHECK constraint):
```sql
puan INT CHECK (puan BETWEEN 1 AND 5)
```
> 💬 *"`CHECK` constraint ile puan 1-5 arası garanti. MariaDB 10.2+ destekliyor."*

## 11:30–12:30 — phpMyAdmin'de Designer (ER Diyagramı)

> 🖱 phpMyAdmin'e geç → `eticaret_db` seç → üst menüden **"Designer"** sekmesi
> 💬 *"İşte ilişkilerin görsel hali. 6 tablo, foreign key okları görünüyor."*

> 💬 *"İlişkiler şöyle:"*
- `kullanicilar` → `siparisler` (1-N)
- `siparisler` → `siparis_detaylari` (1-N)
- `siparis_detaylari` → `urunler` (N-1)
- `urunler` → `kategoriler` (N-1)
- `yorumlar` → `urunler` ve `kullanicilar` (N-1, N-1)

> 💬 *"Şimdi gelişmiş SQL sorgularına geçelim."*

## 12:30–15:00 — 4 GELİŞMİŞ SQL SORGUSU (DERS GEREKSİNİMİ)

> 📁 VS Code'da **`queries.sql`** aç (proje kökü)
> 🖱 phpMyAdmin → **SQL** sekmesi

### 🔹 SORGU 1: GROUP BY + JOIN
**Amaç:** Her kategorideki ürün sayısı + toplam satış tutarı

> 📁 queries.sql **satır 28-34** göster:
```sql
SELECT k.ad AS kategori,
       COUNT(DISTINCT u.id) AS urun_sayisi,
       COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
FROM kategoriler k
LEFT JOIN urunler u           ON u.kategori_id = k.id
LEFT JOIN siparis_detaylari sd ON sd.urun_id    = u.id
GROUP BY k.id, k.ad
ORDER BY toplam_satis DESC;
```

> 💬 *"Bu sorgu iki tane LEFT JOIN ile 3 tabloyu birleştiriyor. LEFT JOIN kullandık çünkü hiç ürünü olmayan kategoriler de listede çıksın istedik — onların toplam satışı 0 olacak."*

> 💬 *"`COUNT(DISTINCT u.id)` — aynı ürün birden fazla siparişte olsa bile bir kez sayılıyor."*

> 💬 *"`COALESCE` — NULL değerleri 0'a çeviriyor."*

> 🖱 **Sorguyu kopyala** → phpMyAdmin SQL sekmesine yapıştır → **Git**
> 💬 *"Görüldüğü gibi 6 kategori, satış tutarına göre sıralanmış."*

### 🔹 SORGU 2: SUBQUERY (İÇ İÇE SORGU)
**Amaç:** Ortalama fiyatın üzerindeki ürünler

> 📁 queries.sql **satır 50-54** göster:
```sql
SELECT id, ad, fiyat,
       (SELECT ROUND(AVG(fiyat), 2) FROM urunler) AS genel_ortalama
FROM urunler
WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
ORDER BY fiyat DESC;
```

> 💬 *"WHERE içindeki parantezli SELECT bir 'subquery' — iç sorgu. Önce iç sorgu çalışıyor, tüm ürünlerin ortalamasını hesaplıyor. Sonra dış sorgu bu değerden büyük ürünleri filtreliyor."*

> 💬 *"Ayrıca SELECT içine de bir subquery koyduk — sonuç tablosunda 'genel_ortalama' kolonu olarak ortalamayı da gösteriyoruz."*

> 🖱 Sorguyu phpMyAdmin'de çalıştır
> 💬 *"Mesela 100 üründen, ortalama fiyatın (örnek 1500 TL) üzerinde olanlar listelendi."*

### 🔹 SORGU 3: GROUP BY + HAVING
**Amaç:** 3'ten fazla sipariş veren aktif müşteriler

> 📁 queries.sql **satır 73-80** göster:
```sql
SELECT k.id, k.ad, k.email,
       COUNT(s.id) AS siparis_sayisi,
       SUM(s.toplam_tutar) AS toplam_harcama
FROM kullanicilar k
INNER JOIN siparisler s ON s.kullanici_id = k.id
GROUP BY k.id, k.ad, k.email
HAVING COUNT(s.id) > 3
ORDER BY toplam_harcama DESC;
```

> 💬 *"En önemli noktası: **WHERE ile HAVING farkı**. WHERE satırları gruplamadan ÖNCE filtreler. HAVING ise GRUPLANMIŞ sonuçları filtreler."*

> 💬 *"`COUNT(s.id)` bir aggregate fonksiyon, WHERE'de kullanılamaz — HAVING gerekli. Bu sorgu 3'ten fazla siparişi olan müşterileri buluyor."*

> 🖱 phpMyAdmin'de çalıştır
> 💬 *"Mesela Ayşe Yılmaz 8 siparişle en aktif müşteri."*

### 🔹 SORGU 4: SUBQUERY + JOIN (Korelasyonlu)
**Amaç:** En çok yorum alan ürünler + ortalama puan

> 📁 queries.sql **satır 99-104** göster:
```sql
SELECT u.id, u.ad, u.fiyat,
       (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
       (SELECT ROUND(AVG(puan), 2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
FROM urunler u
WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
ORDER BY yorum_sayisi DESC, ortalama_puan DESC
LIMIT 10;
```

> 💬 *"Bu **korelasyonlu subquery**. İç sorgu, dış sorgudaki her ürün için ayrı ayrı çalışıyor — `WHERE y.urun_id = u.id` bunu sağlıyor."*

> 💬 *"SELECT içine 2 subquery koyduk: yorum sayısı ve ortalama puan."*

> 🖱 phpMyAdmin'de çalıştır
> 💬 *"En çok yorum alan 10 ürün listelendi."*

### 🔹 BONUS SORGU 5: NOT IN
**Amaç:** Hiç sipariş edilmemiş ürünler

> 📁 queries.sql **satır 119-123** göster:
```sql
SELECT u.id, u.ad, u.fiyat, u.stok, k.ad AS kategori
FROM urunler u
LEFT JOIN kategoriler k ON k.id = u.kategori_id
WHERE u.id NOT IN (SELECT DISTINCT urun_id FROM siparis_detaylari)
ORDER BY u.fiyat DESC;
```

> 💬 *"Bir tür 'fark kümesi' sorgusu — bonus olarak ekledik. Hiç sipariş edilmemiş ürünleri bulup stok fazlalığı analizi yapabiliyoruz."*

## 15:00–17:00 — Transaction (Sipariş Verme Mantığı)

> 📁 VS Code'da **`backend/routes/siparisler.js`** aç
> 📁 **Satır 10-58** göster (POST endpoint)

> 💬 *"En önemli backend mantığımız bu. Sipariş oluşturma."*

**Satır 14-15** göster:
```js
const conn = await pool.getConnection();
try {
  await conn.beginTransaction();
```
> 💬 *"Önce connection alıyoruz ve `beginTransaction()` çağırıyoruz. Bu noktadan sonra ya hepsi başarılı olur ya hiçbiri."*

**Satır 18-22** göster:
```js
const [rows] = await conn.query(
  `SELECT id, ad, fiyat, stok FROM urunler WHERE id IN (${placeholders}) FOR UPDATE`,
  ids
);
```
> 💬 *"`SELECT ... FOR UPDATE` — bu satırları **kilitliyor**. Başka bir sipariş aynı anda gelirse bekliyor. Race condition'a karşı koruma."*

**Satır 26-30** göster:
```js
if (u.stok < item.adet) throw new Error(`${u.ad} için yeterli stok yok`);
```
> 💬 *"Stok yetersizse hata atıyoruz."*

**Satır 49** göster:
```js
await conn.commit();
```
> 💬 *"Her şey başarılıysa commit yapıyoruz, transaction tamamlanıyor."*

**Satır 51-53** göster:
```js
} catch (e) {
  await conn.rollback();
```
> 💬 *"Hata olursa rollback — tüm değişiklikler geri alınıyor. Yarım kalmış kayıt olmaz."*

## 17:00–18:00 — Rapor Sayfasını Demo (Bonus)

> 🖱 AstraMarket sekmesine geç → Admin → Sol sidebar **"Raporlar & SQL"**

> 💬 *"Tüm bu sorgular admin panelimizin Raporlar sayfasında **canlı çalışıyor**. Her birinin altında sorgu kodu da yazıyor, hocaya kolayca gösterebiliyoruz."*

> 🖱 Sayfayı yukarıdan aşağı kaydır, her bir sorgu kartını göster.

---

## 18:00–20:00 — Kapanış + Soru-Cevap

> 💬 **(Kişi 3 sonunda)** *"Özetle: 6 tablo, 8+ sayfa, 15+ component, JWT auth, MySQL transaction, 4 gelişmiş SQL sorgusu, dark/light mode ve responsive tasarımla tüm ders gereksinimlerini karşıladık. Sorularınız?"*

---

# 🆘 Olası Hoca Soruları + Cevaplar

### S: Şifreler nasıl güvenlik altında?
**C:** bcryptjs ile **10 round** hash'liyoruz. Login'de `bcrypt.compare()` ile doğruluyoruz. Veritabanında hash hali var, plaintext yok.

### S: JWT nasıl çalışıyor?
**C:** Login başarılıysa server JWT token üretip dönüyor (`jsonwebtoken` ile). Frontend bunu **localStorage**'a kaydediyor. Sonraki isteklerde Authorization header'da gönderiyor. Backend middleware'de doğruluyor (`backend/middleware/auth.js`).

### S: Stok yönetimi nasıl?
**C:** `SELECT FOR UPDATE` ile satırı kilitliyoruz (race condition koruması), `START TRANSACTION` ile atomik işlem, stok yetersizse `ROLLBACK`.

### S: Foreign key olmasaydı ne olurdu?
**C:** Veri tutarlılığı bozulurdu. Mesela bir kategori silindiğinde ürünlerin `kategori_id` alanı hâlâ silinmiş kategoriyi gösterirdi. Bizde `ON DELETE SET NULL` ile o ürünler kategorisiz kalır ama veri korunur.

### S: Subquery vs JOIN farkı?
**C:** JOIN tabloları yan yana koyup tek query'de işliyor. Subquery iç içe sorgu, tek değer veya liste döndürüyor. JOIN genelde daha hızlı ama bazı durumlarda subquery daha okunaklı.

### S: WHERE ile HAVING farkı?
**C:** WHERE satırları gruplamadan **önce** filtreler. HAVING grupları gruplandıktan **sonra** filtreler. `COUNT()`, `SUM()` gibi aggregate fonksiyonlar WHERE'de kullanılamaz, HAVING'de kullanılır.

### S: Frontend hangi component'leri kullandınız?
**C:** Navbar, Card, Table, Modal, Form, Button, Alert, Badge, Pagination, Dropdown, Spinner, Carousel, Tabs, Accordion, ListGroup, Container, Row, Col, Image — **18 farklı çeşit**, ders gereksinimi olan 10'un üzerinde.

### S: Responsive mi?
**C:** Evet. Bootstrap grid + custom media queries. Mobilde admin sidebar yatay, partikül/blob sayısı azalır.

### S: Bu kadar görseli nereden buldunuz?
**C:** DummyJSON.com API'sinden 24 farklı kategoride gerçek ürün isimleri ve fotoğrafları çektik. `backend/db/replace-products.js` scripti UPDATE ile mevcut ürünlerin ad, fiyat, görsel ve açıklamalarını değiştiriyor — siparişler bozulmuyor çünkü ID'ler aynı kalıyor.

### S: Tasarım nasıl yapıldı?
**C:** Tamamen custom CSS. Sci-fi/futuristik tema: koyu zemin, neon mor/pembe vurgular, glassmorphism cam efektler, partikül arka plan (canvas-based, three.js yok), parallax bloblar, scroll-driven animasyonlar. Light mode için ayrı CSS variables setiyle theme toggle var.

### S: Veritabanı yedeklemesi nasıl?
**C:** `npm run init-db` sıfırdan kurar. `add-fake-users.js` ek kullanıcı ekler. `replace-products.js` ürünleri DummyJSON'dan günceller. Tüm bunlar repo'da, grup arkadaşları kendi PC'lerinde aynı veriyi alabiliyor.

---

# 🆘 Eğer Bir Şey Çökse

| Sorun | Çözüm |
|---|---|
| Frontend açılmıyor | Terminal: `cd frontend && npm run dev` |
| Backend cevap vermiyor | Terminal: `cd backend && npm run dev` |
| MySQL kapalı | Terminal: `brew services start mysql` veya `nohup /opt/homebrew/opt/mysql/bin/mysqld --datadir=/opt/homebrew/var/mysql > /tmp/mysql.log 2>&1 &` |
| Veriler kayboldu | `cd backend && npm run init-db && node db/add-fake-users.js && node db/replace-products.js` |
| Site'da intro çıkmıyor | Konsol: `sessionStorage.clear()` → sayfa yenile |
| Port 4000 dolu | `lsof -ti :4000 \| xargs kill -9` |
| phpMyAdmin görünmüyor | XAMPP Control Panel → Apache + MySQL Start |

---

# 📋 Provayı Yap!

Bu rehberi en az 1 kez baştan sona kendiniz çalıştırın. Süre tut, geçmemesine dikkat edin. Soruları arkadaşlarınızla simule edin.

**Başarılar! 🚀**
