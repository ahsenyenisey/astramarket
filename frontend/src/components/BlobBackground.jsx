import { useEffect, useRef } from 'react';

export default function BlobBackground() {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let rafId;
    let lastY = -1;
    const onScroll = () => {
      const y = window.scrollY;
      if (y === lastY) return;
      lastY = y;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.setProperty('--scroll-y', `${y}px`);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className="blob-arka-plan" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
      <div className="blob blob-6" />
    </div>
  );
}
