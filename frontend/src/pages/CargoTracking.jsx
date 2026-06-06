import { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';

const ORNEK_DURUMLAR = [
  { tarih: 'Bugün 14:32', durum: 'Dağıtıma çıktı', detay: 'Kuryeniz Mehmet Yılmaz - Tahmini teslim: 17:00-19:00' },
  { tarih: 'Bugün 09:15', durum: 'Şubeye geldi', detay: 'Kadıköy Şubesi - İstanbul' },
  { tarih: 'Dün 22:48', durum: 'Aktarma merkezinde', detay: 'İstanbul Anadolu Aktarma Merkezi' },
  { tarih: 'Dün 18:20', durum: 'Yola çıktı', detay: 'Ankara Çıkış Merkezi' },
  { tarih: 'Dün 12:05', durum: 'Kargoya verildi', detay: 'AstraMarket Depo - Ankara' },
];

export default function CargoTracking() {
  const [takipNo, setTakipNo] = useState('');
  const [sonuc, setSonuc] = useState(null);

  const ara = (e) => {
    e.preventDefault();
    if (takipNo.trim().length < 4) {
      setSonuc({ hata: 'Takip numarası en az 4 karakter olmalı' });
      return;
    }
    setSonuc({
      no: takipNo,
      durum: ORNEK_DURUMLAR,
      teslim: '17:00-19:00 arasında',
    });
  };

  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>Kargo Takibi</h2>
        <p>Siparişinin nerede olduğunu anlık olarak takip et</p>
      </div>

      <div className="cam-kart fade-up" style={{ padding: 32, maxWidth: 700, margin: '0 auto 32px' }}>
        <Form onSubmit={ara}>
          <Form.Label className="fw-semibold mb-2">Takip Numarası</Form.Label>
          <Row className="g-2">
            <Col>
              <Form.Control
                type="text"
                placeholder="Örnek: ASTM2026060812345"
                value={takipNo}
                onChange={(e) => setTakipNo(e.target.value)}
                style={{ fontSize: '1.05rem' }}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" className="btn-bordo" size="lg">Sorgula</Button>
            </Col>
          </Row>
          <small style={{ color: 'var(--metin-sonuk)', marginTop: 8, display: 'block' }}>
            Takip numarasını sipariş onay e-postasında veya SMS'inde bulabilirsin.
          </small>
        </Form>
      </div>

      {sonuc?.hata && <Alert variant="danger" className="fade-up">{sonuc.hata}</Alert>}

      {sonuc?.durum && (
        <div className="cam-kart fade-up" style={{ padding: 28 }}>
          <div className="d-flex justify-content-between flex-wrap mb-4">
            <div>
              <small style={{ color: 'var(--metin-sonuk)', textTransform: 'uppercase', letterSpacing: 1 }}>Takip No</small>
              <h5 style={{ fontWeight: 700, marginTop: 4 }}>{sonuc.no}</h5>
            </div>
            <div className="text-end">
              <small style={{ color: 'var(--metin-sonuk)', textTransform: 'uppercase', letterSpacing: 1 }}>Tahmini Teslimat</small>
              <h5 style={{ fontWeight: 700, marginTop: 4, color: 'var(--pembe)' }}>{sonuc.teslim}</h5>
            </div>
          </div>

          <div className="kargo-zaman-cizgisi">
            {sonuc.durum.map((d, i) => (
              <div key={i} className={`kzc-adim ${i === 0 ? 'aktif' : ''}`}>
                <div className="kzc-nokta" />
                <div className="kzc-icerik">
                  <div className="kzc-tarih">{d.tarih}</div>
                  <h6 className="kzc-durum">{d.durum}</h6>
                  <div className="kzc-detay">{d.detay}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
