// Premium planlari - Premium.jsx ve PremiumCheckout.jsx tarafindan paylasilir
export const PLANLAR = [
  {
    id: 'aylik',
    ad: 'Aylık',
    fiyat: 39.90,
    donem: 'ay',
    tasarruf: null,
    populer: false,
    not: null,
  },
  {
    id: 'yillik',
    ad: 'Yıllık',
    fiyat: 299,
    donem: 'yıl',
    tasarruf: '37%',
    populer: true,
    aylik: 24.92,
    not: null,
  },
  {
    id: 'ogrenci',
    ad: 'Öğrenci',
    fiyat: 19.90,
    donem: 'ay',
    tasarruf: '50%',
    populer: false,
    not: 'Öğrenci belgesi gerekir',
  },
];

export function bulPlan(id) {
  return PLANLAR.find((p) => p.id === id);
}
