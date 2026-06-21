import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation, Navigate } from 'react-router-dom';

export default function PremiumSuccess() {
  const loc = useLocation();
  const plan = loc.state?.plan;
  const planDegisikligi = loc.state?.planDegisikligi;
  if (!plan) return <Navigate to="/" replace />;

  return (
    <Container className="my-5 text-center">
      <div className="basari-konfeti">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="kk-parca" style={{
            left: `${(i * 3.3) % 100}%`,
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#fb7185' : '#a855f7',
          }} />
        ))}
      </div>

      <div className="basari-icerik fade-up">
        <div className="basari-tik" style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(245, 158, 11, 0.3)',
        }}>⭐</div>

        <h1 className="holo-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
          {planDegisikligi ? 'Planın Değiştirildi!' : 'Premium Üyeliğin Aktif!'}
        </h1>
        <p style={{ color: 'var(--metin-orta)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 28px' }}>
          {planDegisikligi
            ? `Yeni planın "${plan.ad}" hemen aktif oldu. Tüm Premium avantajların kesintisiz devam ediyor.`
            : 'AstraMarket Premium\'a hoş geldin. Tüm avantajların hesabına anında işlendi. Sürpriz hoşgeldin hediyen için e-postanı kontrol et.'}
        </p>

        <Row className="g-3 justify-content-center mb-4">
          <Col xs={6} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">PLAN</div>
              <div className="bk-deger">{plan.ad}</div>
            </div>
          </Col>
          <Col xs={6} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">ÖDEME</div>
              <div className="bk-deger gradient-text-dark">
                {plan.fiyat.toFixed(2)} TL
              </div>
            </div>
          </Col>
          <Col xs={12} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">DURUM</div>
              <div className="bk-deger" style={{ color: '#86efac' }}>✓ AKTIF</div>
            </div>
          </Col>
        </Row>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button as={Link} to="/" className="btn-bordo" size="lg">
            Alışverişe Devam Et
          </Button>
          <Button as={Link} to="/premium" className="btn-outline-bordo" size="lg">
            Premium Sayfasını Gör
          </Button>
        </div>
      </div>
    </Container>
  );
}
