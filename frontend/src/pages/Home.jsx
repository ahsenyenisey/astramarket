import { useEffect, useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import HoloField from '../components/HoloField';
import useMouseTilt from '../components/useMouseTilt';
import RevealOnScroll from '../components/RevealOnScroll';
import TronGrid from '../components/TronGrid';
import ScrambleText from '../components/ScrambleText';
import Counter from '../components/Counter';
import PortalRing from '../components/PortalRing';
import MagneticButton from '../components/MagneticButton';

const SAYFA_BASI = 8;

function SkeletonKart() {
  return (
    <div className="skeleton-card">
      <div className="skeleton img" />
      <div className="body">
        <div className="skeleton line" style={{ width: '40%' }} />
        <div className="skeleton line" style={{ width: '85%' }} />
        <div className="skeleton line" style={{ width: '60%' }} />
        <div className="skeleton line" style={{ width: '50%', height: 28, marginTop: 12 }} />
      </div>
    </div>
  );
}

function DekoKart({ hedef, onEk = '', sonEk = '', etiket, gecikme = 0 }) {
  const ref = useRef(null);
  useMouseTilt(ref, { maxAngle: 10, scale: 1.04 });
  return (
    <div ref={ref} className="hero-dekor-kart" style={{ animationDelay: `${gecikme}s` }}>
      <div className="deger">
        <Counter hedef={hedef} onEk={onEk} sonEk={sonEk} gecikme={gecikme * 200} sure={1500} />
      </div>
      <div className="etiket">{etiket}</div>
    </div>
  );
}

export default function Home() {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [secili, setSecili] = useState(null);
  const [arama, setArama] = useState('');
  const [sayfa, setSayfa] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    Promise.all([api.get('/urunler'), api.get('/kategoriler')])
      .then(([u, k]) => { setUrunler(u.data); setKategoriler(k.data); })
      .catch((e) => setHata(e.response?.data?.hata || 'Veri yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  // URL'den ?kategori=ID okunup otomatik filtre uygula + urunlere kaydir
  useEffect(() => {
    const kat = searchParams.get('kategori');
    if (kat === 'tum') {
      setSecili(null);
      setSayfa(1);
      setTimeout(() => {
        document.getElementById('urunler-bolum')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (kat) {
      const id = Number(kat);
      if (!isNaN(id)) {
        setSecili(id);
        setSayfa(1);
        setTimeout(() => {
          document.getElementById('urunler-bolum')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [searchParams]);

  const filtrelenen = useMemo(() => {
    return urunler.filter((u) => {
      if (secili && u.kategori_id !== secili) return false;
      if (arama && !u.ad.toLowerCase().includes(arama.toLowerCase())) return false;
      return true;
    });
  }, [urunler, secili, arama]);

  const toplamSayfa = Math.max(1, Math.ceil(filtrelenen.length / SAYFA_BASI));
  const goster = filtrelenen.slice((sayfa - 1) * SAYFA_BASI, sayfa * SAYFA_BASI);

  return (
    <Container className="my-4 my-md-5">
      {/* HERO */}
      <section className="hero-banner fade-up">
        <HoloField gridLines={true} />
        <PortalRing boyut={460} className="hero-portal" />

        <div className="hero-icerik">
          <span className="hero-rozet">
            <ScrambleText text="▸ YAZ KAMPANYASI 2026" sure={900} />
          </span>
          <h1>
            Sevdiklerin <span className="holo-text glitch-text" data-text="burada,">burada,</span><br />
            <span className="glitch-text" data-text="fırsatları kaçırma!">fırsatları kaçırma!</span>
          </h1>
          <p>
            Elektronikten giyime, ev eşyasından kozmetiğe binlerce ürün.
            500 TL üzeri ücretsiz kargo, %50'ye varan indirimlerle.
          </p>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            <MagneticButton>
              <button className="btn-cyber btn-neon-pulse" onClick={() => document.getElementById('urunler-bolum')?.scrollIntoView({ behavior: 'smooth' })}>
                ▸ Alışverişe Başla
              </button>
            </MagneticButton>
            <MagneticButton>
              <Link to="/sepet" className="btn-cyber btn-cyber-outline">
                ▸ Sepetime Git
              </Link>
            </MagneticButton>
          </div>
        </div>
        <div className="hero-dekor d-none d-lg-flex">
          <DekoKart hedef={100} sonEk="+" etiket="Ürün Çeşidi" gecikme={0} />
          <DekoKart hedef={50} onEk="%" etiket="İndirim" gecikme={1} />
          <DekoKart hedef={24} sonEk="sa" etiket="Hızlı Kargo" gecikme={2} />
        </div>
      </section>

      {/* ARAMA + KATEGORI PILL'LERI */}
      <div className="fade-up" style={{ animationDelay: '0.1s' }}>
        <Row className="g-3 align-items-center mb-3">
          <Col md={6} lg={5}>
            <label className="arama-kutu">
              <input
                placeholder="Aradığınız ürünü yazın..."
                value={arama}
                onChange={(e) => { setArama(e.target.value); setSayfa(1); }}
              />
              <button className="arama-btn" type="button" aria-label="Ara">⌕</button>
            </label>
          </Col>
          <Col md={6} lg={7} className="text-md-end">
            <small style={{ color: 'var(--metin-sonuk)' }}>
              <strong style={{ color: 'var(--pembe)' }}>{filtrelenen.length}</strong> ürün listeleniyor
            </small>
          </Col>
        </Row>

        <div className="kategori-pills">
          <button
            className={`kategori-pill ${secili === null ? 'aktif' : ''}`}
            onClick={() => { setSecili(null); setSayfa(1); }}
          >
            Tümü
          </button>
          {kategoriler.map((k) => (
            <button
              key={k.id}
              className={`kategori-pill ${secili === k.id ? 'aktif' : ''}`}
              onClick={() => { setSecili(k.id); setSayfa(1); }}
            >
              {k.ad}
            </button>
          ))}
        </div>
      </div>

      {/* HOLO LINE - cyber gecisi */}
      <div className="holo-line fade-up" style={{ animationDelay: '0.18s' }} />

      {/* BOLUM BASLIK */}
      <RevealOnScroll as="div" yon="left" className="bolum-baslik" {...{ id: 'urunler-bolum' }}>
        <div>
          <h3 className="glitch-text" data-text="Öne Çıkan Ürünler">Öne Çıkan Ürünler</h3>
          <div className="alt">Seninle aramızda binlerce harika ürün var</div>
        </div>
      </RevealOnScroll>

      {hata && <Alert variant="danger">{hata}</Alert>}

      {loading ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Col key={i}><SkeletonKart /></Col>
          ))}
        </Row>
      ) : goster.length === 0 ? (
        <EmptyState ikon="🔍" baslik="Ürün bulunamadı" aciklama="Filtreleri değiştirip tekrar deneyin." />
      ) : (
        <>
          <Row
            xs={1} sm={2} md={3} lg={4}
            className="g-4 stagger"
            key={`${secili}-${arama}-${sayfa}`}
          >
            {goster.map((u) => (
              <Col key={u.id} className="fade-up"><ProductCard urun={u} /></Col>
            ))}
          </Row>

          <TronGrid />
          {toplamSayfa > 1 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.First onClick={() => setSayfa(1)} disabled={sayfa === 1} />
              <Pagination.Prev onClick={() => setSayfa((s) => Math.max(1, s - 1))} disabled={sayfa === 1} />
              {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                <Pagination.Item key={n} active={n === sayfa} onClick={() => setSayfa(n)}>{n}</Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))} disabled={sayfa === toplamSayfa} />
              <Pagination.Last onClick={() => setSayfa(toplamSayfa)} disabled={sayfa === toplamSayfa} />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}
