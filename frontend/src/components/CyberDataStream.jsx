import { useMemo } from 'react';

// Ekranin sol kenarinda dikey akan cyber/matrix-style random karakter kolonlari.
// Saf CSS animasyonu, sadece 3 ince kolon, low opacity.
const KARAKTERLER = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ▓▒░█◆◇▲▼';
const SATIR_SAYISI = 32;

function Kolon({ gecikme, sure }) {
  const satirlar = useMemo(
    () => Array.from({ length: SATIR_SAYISI }, () => KARAKTERLER[Math.floor(Math.random() * KARAKTERLER.length)]).join('\n'),
    []
  );
  return (
    <span
      className="cyber-kolon"
      style={{ animationDelay: `-${gecikme}s`, animationDuration: `${sure}s` }}
    >
      {satirlar}
    </span>
  );
}

export default function CyberDataStream() {
  return (
    <div className="cyber-veri-akisi" aria-hidden="true">
      <Kolon gecikme={0} sure={20} />
      <Kolon gecikme={6} sure={26} />
      <Kolon gecikme={12} sure={22} />
    </div>
  );
}
