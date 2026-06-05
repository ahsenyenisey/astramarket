import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const raw = localStorage.getItem('sepet');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    localStorage.setItem('sepet', JSON.stringify(items));
  }, [items]);

  const ekle = (urun, adet = 1) => {
    setItems((prev) => {
      const mevcut = prev.find((x) => x.id === urun.id);
      if (mevcut) {
        return prev.map((x) => x.id === urun.id ? { ...x, adet: x.adet + adet } : x);
      }
      return [...prev, { id: urun.id, ad: urun.ad, fiyat: urun.fiyat, resim_url: urun.resim_url, adet }];
    });
  };

  const guncelle = (id, adet) => {
    if (adet < 1) return cikar(id);
    setItems((prev) => prev.map((x) => x.id === id ? { ...x, adet } : x));
  };

  const cikar = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const temizle = () => setItems([]);

  const toplam = items.reduce((s, x) => s + Number(x.fiyat) * x.adet, 0);
  const adetSayisi = items.reduce((s, x) => s + x.adet, 0);

  return (
    <CartContext.Provider value={{ items, ekle, guncelle, cikar, temizle, toplam, adetSayisi }}>
      {children}
    </CartContext.Provider>
  );
}
