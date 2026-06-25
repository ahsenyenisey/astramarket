import { useLocation } from 'react-router-dom';

export default function SayfaGecis({ children }) {
  const loc = useLocation();
  return (
    <div key={loc.pathname} className="sayfa-gecis">
      {children}
    </div>
  );
}
