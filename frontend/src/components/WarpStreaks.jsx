import { useEffect, useRef } from 'react';

// Hizli scroll edince ekranin solunda ve saginda dikey isik cizgileri zip yapar.
// Threshold: 1.0px/ms scroll hizi. Yavas scrollda gozukmez.
export default function WarpStreaks() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = null;
    let temizleTimer = null;

    const tikla = () => {
      raf = null;
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = now - lastT || 1;
      const hiz = Math.abs(dy / dt);
      lastY = window.scrollY;
      lastT = now;

      if (hiz > 1.0) {
        el.classList.add('aktif');
        // Hiza gore yogunluk: var(--yogunluk) 0-1 araliginda
        const yogunluk = Math.min(1, (hiz - 1.0) / 3.0);
        el.style.setProperty('--yogunluk', yogunluk.toFixed(2));
        clearTimeout(temizleTimer);
        temizleTimer = setTimeout(() => {
          el.classList.remove('aktif');
          el.style.setProperty('--yogunluk', '0');
        }, 250);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tikla);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(temizleTimer);
    };
  }, []);

  return (
    <div ref={ref} className="warp-streaks" aria-hidden="true">
      {/* Sol kenarda 8 dikey cizgi, sag kenarda 8 dikey cizgi */}
      <div className="ws-yan ws-sol">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="ws-cizgi" style={{ '--i': i }} />
        ))}
      </div>
      <div className="ws-yan ws-sag">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="ws-cizgi" style={{ '--i': i }} />
        ))}
      </div>
    </div>
  );
}
