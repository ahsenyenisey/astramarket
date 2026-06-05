import { useEffect } from 'react';

// Verilen elementin uzerinde mouse hareketine 3D tilt uygular.
// prefers-reduced-motion acik kullanicilarda kapali.
export default function useMouseTilt(ref, { maxAngle = 8, scale = 1.02 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId;
    let targetRx = 0, targetRy = 0;
    let curRx = 0, curRy = 0;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetRy = (x - 0.5) * 2 * maxAngle;
      targetRx = -(y - 0.5) * 2 * maxAngle;
      if (!rafId) tick();
    };
    const onLeave = () => {
      targetRx = 0; targetRy = 0;
      if (!rafId) tick();
    };

    const tick = () => {
      // Yumusak gecis
      curRx += (targetRx - curRx) * 0.12;
      curRy += (targetRy - curRy) * 0.12;
      el.style.transform = `perspective(1000px) rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg) scale(${scale})`;
      if (Math.abs(curRx - targetRx) > 0.05 || Math.abs(curRy - targetRy) > 0.05) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (targetRx === 0 && targetRy === 0) {
          el.style.transform = '';
        }
        rafId = null;
      }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [ref, maxAngle, scale]);
}
