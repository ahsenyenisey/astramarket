// Dikey donen DNA-helix - parcaciklar Y ekseninde rotate eder.
// Her parca grubunun rotateY animasyonu ayni - sadece dikey ofset (top%) ve gecikme farkli.
// Bu sayede gercek helix illuzyonu.
const PARCA_SAYISI = 18;

export default function HoloHelix() {
  return (
    <div className="holo-helix" aria-hidden="true">
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
