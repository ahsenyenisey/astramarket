import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <div style={{ marginBottom: 14 }}>
              <Logo boyut="lg" benzersizId="footer-logo" />
            </div>
            <p>
              Evrenin alışveriş merkezi. Elektronikten giyime, ev eşyasından kozmetiğe
              binlerce yıldız ürün, ışık hızında kargo ve güvenli ödeme.
            </p>
            <div className="sosyal-ikonlar">
              <a href="#" className="sosyal-ikon" aria-label="Instagram">IG</a>
              <a href="#" className="sosyal-ikon" aria-label="Facebook">FB</a>
              <a href="#" className="sosyal-ikon" aria-label="Twitter">TW</a>
              <a href="#" className="sosyal-ikon" aria-label="YouTube">YT</a>
            </div>
          </Col>
          <Col md={2} sm={6}>
            <h5>Keşfet</h5>
            <Link to="/">Anasayfa</Link>
            <Link to="/sepet">Sepetim</Link>
            <Link to="/siparislerim">Siparişlerim</Link>
            <a href="#">Kampanyalar</a>
          </Col>
          <Col md={3} sm={6}>
            <h5>Yardım</h5>
            <a href="#">Sıkça Sorulan Sorular</a>
            <a href="#">İade & Değişim</a>
            <a href="#">Kargo Takibi</a>
            <a href="#">İletişim</a>
          </Col>
          <Col md={3}>
            <h5>İletişim</h5>
            <p style={{ marginBottom: 4 }}>destek@astramarket.com</p>
            <p style={{ marginBottom: 4 }}>+90 850 000 00 00</p>
            <p>İstanbul, Türkiye</p>
          </Col>
        </Row>
        <div className="footer-alt">
          © 2026 AstraMarket. Tüm hakları saklıdır. Bu site bir ders projesi olarak geliştirilmiştir.
        </div>
      </Container>
    </footer>
  );
}
