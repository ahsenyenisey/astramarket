import { useEffect, useRef } from 'react';

// IntersectionObserver ile scroll-triggered reveal.
// Element gorunuluk alanina girince 'gorunur' class'i eklenir.
// CSS'te .reveal-on-scroll.gorunur kuralina tabi.
export default function RevealOnScroll({ children, as = 'div', gecikme = 0, className = '', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('gorunur');
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('gorunur'), gecikme);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [gecikme]);

  const Comp = as;
  return (
    <Comp ref={ref} className={`reveal-on-scroll ${className}`} {...rest}>
      {children}
    </Comp>
  );
}
