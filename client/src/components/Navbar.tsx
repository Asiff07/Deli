import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, User as UserIcon, Heart, Compass, Cpu, HelpCircle, Shield, LogOut, Menu, X, Home as HomeIcon, Info, Mail, Sun, Moon } from 'lucide-react';
import axios from 'axios';

interface NavbarProps {
  currentPath: string;
  setPage: (page: string) => void;
  openCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, setPage, openCart }) => {
  const { user, getCartCount, wishlist, logoutStore } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const toggleTheme = () => {
    const body = document.body;
    body.classList.toggle('light-theme');
    setIsLightTheme(body.classList.contains('light-theme'));
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      logoutStore();
      setPage('home');
      setUserDropdownOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: 'Home', path: 'home', icon: HomeIcon },
    { name: 'Shop', path: 'shop', icon: Compass },
    { name: 'About Us', path: 'about', icon: Info },
    { name: 'Contact Us', path: 'contact', icon: Mail },
    { name: 'Support', path: 'support', icon: HelpCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        onClick={() => { setPage('home'); setMobileMenuOpen(false); }} 
        className="flex items-center gap-1 cursor-pointer select-none"
      >
        <span className="font-display font-bold text-lg md:text-xl tracking-wider text-white">
          LUMEN <span className="text-white/40 font-light">x</span> DELI
        </span>
        <span className="neon-dot-cyan"></span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = currentPath === link.path;
          return (
            <button
              key={link.path}
              onClick={() => setPage(link.path)}
              className={`font-sans font-medium text-sm tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                isActive ? 'text-white text-glow-white font-semibold' : 'text-white/70 hover:text-white hover:text-glow-white'
              }`}
            >
              <link.icon size={15} />
              {link.name}
            </button>
          );
        })}
      </div>

      {/* Action Icons Panel */}
      <div className="hidden md:flex items-center gap-6">
        {/* Light/Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="text-white/70 hover:text-neon-cyan transition-colors cursor-pointer"
          title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {isLightTheme ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Wishlist Button */}
        <button 
          onClick={() => setPage('dashboard')} 
          className="relative text-white/70 hover:text-neon-rose transition-colors cursor-pointer"
        >
          <Heart size={20} />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-neon-rose text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Cart Trigger */}
        <button 
          onClick={openCart} 
          className="relative text-white/70 hover:text-neon-cyan transition-colors cursor-pointer"
        >
          <ShoppingCart size={20} />
          {getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-neon-cyan text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {getCartCount()}
            </span>
          )}
        </button>

        {/* User Account / Profile Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 text-white/80 hover:text-white glass-capsule px-3 py-1.5 text-xs font-sans tracking-wide cursor-pointer"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <UserIcon size={14} className="text-neon-cyan" />
              )}
              {user.name}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 glass-panel rounded-lg py-2 shadow-2xl border border-white/10 z-50">
                <button
                  onClick={() => { setPage('dashboard'); setUserDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-neon-cyan flex items-center gap-2"
                >
                  <UserIcon size={14} /> My Profile
                </button>
                {['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT'].includes(user.role) && (
                  <button
                    onClick={() => { setPage('admin'); setUserDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-neon-cyan flex items-center gap-2"
                  >
                    <Shield size={14} className="text-neon-yellow" /> Admin Panel
                  </button>
                )}
                <div className="border-t border-white/5 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-neon-rose hover:bg-white/5 flex items-center gap-2"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setPage('auth')}
            className="liquid-glass-cyan px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-wide cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden flex items-center gap-4">
        {/* Light/Dark Mode Switcher mobile */}
        <button
          onClick={toggleTheme}
          className="text-white/70 hover:text-neon-cyan transition-colors cursor-pointer"
        >
          {isLightTheme ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Cart Trigger mobile */}
        <button onClick={openCart} className="relative text-white/70 hover:text-neon-cyan transition-colors">
          <ShoppingCart size={20} />
          {getCartCount() > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-neon-cyan text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {getCartCount()}
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white/70 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-[68px] left-0 w-full glass-panel border-b border-white/10 flex flex-col py-6 px-8 gap-4 md:hidden z-40 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => { setPage(link.path); setMobileMenuOpen(false); }}
                className={`text-left font-sans py-2 text-base flex items-center gap-3 transition-all ${
                  isActive ? 'text-white text-glow-white font-semibold' : 'text-white/80 hover:text-white hover:text-glow-white'
                }`}
              >
                <link.icon size={18} />
                {link.name}
              </button>
            );
          })}
          <div className="border-t border-white/5 my-2"></div>
          {user ? (
            <>
              <button
                onClick={() => { setPage('dashboard'); setMobileMenuOpen(false); }}
                className="text-left font-sans text-white/80 py-2 text-base flex items-center gap-3"
              >
                <UserIcon size={18} /> My Profile
              </button>
              {['ADMIN', 'EDITOR', 'CUSTOMER_SUPPORT'].includes(user.role) && (
                <button
                  onClick={() => { setPage('admin'); setMobileMenuOpen(false); }}
                  className="text-left font-sans text-neon-yellow py-2 text-base flex items-center gap-3"
                >
                  <Shield size={18} /> Admin Dashboard
                </button>
              )}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="text-left font-sans text-neon-rose py-2 text-base flex items-center gap-3"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { setPage('auth'); setMobileMenuOpen(false); }}
              className="liquid-glass-cyan text-center py-2.5 rounded-full text-sm font-sans font-semibold tracking-wide"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;
