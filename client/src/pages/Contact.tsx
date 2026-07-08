import React, { useState } from 'react';
import { Send, MapPin, Mail, Key, Instagram, Twitter, Linkedin } from 'lucide-react';

interface ContactProps {
  setPage: (page: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate contact submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
        
        {/* Left Side: Contact Information & Coordinates */}
        <div className="flex flex-col gap-6 text-left justify-center">
          <div className="glass-capsule px-4 py-1 text-[10px] text-neon-cyan tracking-widest font-semibold uppercase self-start">
            Communications Desk
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none">
            Secure Channels <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-yellow">
              Established
            </span>
          </h1>
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-md">
            For inquiries regarding bespoke architectural design volumes, custom flight composite configurations, or secure bulk ordering, reach out using the encrypted communication parameters below.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10">
                <MapPin size={16} className="text-neon-cyan" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Sintering Labs & Head Office</h4>
                <p className="text-[11px] text-white/40">404 Silicon Curve, Building D, Floor 9, San Francisco, CA</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10">
                <Mail size={16} className="text-neon-yellow" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Direct Communications</h4>
                <p className="text-[11px] text-white/40">dispatch@lumendeli.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10">
                <Key size={16} className="text-neon-cyan" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">PGP Fingerprint Signature</h4>
                <p className="text-[10px] text-white/30 font-mono">0x2A3C 4E8F 9021 B7D6 8374 A51D F20C E493</p>
              </div>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6">
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Connect with our channels</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10 hover:border-neon-yellow hover:text-neon-yellow transition-all cursor-pointer text-white/70"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer text-white/70"
                title="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://linkedin.com/company/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/10 hover:border-neon-yellow hover:text-neon-yellow transition-all cursor-pointer text-white/70"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Inquiry Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative flex flex-col gap-6">
          <h3 className="font-display font-semibold text-lg text-white">Send Transmission</h3>
          
          {submitted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
              <span className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan flex items-center justify-center animate-bounce">
                ✓
              </span>
              <h4 className="font-display font-semibold text-sm">Transmission Received</h4>
              <p className="text-[10px] text-white/40">Secure dispatch log generated successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-semibold">Ident/Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Operator Vance" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/3 border border-white/5 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-semibold">Routing Address/Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/3 border border-white/5 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-semibold">Subject Parameter</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-[#0c0c0c] border border-white/5 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Corporate Orders</option>
                  <option>Bespoke CAD Specifications</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/40 uppercase font-semibold">Message Transmission</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Write your transmission parameters..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/3 border border-white/5 rounded-lg py-2.5 px-4 text-xs text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="liquid-glass-cyan py-3 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send size={12} />
                Send Transmission
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
export default Contact;
