import { useEffect, useRef } from 'react';

export default function HoloField({ density = 90, gridLines = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    let w = 0, h = 0;

    const resize = () => {
      const r = parent.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    requestAnimationFrame(() => requestAnimationFrame(resize));
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const mobil = w < 768;
    const KATMAN_AYAR = [
      { say: mobil ? 10 : 18, vMax: 0.10, rMin: 0.4, rMax: 1.0, op: 0.30, baglMax: 100, renk: '99, 102, 241' },
      { say: mobil ? 8 : 14, vMax: 0.20, rMin: 0.6, rMax: 1.4, op: 0.55, baglMax: 130, renk: '168, 85, 247' },
      { say: mobil ? 6 : 10, vMax: 0.30, rMin: 1.0, rMax: 2.0, op: 0.90, baglMax: 110, renk: '251, 113, 133' },
    ];

    const katmanlar = KATMAN_AYAR.map((k) => ({
      ayar: k,
      noktalar: Array.from({ length: k.say }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * k.vMax,
        vy: (Math.random() - 0.5) * k.vMax,
        r: k.rMin + Math.random() * (k.rMax - k.rMin),
      })),
    }));

    const mouse = { x: -9999, y: -9999, aktif: false };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.aktif = true;
    };
    const onLeave = () => { mouse.aktif = false; mouse.x = -9999; mouse.y = -9999; };
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    let rafId;
    let frame = 0;

    const ciz = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      if (gridLines) {
        const gridStep = 80;
        const offset = (frame * 0.15) % gridStep;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.04)';
        ctx.lineWidth = 1;
        for (let x = -offset; x < w; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = -offset; y < h; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      for (let li = 0; li < katmanlar.length; li++) {
        const { ayar, noktalar } = katmanlar[li];
        const mouseTakipMultiplier = (li + 1) * 0.5; // ne kadar yakinsa o kadar takip

        for (const p of noktalar) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;

          if (mouse.aktif) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 130 * 130) {
              const d = Math.sqrt(d2);
              const force = (130 - d) / 130;
              p.x -= (dx / d) * force * mouseTakipMultiplier;
              p.y -= (dy / d) * force * mouseTakipMultiplier;
            }
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ayar.renk}, ${ayar.op})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(${ayar.renk}, 0.8)`;
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        for (let i = 0; i < noktalar.length; i++) {
          for (let j = i + 1; j < noktalar.length; j++) {
            const dx = noktalar[i].x - noktalar[j].x;
            const dy = noktalar[i].y - noktalar[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < ayar.baglMax * ayar.baglMax) {
              const d = Math.sqrt(d2);
              const op = (1 - d / ayar.baglMax) * ayar.op * 0.5;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${ayar.renk}, ${op})`;
              ctx.lineWidth = 1;
              ctx.moveTo(noktalar[i].x, noktalar[i].y);
              ctx.lineTo(noktalar[j].x, noktalar[j].y);
              ctx.stroke();
            }
          }
        }
      }

      rafId = requestAnimationFrame(ciz);
    };
    ciz();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseleave', onLeave);
    };
  }, [density, gridLines]);

  return (
    <div className="particle-bg" aria-hidden="true">
      <canvas ref={ref} className="particle-canvas" />
    </div>
  );
}
