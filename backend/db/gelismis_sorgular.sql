-- =============================================================
-- E-TICARET PROJESI - GELISMIS SQL SORGULARI
-- Bu dosyayi DBeaver'da Cmd+O ile ac, sorgulari teker teker
-- secip Cmd+Enter ile calistir.
-- =============================================================

USE eticaret_db;
eticaret_db
-- -------------------------------------------------------------
-- SORGU 1: GROUP BY + JOIN
-- Her kategorideki urun sayisi ve toplam satis tutari.
-- LEFT JOIN sayesinde hic urunu olmayan kategoriler de listelenir.
-- Toplam satis tutari = adet * birim_fiyat'in toplami.
-- -------------------------------------------------------------
SELECT k.ad AS kategori,
       COUNT(DISTINCT u.id) AS urun_sayisi,
       COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
FROM kategoriler k
LEFT JOIN urunler u ON u.kategori_id = k.id
LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
GROUP BY k.id, k.ad
ORDER BY toplam_satis DESC;


-- -------------------------------------------------------------
-- SORGU 2: IC ICE SORGU (SUBQUERY)
-- Tum urunlerin ortalama fiyatinin uzerindeki urunler.
-- WHERE icindeki parantezli SELECT ile dinamik olarak
-- her zaman guncel ortalama hesaplanir.
-- -------------------------------------------------------------
SELECT id, ad, fiyat,
       (SELECT ROUND(AVG(fiyat), 2) FROM urunler) AS genel_ortalama
FROM urunler
WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
ORDER BY fiyat DESC;


-- -------------------------------------------------------------
-- SORGU 3: GROUP BY + HAVING
-- 3'ten fazla siparis veren musteriler (aktif musteriler).
-- HAVING, GROUP BY sonrasi gruplara filtre uygular
-- (WHERE'den farkli olarak).
-- -------------------------------------------------------------
SELECT k.id, k.ad, k.email,
       COUNT(s.id) AS siparis_sayisi,
       SUM(s.toplam_tutar) AS toplam_harcama
FROM kullanicilar k
JOIN siparisler s ON s.kullanici_id = k.id
GROUP BY k.id, k.ad, k.email
HAVING COUNT(s.id) > 3
ORDER BY toplam_harcama DESC;


-- -------------------------------------------------------------
-- SORGU 4: IC ICE SORGU + JOIN
-- En cok yorum alan urunler ve ortalama puanlari.
-- SELECT icinde iki subquery: biri yorum sayisi,
-- digeri ortalama puan icin.
-- -------------------------------------------------------------
SELECT u.id, u.ad, u.fiyat,
       (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
       (SELECT ROUND(AVG(puan), 2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
FROM urunler u
WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
ORDER BY yorum_sayisi DESC, ortalama_puan DESC
LIMIT 10;


-- -------------------------------------------------------------
-- BONUS SORGU 5: IC ICE NOT IN
-- Hic siparis edilmemis urunler (satilamayan urunler analizi).
-- "u.id NOT IN (...)" subquery ile siparise giren urunleri haric tut.
-- -------------------------------------------------------------
SELECT u.id, u.ad, u.fiyat, u.stok, k.ad AS kategori
FROM urunler u
LEFT JOIN kategoriler k ON k.id = u.kategori_id
WHERE u.id NOT IN (SELECT DISTINCT urun_id FROM siparis_detaylari)
ORDER BY u.fiyat DESC;
