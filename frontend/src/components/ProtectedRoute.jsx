import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (adminOnly && user.rol !== 'admin') return <Navigate to="/login" state={{ yetki: 'Bu sayfaya erisim yetkiniz yok' }} replace />;
  return children;
}
