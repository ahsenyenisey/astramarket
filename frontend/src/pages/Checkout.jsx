import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const BOS_TESLIMAT = {
  ad: '', soyad: '', telefon: '',
  adres: '', sehir: '', ilce: '', posta: '',
};
const BOS_KART = {
  uzerinde: '', no: '', skt: '', cvv: '',
};

export default function Checkout() {
  const { items, toplam, temizle } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [adim, setAdim] = useState(1); // 1: teslimat, 2: odeme
  const [teslimat, setTeslimat] = useState(BOS_TESLIMAT);
  const [odemeYontemi, setOdemeYontemi] = useState('kart');
  const [kart, setKart] = useState(BOS_KART);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  const kargo = toplam >= 500 ? 0 : 29.9;
  const genelToplam = toplam + kargo;

  // Sepet bos veya giris yapilmamissa yonlendir
  if (!user) return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  if (items.length === 0) return <Navigate to="/sepet" replace />;

  const teslimatGecerli =
    teslimat.ad && teslimat.soyad && teslimat.telefon &&
    teslimat.adres && teslimat.sehir;

  const odemeGecerli = odemeYontemi !== 'kart' || (
    kart.uzerinde && kart.no.replace(/\s/g, '').length >= 16 &&
    kart.skt.length >= 5 && kart.cvv.length >= 3
  );

  const teslimatIleri = (e) => {
    e.preventDefault();
    if (!teslimatGecerli) {
      setHata('Lütfen tüm zorunlu alanları doldurun');
      return;
    }
    setHata('');
    setAdim(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siparisOlustur = async (e) => {
    e.preventDefault();
    if (!odemeGecerli) {
      setHata('Lütfen kart bilgilerini eksiksiz doldurun');
      return;
    }
    setHata('');
    setYukleniyor(true);
    try {
      const { data } = await api.post('/siparisler', {
        urunler: items.map((x) => ({ urun_id: x.id, adet: x.adet })),
      });
      temizle();
      nav('/siparis-tamamlandi', {
        replace: true,
        state: { siparisId: data.siparis_id, toplam: data.toplam_tutar },
      });
    } catch (err) {
      setHata(err.response?.data?.hata || 'Sipariş oluşturulamadı');
      setYukleniyor(false);
    }
  };

  return (
    <Container className="my-4 my-md-5">
      {/* Stepper */}
      <div className="checkout-stepper fade-up">
        <Link to="/sepet" className="cs-adim tamamlandi">
          <div className="cs-no">✓</div>
          <div className="cs-baslik">Sepet</div>
        </Link>
        <div className="cs-cizgi tamamlandi" />
        <div className={`cs-adim ${adim >= 1 ? 'aktif' : ''} ${adim > 1 ? 'tamamlandi' : ''}`}>
          <div className="cs-no">{adim > 1 ? '✓' : '1'}</div>
          <div className="cs-baslik">Teslimat</div>
        </div>
        <div className={`cs-cizgi ${adim > 1 ? 'tamamlandi' : ''}`} />
        <div className={`cs-adim ${adim >= 2 ? 'aktif' : ''}`}>
          <div className="cs-no">2</div>
          <div className="cs-baslik">Ödeme</div>
        </div>
        <div className="cs-cizgi" />
        <div className="cs-adim">
          <div className="cs-no">3</div>
          <div className="cs-baslik">Onay</div>
        </div>
      </div>

      <Row className="g-4">
        {/* SOL: Form */}
        <Col lg={8}>
          {hata && <Alert variant="danger" className="fade-up">{hata}</Alert>}

          {adim === 1 && (
            <div className="cam-kart fade-up" style={{ padding: 28 }}>
              <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>📍 Teslimat Bilgileri</h4>
              <Form onSubmit={teslimatIleri}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Ad *</Form.Label>
                    <Form.Control
                      required
                      value={teslimat.ad}
                      onChange={(e) => setTeslimat({ ...teslimat, ad: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Soyad *</Form.Label>
                    <Form.Control
                      required
                      value={teslimat.soyad}
                      onChange={(e) => setTeslimat({ ...teslimat, soyad: e.target.value })}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Telefon *</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="0532 123 45 67"
                      required
                      value={teslimat.telefon}
                      onChange={(e) => setTeslimat({ ...teslimat, telefon: e.target.value })}
                    />
                  </Col>
                  <Col md={12}>
                    <Form.Label>Adres *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Mahalle, sokak, bina, daire no"
                      required
                      value={teslimat.adres}
                      onChange={(e) => setTeslimat({ ...teslimat, adres: e.target.value })}
                    />
                  </Col>
                  <Col md={5}>
                    <Form.Label>Şehir *</Form.Label>
                    <Form.Control
                      required
                      value={teslimat.sehir}
                      onChange={(e) => setTeslimat({ ...teslimat, sehir: e.target.value })}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>İlçe</Form.Label>
                    <Form.Control
                      value={teslimat.ilce}
                      onChange={(e) => setTeslimat({ ...teslimat, ilce: e.target.value })}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Label>Posta Kodu</Form.Label>
                    <Form.Control
                      value={teslimat.posta}
                      onChange={(e) => setTeslimat({ ...teslimat, posta: e.target.value })}
                    />
                  </Col>
                  <Col md={12} className="d-flex justify-content-between mt-4">
                    <Link to="/sepet" className="btn btn-outline-bordo">← Sepete Dön</Link>
                    <Button type="submit" className="btn-bordo" size="lg">
                      Ödemeye Geç →
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          )}

          {adim === 2 && (
            <div className="cam-kart fade-up" style={{ padding: 28 }}>
              <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>💳 Ödeme Yöntemi</h4>

              <div className="odeme-secim mb-4">
                <label className={`odeme-opt ${odemeYontemi === 'kart' ? 'aktif' : ''}`}>
                  <input
                    type="radio"
                    name="odeme"
                    value="kart"
                    checked={odemeYontemi === 'kart'}
                    onChange={(e) => setOdemeYontemi(e.target.value)}
                  />
                  <span className="odeme-ikon">💳</span>
                  <div>
                    <strong>Kredi/Banka Kartı</strong>
                    <div className="odeme-not">Visa, Mastercard, Troy</div>
                  </div>
                </label>

                <label className={`odeme-opt ${odemeYontemi === 'havale' ? 'aktif' : ''}`}>
                  <input
                    type="radio"
                    name="odeme"
                    value="havale"
                    checked={odemeYontemi === 'havale'}
                    onChange={(e) => setOdemeYontemi(e.target.value)}
                  />
                  <span className="odeme-ikon">🏦</span>
                  <div>
                    <strong>Havale / EFT</strong>
                    <div className="odeme-not">24 saat içinde ödeme</div>
                  </div>
                </label>

                <label className={`odeme-opt ${odemeYontemi === 'kapida' ? 'aktif' : ''}`}>
                  <input
                    type="radio"
                    name="odeme"
                    value="kapida"
                    checked={odemeYontemi === 'kapida'}
                    onChange={(e) => setOdemeYontemi(e.target.value)}
                  />
                  <span className="odeme-ikon">💵</span>
                  <div>
                    <strong>Kapıda Nakit</strong>
                    <div className="odeme-not">+10 TL ek ücret</div>
                  </div>
                </label>
              </div>

              {odemeYontemi === 'kart' && (
                <Form onSubmit={siparisOlustur}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Label>Kart Üzerindeki İsim *</Form.Label>
                      <Form.Control
                        placeholder="AHSEN YENİSEY"
                        required
                        value={kart.uzerinde}
                        onChange={(e) => setKart({ ...kart, uzerinde: e.target.value.toUpperCase() })}
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Label>Kart Numarası *</Form.Label>
                      <Form.Control
                        placeholder="0000 0000 0000 0000"
                        required
                        maxLength={19}
                        value={kart.no}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
                          setKart({ ...kart, no: v });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Son Kullanma *</Form.Label>
                      <Form.Control
                        placeholder="AA/YY"
                        required
                        maxLength={5}
                        value={kart.skt}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '');
                          if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
                          setKart({ ...kart, skt: v });
                        }}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label>CVV *</Form.Label>
                      <Form.Control
                        placeholder="123"
                        required
                        maxLength={3}
                        value={kart.cvv}
                        onChange={(e) => setKart({ ...kart, cvv: e.target.value.replace(/\D/g, '') })}
                      />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-4">
                    <Button variant="outline-secondary" onClick={() => setAdim(1)}>← Geri</Button>
                    <Button type="submit" className="btn-bordo" size="lg" disabled={yukleniyor}>
                      {yukleniyor ? <Spinner size="sm" animation="border" /> : 'Siparişi Onayla →'}
                    </Button>
                  </div>
                </Form>
              )}

              {odemeYontemi !== 'kart' && (
                <div>
                  <Alert variant="info" className="mb-4">
                    {odemeYontemi === 'havale' ? (
                      <>🏦 Sipariş onayından sonra IBAN bilgileri e-postanıza gönderilir.</>
                    ) : (
                      <>💵 Kuryeye nakit ödeme yapacaksınız. +10 TL ek ücret eklenir.</>
                    )}
                  </Alert>
                  <Form onSubmit={siparisOlustur}>
                    <div className="d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={() => setAdim(1)}>← Geri</Button>
                      <Button type="submit" className="btn-bordo" size="lg" disabled={yukleniyor}>
                        {yukleniyor ? <Spinner size="sm" animation="border" /> : 'Siparişi Onayla →'}
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          )}
        </Col>

        {/* SAG: Siparis Ozeti */}
        <Col lg={4}>
          <div className="cam-kart fade-up" style={{ padding: 24, position: 'sticky', top: 100, animationDelay: '0.1s' }}>
            <h5 style={{ fontWeight: 700, marginBottom: 16 }}>Sipariş Özeti</h5>
            <div className="checkout-urun-listesi">
              {items.map((x) => (
                <div key={x.id} className="checkout-urun">
                  <img
                    src={x.resim_url || `https://picsum.photos/seed/urun-${x.id}/60/60`}
                    alt={x.ad}
                  />
                  <div className="cu-bilgi">
                    <div className="cu-ad">{x.ad}</div>
                    <div className="cu-adet">{x.adet} adet</div>
                  </div>
                  <div className="cu-fiyat">
                    {(Number(x.fiyat) * x.adet).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ borderColor: 'rgba(232, 121, 249, 0.15)' }} />

            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: 'var(--metin-orta)' }}>Ara Toplam</span>
              <strong>{toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: 'var(--metin-orta)' }}>Kargo</span>
              <strong style={{ color: kargo === 0 ? '#15803d' : 'inherit' }}>
                {kargo === 0 ? 'ÜCRETSİZ' : `${kargo.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`}
              </strong>
            </div>
            {adim === 2 && odemeYontemi === 'kapida' && (
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--metin-orta)' }}>Kapıda Ödeme</span>
                <strong>10,00 TL</strong>
              </div>
            )}

            <hr style={{ borderColor: 'rgba(232, 121, 249, 0.15)' }} />

            <div className="d-flex justify-content-between align-items-baseline">
              <strong>Genel Toplam</strong>
              <span className="gradient-text-dark" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {(genelToplam + (adim === 2 && odemeYontemi === 'kapida' ? 10 : 0))
                  .toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
              </span>
            </div>

            <div style={{ marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.8rem', color: 'var(--metin-sonuk)', lineHeight: 1.6 }}>
              🔒 256-bit SSL ile güvenli ödeme<br />
              🚚 24 saatte kargoda<br />
              ↩️ 14 gün iade garantisi
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
