export default function HudFrame({ children, etiket, className = '' }) {
  return (
    <div className={`hud-frame ${className}`}>
      {etiket && <span className="hud-etiket">{etiket}</span>}
      <span className="hud-kose hud-sol-ust" />
      <span className="hud-kose hud-sag-ust" />
      <span className="hud-kose hud-sol-alt" />
      <span className="hud-kose hud-sag-alt" />
      <span className="hud-border-anim" />
      {children}
    </div>
  );
}
