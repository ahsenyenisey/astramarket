import { useEffect, useRef } from 'react';

// Saf canvas partikul ag. Yavasca suzulen noktalar, birbirine ince cizgilerle
// baglanir, mouse'tan hafifce uzaklasir. Mobilde otomatik olarak sayisi azalir.
// prefers-reduced-motion acik kullanicilarda gorunmez.
export default function ParticleField({
  density = 90,
  color = 'rgba(251, 113, 133, 1)',
  lineColor = 'rgba(232, 121, 249, ',
  maxDist = 130,
  speed = 0.3,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const reduced = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    let w = 0, h = 0;
    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    // Animasyon/layout sonrasi tekrar olcum yap (containing block degisikligi vs. icin)
    const lateResize = requestAnimationFrame(() => requestAnimationFrame(resize));
    // ResizeObserver ile parent boyutu degisirse otomatik guncelle
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize());
      ro.observe(parent);
    }

    const isMobile = w < 768;
    const count = isMobile ? Math.floor(density * 0.4) : density;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      r: Math.random() * 1.6 + 0.6,
    }));

    const mouse = { x: -10000, y: -10000, active: false };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = -10000; mouse.y = -10000; };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Partikulleri guncelle + ciz
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > w) { p.x = w; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > h) { p.y = h; p.vy *= -1; }

        // Mouse'tan hafifce uzaklas
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 100 * 100) {
            const d = Math.sqrt(d2);
            const force = (100 - d) / 100;
            p.x -= (dx / d) * force * 1.2;
            p.y -= (dy / d) * force * 1.2;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Cizgileri ciz
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const d = Math.sqrt(d2);
            const opacity = (1 - d / maxDist) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = lineColor + opacity + ')';
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(lateResize);
      if (ro) ro.disconnect();
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [density, color, lineColor, maxDist, speed]);

  return (
    <div className="particle-bg" aria-hidden="true">
      <canvas ref={ref} className="particle-canvas" />
    </div>
  );
}
