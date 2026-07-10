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
    <footer className="w-full bg-[#111111] border-t border-white/10 pt-24 pb-12 px-6 md:px-16 text-white/50 text-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 mb-24">
        {/* Brand details */}
        <div className="flex flex-col gap-6 md:w-1/3">
          <div 
            onClick={() => setPage('home')} 
            className="flex flex-col cursor-pointer select-none text-white"
          >
            <span className="font-display font-bold text-2xl tracking-widest uppercase">
              PROJECT DELI
            </span>
            <span className="font-display text-lg text-white/70 mt-1">
              Engineering Tomorrow's Innovation
            </span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed font-light max-w-sm mt-4">
            Luxury additive manufacturing,<br/>
            professional drones,<br/>
            custom 3D printing,<br/>
            and precision engineering.
          </p>
        </div>

        {/* Links & Newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:w-2/3">
          {/* Products */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-display font-semibold tracking-widest text-xs uppercase">PRODUCTS</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-white/60">
              <li><button onClick={() => setPage('shop')} className="hover:text-white transition-colors text-left cursor-pointer">• 3D Printed Lamps</button></li>
              <li><button onClick={() => setPage('shop')} className="hover:text-white transition-colors text-left cursor-pointer">• Drones</button></li>
              <li><button onClick={() => setPage('shop')} className="hover:text-white transition-colors text-left cursor-pointer">• Accessories</button></li>
              <li><button onClick={() => setPage('shop')} className="hover:text-white transition-colors text-left cursor-pointer">• Custom Orders</button></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-display font-semibold tracking-widest text-xs uppercase">COMPANY</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-white/60">
              <li><button onClick={() => setPage('about')} className="hover:text-white transition-colors text-left cursor-pointer">• About</button></li>
              <li><button className="hover:text-white transition-colors text-left cursor-pointer">• Careers</button></li>
              <li><button onClick={() => setPage('contact')} className="hover:text-white transition-colors text-left cursor-pointer">• Contact</button></li>
              <li><button onClick={() => setPage('support')} className="hover:text-white transition-colors text-left cursor-pointer">• Support</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-display font-semibold tracking-widest text-xs uppercase">RESOURCES</h4>
            <ul className="flex flex-col gap-4 text-sm font-light text-white/60">
              <li><button className="hover:text-white transition-colors text-left cursor-pointer">• Blog</button></li>
              <li><button className="hover:text-white transition-colors text-left cursor-pointer">• FAQs</button></li>
              <li><button className="hover:text-white transition-colors text-left cursor-pointer">• Shipping</button></li>
              <li><button className="hover:text-white transition-colors text-left cursor-pointer">• Warranty</button></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-display font-semibold tracking-widest text-xs uppercase">NEWSLETTER</h4>
            <p className="text-sm font-light text-white/60 leading-relaxed">
              Stay updated with our latest products and innovations.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 mt-2">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
                required
              />
              <button
                type="submit"
                className="w-full bg-white text-[#111111] font-semibold py-3 rounded-sm hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-white mt-1">
                Thank you for subscribing.
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full h-[1px] bg-white/10 mb-8" />

      {/* Footer Bottom Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-xs text-white/40 font-light">&copy; 2026 PROJECT DELI</span>
        
        <div className="flex gap-8 text-xs text-white/40 font-light">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
          <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
        </div>

        {/* Back to top anchor */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs text-white/40 font-light hover:text-white transition-all group"
        >
          Back to Top <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
export default Footer;
