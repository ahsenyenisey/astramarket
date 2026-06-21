import { useEffect, useState } from 'react';

// Rastgele araliklarla ekranin solundan sagina dogru parlak enerji isigi sweep yapar.
// Her sweep ~700ms surer, aralar 8-15 saniye.
export default function EnergyBeam() {
  const [aktif, setAktif] = useState([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let sayac = 0;
    let yasiyorMu = true;

    const sweep = () => {
      if (!yasiyorMu) return;
      const id = sayac++;
      const ust = 10 + Math.random() * 75; // 10-85%
      const renk = Math.random() > 0.5 ? 'pembe' : 'mor';
      setAktif((a) => [...a, { id, ust, renk }]);
      setTimeout(() => {
        setAktif((a) => a.filter((b) => b.id !== id));
      }, 1100);
    };

    // Ilk sweep hemen
    const ilk = setTimeout(sweep, 1500);
    // Sonra her 4-8sn'de bir
    let timeout;
    const planla = () => {
      const sure = 4000 + Math.random() * 4000;
      timeout = setTimeout(() => {
        sweep();
        planla();
      }, sure);
    };
    const baslangic = setTimeout(planla, 3000);

    return () => {
      yasiyorMu = false;
      clearTimeout(ilk);
      clearTimeout(baslangic);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="enerji-isin-katmani" aria-hidden="true">
      {aktif.map((b) => (
        <span key={b.id} className={`enerji-isin enerji-isin-${b.renk}`} style={{ top: `${b.ust}%` }} />
      ))}
    </div>
  );
}
