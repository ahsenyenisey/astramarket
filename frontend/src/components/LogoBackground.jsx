import { useEffect, useRef } from 'react';

// AstraMarket logosu (yildiz + orbit) ikonu - yazisiz versiyon
function LogoIkon({ idx }) {
  const id = `bg-logo-${idx}`;
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-g1`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e11d48" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={`${id}-g2`} x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="32" cy="32" r="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="26" stroke={`url(#${id}-g1)`} strokeWidth="2" opacity="0.55" />
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke={`url(#${id}-g2)`} strokeWidth="1.5" opacity="0.7" transform="rotate(-30 32 32)" />
      <path d="M32 14 L34 28 L48 30 L34 32 L32 50 L30 32 L16 30 L30 28 Z" fill={`url(#${id}-g1)`} />
      <circle cx="32" cy="32" r="4" fill={`url(#${id}-glow)`} />
      <circle cx="32" cy="32" r="2.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

// 7 logo ikonu sayfada dagilmis, scroll'da farkli yonlerde hareket eder
// ve birbiriyle yer degistirir gibi gorunur.
export default function LogoBackground() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = null;
    const guncelle = () => {
      raf = null;
      const y = window.scrollY;
      if (ref.current) ref.current.style.setProperty('--scroll', y.toString());
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
    <div ref={ref} className="logo-arkaplan" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={`lab-pos lab-pos-${i}`}>
          <div className="lab-float">
            <LogoIkon idx={i} />
          </div>
        </div>
      ))}
    </div>
  );
}
