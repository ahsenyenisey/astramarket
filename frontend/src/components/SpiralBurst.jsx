import { useEffect, useState } from 'react';

const PARCA_SAYISI = 14;

export default function SpiralBurst() {
  const [patlamalar, setPatlamalar] = useState([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let sayac = 0;
    const onClick = (e) => {
      if (e.target.closest('input, textarea, select, label')) return;
      const id = sayac++;
      setPatlamalar((p) => [...p, { id, x: e.clientX, y: e.clientY, renk: Math.random() > 0.5 ? 'pembe' : 'mor' }]);
      setTimeout(() => {
        setPatlamalar((p) => p.filter((b) => b.id !== id));
      }, 1300);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="spiral-burst-katmani" aria-hidden="true">
      {patlamalar.map((b) => (
        <div key={b.id} className={`sb-burst sb-${b.renk}`} style={{ left: `${b.x}px`, top: `${b.y}px` }}>
          {Array.from({ length: PARCA_SAYISI }).map((_, i) => (
            <span
              key={i}
              className="sb-parca"
              style={{ '--i': i, '--toplam': PARCA_SAYISI }}
            />
          ))}
          <span className="sb-merkez" />
        </div>
      ))}
    </div>
  );
}
