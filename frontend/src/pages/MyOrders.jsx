import { useEffect, useState } from 'react';
import { Container, Accordion, Spinner, Alert, Table } from 'react-bootstrap';
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
              <Accordion.Body style={{ background: 'rgba(255, 247, 245, 0.6)' }}>
                <Table size="sm" responsive className="mb-0" style={{ background: 'transparent', boxShadow: 'none' }}>
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th className="text-center">Adet</th>
                      <th className="text-end">Birim</th>
                      <th className="text-end">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.detaylar.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={d.resim_url || `https://picsum.photos/seed/urun-${d.urun_id}/40/40`}
                              alt={d.urun_ad}
                              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <span>{d.urun_ad}</span>
                          </div>
                        </td>
                        <td className="text-center">{d.adet}</td>
                        <td className="text-end">{Number(d.birim_fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</td>
                        <td className="text-end fw-semibold">
                          {(Number(d.birim_fiyat) * d.adet).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}
