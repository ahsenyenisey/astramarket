import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

export default function Contact() {
  const [form, setForm] = useState({ ad: '', email: '', konu: 'genel', mesaj: '' });
  const [gonderildi, setGonderildi] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setGonderildi(true);
    setForm({ ad: '', email: '', konu: 'genel', mesaj: '' });
    setTimeout(() => setGonderildi(false), 5000);
  };

  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>İletişim</h2>
        <p>Sorularınız, önerileriniz ve geri bildirimleriniz bizim için değerli</p>
      </div>

      <Row className="g-4 stagger">
        <Col lg={5} className="fade-up">
          <div className="cam-kart" style={{ padding: 32, height: '100%' }}>
            <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>Bize Ulaşın</h4>

            <div className="iletisim-blok">
              <div className="ib-ikon">📞</div>
              <div>
                <div className="ib-etiket">Çağrı Merkezi</div>
                <div className="ib-deger">+90 850 000 00 00</div>
                <small style={{ color: 'var(--metin-sonuk)' }}>7/24 hizmet</small>
              </div>
            </div>

            <div className="iletisim-blok">
              <div className="ib-ikon">✉️</div>
              <div>
                <div className="ib-etiket">E-posta</div>
                <div className="ib-deger">destek@astramarket.com</div>
                <small style={{ color: 'var(--metin-sonuk)' }}>Ortalama 2 saatte yanıt</small>
              </div>
            </div>

            <div className="iletisim-blok">
              <div className="ib-ikon">💬</div>
              <div>
                <div className="ib-etiket">Canlı Destek</div>
                <div className="ib-deger">Anında bağlan</div>
                <small style={{ color: 'var(--metin-sonuk)' }}>09:00 - 22:00</small>
              </div>
            </div>

            <div className="iletisim-blok">
              <div className="ib-ikon">📍</div>
              <div>
                <div className="ib-etiket">Merkez Ofis</div>
                <div className="ib-deger">Maslak, Sarıyer / İstanbul</div>
                <small style={{ color: 'var(--metin-sonuk)' }}>Astra Tower, Kat 12</small>
              </div>
            </div>

            <div className="sosyal-ikonlar mt-4">
              <a href="#" className="sosyal-ikon" aria-label="Instagram">IG</a>
              <a href="#" className="sosyal-ikon" aria-label="Facebook">FB</a>
              <a href="#" className="sosyal-ikon" aria-label="Twitter">TW</a>
              <a href="#" className="sosyal-ikon" aria-label="YouTube">YT</a>
            </div>
          </div>
        </Col>

        <Col lg={7} className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="cam-kart" style={{ padding: 32 }}>
            <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>Mesaj Gönder</h4>

            {gonderildi && (
              <Alert variant="success" className="mb-3">
                ✓ Mesajın alındı! Ekibimiz en kısa sürede sana dönüş yapacak.
              </Alert>
            )}

            <Form onSubmit={onSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Ad Soyad</Form.Label>
                  <Form.Control
                    required
                    value={form.ad}
                    onChange={(e) => setForm({ ...form, ad: e.target.value })}
                    placeholder="Adınız soyadınız"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>E-posta</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ornek@mail.com"
                  />
                </Col>
                <Col md={12}>
                  <Form.Label>Konu</Form.Label>
                  <Form.Select value={form.konu} onChange={(e) => setForm({ ...form, konu: e.target.value })}>
                    <option value="genel">Genel Bilgi</option>
                    <option value="siparis">Sipariş Sorunu</option>
                    <option value="iade">İade / Değişim</option>
                    <option value="oneri">Öneri / Şikayet</option>
                    <option value="kurumsal">Kurumsal İşbirliği</option>
                  </Form.Select>
                </Col>
                <Col md={12}>
                  <Form.Label>Mesajınız</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    required
                    value={form.mesaj}
                    onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
                    placeholder="Mesajınızı detaylı bir şekilde yazın..."
                  />
                </Col>
                <Col md={12}>
                  <Button type="submit" className="btn-bordo" size="lg">
                    Mesajı Gönder →
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
