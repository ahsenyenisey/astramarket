const PARCA_SAYISI = 12;

function MiniLogo() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="hh-mini-logo">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.6" opacity="0.6" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="currentColor" strokeWidth="1.2" opacity="0.55" transform="rotate(-30 16 16)" />
      <path d="M16 4 L17.4 14.6 L26 15 L17.4 17.4 L16 28 L14.6 17.4 L6 15 L14.6 14.6 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.8" fill="#fff" opacity="0.95" />
    </svg>
  );
}

function Helix({ yan }) {
  const set = Array.from({ length: PARCA_SAYISI });
  return (
    <div className={`holo-helix holo-helix-${yan}`} aria-hidden="true">
      <div className="hh-saramal">
        {[0, 1].map((setIdx) =>
          set.map((_, i) => {
            const t = (setIdx * 50) + (i / PARCA_SAYISI) * 50;
            return (
              <div
                key={`${setIdx}-${i}`}
                className="hh-parca-grup"
                style={{
                  top: `${t}%`,
                  animationDelay: `${-(i * 0.30)}s`,
                }}
              >
                <span className="hh-dot hh-sol"><MiniLogo /></span>
                <span className="hh-bag" />
                <span className="hh-dot hh-sag"><MiniLogo /></span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function HoloHelix() {
  return (
    <>
      <Helix yan="sag" />
      <Helix yan="sol" />
    </>
  );
}
