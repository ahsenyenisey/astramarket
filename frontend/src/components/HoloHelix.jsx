// Dikey donen DNA-helix - 24 parcaciktan olusan cift sarmal.
// Pure CSS animasyon, GPU dostu transforms.
// Sayfanin sag tarafinda yari saydam, surekli yavasca doner ve dikey kayar.
const PARCA_SAYISI = 22;

export default function HoloHelix() {
  return (
    <div className="holo-helix" aria-hidden="true">
      <div className="hh-saramal">
        {Array.from({ length: PARCA_SAYISI }).map((_, i) => {
          const ofset = (i / PARCA_SAYISI) * 360;
          const t = (i / PARCA_SAYISI) * 100;
          return (
            <div
              key={i}
              className="hh-parca-grup"
              style={{ top: `${t}%`, animationDelay: `${-(i * 0.18)}s` }}
            >
              <span className="hh-dot hh-sol" style={{ '--ofset': `${ofset}deg` }} />
              <span className="hh-bag" style={{ '--ofset': `${ofset}deg` }} />
              <span className="hh-dot hh-sag" style={{ '--ofset': `${ofset}deg` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
