import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function indirim(urun) {
  const seed = urun.id % 10;
  if (seed < 3) return 0;
  return 10 + (seed * 4);
}

function GeriSayim() {
  const [{ s, d, sa, dk, sn }, setT] = useState({ s: 0, d: 0, sa: 0, dk: 0, sn: 0 });
  useEffect(() => {
    const hedef = new Date();
    hedef.setDate(hedef.getDate() + 3);
    hedef.setHours(23, 59, 59, 0);
    const tik = () => {
      const fark = hedef - new Date();
      if (fark <= 0) return;
      setT({
        s: 1,
        d: Math.floor(fark / 86400000),
        sa: Math.floor((fark / 3600000) % 24),
        dk: Math.floor((fark / 60000) % 60),
        sn: Math.floor((fark / 1000) % 60),
      });
    };
    tik();
    const i = setInterval(tik, 1000);
    return () => clearInterval(i);
  }, []);
  if (!s) return null;
  return (
    <div className="geri-sayim">
      <div className="gs-kutu"><span className="gs-deger">{String(d).padStart(2,'0')}</span><span className="gs-etiket">GÜN</span></div>
      <div className="gs-iki-nokta">:</div>
      <div className="gs-kutu"><span className="gs-deger">{String(sa).padStart(2,'0')}</span><span className="gs-etiket">SAAT</span></div>
      <div className="gs-iki-nokta">:</div>
      <div className="gs-kutu"><span className="gs-deger">{String(dk).padStart(2,'0')}</span><span className="gs-etiket">DAKİKA</span></div>
      <div className="gs-iki-nokta">:</div>
      <div className="gs-kutu"><span className="gs-deger">{String(sn).padStart(2,'0')}</span><span className="gs-etiket">SANİYE</span></div>
    </div>
  );
}

export default function SuperPrice() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    api.get('/urunler')
      .then(r => setUrunler(r.data))
      .catch(e => setHata(e.response?.data?.hata || 'Veri yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  const enYuksekIndirimliler = useMemo(() => {
    return [...urunler]
      .map(u => ({ ...u, _i: indirim(u) }))
      .filter(u => u._i > 0)
      .sort((a, b) => b._i - a._i);
  }, [urunler]);

  const kategoriler = {
    '%40+ İndirim': enYuksekIndirimliler.filter(u => u._i >= 40),
    '%30-39 İndirim': enYuksekIndirimliler.filter(u => u._i >= 30 && u._i < 40),
    '%20-29 İndirim': enYuksekIndirimliler.filter(u => u._i >= 20 && u._i < 30),
  };

  return (
    <Container className="my-4 my-md-5">
      <section className="super-fiyat-hero fade-up">
        <div className="sf-icerik">
          <span className="sf-rozet">🔥 SINIRLI SÜRE FIRSAT</span>
          <h1>Süper Fiyat, <span className="gradient-text">Süper Teklif!</span></h1>
          <p>%50'ye varan indirimler ve sadece bu hafta sonu özel fırsatlar. Stoklar tükenmeden!</p>
          <GeriSayim />
        </div>
      </section>

      {hata && <Alert variant="danger">{hata}</Alert>}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--pembe)' }} /></div>
      ) : (
        Object.entries(kategoriler).map(([baslik, liste], idx) => liste.length > 0 && (
          <section key={baslik} className="fade-up" style={{ marginTop: 48, animationDelay: `${0.1 + idx * 0.05}s` }}>
            <div className="bolum-baslik">
              <div>
                <h3>{baslik}</h3>
                <div className="alt">{liste.length} ürün bu kategoride indirimde</div>
              </div>
            </div>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4 stagger">
              {liste.slice(0, 8).map(u => (
                <Col key={u.id} className="fade-up"><ProductCard urun={u} /></Col>
              ))}
            </Row>
          </section>
        ))
      )}
    </Container>
  );
}
