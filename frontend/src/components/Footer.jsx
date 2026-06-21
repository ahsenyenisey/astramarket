import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const SOSYAL = [
  {
    ad: 'Instagram',
    url: 'https://instagram.com/astramarket',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    ad: 'Facebook',
    url: 'https://facebook.com/astramarket',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    ad: 'X (Twitter)',
    url: 'https://twitter.com/astramarket',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4l7.5 9.5L4.5 20H7l5.5-6 4.5 6h3L12.5 10 19.5 4H17l-5 5.5L8 4H4Z"
          fill="currentColor" />
      </svg>
    ),
  },
  {
    ad: 'YouTube',
    url: 'https://youtube.com/@astramarket',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
      </svg>
    ),
  },
];

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
              {SOSYAL.map((s) => (
                <a
                  key={s.ad}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sosyal-ikon"
                  aria-label={s.ad}
                  title={s.ad}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </Col>
          <Col md={2} sm={6}>
            <h5>Keşfet</h5>
            <Link to="/">Anasayfa</Link>
            <Link to="/firsatlar">Süper Fırsatlar</Link>
            <Link to="/kampanyalar">Kampanyalar</Link>
            <Link to="/premium">Premium</Link>
          </Col>
          <Col md={3} sm={6}>
            <h5>Yardım</h5>
            <Link to="/yardim/sss">Sıkça Sorulan Sorular</Link>
            <Link to="/yardim/iade">İade & Değişim</Link>
            <Link to="/yardim/kargo">Kargo Takibi</Link>
            <Link to="/yardim/iletisim">İletişim</Link>
          </Col>
          <Col md={3}>
            <h5>İletişim</h5>
            <p style={{ marginBottom: 4 }}>
              <a href="mailto:ahsenyenisey@gmail.com">ahsenyenisey@gmail.com</a>
            </p>
            <p style={{ marginBottom: 4 }}>
              <a href="tel:+905539736740">+90 553 973 6740</a>
            </p>
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
