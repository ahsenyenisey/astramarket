import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Stok ID'sine gore deterministik indirim hesabi (gosterim icin)
function indirimHesapla(urun) {
  const seed = urun.id % 10;
  if (seed < 3) return { yuzde: 0 };
  const yuzde = 10 + (seed * 4); // 10-46 arasi
  const eskiFiyat = (Number(urun.fiyat) / (1 - yuzde / 100));
  return { yuzde, eskiFiyat };
}

export default function ProductCard({ urun }) {
  const { ekle } = useCart();
  const nav = useNavigate();
  const stokYok = urun.stok <= 0;
  const { yuzde, eskiFiyat } = indirimHesapla(urun);

  return (
    <Card className="product-card">
      <div className="urun-resim-kutu">
        <img
          src={urun.resim_url || `https://picsum.photos/seed/urun-${urun.id}/400/300`}
          alt={urun.ad}
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1';
              e.currentTarget.src = `https://picsum.photos/seed/urun-${urun.id}/400/300`;
            }
          }}
        />
        {yuzde > 0 && <span className="indirim-rozet">%{yuzde} İNDİRİM</span>}
        <div className="hizli-islemler">
          <button
            className="hizli-btn"
            title="Sepete ekle"
            disabled={stokYok}
            onClick={(e) => { e.preventDefault(); ekle(urun); }}
            aria-label="Sepete ekle"
          >+</button>
          <button
            className="hizli-btn"
            title="Detay görüntüle"
            onClick={() => nav(`/urun/${urun.id}`)}
            aria-label="Detay görüntüle"
          >→</button>
        </div>
      </div>
      <Card.Body>
        <div className="urun-meta">
          <span className="urun-sku">SKU-{String(urun.id).padStart(4, '0')}</span>
          <span className={`urun-stk ${stokYok ? 'tukendi' : urun.stok < 20 ? 'az' : 'var'}`}>
            STK-{String(urun.stok).padStart(3, '0')}
          </span>
        </div>
        {urun.kategori_ad && <div className="kategori-etiket">{urun.kategori_ad}</div>}
        <Card.Title>
          <Link to={`/urun/${urun.id}`} style={{ color: 'inherit' }}>{urun.ad}</Link>
        </Card.Title>
        <div className="fiyat-kutu">
          <span className="fiyat-yeni">
            {Number(urun.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
          </span>
          {yuzde > 0 && (
            <span className="fiyat-eski">
              {eskiFiyat.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
            </span>
          )}
        </div>
        <button
          className="btn btn-bordo w-100"
          disabled={stokYok}
          onClick={() => ekle(urun)}
        >
          {stokYok ? 'Stokta Yok' : 'Sepete Ekle'}
        </button>
      </Card.Body>
    </Card>
  );
}
