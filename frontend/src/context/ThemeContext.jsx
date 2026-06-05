import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function ilkTema() {
  if (typeof window === 'undefined') return 'dark';
  const kayitli = localStorage.getItem('astra-tema');
  if (kayitli === 'light' || kayitli === 'dark') return kayitli;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(ilkTema);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('astra-tema', tema);
  }, [tema]);

  const degistir = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ tema, setTema, degistir }}>
      {children}
    </ThemeContext.Provider>
  );
}
