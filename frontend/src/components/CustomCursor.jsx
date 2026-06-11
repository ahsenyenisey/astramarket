import { useEffect, useRef } from 'react';

// Neon glow trailli ozel imlec. Sadece pointer destekleyen
// (touch olmayan) cihazlarda gorunur. prefers-reduced-motion'da kapali.
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return;

    let mx = -100, my = -100;
    let dx = -100, dy = -100;   // dot pozisyonu (anlık)
    let rx = -100, ry = -100;   // ring (gecikmeli)
    const trail = trailRefs.current.map(() => ({ x: -100, y: -100 }));

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const tiklanabilirSecicileri = [
      'a', 'button', '[role="button"]', 'input', 'textarea', 'select',
      '.product-card', '.kategori-pill', '.custom-dropdown-toggle',
      '.custom-dropdown-item', '.btn', '.tema-btn', '.hizli-btn',
    ].join(',');

    const hoverDinleyici = (e) => {
      if (e.target.closest(tiklanabilirSecicileri)) {
        ringRef.current?.classList.add('hover');
      } else {
        ringRef.current?.classList.remove('hover');
      }
    };
    document.addEventListener('mouseover', hoverDinleyici);

    let raf;
    const tik = () => {
      // dot anlık takip
      dx += (mx - dx) * 0.85;
      dy += (my - dy) * 0.85;
      // ring biraz gecikmeli
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

      // Trail noktalari kademeli takip
      let px = mx, py = my;
      for (let i = 0; i < trail.length; i++) {
        const speed = 0.30 - i * 0.05;
        trail[i].x += (px - trail[i].x) * speed;
        trail[i].y += (py - trail[i].y) * speed;
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0)`;
        px = trail[i].x; py = trail[i].y;
      }

      raf = requestAnimationFrame(tik);
    };
    raf = requestAnimationFrame(tik);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', hoverDinleyici);
    };
  }, []);

  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => (trailRefs.current[i] = el)}
          className="cursor-trail"
          style={{ opacity: 0.5 - i * 0.10 }}
        />
      ))}
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}
