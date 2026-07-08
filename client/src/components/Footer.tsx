import React, { useState } from 'react';
import { Send, ArrowUp } from 'lucide-react';

interface FooterProps {
  setPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 0) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#030303] border-t border-white/5 pt-16 pb-8 px-6 md:px-16 text-white/50 text-sm font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand details */}
        <div className="flex flex-col gap-4">
          <div 
            onClick={() => setPage('home')} 
            className="flex items-center gap-1 cursor-pointer select-none text-white"
          >
            <span className="font-display font-bold text-xl tracking-wider">
              LUMEN <span className="text-white/40 font-light">x</span> DELI
            </span>
            <span className="neon-dot-cyan"></span>
          </div>
          <p className="text-xs text-white/40 pr-4 leading-relaxed">
            Luxury high-end additive-manufactured lighting systems and modular, CNC-sintered structural drone components for precision flights.
          </p>
        </div>

        {/* Catalog Categories */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-display font-semibold tracking-wide text-xs">COLLECTIONS</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li><button onClick={() => setPage('shop')} className="hover:text-neon-cyan transition-colors text-left cursor-pointer">Bespoke 3D Lamps</button></li>
            <li><button onClick={() => setPage('shop')} className="hover:text-neon-cyan transition-colors text-left cursor-pointer">Carbon Drone Parts</button></li>
          </ul>
        </div>

        {/* Company and Philosophy */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-display font-semibold tracking-wide text-xs">COMPANY</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li><button onClick={() => setPage('about')} className="hover:text-neon-cyan transition-colors text-left cursor-pointer">About Our Brand</button></li>
            <li><button onClick={() => setPage('contact')} className="hover:text-neon-cyan transition-colors text-left cursor-pointer">Contact Secure Desk</button></li>
            <li><button onClick={() => setPage('support')} className="hover:text-neon-cyan transition-colors text-left cursor-pointer">Technical Support Queue</button></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-display font-semibold tracking-wide text-xs">ENGINEERING UPDATES</h4>
          <p className="text-xs text-white/40 leading-relaxed">
            Subscribe to receive manufacturing briefs, CAD model updates, and community pilot discount alerts.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex gap-2 relative mt-2">
            <input
              type="email"
              placeholder="operator@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan transition-all"
              required
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-white text-black p-1.5 rounded-full hover:bg-neon-cyan transition-colors"
            >
              <Send size={12} />
            </button>
          </form>
          {subscribed && (
            <span className="text-[10px] text-neon-cyan font-semibold tracking-wide animate-pulse">
              Transmission received. Welcome aboard.
            </span>
          )}
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[11px] text-white/30">
          <span>&copy; 2026 LUMEN X DELI. All engineering rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Operations</a>
            <a href="#" className="hover:text-white transition-colors">SLA & Security</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Shield</a>
          </div>
        </div>

        {/* Back to top anchor */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-neon-cyan transition-all group"
        >
          Back to Orbit
          <span className="p-2 border border-white/5 rounded-full group-hover:border-neon-cyan/30 group-hover:text-neon-cyan transition-all">
            <ArrowUp size={12} />
          </span>
        </button>
      </div>
    </footer>
  );
};
export default Footer;
