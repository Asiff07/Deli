import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Package, Quote } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HomeProps {
  setPage: (page: string) => void;
}

const frameCount = 240;
const currentFrame = (index: number) =>
  `/drone_frame_video/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Setup Canvas Frame Scrubbing Animation
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const img = new Image();
    img.src = currentFrame(0);

    const render = () => {
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    };

    img.onload = render;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    window.addEventListener('resize', resize);
    resize();

    // Preload images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const image = new Image();
      image.src = currentFrame(i);
      images.push(image);
    }

    const playhead = { frame: 0 };

    // 2. Pin the section and scrub frames
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=500%", // 500vh scroll duration
        scrub: 1,
        pin: true,
      }
    });

    // Frame sequence animation (0 to 0.95 duration so it stops at 95%)
    tl.to(playhead, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      duration: 0.95,
      onUpdate: () => {
        if (images[playhead.frame]) {
          img.src = images[playhead.frame].src;
          render();
        }
      }
    }, 0);

    // Synchronize Text Animations with exact percentages
    const t1 = document.querySelector('.story-1');
    const t2 = document.querySelector('.story-2');
    const t3 = document.querySelector('.story-3');
    const t4 = document.querySelector('.story-4');
    const t5 = document.querySelector('.story-5');
    const tFinal = document.querySelector('.story-final');
    const overlay = document.querySelector('.story-overlay');

    // 0–20%
    tl.fromTo(t1, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0)
      .to(t1, { opacity: 0, y: -30, duration: 0.05 }, 0.15);

    // 20–40%
    tl.fromTo(t2, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.2)
      .to(t2, { opacity: 0, y: -30, duration: 0.05 }, 0.35);

    // 40–60%
    tl.fromTo(t3, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.4)
      .to(t3, { opacity: 0, y: -30, duration: 0.05 }, 0.55);

    // 60–80%
    tl.fromTo(t4, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.6)
      .to(t4, { opacity: 0, y: -30, duration: 0.05 }, 0.75);

    // 80–95%
    tl.fromTo(t5, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.8)
      .to(t5, { opacity: 0, y: -30, duration: 0.05 }, 0.9);

    // 95-100% Final Frame Content
    tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.95);
    tl.fromTo(tFinal, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.05 }, 0.95);

    // 4. Fade up animations for all other standard sections
    const fadeElements = gsap.utils.toArray('.gsap-fade-up');
    fadeElements.forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      window.removeEventListener('resize', resize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="w-full bg-[#FAFAFA] text-[#111111] font-sans selection:bg-[#0057FF] selection:text-white">

      {/* 1. PINNED STORYTELLING SECTION (Hero + Frames) */}
      <section ref={containerRef} className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden">
        {/* Canvas Background */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

        {/* Dark Overlay for Final Content */}
        <div className="story-overlay absolute inset-0 bg-black/40 backdrop-blur-md z-0 opacity-0 pointer-events-none" />

        {/* Storytelling Text Overlays */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none text-[#111111]">

          {/* 0-20% */}
          <div className="story-1 opacity-0 absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">Engineering Tomorrow.</h2>
            <p className="mt-8 text-2xl text-[#111111] font-light max-w-xl mx-auto">Innovation begins with an idea.</p>
          </div>

          {/* 20-40% */}
          <div className="story-2 opacity-0 absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">Precision Manufacturing</h2>
            <p className="mt-8 text-2xl text-[#111111] font-light max-w-xl mx-auto">Every product begins with an idea.</p>
          </div>

          {/* 40-60% */}
          <div className="story-3 opacity-0 absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">Designed with Purpose</h2>
            <p className="mt-8 text-2xl text-[#111111] font-light max-w-xl mx-auto">Advanced engineering meets creativity.</p>
          </div>

          {/* 60-80% */}
          <div className="story-4 opacity-0 absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">Built for Performance</h2>
            <p className="mt-8 text-2xl text-[#111111] font-light max-w-2xl mx-auto">From drones to custom 3D printed products.</p>
          </div>

          {/* 80-95% */}
          <div className="story-5 opacity-0 absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight">Ready for the Future</h2>
            <p className="mt-8 text-2xl text-[#111111] font-light max-w-xl mx-auto">Explore our collection.</p>
          </div>

          {/* 95-100% Final Content */}
          <div className="story-final opacity-0 absolute inset-0 flex flex-col items-center justify-center pointer-events-auto text-white">
            <span className="text-xs font-semibold tracking-widest uppercase mb-6 text-white/80">PROJECT DELI</span>
            <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight max-w-5xl">Engineering Tomorrow's Innovation</h2>
            <p className="mt-10 text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
              We design and manufacture premium drones,<br />
              drone accessories,<br />
              and custom 3D printed products<br />
              for professionals and creators.
            </p>
            <div className="mt-14 flex flex-col sm:flex-row gap-5">
              <button onClick={() => setPage('shop')} className="px-10 py-5 bg-white text-[#111111] rounded-full text-base font-semibold tracking-wide transition-all hover:scale-105 shadow-2xl">
                Explore Products
              </button>
              <button onClick={() => setPage('contact')} className="px-10 py-5 bg-transparent border border-white/40 hover:border-white text-white rounded-full text-base font-semibold tracking-wide transition-all hover:scale-105">
                Get a Quote
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. PRODUCT CATEGORIES */}
      <section className="w-full py-32 px-6 md:px-16 bg-[#FAFAFA] relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="gsap-fade-up text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[#111111] tracking-tight">Product Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['3D Printed Products', 'Drones', 'Drone Accessories'].map((title, i) => (
              <div key={i} onClick={() => setPage('shop')} className="gsap-fade-up group relative aspect-square bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-700 hover:-translate-y-3 cursor-pointer flex flex-col justify-end overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                <h3 className="text-3xl font-semibold text-[#111111] group-hover:scale-105 transition-transform duration-700 origin-left">{title}</h3>
                <div className="mt-4 flex items-center gap-2 text-[#0057FF] font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                  View Collection <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="w-full py-32 px-6 md:px-16 bg-white relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="gsap-fade-up flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[#111111] tracking-tight">Featured Products</h2>
            <button onClick={() => setPage('shop')} className="flex items-center gap-2 font-medium hover:text-[#0057FF] transition-colors pb-2 border-b-2 border-transparent hover:border-[#0057FF]">
              View Full Store <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Aerodyne Pro Cinematic', desc: '4K stabilized flight system with active object tracking and 45min endurance.', price: '$1,299' },
              { name: 'Nexus Carbon Unibody', desc: 'Ultra-lightweight high-strength CNC carbon fiber frame for racing.', price: '$149' },
              { name: 'Vertex 3D Lamp', desc: 'Bespoke parametric design lamp printed with microscopic precision.', price: '$89' }
            ].map((product, i) => (
              <div key={i} className="gsap-fade-up group cursor-pointer flex flex-col gap-8">
                <div className="w-full aspect-[4/5] bg-[#F7F7F7] rounded-[2.5rem] overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-wide shadow-sm">New</div>
                </div>
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-2xl font-semibold text-[#111111] leading-tight">{product.name}</h3>
                    <span className="font-semibold text-xl text-[#0057FF]">{product.price}</span>
                  </div>
                  <p className="text-gray-500 mt-4 line-clamp-2 leading-relaxed text-lg">{product.desc}</p>
                  <button className="mt-8 w-full py-5 rounded-full border border-gray-200 font-semibold hover:bg-[#111111] hover:text-white hover:border-transparent transition-all duration-300">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MANUFACTURING PROCESS */}
      <section className="w-full py-40 px-6 md:px-16 bg-[#FAFAFA] overflow-hidden relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="gsap-fade-up text-center mb-32">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[#111111] tracking-tight">How It's Made</h2>
            <p className="text-2xl text-gray-500 mt-6 max-w-3xl mx-auto font-light">Our streamlined process ensures maximum quality from concept to delivery.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between relative gap-12 lg:gap-0">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-[40px] left-0 w-full h-[2px] bg-gray-200 -z-10" />

            {['Idea', 'Design', '3D Printing', 'Assembly', 'Quality Check', 'Delivered'].map((step, i) => (
              <div key={i} className="gsap-fade-up relative flex flex-col items-center gap-6 bg-[#FAFAFA] lg:px-4">
                <div className="w-20 h-20 rounded-full bg-white shadow-2xl shadow-black/5 border border-gray-100 flex items-center justify-center text-2xl font-bold text-[#111111] z-10 group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-xl text-[#111111]">{step}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="w-full py-40 px-6 md:px-16 bg-white relative z-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="gsap-fade-up">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-[#111111] leading-[1.1] tracking-tight">
              Engineered for<br />those who demand<br />the best.
            </h2>
            <p className="mt-8 text-2xl text-gray-500 font-light leading-relaxed">
              We utilize state-of-the-art SLS and FDM printing technologies alongside aerospace-grade carbon fiber CNC routing to produce uncompromising hardware.
            </p>
            <div className="mt-12 flex flex-col gap-6">
              {[
                'Micro-precision additive manufacturing',
                'Automated quality assurance pipelines',
                'Aerospace-grade materials',
                'Global priority shipping'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-5">
                  <CheckCircle2 className="text-[#0057FF] w-8 h-8" />
                  <span className="text-xl font-medium text-[#111111]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="gsap-fade-up w-full aspect-square bg-[#F7F7F7] rounded-[4rem] p-10 flex items-center justify-center border border-gray-100 shadow-inner">
            <Package size={160} className="text-gray-200" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="w-full py-40 px-6 md:px-16 bg-[#FAFAFA] relative z-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="gsap-fade-up text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-[#111111] tracking-tight">Trusted by Innovators</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { quote: "The precision of their drone frames is unmatched. We've completely switched our racing fleet to Project Deli.", name: "Alex Chen", role: "FPV Racing Champion" },
              { quote: "Their bespoke 3D printed lamps are architectural masterpieces. They transform any room instantly.", name: "Sarah Jenkins", role: "Interior Designer" },
              { quote: "Rapid prototyping with their SLS machines saved us weeks of development time. Incredibly professional.", name: "David Russo", role: "Hardware Engineer" }
            ].map((test, i) => (
              <div key={i} className="gsap-fade-up bg-white p-12 rounded-[3rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-shadow duration-500">
                <div>
                  <Quote className="text-gray-200 w-12 h-12 mb-8" />
                  <p className="text-xl font-medium leading-relaxed text-[#111111]">"{test.quote}"</p>
                </div>
                <div className="mt-12">
                  <h4 className="font-semibold text-[#111111] text-lg">{test.name}</h4>
                  <p className="text-base text-gray-500">{test.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT CTA */}
      <section className="w-full py-40 px-6 md:px-16 bg-[#FAF9F6] text-[#111111] relative z-20 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[200px] opacity-40 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center gsap-fade-up relative z-10">
          <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[1.1]">Ready to elevate your project?</h2>
          <p className="mt-8 text-2xl text-[#6B7280] font-light max-w-2xl mx-auto leading-relaxed">
            Whether you need a custom drone build or a large-scale manufacturing run, our team is ready to deliver.
          </p>
          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => setPage('contact')} className="px-10 py-5 bg-[#111111] text-white hover:bg-[#333333] rounded-full text-lg font-semibold tracking-wide transition-all hover:scale-105 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
              Get a Quote
            </button>
            <button onClick={() => setPage('shop')} className="px-10 py-5 bg-white border border-[#E5E7EB] hover:border-[#111111] text-[#111111] rounded-full text-lg font-semibold tracking-wide transition-all hover:scale-105 shadow-sm">
              Explore Products
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
