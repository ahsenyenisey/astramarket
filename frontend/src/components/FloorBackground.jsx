// Tum arka plan: yukarida tavan + asagida zemin seklinde 2 perspektifli grid floor.
// .floor-kirpi: overflow:hidden ile izgaranin tasmasini engeller
// .floor-izgara: transform: translateY ile GPU'da akar (background-position yerine)
export default function FloorBackground() {
  return (
    <div className="floor-bg" aria-hidden="true">
      <div className="floor-yuzey floor-tavan">
        <div className="floor-kirpi">
          <div className="floor-izgara" />
        </div>
      </div>
      <div className="floor-yuzey floor-zemin">
        <div className="floor-kirpi">
          <div className="floor-izgara" />
        </div>
      </div>
      <div className="floor-ufuk" />
    </div>
  );
}
