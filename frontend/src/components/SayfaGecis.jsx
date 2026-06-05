import { useLocation } from 'react-router-dom';

// Route degisince icerigi fade + scale ile sarmar.
// Key olarak pathname kullanilir, animation tetiklenir.
export default function SayfaGecis({ children }) {
  const loc = useLocation();
  return (
    <div key={loc.pathname} className="sayfa-gecis">
      {children}
    </div>
  );
}
