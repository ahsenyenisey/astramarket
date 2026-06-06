import { Container, Row, Col, Alert } from 'react-bootstrap';

const ADIMLAR = [
  { n: 1, b: 'Siparişlerim sayfasına git', a: 'Hesabına giriş yap, üst menüden "Siparişlerim"e tıkla.' },
  { n: 2, b: 'İade etmek istediğin ürünü seç', a: 'Sipariş detayında iade etmek istediğin ürünün yanındaki "İade Et" butonuna bas.' },
  { n: 3, b: 'İade sebebini belirt', a: 'Kısa bir açıklama yaz ve istersen fotoğraf ekle. Sistem otomatik onaylar.' },
  { n: 4, b: 'Ücretsiz kargo etiketi al', a: 'E-postana özel kargo etiketi gelir. PTT, Yurtiçi veya Aras şubelerine bırakabilirsin.' },
  { n: 5, b: 'İade onayını bekle', a: 'Ürün depoya ulaştığında kontrol edilir (1-2 iş günü) ve ücretin kart/hesabına iade edilir.' },
];

const SARTLAR = [
  { ok: true, t: 'Ürün orijinal ambalajında ve etiketleri ile birlikte olmalı' },
  { ok: true, t: 'Kullanılmamış / denenmiş giyim ürünleri 14 gün içinde iade edilebilir' },
  { ok: true, t: 'Elektronik ürünler kutusu açılmış olsa bile iade edilebilir' },
  { ok: false, t: 'Açılmış kozmetik ürünleri (parfüm, krem, makyaj) iade alınmaz' },
  { ok: false, t: 'İç giyim ve mayo ürünleri hijyen sebebiyle iade alınmaz' },
  { ok: false, t: 'Kişiselleştirilmiş / özel üretim ürünler iade kapsamı dışındadır' },
];

export default function Returns() {
  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>İade ve Değişim</h2>
        <p>14 gün hassasız iade garantisi — Premium üyelere 30 gün</p>
      </div>

      <Alert variant="success" className="cam-kart mb-4 fade-up" style={{ borderLeft: '4px solid #4ade80', padding: 20 }}>
        <strong style={{ fontSize: '1.05rem' }}>✓ Memnun kalmazsan kolayca iade et!</strong>
        <div className="mt-1" style={{ color: 'var(--metin-orta)' }}>
          Tüm iade kargo masrafları AstraMarket tarafından karşılanır. Para iadesi 3 iş günü içinde kartına yansır.
        </div>
      </Alert>

      <Row className="g-4 stagger">
        <Col lg={7}>
          <div className="cam-kart fade-up" style={{ padding: 28 }}>
            <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>İade Adımları</h4>
            {ADIMLAR.map((a) => (
              <div key={a.n} className="iade-adim">
                <div className="ia-numara">{a.n}</div>
                <div>
                  <h6 style={{ fontWeight: 700, marginBottom: 4 }}>{a.b}</h6>
                  <div style={{ color: 'var(--metin-orta)', fontSize: '0.92rem' }}>{a.a}</div>
                </div>
              </div>
            ))}
          </div>
        </Col>

        <Col lg={5}>
          <div className="cam-kart fade-up" style={{ padding: 28, animationDelay: '0.1s' }}>
            <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>İade Koşulları</h4>
            {SARTLAR.map((s, i) => (
              <div key={i} className="iade-sart">
                <div className={s.ok ? 'is-ok' : 'is-no'}>{s.ok ? '✓' : '✗'}</div>
                <div style={{ color: s.ok ? 'var(--metin-parlak)' : 'var(--metin-sonuk)' }}>{s.t}</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
