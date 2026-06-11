import { useEffect, useRef } from 'react';

// 3D donen wireframe oktahedron (gem/kristal).
// CSS 3D transforms ile gercek perspektifle doner.
// Scroll'da rotateX + rotateY + rotateZ farkli hizlarda.
export default function CosmicGem() {
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
    <div ref={ref} className="cosmic-gem" aria-hidden="true">
      <div className="cg-sahne">
        <div className="cg-gem">
          {/* Ust piramit - 4 ucgen yuzu */}
          <div className="cg-yuz cg-ust-1" />
          <div className="cg-yuz cg-ust-2" />
          <div className="cg-yuz cg-ust-3" />
          <div className="cg-yuz cg-ust-4" />
          {/* Alt piramit - 4 ucgen yuzu */}
          <div className="cg-yuz cg-alt-1" />
          <div className="cg-yuz cg-alt-2" />
          <div className="cg-yuz cg-alt-3" />
          <div className="cg-yuz cg-alt-4" />
        </div>
      </div>

      {/* Etrafinda yorungesinde donen ucuk parcacik */}
      <div className="cg-yorunge">
        <div className="cg-uydu" />
      </div>
    </div>
  );
}
