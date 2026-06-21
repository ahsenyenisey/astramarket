import { useEffect, useState, useMemo, useRef } from 'react';
import { Container, Row, Col, Pagination, Alert } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import HoloField from '../components/HoloField';
import useMouseTilt from '../components/useMouseTilt';
import RevealOnScroll from '../components/RevealOnScroll';
import StatusIndicator from '../components/StatusIndicator';
import TronGrid from '../components/TronGrid';

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

function DekoKart({ deger, etiket, gecikme = 0 }) {
  const ref = useRef(null);
  useMouseTilt(ref, { maxAngle: 10, scale: 1.04 });
  return (
    <div ref={ref} className="hero-dekor-kart" style={{ animationDelay: `${gecikme}s` }}>
      <div className="deger">{deger}</div>
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

        <div className="hero-icerik">
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
            <span className="hero-rozet">▸ YAZ KAMPANYASI 2026</span>
            <StatusIndicator label="SISTEM AKTIF" renk="yesil" />
          </div>
          <h1>
            Sevdiklerin <span className="holo-text glitch-text" data-text="burada,">burada,</span><br />
            <span className="glitch-text" data-text="fırsatları kaçırma!">fırsatları kaçırma!</span>
          </h1>
          <p>
            Elektronikten giyime, ev eşyasından kozmetiğe binlerce ürün.
            500 TL üzeri ücretsiz kargo, %50'ye varan indirimlerle.
          </p>
          <div className="d-flex gap-3 flex-wrap align-items-center">
            <button className="btn-cyber" onClick={() => document.getElementById('urunler-bolum')?.scrollIntoView({ behavior: 'smooth' })}>
              ▸ Alışverişe Başla
            </button>
            <Link to="/sepet" className="btn btn-outline-light btn-lg" style={{ borderRadius: 50, padding: '14px 32px', fontWeight: 600 }}>
              Sepetime Git
            </Link>
          </div>
        </div>
        <div className="hero-dekor d-none d-lg-flex">
          <DekoKart deger="18+" etiket="Ürün Çeşidi" gecikme={0} />
          <DekoKart deger="%50" etiket="İndirim" gecikme={1} />
          <DekoKart deger="24sa" etiket="Hızlı Kargo" gecikme={2} />
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
      <RevealOnScroll as="div" className="bolum-baslik" {...{ id: 'urunler-bolum' }}>
        <div>
          <h3 className="glitch-text" data-text="Öne Çıkan Ürünler">Öne Çıkan Ürünler</h3>
          <div className="alt">Seninle aramızda binlerce harika ürün var</div>
        </div>
        <StatusIndicator label="100 KAYIT YÜKLENDI" renk="mor" />
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
