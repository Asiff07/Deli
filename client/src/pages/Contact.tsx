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
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#111111] pt-32 pb-24 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
        
        {/* Left Side: Contact Information & Coordinates */}
        <div className="flex flex-col gap-6 text-left justify-center">
          <div className="glass-capsule px-4 py-1 text-[10px] text-[#0057FF] tracking-widest font-semibold uppercase self-start">
            Communications Desk
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-none">
            Secure Channels <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0057FF] to-neon-yellow">
              Established
            </span>
          </h1>
          <p className="text-xs md:text-sm text-black/50 leading-relaxed max-w-md">
            For inquiries regarding bespoke architectural design volumes, custom flight composite configurations, or secure bulk ordering, reach out using the encrypted communication parameters below.
          </p>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10">
                <MapPin size={16} className="text-[#0057FF]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#111111]">Sintering Labs & Head Office</h4>
                <p className="text-[11px] text-black/40">404 Silicon Curve, Building D, Floor 9, San Francisco, CA</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10">
                <Mail size={16} className="text-[#FFC857]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#111111]">Direct Communications</h4>
                <p className="text-[11px] text-black/40">dispatch@lumendeli.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10">
                <Key size={16} className="text-[#0057FF]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[#111111]">PGP Fingerprint Signature</h4>
                <p className="text-[10px] text-black/30 font-mono">0x2A3C 4E8F 9021 B7D6 8374 A51D F20C E493</p>
              </div>
            </div>
          </div>

          {/* Social Media Channels */}
          <div className="flex flex-col gap-3 mt-6 border-t border-black/5 pt-6">
            <h4 className="text-xs font-semibold text-black/50 uppercase tracking-widest">Connect with our channels</h4>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10 hover:border-[#FFC857] hover:text-[#FFC857] transition-all cursor-pointer text-black/70"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://twitter.com/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10 hover:border-[#0057FF] hover:text-[#0057FF] transition-all cursor-pointer text-black/70"
                title="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://linkedin.com/company/lumenxdeli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex items-center justify-center border border-black/10 hover:border-[#FFC857] hover:text-[#FFC857] transition-all cursor-pointer text-black/70"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Inquiry Form */}
        <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 rounded-3xl border border-black/5 relative flex flex-col gap-6">
          <h3 className="font-display font-semibold text-lg text-[#111111]">Send Transmission</h3>
          
          {submitted ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12">
              <span className="w-10 h-10 rounded-full bg-[#0057FF]/20 border border-[#0057FF]/50 text-[#0057FF] flex items-center justify-center animate-bounce">
                ✓
              </span>
              <h4 className="font-display font-semibold text-sm">Transmission Received</h4>
              <p className="text-[10px] text-black/40">Secure dispatch log generated successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-black/40 uppercase font-semibold">Ident/Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Operator Vance" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/3 border border-black/5 rounded-lg py-2.5 px-4 text-xs text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-black/40 uppercase font-semibold">Routing Address/Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@domain.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/3 border border-black/5 rounded-lg py-2.5 px-4 text-xs text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-black/40 uppercase font-semibold">Subject Parameter</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-white border border-black/5 rounded-lg py-2.5 px-4 text-xs text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors"
                >
                  <option>General Inquiry</option>
                  <option>Corporate Orders</option>
                  <option>Bespoke CAD Specifications</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-black/40 uppercase font-semibold">Message Transmission</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Write your transmission parameters..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="bg-white/3 border border-black/5 rounded-lg py-2.5 px-4 text-xs text-[#111111] focus:outline-none focus:border-[#0057FF] transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                className="bg-[#111111] text-white hover:bg-[#333333] py-3 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
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
