import React, { useEffect, useRef } from 'react';
import { Compass, Cpu, HelpCircle, ArrowRight, Star, ArrowUpRight, Flame, ShieldAlert, Award } from 'lucide-react';
import { gsap } from 'gsap';

interface HomeProps {
  setPage: (page: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Basic GSAP entrance animation for titles and buttons
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
      
      gsap.from('.scale-in', {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  const timelineSteps = [
    {
      num: '01',
      title: 'Parametric CAD Verification',
      desc: 'Users specify mechanical tolerances or lamp shade curves. Our server runs stress analyses checking node structures.',
    },
    {
      num: '02',
      title: 'Robotic Carbon Sintering',
      desc: 'Multi-axis extruders deposit carbon-fiber filament weaves or molten optical resin polymers layer-by-layer.',
    },
    {
      num: '03',
      title: 'Chemical Vapor Finishing',
      desc: 'Completed units are placed in smoothing vapor chambers or sandblasted to achieve matte, gloss, or anodized finishes.',
    },
    {
      num: '04',
      title: 'Optical & Flight Calibration',
      desc: 'Lamps are wired with capacitive OLED boards. Drone plates are weighed and stress-tested on mechanical calibration rigs.',
    },
  ];

  return (
    <div className="w-full bg-[#050505] text-white relative font-sans overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-16 px-6 md:px-16 text-center z-20">
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
          <div className="glass-capsule px-3 py-1 flex items-center gap-1.5 self-center text-[10px] text-neon-cyan tracking-widest font-semibold border-white/5 uppercase">
            <Flame size={12} className="animate-pulse" />
            Next-Gen Additive Synthesis
          </div>

          <h1 className="fade-up display-title text-4xl md:text-7xl font-bold tracking-tight text-white leading-none">
            LIGHTING <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-yellow to-neon-yellow/70 text-glow-yellow font-bold">REDEFINED</span>
            <br />
            <span className="text-white/20 font-light">&</span> DRONES <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-cyan/70 text-glow-cyan font-bold">EVOLVED</span>
          </h1>

          <p className="fade-up text-sm md:text-base text-white/50 leading-relaxed max-w-xl text-center font-sans">
            Lumen x Deli engineers luxury bespoke 3D printed lamps and high-strength CNC carbon-fiber quadcopter frame structures. Made in our automated sintering laboratories.
          </p>

          <div className="fade-up flex flex-wrap justify-center gap-4 mt-2">
            <button
              onClick={() => setPage('shop')}
              className="liquid-glass-yellow px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Compass size={14} className="text-neon-yellow" />
              EXPLORE LAMPS
            </button>
            <button
              onClick={() => setPage('shop')}
              className="liquid-glass-cyan px-8 py-3.5 rounded-full text-xs font-semibold tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Cpu size={14} className="text-neon-cyan" />
              EXPLORE DRONE PARTS
            </button>
          </div>
        </div>
      </section>

      {/* 2. MANUFACTURING TIMELINE */}
      <section ref={timelineRef} className="w-full py-24 px-6 md:px-16 bg-[#080808] border-t border-b border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] text-neon-yellow tracking-widest font-semibold uppercase">Synthesis Pipeline</span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mt-2">HOW WE FORGE ASSETS</h2>
            </div>
            <p className="text-xs text-white/40 max-w-md leading-relaxed">
              Every lamp shell and drone frame arm is processed using state-of-the-art multi-axis extrusion nozzles, resulting in extreme tensile thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {timelineSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="homepage-card p-6 rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full filter blur-2xl pointer-events-none group-hover:bg-neon-yellow/5 transition-all" />
                <span className="font-display font-bold text-3xl text-white/10 group-hover:text-neon-cyan/30 transition-colors">
                  {step.num}
                </span>
                <h3 className="font-display font-semibold text-sm text-white">{step.title}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ENGINEERING PHILOSOPHY & CODE */}
      <section className="w-full py-24 px-6 md:px-16 bg-black relative z-20">
        <div className="max-w-5xl mx-auto homepage-card p-8 md:p-16 rounded-3xl border border-white/5 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-neon-cyan/5 via-transparent to-transparent opacity-60" />
          
          <Award size={36} className="text-neon-cyan animate-pulse" />
          <span className="text-[10px] text-neon-cyan tracking-widest font-semibold uppercase">The Sintering Manifesto</span>
          <h2 className="font-display font-bold text-2xl md:text-4xl text-white tracking-wide max-w-2xl">
            "WE REJECT THE DISPOSABILITY OF MODERN ELECTRONICS."
          </h2>
          <p className="text-xs md:text-sm text-white/50 max-w-3xl leading-relaxed font-sans">
            By fusing aerospace-grade carbon fiber filaments with crystal polymer structures, we engineer products built for performance. Our visual shapes represent fluid curves, mathematical refractors, and structural lattices. We combine rapid manufacturing tolerances with high art.
          </p>
          <button 
            onClick={() => setPage('shop')}
            className="flex items-center gap-2 text-xs text-white hover:text-neon-cyan font-semibold transition-all mt-4 group cursor-pointer"
          >
            Explore Catalog
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 4. CUSTOMER REVIEWS FEED */}
      <section className="w-full py-24 px-6 md:px-16 bg-[#080808] border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <span className="text-[10px] text-neon-yellow tracking-widest font-semibold uppercase">OPERATIONAL REVIEWS</span>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-2 text-white">COMMUNITY PILOTS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Kaelen Miller',
                role: 'FPV Racer',
                rating: 5,
                comment: 'The Aerolite 220mm frame has survived three high-speed concrete collisions without a single arm crack. The titanium arm cores are indestructible.',
              },
              {
                name: 'Elena Rostova',
                role: 'Architectural Designer',
                rating: 5,
                comment: 'Aurora Eclipse shade casting patterns across our concrete office walls is stunning. The organic layer lines catch the light perfectly.',
              },
              {
                name: 'Damon Vance',
                role: 'Custom Client',
                rating: 5,
                comment: 'I uploaded my custom brand SVG logo and mapped it directly to the 3D lamp base. The final print received is absolutely flawless.',
              },
            ].map((review, idx) => (
              <div key={idx} className="homepage-card p-6 rounded-2xl flex flex-col gap-4 border border-white/5 relative">
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-neon-yellow text-neon-yellow" />
                  ))}
                </div>
                <p className="text-xs text-white/60 leading-relaxed italic">"{review.comment}"</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <span className="text-xs font-semibold text-white">{review.name}</span>
                  <span className="text-[10px] text-white/30 font-semibold">{review.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Home;
