// Sinematik kati efektler: film grain, vignette, ust/alt anamorphic siyah bandlar.
// Hicbir performans yuku yok (sadece CSS), her zaman gorunur.
export default function FilmEffects() {
  return (
    <>
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </>
  );
}
