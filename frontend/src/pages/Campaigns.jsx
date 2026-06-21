import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { KAMPANYALAR } from '../data/kampanyalar';

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
              <Link to={`/kampanyalar/${k.id}`} className="btn btn-bordo w-100 mt-3">
                Kampanyayı Gör →
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
