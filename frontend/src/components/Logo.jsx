// AstraMarket logo - SVG ile cizilmis, neon gradient
// Boyutlar: 'sm' (24px ikon), 'md' (32px), 'lg' (48px), 'xl' (64px)

const BOYUTLAR = {
  sm: { ikon: 24, yazi: '1rem', bosluk: 8 },
  md: { ikon: 32, yazi: '1.4rem', bosluk: 10 },
  lg: { ikon: 48, yazi: '2rem', bosluk: 14 },
  xl: { ikon: 64, yazi: '2.6rem', bosluk: 18 },
};

export default function Logo({
  boyut = 'md',
  yaziGoster = true,
  className = '',
  benzersizId = 'logo',
}) {
  const b = BOYUTLAR[boyut] || BOYUTLAR.md;

  return (
    <div className={`astra-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: b.bosluk }}>
      <svg
        width={b.ikon}
        height={b.ikon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.65))' }}
        aria-label="AstraMarket"
      >
        <defs>
          <linearGradient id={`${benzersizId}-grad`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`${benzersizId}-grad2`} x1="64" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <radialGradient id={`${benzersizId}-glow`} cx="32" cy="32" r="14" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dis halka (orbit) */}
        <circle
          cx="32" cy="32" r="26"
          stroke={`url(#${benzersizId}-grad)`}
          strokeWidth="2"
          opacity="0.55"
        />

        {/* Acili ic halka */}
        <ellipse
          cx="32" cy="32" rx="26" ry="10"
          stroke={`url(#${benzersizId}-grad2)`}
          strokeWidth="1.5"
          opacity="0.7"
          transform="rotate(-30 32 32)"
        />

        {/* Merkez yildiz - 4 isinli */}
        <path
          d="M32 14 L34 28 L48 30 L34 32 L32 50 L30 32 L16 30 L30 28 Z"
          fill={`url(#${benzersizId}-grad)`}
        />

        {/* Merkez parlak nokta */}
        <circle cx="32" cy="32" r="4" fill={`url(#${benzersizId}-glow)`} />
        <circle cx="32" cy="32" r="2.5" fill="#fff" opacity="0.9" />

        {/* Kucuk yildizlar (uydular) */}
        <circle cx="54" cy="20" r="1.6" fill="#fb7185" opacity="0.95" />
        <circle cx="12" cy="46" r="1.2" fill="#c084fc" opacity="0.85" />
        <circle cx="50" cy="48" r="1" fill="#fda4af" opacity="0.85" />
      </svg>

      {yaziGoster && (
        <span
          style={{
            fontSize: b.yazi,
            fontWeight: 800,
            letterSpacing: '0.5px',
            background: 'linear-gradient(135deg, #fb7185 0%, #c084fc 50%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 16px rgba(168, 85, 247, 0.4))',
            lineHeight: 1,
          }}
        >
          AstraMarket
        </span>
      )}
    </div>
  );
}
