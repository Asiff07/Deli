import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface NavbarProps {
  setPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useCartStore();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'Products', path: 'shop' },
    { name: 'About', path: 'about' },
    { name: 'Contact', path: 'contact' },
    { name: 'Support', path: 'support' },
  ];

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${hidden ? '-translate-y-32 opacity-0 scale-95' : 'translate-y-0 opacity-100 scale-100'
        } ${scrolled
          ? 'bg-white/60 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40'
          : 'bg-white/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/50'
        } rounded-full flex items-center justify-between px-6 h-[72px]`}
    >
      {/* Brand */}
      <div
        onClick={() => setPage('home')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <span className="font-display font-bold text-lg tracking-tight text-[#111111] group-hover:opacity-80 transition-opacity">
          PROJECT DELI
        </span>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => setPage(link.path)}
            className="px-4 py-2 rounded-full text-[13px] font-sans font-medium text-[#111111]/70 hover:text-[#111111] hover:bg-black/5 transition-all duration-300 cursor-pointer"
          >
            {link.name}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="hidden lg:flex items-center gap-4">
        {user ? (
          <button
            onClick={() => setPage('admin')}
            className="text-[#111111]/70 hover:text-[#111111] px-4 py-2 text-[13px] font-sans font-medium transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => setPage('auth')}
            className="text-[#111111]/70 hover:text-[#111111] px-4 py-2 text-[13px] font-sans font-medium transition-colors cursor-pointer"
          >
            Login
          </button>
        )}

        <button
          onClick={() => setPage('contact')}
          className="bg-[#0057FF] hover:bg-[#004BE6] text-white px-5 py-2 rounded-full text-[13px] font-sans font-semibold transition-all hover:shadow-[0_4px_14px_rgba(0,87,255,0.39)] cursor-pointer transform hover:scale-[1.02]"
        >
          Get Quote
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#111111] p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-[calc(100%+16px)] left-0 w-full bg-white/95 backdrop-blur-3xl rounded-3xl p-6 flex flex-col gap-2 shadow-[0_24px_48px_rgba(0,0,0,0.1)] border border-gray-100 lg:hidden origin-top animate-in slide-in-from-top-4 fade-in duration-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { setPage(link.path); setMobileMenuOpen(false); }}
              className="text-[#111111] text-left px-4 py-3 rounded-xl text-[15px] font-sans font-medium hover:bg-black/5 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="h-[1px] bg-gray-100 my-2" />
          {user ? (
            <button
              onClick={() => { setPage('admin'); setMobileMenuOpen(false); }}
              className="bg-gray-50 text-[#111111] text-center py-3 rounded-xl text-[15px] font-sans font-medium tracking-wide mt-2"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => { setPage('auth'); setMobileMenuOpen(false); }}
              className="bg-gray-50 text-[#111111] text-center py-3 rounded-xl text-[15px] font-sans font-medium tracking-wide mt-2"
            >
              Login
            </button>
          )}
          <button
            onClick={() => { setPage('contact'); setMobileMenuOpen(false); }}
            className="bg-[#0057FF] text-white text-center py-3 rounded-xl text-[15px] font-sans font-semibold tracking-wide mt-2 shadow-md"
          >
            Get Quote
          </button>
        </div>
      )}
    </nav>
  );
};
