// Buyuk kozmik orbital sistem - 3 ic ice halka, her halkanin uzerinde
// AstraMarket mini logosu gezegen gibi orbit yapar. Tum sistemde surekli yavasca doner.
// Fixed positioned arka plan element, pointer-events: none.

function MiniLogo({ renk = 'pembe' }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={`co-mini-logo co-${renk}`}>
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="currentColor" strokeWidth="1.1" opacity="0.5" transform="rotate(-30 16 16)" />
      <path d="M16 4 L17.4 14.6 L26 15 L17.4 17.4 L16 28 L14.6 17.4 L6 15 L14.6 14.6 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.8" fill="#fff" opacity="0.95" />
    </svg>
  );
}

// Bir orbital halka. Halkanin kendisi cizimli (ellipse stroke),
// uzerinde 2 logo karsi koselerde orbit yapar.
function Halka({ siralama, tilt, donus, sure, logoSayisi = 2, logoRenk }) {
  return (
    <div
      className={`co-halka co-halka-${siralama}`}
      style={{ '--tilt': tilt, '--donus-sure': `${sure}s`, animationDirection: donus }}
    >
      <div className="co-halka-cizim" />
      <div className="co-yorunge">
        {Array.from({ length: logoSayisi }).map((_, i) => (
          <div
            key={i}
            className="co-logo-konum"
            style={{ '--baslangic-aci': `${(360 / logoSayisi) * i}deg` }}
          >
            <MiniLogo renk={logoRenk} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CosmicOrbit() {
  return (
    <div className="cosmic-orbit" aria-hidden="true">
      <div className="co-merkez">
        {/* Merkez yildiz - tum sistemin agirlik noktasi */}
        <div className="co-yildiz" />
      </div>
      {/* 3 farkli boyut, tilt ve hizda halka */}
      <Halka siralama={1} tilt="65deg" donus="normal" sure={28} logoSayisi={2} logoRenk="pembe" />
      <Halka siralama={2} tilt="72deg" donus="reverse" sure={42} logoSayisi={3} logoRenk="mor" />
      <Halka siralama={3} tilt="55deg" donus="normal" sure={56} logoSayisi={2} logoRenk="pembe" />
    </div>
  );
}
