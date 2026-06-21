import { useEffect, useState } from 'react';

// Rastgele araliklarla (30-60sn) ekranda 200-400ms suren RGB-split glitch flash.
// Dramatik ama nadir - kullanici dikkati cekiyor ama bunaltmiyor.
export default function GlitchFlash() {
  const [aktif, setAktif] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let yasiyorMu = true;
    let timeout;

    const tetikle = () => {
      if (!yasiyorMu) return;
      setAktif(true);
      const sure = 250 + Math.random() * 200;
      setTimeout(() => {
        setAktif(false);
      }, sure);

      const sonraki = 30000 + Math.random() * 30000;
      timeout = setTimeout(tetikle, sonraki);
    };

    // Ilk glitch 15-25sn sonra
    timeout = setTimeout(tetikle, 15000 + Math.random() * 10000);

    return () => {
      yasiyorMu = false;
      clearTimeout(timeout);
    };
  }, []);

  return <div className={`glitch-flash ${aktif ? 'aktif' : ''}`} aria-hidden="true" />;
}
