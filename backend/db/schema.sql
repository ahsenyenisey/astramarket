-- Veritabanı oluşturma
DROP DATABASE IF EXISTS eticaret_db;
CREATE DATABASE eticaret_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eticaret_db;

-- 1. Kullanicilar tablosu
CREATE TABLE kullanicilar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    sifre VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'musteri') DEFAULT 'musteri',
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Kategoriler tablosu
CREATE TABLE kategoriler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT
) ENGINE=InnoDB;

-- 3. Urunler tablosu
CREATE TABLE urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(200) NOT NULL,
    fiyat DECIMAL(10, 2) NOT NULL,
    stok INT DEFAULT 0,
    kategori_id INT,
    resim_url VARCHAR(500),
    aciklama TEXT,
    olusturma_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategoriler(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Siparisler tablosu
CREATE TABLE siparisler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    toplam_tutar DECIMAL(10, 2) NOT NULL,
    durum ENUM('hazirlaniyor', 'kargolandi', 'teslim_edildi', 'iptal') DEFAULT 'hazirlaniyor',
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Siparis detaylari tablosu
CREATE TABLE siparis_detaylari (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siparis_id INT NOT NULL,
    urun_id INT NOT NULL,
    adet INT NOT NULL,
    birim_fiyat DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (siparis_id) REFERENCES siparisler(id) ON DELETE CASCADE,
    FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Yorumlar tablosu
CREATE TABLE yorumlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    urun_id INT NOT NULL,
    kullanici_id INT NOT NULL,
    puan INT CHECK (puan BETWEEN 1 AND 5),
    yorum_metni TEXT,
    tarih TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (urun_id) REFERENCES urunler(id) ON DELETE CASCADE,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id) ON DELETE CASCADE
) ENGINE=InnoDB;
