import { Container, Accordion } from 'react-bootstrap';

const KATEGORILER = [
  {
    baslik: '🛒 Sipariş',
    sorular: [
      { s: 'Siparişimi nasıl iptal edebilirim?', c: 'Sipariş "Hazırlanıyor" durumundaysa Siparişlerim sayfasından doğrudan iptal edebilirsin. Kargolandıysa müşteri hizmetleri ile iletişime geç.' },
      { s: 'Siparişim ne zaman kargoya verilir?', c: 'Standart siparişler 24 saat içinde, Premium üye siparişleri 6 saat içinde kargoya verilir.' },
      { s: 'Sipariş takip numaramı nereden alabilirim?', c: 'Sipariş kargoya verildiğinde SMS ve e-posta ile takip numaran iletilir. Siparişlerim sayfasından da görebilirsin.' },
    ],
  },
  {
    baslik: '🚚 Kargo',
    sorular: [
      { s: '500 TL altı siparişlerde kargo ücreti ne kadar?', c: 'Standart kargo ücreti 29.90 TL\'dir. Premium üyelere 250 TL üzeri tüm siparişlerde ücretsiz.' },
      { s: 'Hangi gün teslim alırım?', c: 'İstanbul içi 1-2 iş günü, diğer iller 2-4 iş günü. Premium üyelere aynı gün teslimat.' },
      { s: 'Kargom hasarlı geldi, ne yapmalıyım?', c: 'Kargoyu teslim alırken hasar tespit ettiğinde mutlaka tutanak tut. 48 saat içinde fotoğraflarla bize ulaş, ürünü yenisiyle değiştirelim.' },
    ],
  },
  {
    baslik: '🔄 İade',
    sorular: [
      { s: 'Kaç gün içinde iade yapabilirim?', c: 'Tüm ürünleri 14 gün içinde iade edebilirsin. Premium üyeler için bu süre 30 gündür.' },
      { s: 'İade ücreti var mı?', c: 'Hayır, iade kargo ücreti tarafımızca karşılanır. Kargonu bedava gönderebilmen için kupon e-posta ile gelir.' },
      { s: 'Hangi ürünler iade edilemez?', c: 'Kozmetik ürünleri açılmışsa, iç giyim ve hijyen ürünleri iade alınmaz. Diğer tüm ürünler sebep göstermeksizin iade edilebilir.' },
    ],
  },
  {
    baslik: '💳 Ödeme',
    sorular: [
      { s: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', c: 'Kredi/banka kartı, havale/EFT, kapıda nakit ödeme, BKM Express ve Papara desteklenmektedir.' },
      { s: 'Taksit imkanı var mı?', c: '750 TL üzeri alımlarda 3 taksit, 1500 TL üzeri 6 taksit, 5000 TL üzeri 12 taksit imkanı vardır.' },
      { s: 'Ödeme güvenli mi?', c: 'Tüm ödemeler 256-bit SSL sertifikasıyla şifreli olarak işlenir. Kart bilgilerin bizde saklanmaz.' },
    ],
  },
  {
    baslik: '👤 Üyelik',
    sorular: [
      { s: 'Üyelik ücretli mi?', c: 'Standart üyelik tamamen ücretsizdir. Premium üyelik ek özellikler sunar ve aylık 39.90 TL\'dir.' },
      { s: 'Şifremi unuttum, ne yapmalıyım?', c: 'Giriş ekranında "Şifremi Unuttum" linkine tıkla, e-postana sıfırlama bağlantısı gönderelim.' },
      { s: 'Hesabımı nasıl silebilirim?', c: 'Müşteri hizmetleri ile iletişime geç, 24 saat içinde hesabın ve tüm kişisel verilerin KVKK uyarınca silinir.' },
    ],
  },
];

export default function FAQ() {
  return (
    <Container className="my-4 my-md-5">
      <div className="sayfa-baslik fade-up">
        <h2>Sıkça Sorulan Sorular</h2>
        <p>Aradığın cevap büyük ihtimalle burada — bulamazsan iletişime geç</p>
      </div>

      <div className="stagger">
        {KATEGORILER.map((kat, i) => (
          <div key={i} className="fade-up cam-kart mb-4" style={{ padding: 24 }}>
            <h4 className="mb-3" style={{ color: 'var(--pembe)' }}>{kat.baslik}</h4>
            <Accordion>
              {kat.sorular.map((q, j) => (
                <Accordion.Item eventKey={`${i}-${j}`} key={j} style={{ background: 'transparent', border: 'none' }}>
                  <Accordion.Header>{q.s}</Accordion.Header>
                  <Accordion.Body>{q.c}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </Container>
  );
}
