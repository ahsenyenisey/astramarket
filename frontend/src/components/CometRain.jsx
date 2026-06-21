import { useEffect, useState } from 'react';

// Rastgele araliklarla ekranda kayan kuyruklu yildizlar.
// Performans: ayni anda en fazla 3 komet yasiyor.
export default function CometRain() {
  const [kometler, setKometler] = useState([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let sayac = 0;
    let aktif = true;

    const yeniKomet = () => {
      if (!aktif) return;
      const id = sayac++;
      // Rastgele baslangic yonu
      const ust = -10 - Math.random() * 10; // top%
      const sol = Math.random() * 70; // left%
      const aci = 25 + Math.random() * 30; // 25-55 derece
      const sure = 1.6 + Math.random() * 1.4; // 1.6-3sn
      const renk = Math.random() > 0.5 ? 'pembe' : 'mor';
      setKometler((k) => [...k, { id, ust, sol, aci, sure, renk }]);
      // Otomatik temizle
      setTimeout(() => {
        setKometler((k) => k.filter((c) => c.id !== id));
      }, sure * 1000 + 200);
    };

    // Ilk komet 2sn sonra
    const ilkTimer = setTimeout(yeniKomet, 2000);
    // Sonra her 4-9sn'de bir
    const interval = setInterval(() => {
      if (Math.random() > 0.3) yeniKomet();
    }, 4500);

    return () => {
      aktif = false;
      clearTimeout(ilkTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="komet-katmani" aria-hidden="true">
      {kometler.map((k) => (
        <span
          key={k.id}
          className={`komet komet-${k.renk}`}
          style={{
            top: `${k.ust}%`,
            left: `${k.sol}%`,
            transform: `rotate(${k.aci}deg)`,
            animationDuration: `${k.sure}s`,
          }}
        />
      ))}
    </div>
  );
}
