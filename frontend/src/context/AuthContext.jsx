import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, sifre) => {
    const { data } = await api.post('/auth/login', { email, sifre });
    localStorage.setItem('token', data.token);
    localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
    setUser(data.kullanici);
    return data.kullanici;
  };

  const register = async (ad, email, sifre) => {
    const { data } = await api.post('/auth/register', { ad, email, sifre });
    localStorage.setItem('token', data.token);
    localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
    setUser(data.kullanici);
    return data.kullanici;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
