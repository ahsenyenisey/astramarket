import { useEffect, useState, useRef } from 'react';

// Cursor hareket ettikce arkasinda kucuk parlayan parcaciklar birakir.
// Her parcacik 800ms icinde solar ve kaybolur. Throttle ile fazla parcacik uretmez.
export default function CursorSparkles() {
  const [parcaciklar, setParcaciklar] = useState([]);
  const sayacRef = useRef(0);
  const sonZaman = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (e) => {
      const simdi = performance.now();
      // 40ms aralikla parcacik uret (max 25/sn)
      if (simdi - sonZaman.current < 40) return;
      sonZaman.current = simdi;

      const id = sayacRef.current++;
      // Rastgele biraz dagit
      const ofX = (Math.random() - 0.5) * 14;
      const ofY = (Math.random() - 0.5) * 14;
      const boyut = 3 + Math.random() * 4;
      const renk = Math.random() > 0.5 ? 'pembe' : 'mor';
      const surukle = Math.random() * 20 - 10;
      setParcaciklar((p) => [
        ...p,
        { id, x: e.clientX + ofX, y: e.clientY + ofY, boyut, renk, surukle },
      ]);
      setTimeout(() => {
        setParcaciklar((p) => p.filter((x) => x.id !== id));
      }, 850);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="cursor-kivilcim-katmani" aria-hidden="true">
      {parcaciklar.map((p) => (
        <span
          key={p.id}
          className={`cursor-kivilcim cursor-kivilcim-${p.renk}`}
          style={{
            left: p.x,
            top: p.y,
            width: p.boyut,
            height: p.boyut,
            '--surukle': `${p.surukle}px`,
          }}
        />
      ))}
    </div>
  );
}
