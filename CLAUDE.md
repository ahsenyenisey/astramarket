# Proje: Web Tabanlı E-Ticaret Otomasyonu (Hepsiburada benzeri)

## Zorunlu Ders Gereksinimleri (ASLA atlanmayacak)
1. Veritabanında EN AZ 5 tablo olacak
2. EN AZ 7 ayrı sayfa/ekran olacak
3. EN AZ 10 farklı çeşit React/Bootstrap component kullanılacak
4. Login sayfası + tüm tablolarda CRUD (ekleme/silme/güncelleme) olacak
5. EN AZ 4 gelişmiş SQL sorgusu olacak (iç içe sorgu, GROUP BY, JOIN+HAVING vb.)
6. Teknolojiler: React (frontend), NodeJS/Express (backend), Bootstrap (UI), MySQL (veritabanı)

## Fonksiyonel Gereksinimler (ASLA atlanmayacak)
- Sepet sayfasında "Siparişi Tamamla" butonu olacak; sipariş verildiğinde
  `siparisler` ve `siparis_detaylari` tablolarına kayıt eklenecek, ilgili
  ürünlerin stoğu MySQL transaction ile düşürülecek
- Ürün detay sayfasında giriş yapmış kullanıcı yorum ve puan ekleyebilecek,
  kendi yorumunu silebilecek (yorumlar tablosu için tam CRUD); admin de tüm
  yorumları silebilir
- Admin sayfaları route koruması (ProtectedRoute adminOnly) ile korunacak;
  müşteri rolündeki kullanıcı admin sayfalarına erişmeye çalışırsa
  /login sayfasına yönlendirilecek ve uyarı gösterilecek
- Ürün resimleri için fallback olarak picsum.photos placeholder servisi
  kullanılacak (`https://picsum.photos/seed/urun-{id}/400/300`)
- Veritabanı bağlantı bilgileri (host, port, user, password, db_name)
  `.env` dosyasından okunacak; repo'da `.env.example` örnek dosyası bulunacak,
  asıl `.env` git'e commit edilmeyecek
- Tüm MySQL tabloları utf8mb4 character set ve utf8mb4_unicode_ci collation
  kullanacak (Türkçe karakter sorunu yaşanmasın)
- Navbar'da giriş yapmış kullanıcı için çıkış (logout) butonu olacak;
  logout sonrası token localStorage'dan silinecek ve /login'e yönlendirilecek

## Kod Standartları
- Türkçe arayüz metinleri, anlaşılır kod
- Her gelişmiş SQL sorgusu yorum satırıyla açıklanacak (hoca sorduğunda gösterilebilmeli)
- Basit ve çalışır olması karmaşık olmasından önemli

## Tasarım Kuralları (UI/UX)
- Tasarım profesyonel, modern ve sıradan olmayan bir görünüme sahip olacak.
  Varsayılan Bootstrap görünümünden kaçınılacak; özel CSS ile kişiselleştirilecek.
- Renk paleti: bordo (#9f1239) ana renk, pudra pembesi (#fda4af) vurgu,
  kırık beyaz (#fff7f5) arka plan
- Butonlar ve linklerde bordo kullanılacak; hover durumunda biraz koyulaşacak (#881337)
- Badge, etiket ve vurgu alanlarında pudra pembesi kullanılacak
- Google Fonts'tan modern bir font kullanılacak (örn. Poppins veya Inter)
- Ana sayfada tam genişlik hero/banner alanı, ürün kartlarında hover'da
  yumuşak büyüme ve gölge efekti olacak
- Kartlarda yuvarlatılmış köşeler (border-radius), yumuşak gölgeler,
  geçiş animasyonları (transition) kullanılacak
- Navbar sticky olacak ve bordo renkte olacak, sepetteki ürün sayısı
  pudra pembesi badge ile gösterilecek
- Admin paneli ayrı bir görünüme sahip olacak: sol tarafta koyu bordo sidebar menü
- Tasarım responsive olacak (mobilde de düzgün görünecek)
- Boş durumlar (sepet boş, ürün yok) için ikonlu, şık boş-durum ekranları yapılacak
- Metin kontrastına dikkat edilecek; pudra pembesi üzerine asla beyaz metin yazılmayacak
  (okunmaz), koyu metin kullanılacak