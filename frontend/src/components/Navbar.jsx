import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function AppNavbar() {
  const { user, logout } = useAuth();
  const { adetSayisi } = useCart();
  const { tema, degistir } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const adminAlanindayim = loc.pathname.startsWith('/admin');

  const [scrolled, setScrolled] = useState(false);
  const [bounce, setBounce] = useState(false);
  const oncekiAdet = useRef(adetSayisi);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (adetSayisi > oncekiAdet.current) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 650);
      oncekiAdet.current = adetSayisi;
      return () => clearTimeout(t);
    }
    oncekiAdet.current = adetSayisi;
  }, [adetSayisi]);

  return (
    <BSNavbar expand="lg" sticky="top" className={`navbar-bordo ${scrolled ? 'scrolled' : ''}`}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" style={{ padding: 0 }}>
          <Logo boyut={scrolled ? 'sm' : 'md'} benzersizId="nav-logo" />
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="ana-menu" />
        <BSNavbar.Collapse id="ana-menu">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Anasayfa</Nav.Link>
            {user && <Nav.Link as={Link} to="/siparislerim">Siparişlerim</Nav.Link>}
            {user?.rol === 'admin' && (
              <Dropdown align="end">
                <Dropdown.Toggle as={Nav.Link} className="text-white">Admin Paneli</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/admin/urunler">Ürün Yönetimi</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/kullanicilar-kategoriler">Kullanıcı & Kategori</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin/raporlar">Raporlar</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
          <Nav className="align-items-lg-center">
            <button
              className="tema-btn"
              onClick={degistir}
              aria-label={tema === 'dark' ? 'Aydınlık moda geç' : 'Karanlık moda geç'}
              title={tema === 'dark' ? 'Aydınlık mod' : 'Karanlık mod'}
            >
              {tema === 'dark' ? '☀' : '☾'}
            </button>
            {!adminAlanindayim && (
              <Nav.Link as={Link} to="/sepet">
                Sepet
                {adetSayisi > 0 && (
                  <span className={`cart-badge ${bounce ? 'bounce' : ''}`}>{adetSayisi}</span>
                )}
              </Nav.Link>
            )}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle as={Nav.Link} className="text-white">
                  {user.ad}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.ItemText className="small text-muted">{user.email}</Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { logout(); nav('/login'); }}>Çıkış Yap</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Giriş / Kayıt</Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
