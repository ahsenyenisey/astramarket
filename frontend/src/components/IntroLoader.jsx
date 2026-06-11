import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const TAGLINE = 'EVREN · İN · ALIŞVERİŞİ';

// Sayfa ilk acildiginda tum ekrani kaplayan sinematik karsilama.
// Logo + tagline animasyonu bittikten sonra 3 secenek butonu cikar:
// - Giris Yap   -> /login
// - Kayit Ol    -> /login (register tab acik)
// - Misafir Devam-> mevcut sayfada kalir, sadece intro kapanir
// sessionStorage ile ayni oturumda tekrar gosterilmez.
export default function IntroLoader() {
  const [aktif, setAktif] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('astra-intro-gosterildi');
  });
  const [butonlarHazir, setButonlarHazir] = useState(false);
  const [kapaniyor, setKapaniyor] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!aktif) return;
    // Body scroll kilitle
    document.body.classList.add('intro-aktif');
    // Logo (0.3s) + tagline (1.4s) sonrasi butonlar
    const t = setTimeout(() => setButonlarHazir(true), 2100);
    return () => {
      clearTimeout(t);
      document.body.classList.remove('intro-aktif');
    };
  }, [aktif]);

  const kapat = (yer, state) => {
    if (kapaniyor) return;
    setKapaniyor(true);
    setTimeout(() => {
      sessionStorage.setItem('astra-intro-gosterildi', '1');
      setAktif(false);
      if (yer) nav(yer, { state });
    }, 650);
  };

  if (!aktif) return null;

  return (
    <div className={`intro-loader ${kapaniyor ? 'kapaniyor' : ''}`}>
      <div className="il-arka">
        <div className="il-blob il-blob-a" />
        <div className="il-blob il-blob-b" />
        <div className="il-blob il-blob-c" />
      </div>

      <div className="il-icerik">
        <div className="il-logo">
          <Logo boyut="xl" benzersizId="intro-logo" />
        </div>

        <div className="il-tagline">
          {TAGLINE.split('').map((ch, i) => (
            <span key={i}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </div>

        <div className={`il-butonlar ${butonlarHazir ? 'gorunur' : ''}`}>
          <button
            type="button"
            className="il-btn il-btn-primary"
            onClick={() => kapat('/login')}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className="il-btn il-btn-secondary"
            onClick={() => kapat('/login', { tab: 'register' })}
          >
            Kayıt Ol
          </button>
          <button
            type="button"
            className="il-btn il-btn-guest"
            onClick={() => kapat(null)}
          >
            Misafir olarak devam et →
          </button>
        </div>
      </div>
    </div>
  );
}
