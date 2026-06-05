import { useEffect, useState } from 'react';
import { Card, Table, Row, Col, Spinner, Badge } from 'react-bootstrap';
import api from '../api/axios';

const RAPORLAR = [
  {
    key: 'kategori',
    endpoint: '/raporlar/kategori-satislari',
    baslik: '1. Kategori Bazında Satışlar',
    aciklama: 'GROUP BY + JOIN: Her kategorideki ürün sayısı ve toplam satış tutarı.',
    sql: `SELECT k.ad AS kategori,
       COUNT(DISTINCT u.id) AS urun_sayisi,
       COALESCE(SUM(sd.adet * sd.birim_fiyat), 0) AS toplam_satis
FROM kategoriler k
LEFT JOIN urunler u ON u.kategori_id = k.id
LEFT JOIN siparis_detaylari sd ON sd.urun_id = u.id
GROUP BY k.id, k.ad
ORDER BY toplam_satis DESC;`,
    kolonlar: ['kategori', 'urun_sayisi', 'toplam_satis'],
  },
  {
    key: 'ortalama',
    endpoint: '/raporlar/ortalama-uzeri-urunler',
    baslik: '2. Ortalamanın Üzerindeki Ürünler',
    aciklama: 'İÇ İÇE SORGU (SUBQUERY): Tüm ürünlerin ortalama fiyatının üzerindeki ürünler.',
    sql: `SELECT id, ad, fiyat
FROM urunler
WHERE fiyat > (SELECT AVG(fiyat) FROM urunler)
ORDER BY fiyat DESC;`,
    kolonlar: ['id', 'ad', 'fiyat'],
    altVeri: true,
  },
  {
    key: 'aktif',
    endpoint: '/raporlar/aktif-musteriler',
    baslik: '3. Aktif Müşteriler (3+ Sipariş)',
    aciklama: 'GROUP BY + HAVING: 3\'ten fazla sipariş veren müşteriler.',
    sql: `SELECT k.id, k.ad, k.email,
       COUNT(s.id) AS siparis_sayisi,
       SUM(s.toplam_tutar) AS toplam_harcama
FROM kullanicilar k
JOIN siparisler s ON s.kullanici_id = k.id
GROUP BY k.id, k.ad, k.email
HAVING COUNT(s.id) > 3
ORDER BY toplam_harcama DESC;`,
    kolonlar: ['id', 'ad', 'email', 'siparis_sayisi', 'toplam_harcama'],
  },
  {
    key: 'yorum',
    endpoint: '/raporlar/cok-yorumlu-urunler',
    baslik: '4. En Çok Yorum Alan Ürünler',
    aciklama: 'İÇ İÇE SORGU + JOIN: Yorum sayısı ve ortalama puana göre en çok ilgi gören ürünler.',
    sql: `SELECT u.id, u.ad, u.fiyat,
       (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) AS yorum_sayisi,
       (SELECT ROUND(AVG(puan),2) FROM yorumlar y WHERE y.urun_id = u.id) AS ortalama_puan
FROM urunler u
WHERE (SELECT COUNT(*) FROM yorumlar y WHERE y.urun_id = u.id) > 0
ORDER BY yorum_sayisi DESC, ortalama_puan DESC LIMIT 10;`,
    kolonlar: ['id', 'ad', 'fiyat', 'yorum_sayisi', 'ortalama_puan'],
  },
  {
    key: 'satilmayan',
    endpoint: '/raporlar/satilmayan-urunler',
    baslik: 'Bonus: Hiç Sipariş Edilmemiş Ürünler',
    aciklama: 'İÇ İÇE NOT IN: Hiç sipariş edilmemiş ürünlerin tespit edilmesi.',
    sql: `SELECT u.id, u.ad, u.fiyat, u.stok, k.ad AS kategori
FROM urunler u
LEFT JOIN kategoriler k ON k.id = u.kategori_id
WHERE u.id NOT IN (SELECT DISTINCT urun_id FROM siparis_detaylari)
ORDER BY u.fiyat DESC;`,
    kolonlar: ['id', 'ad', 'kategori', 'fiyat', 'stok'],
  },
];

function bicim(v, kolon) {
  if (v === null || v === undefined) return '-';
  if (kolon === 'fiyat' || kolon === 'toplam_satis' || kolon === 'toplam_harcama') {
    return Number(v).toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' TL';
  }
  if (kolon === 'ortalama_puan') return Number(v).toFixed(2) + ' / 5';
  return v;
}

export default function AdminReports() {
  const [ozet, setOzet] = useState(null);
  const [veriler, setVeriler] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const istekler = [
      api.get('/raporlar/ozet'),
      ...RAPORLAR.map((r) => api.get(r.endpoint)),
    ];
    Promise.all(istekler).then((sonuc) => {
      setOzet(sonuc[0].data);
      const m = {};
      RAPORLAR.forEach((r, i) => { m[r.key] = sonuc[i + 1].data; });
      setVeriler(m);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--bordo)' }} /></div>;

  return (
    <div>
      <h3 className="mb-4" style={{ color: 'var(--bordo)' }}>Raporlar & Gelişmiş SQL Sorguları</h3>

      {ozet && (
        <Row className="g-3 mb-4">
          <Col md={3}><div className="ozet-kart"><div className="deger">{ozet.toplam_urun}</div><div className="etiket">Toplam Ürün</div></div></Col>
          <Col md={3}><div className="ozet-kart"><div className="deger">{ozet.toplam_siparis}</div><div className="etiket">Toplam Sipariş</div></div></Col>
          <Col md={3}><div className="ozet-kart"><div className="deger">{Number(ozet.toplam_ciro).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</div><div className="etiket">Toplam Ciro</div></div></Col>
          <Col md={3}><div className="ozet-kart"><div className="deger">{ozet.toplam_musteri}</div><div className="etiket">Toplam Müşteri</div></div></Col>
        </Row>
      )}

      {RAPORLAR.map((r) => {
        const veri = veriler[r.key];
        const liste = r.altVeri ? veri?.urunler : veri;
        return (
          <Card key={r.key} className="rapor-card">
            <Card.Header>{r.baslik}</Card.Header>
            <Card.Body>
              <div className="sql-yorum mb-3">
                <strong>{r.aciklama}</strong>
                <pre style={{ marginTop: 8, marginBottom: 0, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>{r.sql}</pre>
              </div>
              {r.altVeri && veri?.ortalama && (
                <Badge className="badge-pudra mb-2">
                  Ortalama fiyat: {Number(veri.ortalama).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                </Badge>
              )}
              {(!liste || liste.length === 0) ? (
                <p className="text-muted">Bu sorgu için sonuç bulunamadı.</p>
              ) : (
                <Table responsive striped size="sm">
                  <thead>
                    <tr>{r.kolonlar.map((k) => <th key={k}>{k.replace(/_/g, ' ').toUpperCase()}</th>)}</tr>
                  </thead>
                  <tbody>
                    {liste.map((satir, i) => (
                      <tr key={i}>
                        {r.kolonlar.map((k) => <td key={k}>{bicim(satir[k], k)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
}
