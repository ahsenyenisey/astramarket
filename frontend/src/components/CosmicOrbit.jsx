import { useEffect, useRef } from 'react';

// Buyuk kozmik orbital sistem - 3 ic ice halka, her halkanin uzerinde
// AstraMarket mini logosu gezegen gibi orbit yapar.
// Scroll'a gore sistem rotateX/rotateZ ve scale degisir; mini logolar hover'da parlar.

function MiniLogo({ renk = 'pembe' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={`co-mini-logo co-${renk}`}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="currentColor" strokeWidth="1.1" opacity="0.5" transform="rotate(-30 16 16)" />
      <path d="M16 4 L17.4 14.6 L26 15 L17.4 17.4 L16 28 L14.6 17.4 L6 15 L14.6 14.6 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.8" fill="#fff" opacity="0.95" />
    </svg>
  );
}

// Bir orbital halka. Halkanin kendisi cizimli (ellipse stroke),
// uzerinde 2 logo karsi koselerde orbit yapar.
function Halka({ siralama, tilt, donus, sure, logoSayisi = 2, logoRenk }) {
  return (
    <div
      className={`co-halka co-halka-${siralama}`}
      style={{ '--tilt': tilt, '--donus-sure': `${sure}s`, animationDirection: donus }}
    >
      <div className="co-halka-cizim" />
      <div className="co-yorunge">
        {Array.from({ length: logoSayisi }).map((_, i) => (
          <div
            key={i}
            className="co-logo-konum"
            style={{ '--baslangic-aci': `${(360 / logoSayisi) * i}deg` }}
          >
            <MiniLogo renk={logoRenk} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CosmicOrbit() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = null;
    const guncelle = () => {
      raf = null;
      const y = window.scrollY;
      const vh = window.innerHeight || 1;
      const orani = y / vh; // her viewport icin 1 birim
      // Sistem rotateX +/- 20deg, rotateY +/- 35deg, scale 0.92-1.08 araliginda dolasir
      const rx = Math.sin(orani * 0.7) * 20;
      const ry = Math.cos(orani * 0.55) * 35;
      const rz = orani * 18; // surekli artiyor (parallax doniş)
      const scale = 1 + Math.sin(orani * 0.9) * 0.08;
      const yOfset = y * -0.20; // negatif parallax (scroll asagi -> orbit yukari kayar)
      el.style.setProperty('--scroll-rx', `${rx.toFixed(2)}deg`);
      el.style.setProperty('--scroll-ry', `${ry.toFixed(2)}deg`);
      el.style.setProperty('--scroll-rz', `${rz.toFixed(2)}deg`);
      el.style.setProperty('--scroll-scale', scale.toFixed(3));
      el.style.setProperty('--scroll-y', `${yOfset.toFixed(0)}px`);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(guncelle);
    };
    guncelle();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cosmic-orbit" aria-hidden="true">
      <div className="co-merkez">
        {/* Merkez yildiz - tum sistemin agirlik noktasi */}
        <div className="co-yildiz" />
      </div>
      {/* 3 farkli boyut, tilt ve hizda halka */}
      <Halka siralama={1} tilt="65deg" donus="normal" sure={28} logoSayisi={2} logoRenk="pembe" />
      <Halka siralama={2} tilt="72deg" donus="reverse" sure={42} logoSayisi={3} logoRenk="mor" />
      <Halka siralama={3} tilt="55deg" donus="normal" sure={56} logoSayisi={2} logoRenk="pembe" />
    </div>
  );
}
