import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { bulPlan } from '../data/premium';
import { useAuth } from '../context/AuthContext';

const BOS_KART = { uzerinde: '', no: '', skt: '', cvv: '' };
const BOS_OGRENCI = { universite: '', bolum: '', ogrNo: '', belgeAd: '' };

export default function PremiumCheckout() {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, premium, premiumPlan, setPremium } = useAuth();
  const planId = loc.state?.planId;
  const plan = bulPlan(planId);

  const [kart, setKart] = useState(BOS_KART);
  const [ogrenci, setOgrenci] = useState(BOS_OGRENCI);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');

  if (!user) return <Navigate to="/login" state={{ from: '/premium' }} replace />;
  if (!plan) return <Navigate to="/premium" replace />;
  // Ayni plana tekrar gecis engellensin
  if (premium && premiumPlan === planId) return <Navigate to="/premium" replace />;

  const planDegisiyor = premium && premiumPlan !== planId;
  const ogrenciPlani = planId === 'ogrenci';

  const kartGecerli =
    kart.uzerinde &&
    kart.no.replace(/\s/g, '').length >= 16 &&
    kart.skt.length >= 5 &&
    kart.cvv.length >= 3;

  const ogrenciGecerli =
    !ogrenciPlani ||
    (ogrenci.universite.trim().length >= 2 &&
      ogrenci.bolum.trim().length >= 2 &&
      ogrenci.ogrNo.trim().length >= 4 &&
      ogrenci.belgeAd);

  const belgeSec = (e) => {
    const dosya = e.target.files?.[0];
    if (!dosya) return;
    const izinli = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!izinli.includes(dosya.type)) {
      setHata('Sadece JPG, PNG veya PDF dosya yükleyebilirsin.');
      return;
    }
    if (dosya.size > 5 * 1024 * 1024) {
      setHata('Dosya boyutu en fazla 5 MB olmalı.');
      return;
    }
    setHata('');
    setOgrenci((o) => ({ ...o, belgeAd: dosya.name }));
  };

  const odemeYap = (e) => {
    e.preventDefault();
    if (!kartGecerli) {
      setHata('Lütfen kart bilgilerini eksiksiz doldurun');
      return;
    }
    if (!ogrenciGecerli) {
      setHata('Öğrenci planı için öğrenci bilgilerini ve belgeni eksiksiz doldurman gerekiyor');
      return;
    }
    setHata('');
    setYukleniyor(true);
    // Demo - 1.2sn gecikme + basari sayfasi
    setTimeout(() => {
      setPremium(true, planId);
      nav('/premium/basari', { replace: true, state: { plan, planDegisikligi: planDegisiyor } });
    }, 1200);
  };

  return (
    <Container className="my-4 my-md-5">
      <div className="mb-3 fade-up">
        <Link to="/premium" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
          ← Premium Planlara Dön
        </Link>
      </div>

      <div className="premium-checkout-hero fade-up">
        <span className="ph-rozet">⭐ PREMIUM ÜYELİK</span>
        <h2>
          {planDegisiyor ? <>Planını <span className="ph-altin">Değiştir</span></> : <>Üyeliğinizi <span className="ph-altin">Tamamlayın</span></>}
        </h2>
        <p>
          {planDegisiyor
            ? `Mevcut planın "${bulPlan(premiumPlan)?.ad}" yerine "${plan.ad}" aktif olacak.`
            : 'Sadece kart bilgileri, anında üyelik aktif olur.'}
        </p>
      </div>

      {planDegisiyor && (
        <Alert variant="info" className="fade-up" style={{ fontSize: '0.9rem' }}>
          🔄 <strong>Plan değişikliği:</strong> Ödemeyi tamamladığında mevcut üyeliğin sona erer ve yeni plan hemen başlar.
        </Alert>
      )}

      <Row className="g-4">
        {/* SOL: Kart formu */}
        <Col lg={7} className="fade-up">
          <div className="cam-kart" style={{ padding: 32 }}>
            <h4 className="mb-4" style={{ color: 'var(--pembe)' }}>💳 Ödeme Bilgileri</h4>

            {hata && <Alert variant="danger">{hata}</Alert>}

            <Form onSubmit={odemeYap}>
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

              {ogrenciPlani && (
                <div className="ogrenci-dogrulama mt-4">
                  <div className="od-baslik">
                    <span className="od-ikon">🎓</span>
                    <div>
                      <div className="od-ust">ÖĞRENCİ DOĞRULAMA</div>
                      <div className="od-alt">%50 indirim için aktif öğrencilik belgeni ekle</div>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={12}>
                      <Form.Label>Üniversite *</Form.Label>
                      <Form.Control
                        required={ogrenciPlani}
                        placeholder="İstanbul Üniversitesi Cerrahpaşa"
                        value={ogrenci.universite}
                        onChange={(e) => setOgrenci({ ...ogrenci, universite: e.target.value })}
                      />
                    </Col>
                    <Col md={7}>
                      <Form.Label>Bölüm *</Form.Label>
                      <Form.Control
                        required={ogrenciPlani}
                        placeholder="Bilgisayar Mühendisliği"
                        value={ogrenci.bolum}
                        onChange={(e) => setOgrenci({ ...ogrenci, bolum: e.target.value })}
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Label>Öğrenci No *</Form.Label>
                      <Form.Control
                        required={ogrenciPlani}
                        placeholder="1306230123"
                        value={ogrenci.ogrNo}
                        onChange={(e) => setOgrenci({ ...ogrenci, ogrNo: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                      />
                    </Col>
                    <Col md={12}>
                      <Form.Label>Öğrenci Belgesi *</Form.Label>
                      <label className={`od-dosya ${ogrenci.belgeAd ? 'yuklendi' : ''}`}>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={belgeSec}
                          hidden
                        />
                        <span className="od-dosya-ikon">{ogrenci.belgeAd ? '✓' : '↑'}</span>
                        <span className="od-dosya-yazi">
                          {ogrenci.belgeAd
                            ? <>Yüklendi: <strong>{ogrenci.belgeAd}</strong></>
                            : <>Dosya seç <span>(JPG, PNG veya PDF · max 5 MB)</span></>}
                        </span>
                        {ogrenci.belgeAd && (
                          <button
                            type="button"
                            className="od-dosya-sil"
                            onClick={(e) => {
                              e.preventDefault();
                              setOgrenci({ ...ogrenci, belgeAd: '' });
                            }}
                          >
                            Kaldır
                          </button>
                        )}
                      </label>
                    </Col>
                  </Row>

                  <Alert variant="info" className="mt-3 mb-0" style={{ fontSize: '0.82rem' }}>
                    🔒 Belgeniz sadece doğrulama amaçlı kullanılır, 3. taraflarla paylaşılmaz. Onay süresi ortalama 24 saat.
                  </Alert>
                </div>
              )}

              <div className="mt-4">
                <Button type="submit" className="btn-bordo w-100" size="lg" disabled={yukleniyor}>
                  {yukleniyor ? (
                    <><Spinner size="sm" animation="border" className="me-2" /> İşleniyor...</>
                  ) : (
                    <>{planDegisiyor ? 'Plana Geç' : 'Premium Üyeliği Başlat'} • {plan.fiyat.toFixed(2)} TL</>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </Col>

        {/* SAG: Plan ozeti */}
        <Col lg={5} className="fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="cam-kart" style={{ padding: 28, position: 'sticky', top: 100 }}>
            <div className="premium-plan-kart populer" style={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 style={{ fontWeight: 800, margin: 0 }}>{plan.ad}</h4>
                {plan.tasarruf && <span className="pp-tasarruf">{plan.tasarruf} tasarruf</span>}
              </div>

              <div className="pp-fiyat" style={{ justifyContent: 'flex-start' }}>
                <span className="pp-rakam">{plan.fiyat.toFixed(2)} TL</span>
                <span className="pp-donem">/{plan.donem}</span>
              </div>
              {plan.aylik && <div className="pp-aylik">≈ {plan.aylik.toFixed(2)} TL / ay</div>}
              {plan.not && <div className="pp-not">{plan.not}</div>}

              <hr style={{ borderColor: 'rgba(232, 121, 249, 0.18)', margin: '20px 0' }} />

              <h6 style={{ color: 'var(--pembe)', fontWeight: 700, marginBottom: 12 }}>Avantajlarınız</h6>
              <ul className="premium-avantaj-list">
                <li>🚀 Ücretsiz hızlı kargo</li>
                <li>💎 %20 ekstra indirim</li>
                <li>⚡ Erken erişim (48 saat önce)</li>
                <li>🎁 Doğum günü hediyesi</li>
                <li>🛡 30 gün iade süresi</li>
                <li>📞 Öncelikli destek</li>
              </ul>

              <div style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop: '1px solid rgba(232, 121, 249, 0.18)',
                fontSize: '0.82rem',
                color: 'var(--metin-sonuk)',
                lineHeight: 1.6,
              }}>
                🔒 256-bit SSL ile güvenli ödeme<br />
                ↩️ İstediğin zaman iptal et<br />
                ✨ Anında aktivasyon
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
