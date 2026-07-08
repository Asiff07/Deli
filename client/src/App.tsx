import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Support from './pages/Support';
import About from './pages/About';
import Contact from './pages/Contact';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useCartStore } from './store/cartStore';
import axios from 'axios';

// Configure axios base defaults for credentialed REST requests
axios.defaults.baseURL = '';
axios.defaults.withCredentials = true;

export const App: React.FC = () => {
  const { setUser, addToCart } = useCartStore();
  const [page, setPage] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState(false);

  // Restore authenticated operator profile session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.get('/api/v1/auth/me');
        if (res.data?.data?.user) {
          setUser(res.data.data.user);
        }
      } catch (err) {
        // Safe to ignore on initial load if user has no tokens
        setUser(null);
      }
    };
    restoreSession();
  }, []);

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const addToCartGlobal = (item: any) => {
    addToCart(item);
    setCartOpen(true);
  };

  const renderActivePage = () => {
    switch (page) {
      case 'home':
        return <Home setPage={setPage} />;
      case 'shop':
        return <Shop setPage={setPage} addToCartGlobal={addToCartGlobal} />;
      case 'about':
        return <About setPage={setPage} />;
      case 'contact':
        return <Contact setPage={setPage} />;
      case 'support':
        return <Support setPage={setPage} />;
      case 'auth':
        return <AuthPage setPage={setPage} />;
      case 'dashboard':
        return <UserDashboard setPage={setPage} />;
      case 'admin':
        return <AdminDashboard setPage={setPage} />;
      default:
        return <Home setPage={setPage} />;
    }
  };

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
      {/* Background neon visual ambient overlays */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Sticky header navbar */}
      <Navbar currentPath={page} setPage={setPage} openCart={openCart} />

      {/* Cart Slider Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={closeCart} setPage={setPage} />

      {/* Main content body view */}
      <main className="flex-1 w-full relative z-10">
        {renderActivePage()}
      </main>

      {/* Premium Footer sitemaps */}
      <Footer setPage={setPage} />
    </div>
  );
};
export default App;
