import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

// Brutalist HUD katmani: kose bracketler + canli veri
// (saat, scroll yuzdesi, sepet durumu, sistem kodu).
// Dekor degil - gercek bilgi tasiyor.
function saatBicim() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export default function HudOverlay() {
  const { items, toplam } = useCart();
  const [saat, setSaat] = useState(saatBicim());
  const [scrollYuzde, setScrollYuzde] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setSaat(saatBicim()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    let raf = null;
    const guncelle = () => {
      raf = null;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const oran = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollYuzde(Math.min(100, Math.max(0, oran)));
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

  const sepetAdet = items.reduce((s, x) => s + x.adet, 0);

  return (
    <div className="hud-overlay" aria-hidden="true">
      {/* Sol ust */}
      <div className="hud-block hud-tl">
        <span className="hud-mark">[</span>
        <span className="hud-mono">ASTRA-MKT</span>
        <span className="hud-sep">·</span>
        <span className="hud-mono dim">SECTOR-07</span>
        <span className="hud-mark">]</span>
      </div>

      {/* Sag ust */}
      <div className="hud-block hud-tr">
        <span className="hud-pulse" />
        <span className="hud-mono">ONLINE</span>
        <span className="hud-sep">·</span>
        <span className="hud-mono dim">{saat}</span>
      </div>

      {/* Sol alt */}
      <div className="hud-block hud-bl">
        <span className="hud-mark">[</span>
        <span className="hud-mono">SCRL</span>
        <span className="hud-mono lime">{String(Math.round(scrollYuzde)).padStart(3, '0')}%</span>
        <span className="hud-mark">]</span>
      </div>

      {/* Sag alt */}
      <div className="hud-block hud-br">
        <span className="hud-mono">CART</span>
        <span className="hud-mono lime">{String(sepetAdet).padStart(2, '0')}</span>
        <span className="hud-sep">·</span>
        <span className="hud-mono dim">{toplam > 0 ? `${Math.round(toplam)} TL` : '—'}</span>
      </div>
    </div>
  );
}
