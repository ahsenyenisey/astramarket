import { useState } from 'react';
import { Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PLANLAR, bulPlan } from '../data/premium';
import { useAuth } from '../context/AuthContext';
import Counter from '../components/Counter';

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
  const { user, premium, premiumPlan, setPremium } = useAuth();
  const aktifPlan = premium ? bulPlan(premiumPlan) : null;

  const [iptalAcik, setIptalAcik] = useState(false);
  const [iptalEdildi, setIptalEdildi] = useState(false);

  const planSec = (planId) => {
    nav('/premium/odeme', { state: { planId } });
  };

  const iptalOnayla = () => {
    setPremium(false);
    setIptalAcik(false);
    setIptalEdildi(true);
    setTimeout(() => setIptalEdildi(false), 5000);
  };

  return (
    <Container className="my-4 my-md-5">
      {iptalEdildi && (
        <Alert variant="warning" dismissible onClose={() => setIptalEdildi(false)} className="fade-up">
          <strong>Üyeliğin iptal edildi.</strong> Premium avantajların artık geçerli değil.
          İstediğin zaman yeniden katılabilirsin.
        </Alert>
      )}

      <section className="premium-hero fade-up">
        <div className="ph-icerik">
          <div className="ph-ust">
            <span className="ph-rozet">⭐ PREMIUM ÜYELİK</span>
            {premium && (
              <span className="ph-aktif-rozet">✓ ÜYELİĞİN AKTİF</span>
            )}
          </div>
          <h1>AstraMarket <span className="ph-altin">Premium</span></h1>
          <p>
            {premium
              ? `Hoş geldin ${user?.ad?.split(' ')[0] || ''}! Tüm Premium avantajların aktif. Aşağıdaki avantajları kullanmaya hemen başlayabilirsin.`
              : 'Alışverişin VIP deneyimi. Daha çok indirim, daha hızlı kargo, daha iyi destek.'}
          </p>
          <div className="ph-rakamlar">
            <div><strong><Counter hedef={250000} sonEk="+" sure={1800} /></strong><span>Premium üye</span></div>
            <div><strong><Counter hedef={37} onEk="%" sure={1400} gecikme={200} /></strong><span>Yıllık tasarruf</span></div>
            <div><strong><Counter hedef={4.9} ondalik={1} sonEk=" ★" sure={1400} gecikme={400} /></strong><span>Üye memnuniyeti</span></div>
          </div>
        </div>
      </section>

      {premium && aktifPlan && (
        <section className="uyelik-yonetim fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="uy-sol">
            <div className="uy-etiket">MEVCUT ÜYELİĞİN</div>
            <div className="uy-plan">
              <h4>{aktifPlan.ad}</h4>
              <div className="uy-fiyat">
                {aktifPlan.fiyat.toFixed(2)} TL <span>/{aktifPlan.donem}</span>
              </div>
            </div>
            <div className="uy-bilgi">
              {aktifPlan.aylik ? `≈ ${aktifPlan.aylik.toFixed(2)} TL / ay` : 'Aylık abonelik'} •
              Sonraki yenileme: otomatik
            </div>
          </div>
          <div className="uy-sag">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => setIptalAcik(true)}
              className="btn-iptal"
            >
              Üyeliği İptal Et
            </Button>
            <div className="uy-not">İstediğin zaman yeniden katılabilirsin</div>
          </div>
        </section>
      )}

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
          <h3>{premium ? 'Plan Değiştir' : 'Üyelik Planları'}</h3>
          <div className="alt">
            {premium
              ? 'Farklı bir plana geçmek için aşağıdan seç'
              : 'Sana uygun olanı seç, dilediğin zaman iptal et'}
          </div>
        </div>
      </div>

      <Row className="g-4 stagger" style={{ marginBottom: 60 }}>
        {PLANLAR.map((p) => {
          const buAktif = premium && premiumPlan === p.id;
          return (
            <Col md={4} key={p.id} className="fade-up">
              <div className={`premium-plan-kart ${p.populer ? 'populer' : ''} ${buAktif ? 'aktif-plan' : ''}`}>
                {buAktif && <div className="pp-aktif-rozet">ŞU AN AKTİF</div>}
                {p.populer && !buAktif && <div className="pp-populer-rozet">EN POPÜLER</div>}
                <h4>{p.ad}</h4>
                {p.tasarruf && <div className="pp-tasarruf">{p.tasarruf} tasarruf</div>}
                <div className="pp-fiyat">
                  <span className="pp-rakam">{p.fiyat.toFixed(2)} TL</span>
                  <span className="pp-donem">/{p.donem}</span>
                </div>
                {p.aylik && <div className="pp-aylik">≈ {p.aylik.toFixed(2)} TL / ay</div>}
                {p.not && <div className="pp-not">{p.not}</div>}
                {buAktif ? (
                  <Button className="btn-outline-bordo w-100 mt-3" disabled>
                    ✓ SEÇİLİ PLANIN
                  </Button>
                ) : premium ? (
                  <Button className="btn-bordo w-100 mt-3" onClick={() => planSec(p.id)}>
                    Bu Plana Geç
                  </Button>
                ) : (
                  <Button className="btn-bordo w-100 mt-3" onClick={() => planSec(p.id)}>
                    {p.populer ? 'En Avantajlı Plan' : 'Bu Planı Seç'}
                  </Button>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      <Modal show={iptalAcik} onHide={() => setIptalAcik(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Üyeliği iptal et?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ marginBottom: 12 }}>
            <strong>{aktifPlan?.ad}</strong> üyeliğin iptal edilecek.
            Bu işlem hemen yürürlüğe girecek ve aşağıdaki avantajlarını kaybedeceksin:
          </p>
          <ul className="iptal-kayip-listesi">
            <li>🚀 Ücretsiz hızlı kargo</li>
            <li>💎 %20 ekstra indirim</li>
            <li>⚡ Erken erişim hakkı</li>
            <li>🛡 Uzatılmış iade süresi</li>
            <li>📞 Öncelikli müşteri desteği</li>
          </ul>
          <Alert variant="info" className="mb-0 mt-3" style={{ fontSize: '0.85rem' }}>
            💡 İstediğin zaman yeni bir plana abone olarak Premium üyeliğine geri dönebilirsin.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIptalAcik(false)}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={iptalOnayla}>
            Evet, İptal Et
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
