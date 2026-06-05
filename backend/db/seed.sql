USE eticaret_db;

-- Kullanicilar seed.js icinde bcrypt ile hashlenip eklenir.
-- Bu dosya sadece kullanicilar olusturulduktan sonra calistirilmalidir.

-- Kategoriler
INSERT INTO kategoriler (ad, aciklama) VALUES
('Elektronik', 'Telefon, bilgisayar, televizyon ve diğer elektronik ürünler'),
('Giyim', 'Erkek, kadın ve çocuk giyim ürünleri'),
('Ev & Yaşam', 'Mobilya, dekorasyon, mutfak ürünleri'),
('Kitap', 'Roman, ders kitabı, çocuk kitapları'),
('Spor', 'Spor giyim, ekipman ve aksesuarlar'),
('Kozmetik', 'Bakım, makyaj ve parfüm ürünleri');

-- Urunler
INSERT INTO urunler (ad, fiyat, stok, kategori_id, resim_url, aciklama) VALUES
('iPhone 15 Pro', 54999.00, 25, 1, 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=400', 'Apple iPhone 15 Pro 256 GB Titanium'),
('Samsung Galaxy S24', 39999.00, 30, 1, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 'Samsung Galaxy S24 256 GB siyah'),
('MacBook Air M3', 44999.00, 15, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 'Apple MacBook Air 13 inç M3 çipli'),
('Sony WH-1000XM5', 12999.00, 50, 1, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', 'Sony kablosuz gürültü engelleyici kulaklık'),
('Erkek Polo Tişört', 299.90, 100, 2, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', 'Pamuklu erkek polo yaka tişört'),
('Kadın Trençkot', 1499.00, 40, 2, 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', 'Bej rengi kadın trençkot'),
('Kot Pantolon', 599.90, 80, 2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'Slim fit erkek kot pantolon'),
('Ahşap Yemek Masası', 4999.00, 10, 3, 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400', '6 kişilik ahşap yemek masası'),
('Yatak Örtüsü Seti', 899.00, 35, 3, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400', 'Pamuklu çift kişilik yatak örtüsü'),
('Kahve Makinesi', 2799.00, 20, 3, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 'Otomatik espresso kahve makinesi'),
('Suç ve Ceza', 89.90, 200, 4, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'Dostoyevski klasik roman'),
('Yapay Zeka', 149.00, 60, 4, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 'Yapay zekaya giriş kitabı'),
('Koşu Ayakkabısı', 1899.00, 45, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Nike Air Zoom Pegasus 40'),
('Yoga Matı', 399.00, 70, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 'Kalın kaymaz yoga matı'),
('Parfüm 100ml', 1299.00, 25, 6, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 'Unisex eau de parfum 100ml'),
('Nemlendirici Krem', 249.00, 90, 6, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'Yüz nemlendirici krem 50ml'),
('Akıllı Saat', 4499.00, 30, 1, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Su geçirmez akıllı saat'),
('Bluetooth Hoparlör', 1599.00, 55, 1, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'JBL taşınabilir hoparlör');

-- Siparisler (Ayse=2, Mehmet=3, Fatma=4, Ali=5)
INSERT INTO siparisler (kullanici_id, toplam_tutar, durum, tarih) VALUES
(2, 54999.00, 'teslim_edildi', '2026-05-01 10:00:00'),
(2, 12999.00, 'teslim_edildi', '2026-05-05 11:00:00'),
(2, 1499.00, 'kargolandi',   '2026-05-20 12:00:00'),
(2, 299.90,   'teslim_edildi', '2026-05-22 12:00:00'),
(2, 89.90,    'teslim_edildi', '2026-05-25 12:00:00'),
(2, 4499.00, 'hazirlaniyor', '2026-06-01 09:00:00'),
(3, 39999.00, 'teslim_edildi', '2026-05-03 14:00:00'),
(3, 599.90,   'teslim_edildi', '2026-05-10 14:00:00'),
(3, 1899.00, 'kargolandi',   '2026-05-28 15:00:00'),
(4, 44999.00, 'teslim_edildi', '2026-05-07 09:30:00'),
(4, 2799.00, 'teslim_edildi', '2026-05-15 09:30:00'),
(5, 4999.00, 'teslim_edildi', '2026-05-12 16:00:00'),
(5, 1299.00, 'kargolandi',   '2026-05-30 16:00:00');

-- Siparis detaylari
INSERT INTO siparis_detaylari (siparis_id, urun_id, adet, birim_fiyat) VALUES
(1, 1, 1, 54999.00),
(2, 4, 1, 12999.00),
(3, 6, 1, 1499.00),
(4, 5, 1, 299.90),
(5, 11, 1, 89.90),
(6, 17, 1, 4499.00),
(7, 2, 1, 39999.00),
(8, 7, 1, 599.90),
(9, 13, 1, 1899.00),
(10, 3, 1, 44999.00),
(11, 10, 1, 2799.00),
(12, 8, 1, 4999.00),
(13, 15, 1, 1299.00);

-- Yorumlar
INSERT INTO yorumlar (urun_id, kullanici_id, puan, yorum_metni) VALUES
(1, 2, 5, 'Harika bir telefon, çok memnunum!'),
(1, 3, 4, 'Pili biraz daha iyi olabilirdi.'),
(1, 4, 5, 'Mükemmel kamera.'),
(2, 3, 5, 'Samsung yine yapmış yapacağını.'),
(4, 2, 5, 'Ses kalitesi mükemmel, gürültü engelleme çok iyi.'),
(4, 5, 4, 'Konforlu ama biraz pahalı.'),
(5, 2, 3, 'Beden ölçüsü yanlış geldi, biraz büyük.'),
(6, 2, 5, 'Çok şık ve kaliteli.'),
(7, 3, 4, 'Güzel kot pantolon, kalıp iyi.'),
(8, 5, 5, 'Çok kaliteli ahşap masa.'),
(10, 4, 4, 'Kahve makinesinden çok memnunuz.'),
(11, 2, 5, 'Klasikleşmiş bir eser, herkes okumalı.'),
(13, 3, 5, 'Koşarken ayağımı çok rahat tutuyor.'),
(15, 5, 4, 'Hoş bir koku, kalıcı.'),
(17, 2, 5, 'Akıllı saat olarak harika.');
