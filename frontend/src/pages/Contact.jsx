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
              <a href="https://instagram.com/astramarket" target="_blank" rel="noopener noreferrer" className="sosyal-ikon" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a href="https://facebook.com/astramarket" target="_blank" rel="noopener noreferrer" className="sosyal-ikon" aria-label="Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://twitter.com/astramarket" target="_blank" rel="noopener noreferrer" className="sosyal-ikon" aria-label="X (Twitter)" title="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4l7.5 9.5L4.5 20H7l5.5-6 4.5 6h3L12.5 10 19.5 4H17l-5 5.5L8 4H4Z" fill="currentColor" />
                </svg>
              </a>
              <a href="https://youtube.com/@astramarket" target="_blank" rel="noopener noreferrer" className="sosyal-ikon" aria-label="YouTube" title="YouTube">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" />
                </svg>
              </a>
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
