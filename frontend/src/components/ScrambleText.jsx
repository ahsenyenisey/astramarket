import { useEffect, useState, useRef } from 'react';

const KARAKTERLER = '!<>-_\\/[]{}—=+*^?#█▓▒░0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Verilen metni decode/scramble animasyonu ile yazar.
// Tek seferlik calisir (mount edildiginde).
export default function ScrambleText({ text, className = '', as: Tag = 'span', delay = 0, sure = 1100 }) {
  const [goster, setGoster] = useState('');
  const rafRef = useRef();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGoster(text);
      return;
    }

    let timeoutId;
    const baslat = () => {
      const baslangic = performance.now();
      const tikla = (zaman) => {
        const gecen = zaman - baslangic;
        const yuzde = Math.min(gecen / sure, 1);
        const sabitUzunluk = Math.floor(yuzde * text.length);
        let yeni = '';
        for (let i = 0; i < text.length; i++) {
          if (i < sabitUzunluk) {
            yeni += text[i];
          } else if (text[i] === ' ') {
            yeni += ' ';
          } else {
            yeni += KARAKTERLER[Math.floor(Math.random() * KARAKTERLER.length)];
          }
        }
        setGoster(yeni);
        if (yuzde < 1) {
          rafRef.current = requestAnimationFrame(tikla);
        } else {
          setGoster(text);
        }
      };
      rafRef.current = requestAnimationFrame(tikla);
    };

    timeoutId = setTimeout(baslat, delay);

    return () => {
      clearTimeout(timeoutId);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay, sure]);

  return <Tag className={`scramble-text ${className}`}>{goster || ' '}</Tag>;
}
