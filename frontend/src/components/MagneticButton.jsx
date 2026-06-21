import { useEffect, useRef } from 'react';

// Cocugu butonu cursor'a magnetik cekme efekti.
// Cursor element yakininda gezerken buton hafifce kayar; ayrildiginda yumusakca yerine doner.
// Children olarak herhangi bir element gelir; ref attribute'u children'a forward edilir.
export default function MagneticButton({ children, kuvvet = 0.35, esik = 90, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = null;
    let curX = 0, curY = 0;
    let targetX = 0, targetY = 0;

    const tick = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.transform = `translate(${curX.toFixed(1)}px, ${curY.toFixed(1)}px)`;
      if (Math.abs(curX - targetX) > 0.1 || Math.abs(curY - targetY) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        if (targetX === 0 && targetY === 0) el.style.transform = '';
        raf = null;
      }
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const mesafe = Math.sqrt(dx * dx + dy * dy);
      const sinir = Math.max(rect.width, rect.height) / 2 + esik;
      if (mesafe < sinir) {
        targetX = dx * kuvvet;
        targetY = dy * kuvvet;
      } else {
        targetX = 0;
        targetY = 0;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [kuvvet, esik]);

  return (
    <span ref={ref} className={`magnetic-wrap ${className}`} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </span>
  );
}
