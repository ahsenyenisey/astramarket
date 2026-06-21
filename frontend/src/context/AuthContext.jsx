import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const premiumKey = (id) => `astra-premium-${id}`;
const planKey = (id) => `astra-premium-plan-${id}`;
const okuPremium = (id) => !!id && localStorage.getItem(premiumKey(id)) === '1';
const okuPlan = (id) => (id ? localStorage.getItem(planKey(id)) : null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? JSON.parse(raw) : null;
  });

  const [premium, setPremiumState] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? okuPremium(JSON.parse(raw).id) : false;
  });

  const [premiumPlan, setPremiumPlanState] = useState(() => {
    const raw = localStorage.getItem('kullanici');
    return raw ? okuPlan(JSON.parse(raw).id) : null;
  });

  useEffect(() => {
    if (!user?.id) {
      setPremiumState(false);
      setPremiumPlanState(null);
      return;
    }
    const aktifMi = okuPremium(user.id);
    let plan = okuPlan(user.id);
    // Migrasyon: eski premium kayitlarinda planId olmayabilir -> varsayilan yillik
    if (aktifMi && !plan) {
      plan = 'yillik';
      localStorage.setItem(planKey(user.id), plan);
    }
    setPremiumState(aktifMi);
    setPremiumPlanState(plan);
  }, [user?.id]);

  // setPremium(true, 'yillik')  veya  setPremium(false)
  const setPremium = (yes, planId = null) => {
    if (!user) return;
    if (yes) {
      localStorage.setItem(premiumKey(user.id), '1');
      if (planId) localStorage.setItem(planKey(user.id), planId);
      setPremiumState(true);
      if (planId) setPremiumPlanState(planId);
    } else {
      localStorage.removeItem(premiumKey(user.id));
      localStorage.removeItem(planKey(user.id));
      setPremiumState(false);
      setPremiumPlanState(null);
    }
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
    setPremiumPlanState(null);
  };

  return (
    <AuthContext.Provider value={{ user, premium, premiumPlan, setPremium, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
