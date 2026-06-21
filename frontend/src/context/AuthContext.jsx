import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const premiumKey = (id) => `astra-premium-${id}`;
const okuPremium = (id) => !!id && localStorage.getItem(premiumKey(id)) === '1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? JSON.parse(raw) : null;
  });

  const [premium, setPremiumState] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? okuPremium(JSON.parse(raw).id) : false;
  });

  useEffect(() => {
    setPremiumState(okuPremium(user?.id));
  }, [user?.id]);

  const setPremium = (yes) => {
    if (!user) return;
    if (yes) localStorage.setItem(premiumKey(user.id), '1');
    else localStorage.removeItem(premiumKey(user.id));
    setPremiumState(yes);
  };

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
    setPremiumState(false);
  };

  return (
    <AuthContext.Provider value={{ user, premium, setPremium, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
