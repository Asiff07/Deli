import React from 'react';
import { Award, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface AboutProps {
  setPage: (page: string) => void;
}

export const About: React.FC<AboutProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#111111] pt-32 pb-24 px-6 md:px-16 flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col gap-12 text-center items-center">
        {/* Header Block */}
        <div className="flex flex-col gap-4 items-center">
          <div className="glass-capsule px-4 py-1 text-[10px] text-[#0057FF] tracking-widest font-semibold uppercase">
            Our Heritage
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-none">
            Bespose Synthesis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0057FF] via-[#FFC857] to-[#0057FF] bg-size-200 animate-pulse-slow">
              Of Luxury Assets
            </span>
          </h1>
          <p className="text-sm md:text-base text-black/50 max-w-2xl leading-relaxed mt-2">
            Project Deli is a luxury technology house founded to bridge the boundary between mechanical physics, high art, and premium manufacturing.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left mt-6">
          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 rounded-2xl flex flex-col gap-4 border border-black/5 relative overflow-hidden group">
            <Cpu className="text-[#0057FF]" size={28} />
            <h3 className="font-display font-semibold text-lg text-[#111111]">Parametric Precision</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              We design every component using rigorous mathematical code. Our drone frames are optimized for aerodynamics and weight distribution, while our lamps utilize mathematical refraction curves.
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 rounded-2xl flex flex-col gap-4 border border-black/5 relative overflow-hidden group">
            <Sparkles className="text-[#FFC857]" size={28} />
            <h3 className="font-display font-semibold text-lg text-[#111111]">Chemical Finishing</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Raw structural layers are sandblasted, chemically smoothed, and anodized to produce matte, liquid-gloss, or anodized finishes that feel premium to the touch.
            </p>
          </div>

          <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 rounded-2xl flex flex-col gap-4 border border-black/5 relative overflow-hidden group">
            <Award className="text-[#0057FF]" size={28} />
            <h3 className="font-display font-semibold text-lg text-[#111111]">Sintering Labs</h3>
            <p className="text-xs text-black/50 leading-relaxed">
              Our products are crafted in small, numbered batches in automated sintering laboratories. We reject modern mass production in favor of digital craftsmanship.
            </p>
          </div>
        </div>

        {/* Brand Manifesto Quote */}
        <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-8 md:p-12 rounded-3xl border border-black/5 relative w-full overflow-hidden mt-6">
          <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-neon-yellow/5 via-transparent to-transparent opacity-65" />
          <h2 className="font-display font-bold text-xl md:text-2xl text-[#111111] tracking-wide italic">
            "A fusion of structural dynamics and optical art."
          </h2>
          <p className="text-xs text-black/40 leading-relaxed max-w-2xl mx-auto mt-4">
            We source our carbon-fiber threads and optics from aerospace certified facilities. Every light board features micro-controller capacitors to ensure uniform OLED voltage distribution and years of atmospheric illumination.
          </p>
        </div>

        {/* Team Showcase */}
        <div className="w-full flex flex-col gap-8 text-left mt-6">
          <div className="text-center md:text-left">
            <span className="text-[10px] text-[#FFC857] tracking-widest font-semibold uppercase">THE FOUNDING TEAM</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-[#111111] mt-1">PEOPLE BEHIND THE SINTERING</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sk Asif Ahmed',
                role: 'Co-Founder & Principal Design Architect',
                desc: 'Architects mathematical spline curves for lamp shades and designs generative CAD structures for multi-axis composite drone frames.',
                initials: 'AA',
                imgUrl: '', // Ready for photo url
              },
              {
                name: 'Kaelen Vance',
                role: 'Co-Founder & Avionics Engineer',
                desc: 'Directs physical stress calibration testing and configures mechanical flight limits for carbon quadcopter frames.',
                initials: 'KV',
                imgUrl: '', // Ready for photo url
              },
              {
                name: 'Elena Rostova',
                role: 'Lead Optical Integrationist',
                desc: 'Engineers capacitive voltage controller boards and custom OLED lighting layouts to optimize structural heat dissipation.',
                initials: 'ER',
                imgUrl: '', // Ready for photo url
              },
            ].map((member, idx) => (
              <div 
                key={idx} 
                className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB] p-6 rounded-2xl flex flex-col gap-4 border border-black/5 relative overflow-hidden"
              >
                {/* Team Avatar (Fallback to initials, ready for image source url) */}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-black/10 bg-black/5 flex items-center justify-center font-display font-bold text-base text-[#0057FF] tracking-wider">
                  {member.imgUrl ? (
                    <img src={member.imgUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    member.initials
                  )}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm text-[#111111]">{member.name}</h3>
                  <span className="text-[10px] text-[#0057FF]/80 font-semibold tracking-wide block mt-0.5">{member.role}</span>
                </div>
                <p className="text-[11px] text-black/50 leading-relaxed mt-1">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Link */}
        <button
          onClick={() => setPage('shop')}
          className="bg-[#111111] text-white hover:bg-[#333333] px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider cursor-pointer"
        >
          Explore the Catalog
        </button>
      </div>
    </div>
  );
};
export default About;
