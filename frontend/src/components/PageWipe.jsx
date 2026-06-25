import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageWipe() {
  const loc = useLocation();
  const [aktif, setAktif] = useState(false);
  const ilkAcilis = useRef(true);

  useEffect(() => {
    if (ilkAcilis.current) {
      ilkAcilis.current = false;
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setAktif(true);
    const t = setTimeout(() => setAktif(false), 750);
    return () => clearTimeout(t);
  }, [loc.pathname]);

  return (
    <div className={`page-wipe ${aktif ? 'aktif' : ''}`} aria-hidden="true">
      <div className="pw-perde pw-perde-1" />
      <div className="pw-perde pw-perde-2" />
      <div className="pw-perde pw-perde-3" />
    </div>
  );
}
