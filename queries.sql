-- ===================================================================
-- AstraMarket - Gelişmiş SQL Sorguları (Ders Gereksinimi)
--
-- KULLANIM (phpMyAdmin):
--   1. Sol panelden  eticaret_db  veritabanını seçin
--   2. Üst menüden   SQL  sekmesine geçin
--   3. Aşağıdaki sorgulardan birini kopyalayıp yapıştırın
--   4. "Git" / "Çalıştır" butonuna basın
--   5. Sonuç altta tablo halinde gelir
--
-- Her sorgunun üstünde hangi gelişmiş SQL özelliğini kullandığı
-- yorum satırında açıklanmıştır.
-- ===================================================================

USE eticaret_db;


-- ===================================================================
-- SORGU 1: GROUP BY + JOIN
-- -------------------------------------------------------------------
-- Amaç: Her kategorideki ürün sayısını ve toplam satış tutarını listele.
--
-- Açıklama:
--   - LEFT JOIN sayesinde hiç ürünü/satışı olmayan kategoriler de
--     listeye dahil olur (toplam satış 0 görünür).
--   - COUNT(DISTINCT u.id) ile aynı ürün birden fazla siparişte olsa
--     da bir kez sayılır.
--   - COALESCE(SUM(...), 0) ile NULL değerler sıfıra çevrilir.
--   - GROUP BY ile kategori bazında gruplanır.
-- ===================================================================
SELECT k.ad AS kategori,
       COUNT(DISTINCT u.id) AS urun_sayisi,
       COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
FROM kategoriler k
LEFT JOIN urunler u           ON u.kategori_id = k.id
LEFT JOIN siparis_detaylari sd ON sd.urun_id    = u.id
GROUP BY k.id, k.ad
ORDER BY toplam_satis DESC;


-- ===================================================================
-- SORGU 2: İÇ İÇE SORGU (SUBQUERY)
-- -------------------------------------------------------------------
-- Amaç: Tüm ürünlerin ortalama fiyatının üzerindeki ürünleri listele.
--
-- Açıklama:
--   - WHERE içindeki parantezli SELECT, bir "iç sorgu" (subquery).
--   - Önce iç sorgu çalışır: SELECT AVG(fiyat) FROM urunler  -->  tek
--     sayı döner (örn. 4523.40)
--   - Sonra dış sorgu, bu değerden büyük fiyatlı ürünleri getirir.
--   - Ayrıca SELECT içine de bir subquery ekledik: ortalama fiyatı
--     da sonuç tablosunda göstermek için.
-- ===================================================================
SELECT id, ad, fiyat,
       (SELECT ROUND(AVG(fiyat), 2) FROM urunler) AS genel_ortalama
FROM urunler
WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
ORDER BY fiyat DESC;


-- ===================================================================
-- SORGU 3: GROUP BY + HAVING
-- -------------------------------------------------------------------
-- Amaç: 3'ten fazla sipariş veren müşterileri (aktif müşterileri)
--       toplam harcamalarıyla birlikte listele.
--
-- Açıklama:
--   - WHERE, satır seviyesinde filtre uygular (gruplamadan ÖNCE).
--   - HAVING ise GROUP BY ile oluşan GRUPLARA filtre uygular.
--   - Bu sorguda her müşterinin sipariş sayısını grup olarak hesaplıyoruz
--     ve HAVING ile "sipariş sayısı 3'ten fazla olanları" alıyoruz.
--   - JOIN ile siparişler tablosu kullanıcılar tablosuna bağlanıyor.
-- ===================================================================
SELECT k.id, k.ad, k.email,
       COUNT(s.id) AS siparis_sayisi,
       SUM(s.toplam_tutar) AS toplam_harcama
FROM kullanicilar k
INNER JOIN siparisler s ON s.kullanici_id = k.id
GROUP BY k.id, k.ad, k.email
HAVING COUNT(s.id) > 3
ORDER BY toplam_harcama DESC;


-- ===================================================================
-- SORGU 4: İÇ İÇE SORGU + JOIN (Korelasyonlu Subquery)
-- -------------------------------------------------------------------
-- Amaç: En çok yorum alan ürünleri ve ortalama puanlarıyla birlikte
--       listele (en çok ilgi gören ürünler analizi).
--
-- Açıklama:
--   - SELECT içine YERLEŞTİRİLMİŞ iki ayrı subquery var:
--       (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id)
--       (SELECT AVG(puan) FROM yorumlar y WHERE y.urun_id = u.id)
--   - Bunlar "korelasyonlu subquery" — dış sorgudaki her ürün için
--     ayrı ayrı çalışır (u.id'ye bağlı).
--   - WHERE'deki subquery, yorum sayısı 0'dan büyük olan ürünleri
--     filtreler (sadece yorum alan ürünler listelenir).
--   - LIMIT 10 ile en çok yorumlu ilk 10 ürünü alır.
-- ===================================================================
SELECT u.id, u.ad, u.fiyat,
       (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
       (SELECT ROUND(AVG(puan), 2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
FROM urunler u
WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
ORDER BY yorum_sayisi DESC, ortalama_puan DESC
LIMIT 10;


-- ===================================================================
-- BONUS SORGU 5: İÇ İÇE NOT IN (Negatif filtreleme)
-- -------------------------------------------------------------------
-- Amaç: Hiç sipariş edilmemiş ürünleri tespit et (stok fazlalığı
--       analizi için kullanılabilir).
--
-- Açıklama:
--   - İç sorgu: "şimdiye kadar sipariş edilen ürün id'leri"
--   - Dış sorgu: bu listede OLMAYAN ürünleri getirir (NOT IN).
--   - Bir tür "fark kümesi" sorgusu.
-- ===================================================================
SELECT u.id, u.ad, u.fiyat, u.stok, k.ad AS kategori
FROM urunler u
LEFT JOIN kategoriler k ON k.id = u.kategori_id
WHERE u.id NOT IN (SELECT DISTINCT urun_id FROM siparis_detaylari)
ORDER BY u.fiyat DESC;
