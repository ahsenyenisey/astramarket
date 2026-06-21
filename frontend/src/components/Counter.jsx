import { useEffect, useRef, useState } from 'react';

// Sayiyi 0'dan hedef degere kadar animasyonla sayar.
// Viewport icine girdiginde tetiklenir.
// hedef sayi, ondalik basamak, son ek (TL, +, %), baslangic gecikmesi alir.
export default function Counter({ hedef, ondalik = 0, sonEk = '', onEk = '', sure = 1400, gecikme = 0, className = '' }) {
  const [deger, setDeger] = useState(0);
  const ref = useRef();
  const baslatildi = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDeger(hedef);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !baslatildi.current) {
            baslatildi.current = true;
            setTimeout(() => {
              const baslangic = performance.now();
              const tikla = (zaman) => {
                const gecen = zaman - baslangic;
                const yuzde = Math.min(gecen / sure, 1);
                // easeOutExpo
                const ease = yuzde === 1 ? 1 : 1 - Math.pow(2, -10 * yuzde);
                setDeger(hedef * ease);
                if (yuzde < 1) requestAnimationFrame(tikla);
                else setDeger(hedef);
              };
              requestAnimationFrame(tikla);
            }, gecikme);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hedef, sure, gecikme]);

  const formatla = (n) => {
    if (ondalik === 0) return Math.floor(n).toLocaleString('tr-TR');
    return n.toLocaleString('tr-TR', { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik });
  };

  return (
    <span ref={ref} className={`counter-deger ${className}`}>
      {onEk}{formatla(deger)}{sonEk}
    </span>
  );
}
