// Tum arka plan: yukarida tavan + asagida zemin seklinde 2 perspektifli grid floor.
// Sonsuz tunel hissi - her iki yuzeyde de izgara cizgileri sonsuza dogru akar.
export default function FloorBackground() {
  return (
    <div className="floor-bg" aria-hidden="true">
      <div className="floor-yuzey floor-tavan">
        <div className="floor-izgara" />
        <div className="floor-isik" />
      </div>
      <div className="floor-yuzey floor-zemin">
        <div className="floor-izgara" />
        <div className="floor-isik" />
      </div>
      <div className="floor-ufuk" />
    </div>
  );
}
