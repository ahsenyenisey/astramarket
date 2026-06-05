import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h5>YÖNETİM PANELİ</h5>
        <NavLink to="/admin/urunler">Ürün Yönetimi</NavLink>
        <NavLink to="/admin/kullanicilar-kategoriler">Kullanıcı & Kategori</NavLink>
        <NavLink to="/admin/raporlar">Raporlar & SQL</NavLink>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
