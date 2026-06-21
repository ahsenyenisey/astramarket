import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';
import { bulKampanya } from '../data/kampanyalar';

export default function CampaignDetail() {
  const { id } = useParams();
  const kampanya = bulKampanya(id);

  if (!kampanya) return <Navigate to="/kampanyalar" replace />;

  return (
    <Container className="my-4 my-md-5">
      <div className="mb-3 fade-up">
        <Link to="/kampanyalar" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          ← Tüm Kampanyalar
        </Link>
      </div>

      {/* HERO */}
      <section className={`kampanya-detay-hero fade-up ${kampanya.renk}`}>
        <div className="kdh-emoji">{kampanya.emoji}</div>
        <div className="kdh-icerik">
          <Badge className="kdh-rozet">{kampanya.rozet}</Badge>
          <h1>{kampanya.baslik}</h1>
          <p>{kampanya.aciklama}</p>
          <div className="kdh-tarih">
            <span>📅 <strong>Başlangıç:</strong> {kampanya.baslangic}</span>
            <span>⏰ <strong>Bitiş:</strong> {kampanya.bitis}</span>
          </div>
        </div>
      </section>

      {/* AVANTAJLAR */}
      <div className="bolum-baslik fade-up" style={{ animationDelay: '0.1s' }}>
        <div>
          <h3>Kampanya Avantajları</h3>
          <div className="alt">Sana sağlanan tüm fırsatlar</div>
        </div>
      </div>

      <Row className="g-4 stagger mb-5">
        {kampanya.avantajlar.map((a, i) => (
          <Col md={6} lg={3} key={i} className="fade-up">
            <div className="kampanya-avantaj-kart">
              <div className="ka-ikon">{a.ikon}</div>
              <h5>{a.baslik}</h5>
              <p>{a.not}</p>
            </div>
          </Col>
        ))}
      </Row>

      {/* DETAY + SARTLAR */}
      <Row className="g-4 stagger mb-5">
        <Col lg={7} className="fade-up">
          <div className="cam-kart" style={{ padding: 32 }}>
            <h4 className="mb-3" style={{ color: 'var(--pembe)' }}>Kampanya Detayları</h4>
            <p style={{ color: 'var(--metin-orta)', fontSize: '1.02rem', lineHeight: 1.6 }}>
              {kampanya.detay}
            </p>
            <div className="kd-bilgi-grid">
              <div>
                <div className="kdb-etiket">MİNİMUM TUTAR</div>
                <div className="kdb-deger">{kampanya.minTutar}</div>
              </div>
              <div>
                <div className="kdb-etiket">ROZET</div>
                <div className="kdb-deger">{kampanya.rozet}</div>
              </div>
              <div>
                <div className="kdb-etiket">BAŞLANGIÇ</div>
                <div className="kdb-deger">{kampanya.baslangic}</div>
              </div>
              <div>
                <div className="kdb-etiket">BİTİŞ</div>
                <div className="kdb-deger">{kampanya.bitis}</div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={5} className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="cam-kart" style={{ padding: 32, height: '100%' }}>
            <h4 className="mb-3" style={{ color: 'var(--pembe)' }}>Şartlar ve Koşullar</h4>
            <ul className="kd-sartlar">
              {kampanya.sartlar.map((s, i) => (
                <li key={i}>
                  <span className="kd-sart-ok">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>

      {/* CTA */}
      <div className="text-center fade-up" style={{ animationDelay: '0.2s', marginBottom: 40 }}>
        <h4 className="mb-3">Kampanyadan yararlanmak için hazır mısın?</h4>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn-cyber">▸ Alışverişe Başla</Link>
          <Link to="/kampanyalar" className="btn-cyber btn-cyber-outline">
            ▸ Diğer Kampanyalar
          </Link>
        </div>
      </div>
    </Container>
  );
}
