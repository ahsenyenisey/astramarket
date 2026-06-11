import { useEffect, useRef } from 'react';

// Sayfa scroll edildikce farkli hizlarda donen cok katmanli spiral.
// Sci-fi galaksi/portal hissi verir. Sag tarafta sabit, vertical center.
// requestAnimationFrame ile performant, prefers-reduced-motion'da kapali.
export default function SpiralScroll() {
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
    <div ref={ref} className="spiral-scroll" aria-hidden="true">
      <svg viewBox="-100 -100 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ss-grad" x1="-100" y1="-100" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="ss-grad2" x1="100" y1="-100" x2="-100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <radialGradient id="ss-core" cx="0" cy="0" r="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* En dis halka - en yavas */}
        <g className="ss-ring ss-ring-1">
          <circle cx="0" cy="0" r="92" stroke="url(#ss-grad)" strokeWidth="0.5" fill="none" strokeDasharray="2 5" opacity="0.35" />
          <circle cx="92" cy="0" r="2" fill="#fb7185" />
          <circle cx="-65" cy="65" r="1.5" fill="#c084fc" />
        </g>

        {/* 2. halka - ters yon */}
        <g className="ss-ring ss-ring-2">
          <circle cx="0" cy="0" r="74" stroke="url(#ss-grad2)" strokeWidth="0.8" fill="none" strokeDasharray="8 4" opacity="0.5" />
          <circle cx="0" cy="-74" r="3" fill="#c084fc" />
          <circle cx="52" cy="52" r="1.8" fill="#fb7185" />
        </g>

        {/* 3. halka - yatik elips */}
        <g className="ss-ring ss-ring-3">
          <ellipse cx="0" cy="0" rx="58" ry="22" stroke="url(#ss-grad)" strokeWidth="1.2" fill="none" opacity="0.65" transform="rotate(-25)" />
          <circle cx="58" cy="0" r="2.2" fill="#fb7185" transform="rotate(-25)" />
        </g>

        {/* 4. halka - en hizli */}
        <g className="ss-ring ss-ring-4">
          <circle cx="0" cy="0" r="42" stroke="#fb7185" strokeWidth="1.4" fill="none" strokeDasharray="5 3" opacity="0.75" />
          <circle cx="0" cy="42" r="2.5" fill="#fff" opacity="0.9" />
          <circle cx="-30" cy="-30" r="1.5" fill="#fb7185" />
        </g>

        {/* Spiral egrisi - orta hizda */}
        <g className="ss-spiral">
          <path
            d="M 0 0
               C 5 -8, 14 -10, 18 -2
               C 22 6, 14 14, 4 16
               C -8 18, -18 8, -16 -6
               C -14 -22, 4 -32, 22 -24
               C 38 -16, 44 4, 34 22
               C 22 42, -8 46, -28 30
               C -50 12, -52 -22, -32 -42"
            stroke="url(#ss-grad)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>

        {/* Merkez glow + nokta */}
        <circle cx="0" cy="0" r="22" fill="url(#ss-core)" />
        <circle cx="0" cy="0" r="3.5" fill="#fff" />
      </svg>
    </div>
  );
}
