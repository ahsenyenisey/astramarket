import { useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation, Navigate } from 'react-router-dom';

export default function OrderSuccess() {
  const loc = useLocation();
  const siparis = loc.state;

  // Direkt URL ile gelinmisse anasayfaya yonlendir
  if (!siparis?.siparisId) return <Navigate to="/" replace />;

  // Konfeti efekti: kucuk parlayan noktalar
  useEffect(() => {
    const konfeti = document.querySelectorAll('.kk-parca');
    konfeti.forEach((el, i) => {
      const delay = (i % 20) * 0.05;
      el.style.animationDelay = `${delay}s`;
    });
  }, []);

  return (
    <Container className="my-5 text-center">
      <div className="basari-konfeti">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="kk-parca" style={{
            left: `${(i * 3.3) % 100}%`,
            background: i % 3 === 0 ? '#fb7185' : i % 3 === 1 ? '#a855f7' : '#fbbf24',
          }} />
        ))}
      </div>

      <div className="basari-icerik fade-up">
        <div className="basari-tik">✓</div>
        <h1 className="holo-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 12 }}>
          Siparişiniz Alındı!
        </h1>
        <p style={{ color: 'var(--metin-orta)', fontSize: '1.05rem', maxWidth: 520, margin: '0 auto 28px' }}>
          Siparişiniz başarıyla oluşturuldu. Onay e-postası kısa süre içinde gönderilecek.
          Kargoya verildiğinde takip numaranız SMS ile size iletilir.
        </p>

        <Row className="g-3 justify-content-center mb-4">
          <Col xs={6} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">SİPARİŞ NO</div>
              <div className="bk-deger">#{siparis.siparisId}</div>
            </div>
          </Col>
          <Col xs={6} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">TOPLAM</div>
              <div className="bk-deger gradient-text-dark">
                {Number(siparis.toplam || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </div>
            </div>
          </Col>
          <Col xs={12} md="auto">
            <div className="basari-kutu">
              <div className="bk-etiket">TAHMİNİ TESLİMAT</div>
              <div className="bk-deger">24-48 saat</div>
            </div>
          </Col>
        </Row>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button as={Link} to="/siparislerim" className="btn-bordo" size="lg">
            Siparişlerimi Görüntüle
          </Button>
          <Button as={Link} to="/" className="btn-outline-bordo" size="lg">
            Alışverişe Devam Et
          </Button>
        </div>
      </div>
    </Container>
  );
}
