// Tum arka planda uçuşan AstraMarket yildiz sembolleri.
// Her yildiz farkli boyut, pozisyon ve animasyon timing - 8 adet floating star.
// Pure CSS animasyon (float + spin), GPU dostu.

function StarSembol() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="sf-svg">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke="currentColor" strokeWidth="1.1" opacity="0.4" transform="rotate(-30 16 16)" />
      <path d="M16 4 L17.4 14.6 L26 15 L17.4 17.4 L16 28 L14.6 17.4 L6 15 L14.6 14.6 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.8" fill="#fff" opacity="0.95" />
    </svg>
  );
}

// Sayı 8 → 5 (performans icin azaltildi)
const YILDIZLAR = [
  { top: '14%', left: '8%',  boyut: 64, gecikme: '0s',   renk: 'pembe', sure: 14 },
  { top: '22%', left: '78%', boyut: 80, gecikme: '-2s',  renk: 'mor',   sure: 18 },
  { top: '55%', left: '12%', boyut: 64, gecikme: '-3.5s', renk: 'mor',  sure: 20 },
  { top: '70%', left: '88%', boyut: 56, gecikme: '-7s',  renk: 'pembe', sure: 15 },
  { top: '82%', left: '32%', boyut: 72, gecikme: '-1.5s', renk: 'mor',  sure: 17 },
];

export default function StarFloat() {
  return (
    <div className="star-float-katmani" aria-hidden="true">
      {YILDIZLAR.map((y, i) => (
        <div
          key={i}
          className={`sf-yildiz sf-${y.renk}`}
          style={{
            top: y.top,
            left: y.left,
            width: y.boyut,
            height: y.boyut,
            animationDelay: y.gecikme,
            animationDuration: `${y.sure}s`,
          }}
        >
          <div className="sf-float">
            <div className="sf-spin">
              <StarSembol />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
