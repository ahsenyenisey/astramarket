import { useEffect, useState } from 'react';
import Logo from './Logo';

// Sayfa ilk acildiginda gosterilir, 2.5sn sonra fade-out.
// sessionStorage'da isaretlenir, ayni oturumda bir daha gosterilmez.
export default function IntroLoader() {
  const [aktif, setAktif] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('astra-intro-gosterildi');
  });
  const [kapaniyor, setKapaniyor] = useState(false);

  useEffect(() => {
    if (!aktif) return;
    const t1 = setTimeout(() => setKapaniyor(true), 2100);
    const t2 = setTimeout(() => {
      setAktif(false);
      sessionStorage.setItem('astra-intro-gosterildi', '1');
    }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [aktif]);

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
          <span>E</span><span>V</span><span>R</span><span>E</span><span>N</span>
          <span>·</span>
          <span>İ</span><span>N</span>
          <span>·</span>
          <span>A</span><span>L</span><span>I</span><span>Ş</span><span>V</span><span>E</span><span>R</span><span>İ</span><span>Ş</span><span>İ</span>
        </div>
      </div>
    </div>
  );
}
