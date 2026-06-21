// Donen enerji halkasi - 3 ic ice donen halka + orbit edip duran parcaciklar.
// Pure CSS, sadece transform animasyonu, GPU dostu.
export default function PortalRing({ boyut = 240, className = '' }) {
  return (
    <div className={`portal-ring ${className}`} style={{ width: boyut, height: boyut }} aria-hidden="true">
      <div className="pr-halka pr-halka-1" />
      <div className="pr-halka pr-halka-2" />
      <div className="pr-halka pr-halka-3" />
      <div className="pr-merkez" />
      <div className="pr-orbit">
        <span className="pr-parca" />
        <span className="pr-parca" style={{ transform: 'rotate(120deg) translateX(40%)' }} />
        <span className="pr-parca" style={{ transform: 'rotate(240deg) translateX(40%)' }} />
      </div>
    </div>
  );
}
