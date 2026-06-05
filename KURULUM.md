# AstraMarket — Kurulum Rehberi

> Bu rehber **hiç bilmeyen biri** için yazılmıştır. Adımları sırayla yap, takılırsan en alttaki **Sık Hatalar** bölümüne bak.

## İçindekiler
- [Windows Kurulumu](#windows-kurulumu)
- [macOS Kurulumu](#macos-kurulumu)
- [Linux Kurulumu (Ubuntu / Debian)](#linux-kurulumu-ubuntu--debian)
- [Sık Karşılaşılan Hatalar](#sık-karşılaşılan-hatalar)

---

## Windows Kurulumu

### 1. Node.js LTS Kurulumu
1. https://nodejs.org/ adresine git
2. Yeşil **LTS** butonunu indir (örn. Node.js 20.x LTS)
3. İndirilen `.msi` dosyasına çift tıkla, **Next → Next → Install**
4. Kurulum sonunda **PowerShell** veya **Komut İstemi**'ni aç:
   ```cmd
   node -v
   npm -v
   ```
   İki sürüm numarası göründüyse hazırsın.

### 2. XAMPP Kurulumu (MySQL için)
1. https://www.apachefriends.org/download.html adresinden **XAMPP for Windows** indir
2. Kurucuyu çalıştır. Bileşen seçiminde **en az şunlar işaretli olsun:**
   - **MySQL**
   - **phpMyAdmin**
   - **Apache** (phpMyAdmin için gerekli)
3. Varsayılan klasör `C:\xampp\` — değiştirme
4. Kurulum bitince **XAMPP Control Panel** otomatik açılır

### 3. XAMPP'ı Başlat
1. **XAMPP Control Panel**'i açık tut
2. **Apache** satırında **Start** tıkla → yeşil yanmalı
3. **MySQL** satırında **Start** tıkla → yeşil yanmalı
4. Tarayıcıdan **http://localhost/phpmyadmin** aç — phpMyAdmin ekranı açılmalı

### 4. Projeyi İndir
İki seçenek var:

**Seçenek A — Git ile (önerilen):**
1. https://git-scm.com/download/win adresinden Git'i indir, kur (varsayılan ayarlarla)
2. Bir klasör aç (örn. `C:\Users\KullaniciAdi\Desktop`), boş alanda sağ tık → **Open Git Bash here**
3. Komutu çalıştır (GitHub link'i takım liderinden al):
   ```bash
   git clone <REPO_URL>
   cd web_prog
   ```

**Seçenek B — ZIP ile:**
1. GitHub repo sayfasında yeşil **Code** → **Download ZIP**
2. Bir yere çıkar (örn. `Masaüstü\web_prog`)
3. Klasörün adresini kopyala

### 5. Bağımlılıkları Yükle
PowerShell veya Komut İstemi aç, proje klasörüne git:
```cmd
cd C:\Users\KullaniciAdi\Desktop\web_prog
```

Backend bağımlılıkları:
```cmd
cd backend
npm install
copy .env.example .env
```

Frontend bağımlılıkları (yeni komut, aynı pencerede):
```cmd
cd ..\frontend
npm install
```
(Frontend install 3-5 dakika sürebilir, sabırlı ol.)

### 6. Veritabanını Kur
Backend klasörüne dön ve veritabanı sıfırlama scripti'ni çalıştır:
```cmd
cd ..\backend
npm run init-db
```
Şuna benzer bir çıktı görmelisin:
```
Veritabanı siliniyor (varsa) ve yeniden oluşturuluyor...
Kategoriler: 6
Ürünler:     100
Siparişler:  30
Yorumlar:    150
```

### 7. Projeyi Başlat — Tek Komutla
Proje kök klasörüne dön ve **`start.bat`** dosyasına çift tıkla.
İki yeni komut penceresi açılır (biri backend, biri frontend) — kapatma.

### 8. Tarayıcıdan Aç
**http://localhost:5173** adresine git. AstraMarket karşına çıkmalı.

Demo hesaplar:
- Admin: `admin@eticaret.com` / `admin123`
- Müşteri: `ayse@mail.com` / `musteri123`

---

## macOS Kurulumu

### 1. Node.js LTS Kurulumu
1. https://nodejs.org/ → yeşil **LTS** butonu → `.pkg` indir
2. İndirilen dosyaya çift tıkla, **Devam → Yükle**
3. **Terminal**'i aç (Spotlight: `Cmd+Space` → "Terminal"):
   ```bash
   node -v
   npm -v
   ```

### 2. XAMPP Kurulumu
1. https://www.apachefriends.org/download.html → **XAMPP for OS X** indir
2. `.dmg` dosyasına çift tıkla → XAMPP'ı **Applications** klasörüne sürükle
3. **Applications → XAMPP → manager-osx.app** aç
   - macOS "açılamıyor" derse: **Sistem Tercihleri → Güvenlik ve Gizlilik → Yine de Aç**

### 3. XAMPP'ı Başlat
1. **manager-osx** açıkken **Manage Servers** sekmesi
2. **MySQL Database** seç → **Start**
3. **Apache Web Server** seç → **Start** (phpMyAdmin için)
4. Tarayıcıdan **http://localhost/phpmyadmin** aç

### 4. Projeyi İndir
**Terminal'de:**
```bash
cd ~/Desktop
git clone <REPO_URL>
cd web_prog
```
(Git kurulu değilse `git --version` çalıştır, sistem kurman için soracak)

### 5. Bağımlılıkları Yükle
```bash
cd backend
npm install
cp .env.example .env

cd ../frontend
npm install
```

### 6. Veritabanını Kur
```bash
cd ../backend
npm run init-db
```

### 7. Projeyi Başlat
Proje kök klasöründe:
```bash
chmod +x start.sh    # ilk seferde, dosyaya calistirma izni ver
./start.sh
```
Veya iki ayrı terminalde manuel:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### 8. Tarayıcıdan Aç
**http://localhost:5173**

---

## Linux Kurulumu (Ubuntu / Debian)

### 1. Node.js Kurulumu
Terminal aç:
```bash
# NodeSource deposunu ekle (Node.js 20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kontrol
node -v
npm -v
```

### 2. MySQL / MariaDB Kurulumu — İki Seçenek

> Aşağıdan **birini** seç. Tavsiye: **Seçenek B** (apt). XAMPP for Linux 32-bit problemli olabilir.

#### Seçenek A — XAMPP for Linux
*XAMPP'ı tüm grupla aynı kullanmak istiyorsan tercih et. Tüm bileşenler tek paket.*

1. https://www.apachefriends.org/download.html → **XAMPP for Linux** (`.run` dosyası)
2. İndirilen dizine git ve çalıştır:
   ```bash
   cd ~/Downloads
   chmod +x xampp-linux-*-installer.run
   sudo ./xampp-linux-*-installer.run
   ```
3. GUI kurucuyu takip et → varsayılan yol `/opt/lampp/`
4. Başlat:
   ```bash
   sudo /opt/lampp/lampp start
   ```
5. phpMyAdmin: **http://localhost/phpmyadmin**
6. Durdurmak: `sudo /opt/lampp/lampp stop`

#### Seçenek B — apt ile MariaDB + phpMyAdmin
*Daha hafif, sistem ile entegre, modern Linux için önerilir.*

```bash
# MariaDB sunucu (MySQL ile birebir uyumlu)
sudo apt update
sudo apt install -y mariadb-server

# Servisi baslat
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Root sifresini bos birak (proje boyle kuruldu).
# Eger guvenlik adimini calistirdiysan ve sifre koyduysan
# backend/.env icinde DB_PASSWORD=... olarak yaz.
sudo mysql_secure_installation
# Sorular: root sifre bos brak (enter), ENTER... NO... NO... YES (anonymous), YES (root remote)...
```

phpMyAdmin için:
```bash
sudo apt install -y phpmyadmin apache2 php php-mysql

# Kurulum sirasinda:
#   - "Web server to configure" -> apache2 sec (Space ile isaretle, Tab ile OK)
#   - "Configure database for phpmyadmin with dbconfig-common?" -> Yes
#   - phpMyAdmin icin sifre belirle (kendi notuna yaz)

# Apache'yi yeniden baslat
sudo systemctl restart apache2
```

phpMyAdmin'i tarayıcıdan aç: **http://localhost/phpmyadmin**
- Kullanıcı: `root`
- Şifre: (boş veya senin belirlediğin)

### 3. Projeyi İndir
```bash
cd ~
git clone <REPO_URL>
cd web_prog
```

### 4. Bağımlılıkları Yükle
```bash
cd backend
npm install
cp .env.example .env

cd ../frontend
npm install
```

### 5. Veritabanını Kur
```bash
cd ../backend
npm run init-db
```

### 6. Projeyi Başlat
```bash
cd ..
chmod +x start.sh
./start.sh
```
Veya iki ayrı terminalde:
```bash
# Terminal 1
cd backend && npm run dev
# Terminal 2
cd frontend && npm run dev
```

### 7. Tarayıcıdan Aç
**http://localhost:5173**

---

## Sık Karşılaşılan Hatalar

### ❌ "Port 3306 zaten kullanılıyor" / "Can't connect to MySQL on 3306"
- **Sebep:** Başka bir MySQL servisi (sistem MySQL'i, eski XAMPP, Docker) zaten 3306'da dinliyor.
- **Çözüm (Windows):** XAMPP Control Panel'de MySQL satırında **Config → my.ini** → port'u değiştir. VEYA Görev Yöneticisi'nde diğer MySQL servisini durdur.
- **Çözüm (Mac/Linux):** `sudo lsof -i :3306` ile kim kullanıyor bul, kapat.

### ❌ "Port 5173 zaten kullanılıyor"
- **Sebep:** Önceki bir Vite process'i hâlâ çalışıyor.
- **Çözüm (Windows):**
  ```cmd
  netstat -ano | findstr :5173
  taskkill /PID <pid> /F
  ```
- **Çözüm (Mac/Linux):**
  ```bash
  lsof -ti :5173 | xargs kill -9
  ```

### ❌ "npm ERR! ..." veya "EACCES permission denied"
- **Sebep:** Eski Node sürümü, izin sorunu veya bozuk `node_modules`.
- **Çözüm:**
  ```bash
  # Backend ve frontend her ikisinde:
  rm -rf node_modules package-lock.json    # Windows: rmdir /s node_modules ve sil package-lock.json
  npm install
  ```

### ❌ phpMyAdmin'e erişemiyorum (404 veya boş sayfa)
- **XAMPP'da:** Apache çalışıyor mu kontrol et. Çalışmıyorsa 80 portu başka bir şey tarafından kullanılıyor olabilir (Skype, IIS).
- **Linux apt'da:** `sudo systemctl status apache2`, `sudo a2enconf phpmyadmin && sudo systemctl reload apache2`.

### ❌ "ER_NOT_SUPPORTED_AUTH_MODE" hatası
- **Sebep:** MySQL 8'in yeni `caching_sha2_password` auth'una uyumsuzluk. (XAMPP MariaDB'de olmaz, MySQL 8 dev kurulumunda olabilir.)
- **Çözüm:**
  ```sql
  -- phpMyAdmin SQL sekmesinde calistir:
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
  FLUSH PRIVILEGES;
  ```

### ❌ Mac: "manager-osx açılamıyor, doğrulanmamış geliştirici"
- **Çözüm:** Finder'da `manager-osx.app` üzerine **sağ tık → Aç** → açılan uyarıda yine **Aç** de.
- Veya: **Sistem Tercihleri → Güvenlik ve Gizlilik → Yine de Aç**

### ❌ Linux: "/opt/lampp/lampp" permission denied
- **Çözüm:** Komutları `sudo` ile çalıştır: `sudo /opt/lampp/lampp start`

### ❌ npm install: "EBADENGINE" veya "engine node >= ..."
- **Sebep:** Node sürümün eski.
- **Çözüm:** Node 18 LTS veya 20 LTS yükle (yukarıdaki adımları tekrar et).

### ❌ "init-db çalıştı ama tablolar boş görünüyor"
- **Çözüm:** phpMyAdmin'de **sol panelden eticaret_db'yi tıkla** (tabloları görmeden tabloları açmaz). Hâlâ boşsa terminalde tekrar `npm run init-db` çalıştır.

### ❌ Site açılıyor ama "Veri yüklenemedi" yazıyor
- Backend çalışmıyor demektir. Backend terminalinde hata var mı bak:
  - `ECONNREFUSED 3306` → MySQL kapalı, XAMPP'ı başlat
  - `ER_ACCESS_DENIED` → `.env` içindeki DB_PASSWORD yanlış
  - Başka bir port → `.env` içinde `PORT=4001` deneyip frontend'i de yeniden başlat

### ❌ Türkçe karakter sorunu (ı/ç/ş/ğ/ö/ü garip karakter olarak görünüyor)
- **Sebep:** Veritabanı charset utf8 (eski) olabilir.
- **Çözüm:** `npm run init-db` tekrar çalıştır — proje utf8mb4 kullanır.

---

## Yardım

Hâlâ takıldığında:
- Backend hatası → `backend/.logs/backend.log` veya backend terminalindeki kırmızı yazı
- Frontend hatası → tarayıcıda **F12 → Console** sekmesi
- Veritabanı → phpMyAdmin'de **eticaret_db → urunler** tablosunu aç, 100 satır görmen gerek

Grup arkadaşları arasında WhatsApp / Discord üzerinden hata ekran görüntüsü paylaş — büyük ihtimalle biri yaşamıştır.
