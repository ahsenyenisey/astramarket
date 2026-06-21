import { useEffect, useState } from 'react';
import { Container, Accordion, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';
import EmptyState from '../components/EmptyState';

const DURUM_AD = {
  hazirlaniyor: 'Hazırlanıyor',
  kargolandi: 'Kargolandı',
  teslim_edildi: 'Teslim Edildi',
  iptal: 'İptal Edildi',
};

function SkeletonSatir() {
  return (
    <div className="cam-kart mb-3 fade-up" style={{ padding: 20 }}>
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 10, width: '25%' }} />
        </div>
        <div className="skeleton" style={{ height: 28, width: 100 }} />
      </div>
    </div>
  );
}

export default function MyOrders() {
  const [siparisler, setSiparisler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState('');

  useEffect(() => {
    api.get('/siparisler/benim')
      .then((r) => setSiparisler(r.data))
      .catch((e) => setHata(e.response?.data?.hata || 'Siparişler yüklenemedi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>Siparişlerim</h2>
        <p>{loading ? 'Yükleniyor...' : `Toplam ${siparisler.length} sipariş`}</p>
      </div>

      {hata && <Alert variant="danger">{hata}</Alert>}

      {loading ? (
        <div>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonSatir key={i} />)}
        </div>
      ) : siparisler.length === 0 ? (
        <div className="fade-up">
          <EmptyState
            ikon="📦"
            baslik="Hiç siparişiniz yok"
            aciklama="Alışverişe başlamak için ürünlere göz atın."
          />
        </div>
      ) : (
        <Accordion className="stagger" defaultActiveKey="0">
          {siparisler.map((s, i) => (
            <Accordion.Item
              eventKey={String(i)}
              key={s.id}
              className="cam-kart fade-up mb-3"
              style={{ border: 'none', overflow: 'hidden' }}
            >
              <Accordion.Header>
                <div className="d-flex w-100 justify-content-between align-items-center flex-wrap gap-2 pe-3">
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>Sipariş #{s.id}</div>
                    <small className="text-muted">
                      {new Date(s.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className={`durum-rozet durum-${s.durum}`}>
                      {DURUM_AD[s.durum]}
                    </span>
                    <span className="gradient-text-dark" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      {Number(s.toplam_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </span>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body className="siparis-body-cyber">
                <div className="siparis-detay-baslik">
                  <span className="sdb-cizgi" />
                  <span className="sdb-yazi">SİPARİŞ İÇERİĞİ • {s.detaylar.length} ÜRÜN</span>
                  <span className="sdb-cizgi" />
                </div>

                <div className="siparis-urun-listesi">
                  {s.detaylar.map((d, idx) => {
                    const satirToplam = Number(d.birim_fiyat) * d.adet;
                    return (
                      <div className="siparis-urun-satir" key={d.id}>
                        <div className="sus-numara">{String(idx + 1).padStart(2, '0')}</div>
                        <div className="sus-resim-wrap">
                          <img
                            src={d.resim_url || `https://picsum.photos/seed/urun-${d.urun_id}/80/80`}
                            alt={d.urun_ad}
                            loading="lazy"
                          />
                        </div>
                        <div className="sus-bilgi">
                          <div className="sus-ad">{d.urun_ad}</div>
                          <div className="sus-meta">
                            <span className="sus-adet">×{d.adet}</span>
                            <span className="sus-nokta">•</span>
                            <span>{Number(d.birim_fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL / adet</span>
                          </div>
                        </div>
                        <div className="sus-toplam">
                          {satirToplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          <span className="sus-tl">TL</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="siparis-ozet-card">
                  <div className="soc-satir">
                    <span>Ürün toplamı</span>
                    <span>{Number(s.toplam_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                  </div>
                  <div className="soc-satir">
                    <span>Kargo</span>
                    <span className="soc-bedava">ÜCRETSİZ</span>
                  </div>
                  <div className="soc-ayrac" />
                  <div className="soc-grand">
                    <span>Sipariş Toplamı</span>
                    <span className="soc-rakam">
                      {Number(s.toplam_tutar).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                    </span>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}
