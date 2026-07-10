import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Package, Quote } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { MediaShowcase } from '../components/MediaShowcase';
import { ShopConfidence } from '../components/ShopConfidence';

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

      {/* 4. FEATURED PRODUCTS (Accordion) */}
      <section className="w-full py-16 bg-white relative z-20">
        <FeaturedProducts setPage={setPage} />
      </section>

      {/* 4.5 MEDIA SHOWCASE */}
      <MediaShowcase />

      {/* 5. SHOP WITH CONFIDENCE */}
      <ShopConfidence />


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
