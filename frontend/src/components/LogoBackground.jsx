import { useEffect, useRef } from 'react';

// AstraMarket logosu (yildiz + orbit) - yazisiz versiyon
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

// 7 logo arka planda dagilmis. 3 katmanli hareket:
// - lab-pos: scroll'a gore translate + rotate (sayfa kayinca)
// - lab-mouse: imlec yaklasinca repulsion (kacma) hareketi
// - lab-float + svg: surekli idle floating + kendi ekseninde donme
export default function LogoBackground() {
  const refler = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let scrollRaf = null;
    let mouseRaf = null;
    let mouseX = -9999, mouseY = -9999;

    // Scroll listener
    const scrollGuncelle = () => {
      scrollRaf = null;
      const y = window.scrollY;
      refler.current.forEach((el) => {
        if (el) el.style.setProperty('--scroll', y.toString());
      });
    };
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(scrollGuncelle);
    };

    // Mouse listener - her logoyu imlecten uzaklastir + parlat
    const mouseGuncelle = () => {
      mouseRaf = null;
      const ESIK = 220;       // piksel - bu mesafede etki baslar
      const KUVVET_MAX = 60;  // piksel - max kacma mesafesi

      refler.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const d2 = dx * dx + dy * dy;

        if (d2 < ESIK * ESIK && d2 > 0) {
          const d = Math.sqrt(d2);
          // mouse'a yakinlik orani (0..1)
          const yakinlik = 1 - d / ESIK;
          // ease - daha guzel egri
          const guc = yakinlik * yakinlik * KUVVET_MAX;
          // imlecten KACMA yonu (- isareti)
          const mx = -(dx / d) * guc;
          const my = -(dy / d) * guc;
          el.style.setProperty('--mx', `${mx.toFixed(1)}px`);
          el.style.setProperty('--my', `${my.toFixed(1)}px`);
          // Isik: parlama yogunlugu (yakinlasinca artar)
          el.style.setProperty('--isik', yakinlik.toFixed(3));
        } else {
          el.style.setProperty('--mx', '0px');
          el.style.setProperty('--my', '0px');
          el.style.setProperty('--isik', '0');
        }
      });
    };
    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(mouseGuncelle);
    };

    scrollGuncelle();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (mouseRaf) cancelAnimationFrame(mouseRaf);
    };
  }, []);

  return (
    <div className="logo-arkaplan" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          ref={(el) => (refler.current[i] = el)}
          className={`lab-pos lab-pos-${i}`}
        >
          <div className="lab-mouse">
            <div className="lab-float">
              <LogoIkon idx={i} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
