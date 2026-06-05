import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Badge, Form, Alert, Spinner, Card } from 'react-bootstrap';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [urun, setUrun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');
  const [adet, setAdet] = useState(1);
  const [puan, setPuan] = useState(5);
  const [yorumMetni, setYorumMetni] = useState('');
  const [mesaj, setMesaj] = useState('');
  const { ekle } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const yukle = () => {
    setLoading(true);
    api.get(`/urunler/${id}`)
      .then((r) => setUrun(r.data))
      .catch((e) => setHata(e.response?.data?.hata || 'Ürün yüklenemedi'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { yukle(); }, [id]);

  const yorumSil = async (yorumId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/yorumlar/${yorumId}`);
      setMesaj('Yorum silindi');
      yukle();
      setTimeout(() => setMesaj(''), 2500);
    } catch (err) {
      setHata(err.response?.data?.hata || 'Yorum silinemedi');
    }
  };

  const yorumGonder = async (e) => {
    e.preventDefault();
    if (!user) return nav('/login');
    try {
      await api.post('/yorumlar', { urun_id: Number(id), puan, yorum_metni: yorumMetni });
      setYorumMetni('');
      setPuan(5);
      setMesaj('Yorumunuz eklendi');
      yukle();
      setTimeout(() => setMesaj(''), 3000);
    } catch (err) {
      setHata(err.response?.data?.hata || 'Yorum eklenemedi');
    }
  };

  if (loading) {
    return (
      <Container className="my-5 text-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" style={{ color: 'var(--bordo)', width: 60, height: 60 }} />
      </Container>
    );
  }
  if (hata) return <Container className="py-4"><Alert variant="danger">{hata}</Alert></Container>;
  if (!urun) return null;

  const ortalama = urun.yorumlar.length
    ? (urun.yorumlar.reduce((s, y) => s + y.puan, 0) / urun.yorumlar.length).toFixed(1)
    : null;

  return (
    <Container className="my-4 my-md-5">
      <div className="mb-3 fade-up">
        <Link to="/" style={{ fontSize: '0.9rem', fontWeight: 600 }}>← Anasayfaya dön</Link>
      </div>

      <Row className="g-4">
        <Col md={6} className="fade-up">
          <div className="cam-kart" style={{ padding: 16, overflow: 'hidden' }}>
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #fef2f4, #fce7ed)',
            }}>
              <img
                src={urun.resim_url || `https://picsum.photos/seed/urun-${urun.id}/600/400`}
                alt={urun.ad}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s' }}
              />
            </div>
          </div>
        </Col>

        <Col md={6} className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="cam-kart" style={{ padding: 32 }}>
            {urun.kategori_ad && (
              <div className="kategori-etiket" style={{ fontSize: '0.78rem' }}>
                {urun.kategori_ad}
              </div>
            )}
            <h2 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: 12, letterSpacing: '-0.5px' }}>
              {urun.ad}
            </h2>

            {ortalama && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <span className="yildiz" style={{ fontSize: '1.2rem' }}>
                  {'★'.repeat(Math.round(ortalama))}{'☆'.repeat(5 - Math.round(ortalama))}
                </span>
                <span className="text-muted">{ortalama} / 5</span>
                <span className="badge-pudra" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                  {urun.yorumlar.length} yorum
                </span>
              </div>
            )}

            <p style={{ color: 'var(--gri-metin)', lineHeight: 1.6, marginBottom: 20 }}>
              {urun.aciklama}
            </p>

            <div style={{ marginBottom: 20 }}>
              <span className="gradient-text-dark" style={{ fontSize: '2.4rem', fontWeight: 800 }}>
                {Number(urun.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            </div>

            {urun.stok > 0 ? (
              <div className="durum-rozet durum-teslim_edildi mb-3">
                Stokta {urun.stok} adet var
              </div>
            ) : (
              <div className="durum-rozet durum-iptal mb-3">Stokta yok</div>
            )}

            <Row className="align-items-center g-3 mt-2">
              <Col xs="auto">
                <div className="adet-kutu">
                  <button className="adet-btn" onClick={() => setAdet((a) => Math.max(1, a - 1))} disabled={adet <= 1}>−</button>
                  <span className="adet-deger">{adet}</span>
                  <button className="adet-btn" onClick={() => setAdet((a) => Math.min(urun.stok, a + 1))} disabled={adet >= urun.stok}>+</button>
                </div>
              </Col>
              <Col>
                <Button
                  className="btn-bordo w-100"
                  size="lg"
                  disabled={urun.stok <= 0}
                  onClick={() => {
                    ekle(urun, adet);
                    setMesaj(`${adet} adet sepete eklendi`);
                    setTimeout(() => setMesaj(''), 2500);
                  }}
                >
                  Sepete Ekle
                </Button>
              </Col>
            </Row>

            {mesaj && <Alert variant="success" className="mt-3 mb-0">{mesaj}</Alert>}
          </div>
        </Col>
      </Row>

      <div className="fade-up" style={{ animationDelay: '0.2s', marginTop: 48 }}>
        <div className="bolum-baslik">
          <div>
            <h3>Yorumlar ({urun.yorumlar.length})</h3>
            <div className="alt">Bu ürün hakkındaki müşteri yorumları</div>
          </div>
        </div>

        {user ? (
          <Card className="cam-kart mb-4" style={{ padding: 24, border: 'none' }}>
            <Form onSubmit={yorumGonder}>
              <Row className="g-3 align-items-end">
                <Col md={2}>
                  <Form.Label className="fw-semibold">Puan</Form.Label>
                  <Form.Select value={puan} onChange={(e) => setPuan(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                  </Form.Select>
                </Col>
                <Col md={8}>
                  <Form.Label className="fw-semibold">Yorumunuz</Form.Label>
                  <Form.Control
                    as="textarea" rows={2}
                    placeholder="Bu ürün hakkında düşüncelerini yaz..."
                    value={yorumMetni}
                    onChange={(e) => setYorumMetni(e.target.value)}
                  />
                </Col>
                <Col md={2}>
                  <Button type="submit" className="btn-bordo w-100">Gönder</Button>
                </Col>
              </Row>
            </Form>
          </Card>
        ) : (
          <Alert variant="light" className="cam-kart" style={{ padding: 20 }}>
            Yorum yapmak için <Link to="/login" style={{ fontWeight: 600 }}>giriş yapın</Link>.
          </Alert>
        )}

        {urun.yorumlar.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💬</div>
            <h4>Henüz yorum yok</h4>
            <p>Bu ürün hakkında ilk yorumu siz yapın!</p>
          </div>
        ) : (
          <div className="stagger">
            {urun.yorumlar.map((y) => {
              const benimYorumum = user && y.kullanici_id === user.id;
              const silebilirim = benimYorumum || user?.rol === 'admin';
              return (
                <div key={y.id} className="yorum-item fade-up">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <strong>{y.kullanici_ad}</strong>
                      {benimYorumum && <Badge className="badge-pudra ms-2">Sizin yorumunuz</Badge>}
                    </div>
                    <span className="yildiz">{'★'.repeat(y.puan)}{'☆'.repeat(5 - y.puan)}</span>
                  </div>
                  <div style={{ color: 'var(--koyu-metin)', lineHeight: 1.5 }}>{y.yorum_metni}</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">{new Date(y.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
                    {silebilirim && (
                      <Button size="sm" variant="outline-danger" onClick={() => yorumSil(y.id)}>
                        Sil
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
