import { Routes, Route, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import BlobBackground from './components/BlobBackground';
import Footer from './components/Footer';
import SayfaGecis from './components/SayfaGecis';
import AuroraOverlay from './components/AuroraOverlay';
import IntroLoader from './components/IntroLoader';
import FilmEffects from './components/FilmEffects';
import LogoBackground from './components/LogoBackground';

import Login from './pages/Login';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import SuperPrice from './pages/SuperPrice';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Premium from './pages/Premium';
import PremiumCheckout from './pages/PremiumCheckout';
import PremiumSuccess from './pages/PremiumSuccess';
import FAQ from './pages/FAQ';
import Returns from './pages/Returns';
import CargoTracking from './pages/CargoTracking';
import Contact from './pages/Contact';
import AdminProducts from './pages/AdminProducts';
import AdminUsersCategories from './pages/AdminUsersCategories';
import AdminReports from './pages/AdminReports';

export default function App() {
  const loc = useLocation();
  const adminAlani = loc.pathname.startsWith('/admin');
  const loginAlani = loc.pathname === '/login';
  const sadeSayfa = loginAlani;
  // Immersive efektler sadece musteri tarafinda
  const immersiveEfektler = !adminAlani;

  return (
    <div className="app-root">
      {immersiveEfektler && <IntroLoader />}
      {immersiveEfektler && <FilmEffects />}
      {immersiveEfektler && <AuroraOverlay />}
      {!adminAlani && !sadeSayfa && <BlobBackground />}
      {immersiveEfektler && <LogoBackground />}
      {immersiveEfektler && <div className="scan-lines" aria-hidden="true" />}

      {!sadeSayfa && <AppNavbar />}
      <SayfaGecis>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/urun/:id" element={<ProductDetail />} />
          <Route path="/sepet" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/siparis-tamamlandi" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path="/siparislerim" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />

          <Route path="/firsatlar" element={<SuperPrice />} />
          <Route path="/kampanyalar" element={<Campaigns />} />
          <Route path="/kampanyalar/:id" element={<CampaignDetail />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/premium/odeme" element={<ProtectedRoute><PremiumCheckout /></ProtectedRoute>} />
          <Route path="/premium/basari" element={<ProtectedRoute><PremiumSuccess /></ProtectedRoute>} />
          <Route path="/yardim/sss" element={<FAQ />} />
          <Route path="/yardim/iade" element={<Returns />} />
          <Route path="/yardim/kargo" element={<CargoTracking />} />
          <Route path="/yardim/iletisim" element={<Contact />} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route path="urunler" element={<AdminProducts />} />
            <Route path="kullanicilar-kategoriler" element={<AdminUsersCategories />} />
            <Route path="raporlar" element={<AdminReports />} />
          </Route>
        </Routes>
      </SayfaGecis>
      {!adminAlani && !sadeSayfa && <Footer />}
    </div>
  );
}
