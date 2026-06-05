import { useState } from 'react';
import { Card, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticleField from '../components/ParticleField';
import Logo from '../components/Logo';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const yetkiUyarisi = loc.state?.yetki;
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState('');
  const [form, setForm] = useState({ ad: '', email: '', sifre: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setLoading(true);
    try {
      const kullanici = tab === 'login'
        ? await login(form.email, form.sifre)
        : await register(form.ad, form.email, form.sifre);
      nav(kullanici.rol === 'admin' ? '/admin/urunler' : '/');
    } catch (err) {
      setHata(err.response?.data?.hata || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-evren">
      <ParticleField density={110} />

      <Card className="auth-card fade-up">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Logo boyut="lg" benzersizId="login-logo" />
          </div>
          <div className="mt-2" style={{ color: 'var(--metin-sonuk)', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Evrenin Alışverişi
          </div>
        </div>
        <Card.Body className="p-4">
          <Tabs activeKey={tab} onSelect={(k) => { setTab(k); setHata(''); }} className="mb-3" justify>
            <Tab eventKey="login" title="Giriş Yap" />
            <Tab eventKey="register" title="Kayıt Ol" />
          </Tabs>

          {yetkiUyarisi && <Alert variant="warning">{yetkiUyarisi}. Lütfen admin hesabıyla giriş yapın.</Alert>}
          {hata && <Alert variant="danger">{hata}</Alert>}

          <Form onSubmit={onSubmit}>
            {tab === 'register' && (
              <Form.Group className="mb-3">
                <Form.Label>Ad Soyad</Form.Label>
                <Form.Control required value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control type="password" required minLength={4} value={form.sifre} onChange={(e) => setForm({ ...form, sifre: e.target.value })} />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" className="btn-bordo" disabled={loading} size="lg">
                {loading ? <Spinner size="sm" animation="border" /> : (tab === 'login' ? 'Giriş Yap →' : 'Kayıt Ol →')}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--metin-sonuk)' }}>
              ← Misafir olarak gez
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
