import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { PLANLAR } from '../data/premium';

const AVANTAJLAR = [
  { ikon: '🚀', baslik: 'Ücretsiz Hızlı Kargo', aciklama: 'Tüm siparişlerinde 250 TL alt limit ile ücretsiz kargo, üstelik 12 saat içinde teslim.' },
  { ikon: '💎', baslik: '%20 Ekstra İndirim', aciklama: 'Tüm indirimli ürünlere otomatik ekstra %20 indirim, kampanyalara erken erişim.' },
  { ikon: '⚡', baslik: 'Erken Erişim', aciklama: 'Yeni ürünler ve büyük indirimler 48 saat önce sadece Premium üyelere açılır.' },
  { ikon: '🎁', baslik: 'Doğum Günü Hediyesi', aciklama: 'Doğum gününde 200 TL\'ye varan kupon ve sürpriz hediye paketi.' },
  { ikon: '🛡', baslik: 'Uzatılmış İade Süresi', aciklama: 'Standart 14 gün yerine 30 gün içinde sebep göstermeksizin iade hakkı.' },
  { ikon: '📞', baslik: 'Öncelikli Müşteri Hizmetleri', aciklama: '7/24 öncelikli destek hattı, ortalama 30 saniye altında yanıt.' },
];

export default function Premium() {
  const nav = useNavigate();
  const planSec = (planId) => {
    nav('/premium/odeme', { state: { planId } });
  };
  return (
    <Container className="my-4 my-md-5">
      <section className="premium-hero fade-up">
        <div className="ph-icerik">
          <div className="ph-ust">
            <span className="ph-rozet">⭐ PREMIUM ÜYELİK</span>
          </div>
          <h1>AstraMarket <span className="ph-altin">Premium</span></h1>
          <p>Alışverişin VIP deneyimi. Daha çok indirim, daha hızlı kargo, daha iyi destek.</p>
          <div className="ph-rakamlar">
            <div><strong>250.000+</strong><span>Premium üye</span></div>
            <div><strong>%37</strong><span>Yıllık tasarruf</span></div>
            <div><strong>4.9 ★</strong><span>Üye memnuniyeti</span></div>
          </div>
        </div>
      </section>

      <div className="bolum-baslik fade-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h3>Premium Avantajları</h3>
          <div className="alt">6 ayrıcalık, sayısız tasarruf</div>
        </div>
      </div>

      <Row xs={1} sm={2} lg={3} className="g-4 stagger mb-5">
        {AVANTAJLAR.map((a, i) => (
          <Col key={i} className="fade-up">
            <div className="premium-avantaj-kart">
              <div className="pa-ikon">{a.ikon}</div>
              <h5>{a.baslik}</h5>
              <p>{a.aciklama}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="bolum-baslik fade-up" style={{ animationDelay: '0.2s' }}>
        <div>
          <h3>Üyelik Planları</h3>
          <div className="alt">Sana uygun olanı seç, dilediğin zaman iptal et</div>
        </div>
      </div>

      <Row className="g-4 stagger" style={{ marginBottom: 60 }}>
        {PLANLAR.map((p) => (
          <Col md={4} key={p.id} className="fade-up">
            <div className={`premium-plan-kart ${p.populer ? 'populer' : ''}`}>
              {p.populer && <div className="pp-populer-rozet">EN POPÜLER</div>}
              <h4>{p.ad}</h4>
              {p.tasarruf && <div className="pp-tasarruf">{p.tasarruf} tasarruf</div>}
              <div className="pp-fiyat">
                <span className="pp-rakam">{p.fiyat.toFixed(2)} TL</span>
                <span className="pp-donem">/{p.donem}</span>
              </div>
              {p.aylik && <div className="pp-aylik">≈ {p.aylik.toFixed(2)} TL / ay</div>}
              {p.not && <div className="pp-not">{p.not}</div>}
              <Button className="btn-bordo w-100 mt-3" onClick={() => planSec(p.id)}>
                {p.populer ? 'En Avantajlı Plan' : 'Bu Planı Seç'}
              </Button>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
