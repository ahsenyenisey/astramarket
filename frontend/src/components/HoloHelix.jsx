// Dikey donen DNA-helix - parcaciklar Y ekseninde rotate eder.
// Her parca grubunun rotateY animasyonu ayni - sadece dikey ofset (top%) ve gecikme farkli.
// Bu sayede gercek helix illuzyonu. Sayfanin sag ve sol kenarinda ayna gibi 2 tane render.
const PARCA_SAYISI = 18;

function Helix({ yan }) {
  return (
    <div className={`holo-helix holo-helix-${yan}`} aria-hidden="true">
      <div className="hh-saramal">
        {Array.from({ length: PARCA_SAYISI }).map((_, i) => {
          const t = (i / (PARCA_SAYISI - 1)) * 100;
          return (
            <div
              key={i}
              className="hh-parca-grup"
              style={{
                top: `${t}%`,
                animationDelay: `${-(i * 0.22)}s`,
              }}
            >
              <span className="hh-dot hh-sol" />
              <span className="hh-bag" />
              <span className="hh-dot hh-sag" />
            </div>
          );
        })}
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
