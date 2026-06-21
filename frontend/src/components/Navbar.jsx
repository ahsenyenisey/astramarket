import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import api from '../api/axios';

// Basit, garantili calisan custom dropdown.
// Tiklayinca acilir, disariya tiklayinca kapanir.
function CustomDropdown({ label, children }) {
  const [acik, setAcik] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!acik) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAcik(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [acik]);

  return (
    <div ref={ref} className="custom-dropdown">
      <button
        type="button"
        className="custom-dropdown-toggle"
        onClick={() => setAcik((a) => !a)}
        aria-expanded={acik}
      >
        {label}
        <span className="custom-dropdown-arrow" aria-hidden="true">▾</span>
      </button>
      {acik && (
        <div className="custom-dropdown-menu" onClick={() => setAcik(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function AppNavbar() {
  const { user, premium, logout } = useAuth();
  const { adetSayisi } = useCart();
  const { tema, degistir } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const adminAlanindayim = loc.pathname.startsWith('/admin');

  const [scrolled, setScrolled] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [kategoriler, setKategoriler] = useState([]);
  const oncekiAdet = useRef(adetSayisi);

  useEffect(() => {
    api.get('/kategoriler').then((r) => setKategoriler(r.data)).catch(() => {});
  }, []);

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
          <Nav className="me-auto navbar-genel-menu">
            <CustomDropdown label="Kategoriler">
              <Link to="/?kategori=tum" className="custom-dropdown-item">
                <span style={{ marginRight: 8 }}>✦</span> Tüm Ürünler
              </Link>
              <div className="custom-dropdown-divider" />
              {kategoriler.map((k) => (
                <Link key={k.id} to={`/?kategori=${k.id}`} className="custom-dropdown-item">
                  {k.ad}
                </Link>
              ))}
            </CustomDropdown>
            {user && <Nav.Link as={Link} to="/siparislerim">Siparişlerim</Nav.Link>}
            <Nav.Link as={Link} to="/firsatlar" className="nav-vurgu-link">
              <span className="nav-flame">🔥</span> Süper Fiyat, Süper Teklif
            </Nav.Link>
            <Nav.Link as={Link} to="/kampanyalar" className="nav-kampanya-link">Kampanyalar</Nav.Link>
            <CustomDropdown label="Müşteri Hizmetleri">
              <Link to="/premium" className="custom-dropdown-item premium-item">
                <span className="premium-rozet">★</span> AstraMarket Premium
              </Link>
              <div className="custom-dropdown-divider" />
              <Link to="/yardim/sss" className="custom-dropdown-item">Sıkça Sorulan Sorular</Link>
              <Link to="/yardim/iade" className="custom-dropdown-item">İade ve Değişim</Link>
              <Link to="/yardim/kargo" className="custom-dropdown-item">Kargo Takibi</Link>
              <Link to="/yardim/iletisim" className="custom-dropdown-item">İletişim</Link>
            </CustomDropdown>
            {user?.rol === 'admin' && (
              <CustomDropdown label="Admin Paneli">
                <Link to="/admin/urunler" className="custom-dropdown-item">Ürün Yönetimi</Link>
                <Link to="/admin/kullanicilar-kategoriler" className="custom-dropdown-item">Kullanıcı & Kategori</Link>
                <Link to="/admin/raporlar" className="custom-dropdown-item">Raporlar</Link>
              </CustomDropdown>
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
              <CustomDropdown
                label={
                  <span className={`user-label ${premium ? 'is-premium' : ''}`}>
                    {premium && <span className="premium-yildiz" aria-hidden="true">★</span>}
                    {user.ad}
                  </span>
                }
              >
                <div className="custom-dropdown-itemtext">
                  <div style={{ fontWeight: 600 }}>{user.ad}</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.7 }}>{user.email}</div>
                </div>
                <div className="custom-dropdown-divider" />
                {premium ? (
                  <Link to="/premium" className="custom-dropdown-item premium-aktif-satir">
                    <span className="pa-rozet">★ PREMIUM</span>
                    <span className="pa-durum">Aktif</span>
                  </Link>
                ) : (
                  <Link to="/premium" className="custom-dropdown-item premium-pasif-satir">
                    <span>Premium'a Yükselt</span>
                    <span className="pa-ok">→</span>
                  </Link>
                )}
                <div className="custom-dropdown-divider" />
                <button
                  type="button"
                  className="custom-dropdown-item"
                  onClick={() => { logout(); nav('/login'); }}
                >
                  Çıkış Yap
                </button>
              </CustomDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Giriş / Kayıt</Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
