import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const KAMPANYALAR = [
  {
    id: 1,
    baslik: 'Yaz Kampanyası 2026',
    aciklama: 'Tüm kategorilerde %50\'ye varan indirimler ve günün fırsatları seni bekliyor.',
    bitis: '31 Ağustos 2026',
    rozet: 'BÜYÜK',
    renk: 'gradient-bordo',
    emoji: '☀️',
    detay: 'Yaz boyunca her gün farklı kategorilerde flash indirimler. Kampanyaya özel kuponlar üye olunca otomatik tanımlanır.',
    minTutar: '500 TL',
  },
  {
    id: 2,
    baslik: 'Ücretsiz Kargo',
    aciklama: '500 TL ve üzeri tüm siparişlerde kargo ücretsiz, hemen kapında!',
    bitis: 'Süresiz',
    rozet: 'POPÜLER',
    renk: 'gradient-mor',
    emoji: '📦',
    detay: 'Türkiye genelinde 81 ilde geçerli. Premium üyelerimize 250 TL alt limitle ücretsiz kargo.',
    minTutar: '500 TL',
  },
  {
    id: 3,
    baslik: 'İlk Sipariş İndirimi',
    aciklama: 'Yeni üyelere özel %15 indirim. Hemen üye ol, fırsatı kaçırma!',
    bitis: 'Sürekli',
    rozet: 'YENİ ÜYE',
    renk: 'gradient-pembe',
    emoji: '🎁',
    detay: 'Tek kullanımlık, 100 TL üzeri siparişlerde geçerli. Otomatik olarak ilk siparişine uygulanır.',
    minTutar: '100 TL',
  },
  {
    id: 4,
    baslik: 'Elektronik Festivali',
    aciklama: 'iPhone, MacBook, Samsung Galaxy ve daha fazlasında özel fiyatlar.',
    bitis: '15 Temmuz 2026',
    rozet: 'TEKNOLOJİ',
    renk: 'gradient-mavi',
    emoji: '⚡',
    detay: '17 farklı elektronik üründe %10-25 arası indirim. 5000 TL üzeri alımlarda 6 taksit imkanı.',
    minTutar: '1000 TL',
  },
  {
    id: 5,
    baslik: 'Premium Üye Ayrıcalığı',
    aciklama: 'Premium üyelere özel %20 ekstra indirim ve erken erişim.',
    bitis: 'Sürekli',
    rozet: 'PREMIUM',
    renk: 'gradient-altin',
    emoji: '⭐',
    detay: 'Premium üyelik kampanyaları otomatik olarak hesabına işlenir. Detaylar için Premium sayfasını ziyaret et.',
    minTutar: 'Yok',
  },
  {
    id: 6,
    baslik: 'Kozmetik Günleri',
    aciklama: 'Parfüm, makyaj ve cilt bakımında %30 indirim, 3 al 2 öde!',
    bitis: '30 Haziran 2026',
    rozet: 'GÜZELLİK',
    renk: 'gradient-gul',
    emoji: '💄',
    detay: 'Tüm kozmetik kategorisindeki ürünlerde geçerli. 3 ürün sepete eklenince üçüncüsü ücretsiz.',
    minTutar: '300 TL',
  },
];

export default function Campaigns() {
  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>Kampanyalar</h2>
        <p>Aktif tüm kampanyalar ve özel fırsatlar tek bir yerde</p>
      </div>

      <Row className="g-4 stagger">
        {KAMPANYALAR.map((k) => (
          <Col md={6} lg={4} key={k.id} className="fade-up">
            <div className={`kampanya-kart ${k.renk}`}>
              <div className="kk-rozet">{k.rozet}</div>
              <div className="kk-emoji">{k.emoji}</div>
              <h4>{k.baslik}</h4>
              <p className="kk-aciklama">{k.aciklama}</p>
              <p className="kk-detay">{k.detay}</p>
              <div className="kk-altbilgi">
                <div><strong>Min. Tutar:</strong> {k.minTutar}</div>
                <div><strong>Bitiş:</strong> {k.bitis}</div>
              </div>
              <Link to="/" className="btn btn-bordo w-100 mt-3">Kampanyayı Gör →</Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
