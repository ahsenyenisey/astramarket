import { Container, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import api from '../api/axios';

export default function Cart() {
  const { items, guncelle, cikar, temizle, toplam } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const kargo = toplam >= 500 ? 0 : 29.9;
  const genelToplam = toplam + kargo;

  const siparisOlustur = async () => {
    if (!user) return nav('/login');
    setHata('');
    setYukleniyor(true);
    try {
      const { data } = await api.post('/siparisler', {
        urunler: items.map((x) => ({ urun_id: x.id, adet: x.adet })),
      });
      temizle();
      setBasari(`Siparişiniz oluşturuldu! Sipariş No: #${data.siparis_id}`);
      setTimeout(() => nav('/siparislerim'), 2000);
    } catch (err) {
      setHata(err.response?.data?.hata || 'Sipariş oluşturulamadı');
    } finally {
      setYukleniyor(false);
    }
  };

  if (items.length === 0) {
    return (
      <Container className="my-4 my-md-5">
        <div className="fade-up">
          <EmptyState
            ikon="🛒"
            baslik="Sepetiniz boş"
            aciklama="Henüz ürün eklemediniz. Alışverişe başlayalım!"
            cocuk={<Link to="/" className="btn btn-bordo mt-3" style={{ padding: '12px 28px' }}>Alışverişe Devam Et</Link>}
          />
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>Sepetim</h2>
        <p>{items.length} farklı ürün, toplam {items.reduce((s, x) => s + x.adet, 0)} adet</p>
      </div>

      {hata && <Alert variant="danger" className="fade-up">{hata}</Alert>}
      {basari && <Alert variant="success" className="fade-up">{basari}</Alert>}

      <Row className="g-4">
        <Col lg={8}>
          <div className="stagger">
            {items.map((x) => (
              <div key={x.id} className="cam-kart fade-up mb-3" style={{ padding: 18 }}>
                <Row className="align-items-center g-3">
                  <Col xs="auto">
                    <div style={{
                      width: 90, height: 90,
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #fef2f4, #fce7ed)',
                    }}>
                      <img
                        src={x.resim_url || `https://picsum.photos/seed/urun-${x.id}/90/90`}
                        alt={x.ad}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </Col>
                  <Col>
                    <Link to={`/urun/${x.id}`} style={{ color: 'inherit' }}>
                      <h6 style={{ fontWeight: 700, marginBottom: 6 }}>{x.ad}</h6>
                    </Link>
                    <div style={{ color: 'var(--gri-metin)', fontSize: '0.9rem' }}>
                      Birim: {Number(x.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="adet-kutu">
                      <button className="adet-btn" onClick={() => guncelle(x.id, x.adet - 1)}>−</button>
                      <span className="adet-deger">{x.adet}</span>
                      <button className="adet-btn" onClick={() => guncelle(x.id, x.adet + 1)}>+</button>
                    </div>
                  </Col>
                  <Col xs="auto" className="text-end">
                    <div className="gradient-text-dark" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {(Number(x.fiyat) * x.adet).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </div>
                    <button
                      onClick={() => cikar(x.id)}
                      style={{
                        background: 'transparent', border: 'none',
                        color: '#b91c1c', fontSize: '0.85rem', marginTop: 4, cursor: 'pointer',
                      }}
                    >
                      ✕ Kaldır
                    </button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={4}>
          <div className="cam-kart fade-up" style={{ padding: 28, position: 'sticky', top: 100, animationDelay: '0.15s' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Sipariş Özeti</h5>

            <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--gri-metin)' }}>
              <span>Ara Toplam</span>
              <strong style={{ color: 'var(--koyu-metin)' }}>
                {toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </strong>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--gri-metin)' }}>
              <span>Kargo</span>
              <strong style={{ color: kargo === 0 ? '#15803d' : 'var(--koyu-metin)' }}>
                {kargo === 0 ? 'ÜCRETSİZ' : `${kargo.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`}
              </strong>
            </div>

            {kargo > 0 && (
              <div style={{
                background: 'var(--pudra-acik)',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: '0.85rem',
                color: 'var(--koyu-metin)',
                marginTop: 10,
                marginBottom: 10,
              }}>
                💡 {(500 - toplam).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL daha ekle, kargo ücretsiz olsun!
              </div>
            )}

            <hr />
            <div className="d-flex justify-content-between mb-3 align-items-baseline">
              <strong style={{ fontSize: '1.05rem' }}>Genel Toplam</strong>
              <span className="gradient-text-dark" style={{ fontSize: '1.7rem', fontWeight: 800 }}>
                {genelToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            </div>

            <Button
              className="btn-bordo w-100 mb-2"
              size="lg"
              disabled={yukleniyor}
              onClick={siparisOlustur}
            >
              {yukleniyor ? 'Oluşturuluyor...' : 'Siparişi Tamamla'}
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => { if (window.confirm('Sepet temizlensin mi?')) temizle(); }}
            >
              Sepeti Temizle
            </Button>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.85rem', color: 'var(--gri-metin)', lineHeight: 1.6 }}>
              🔒 Güvenli ödeme<br />
              🚚 24 saatte kargo<br />
              ↩️ 14 gün iade garantisi
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
