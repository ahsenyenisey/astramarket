import { useEffect, useState } from 'react';

// Her tiklamada cursor pozisyonunda genisleyen neon halka pulse.
// 3 ic ice halka, her biri hafif gecikmeyle aciliyor.
export default function ClickRipple() {
  const [dalgalar, setDalgalar] = useState([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let sayac = 0;
    const onClick = (e) => {
      // Sadece sol tik
      if (e.button !== 0) return;
      const id = sayac++;
      const renk = Math.random() > 0.5 ? 'pembe' : 'mor';
      setDalgalar((d) => [...d, { id, x: e.clientX, y: e.clientY, renk }]);
      setTimeout(() => {
        setDalgalar((d) => d.filter((x) => x.id !== id));
      }, 900);
    };

    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="click-ripple-katmani" aria-hidden="true">
      {dalgalar.map((d) => (
        <span
          key={d.id}
          className={`click-ripple click-ripple-${d.renk}`}
          style={{ left: d.x, top: d.y }}
        >
          <span className="cr-halka cr-halka-1" />
          <span className="cr-halka cr-halka-2" />
          <span className="cr-halka cr-halka-3" />
        </span>
      ))}
    </div>
  );
}
