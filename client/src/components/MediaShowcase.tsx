import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ShowcaseItem {
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  link: string;
}

// We use 4 items to match the user's request for "4 boxes"
const showcaseItems: ShowcaseItem[] = [
  {
    title: "Aerial Photography",
    subtitle: "Professional Drone Footage",
    image: "/images/drone1.jpeg", 
    link: "/gallery/drone-1"
  },
  {
    title: "FPV Experience",
    subtitle: "Immersive Flight",
    image: "/images/drone2.jpeg",
    link: "/gallery/fpv"
  },
  {
    title: "3D Printing",
    subtitle: "Custom Lamp Designs",
    image: "/images/lamp.jpeg",
    link: "/gallery/lamp"
  },
  {
    title: "RC Technology",
    subtitle: "Bluetooth Smart Car",
    image: "/images/car.jpeg",
    link: "/gallery/car"
  }
];

export const MediaShowcase = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  return (
    <section className="w-full py-16 bg-white relative z-20">
      <div className="max-w-[1920px] mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-display font-semibold text-[#111111] tracking-tight mb-8">
          Experience Innovation
        </h2>

        <div className="w-full overflow-hidden rounded-[24px]">
          <div className="flex flex-col md:flex-row h-[600px] md:h-[700px] w-full bg-[#F8F9FA]">
            {showcaseItems.map((product, index) => {
              const isHovered = hoveredIndex === index;
              // On desktop, the hovered item expands (flex: 2.5), others shrink (flex: 0.8).
              // Since one is always hovered, we don't need a null fallback.
              const flexValue = isHovered ? 2.5 : 0.8;

              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  animate={{ flex: flexValue }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                  className="relative overflow-hidden cursor-pointer flex-1 md:flex-none group h-full border-r border-white/20 last:border-r-0"
                >
                  {/* Background Image / Video */}
                  <div className="absolute inset-0 z-0 bg-[#E8EBED]">
                    <img
                      src={product.image}
                      alt={product.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered && product.video ? 'opacity-0' : 'opacity-100'}`}
                    />
                    {product.video && (
                      <video
                        src={product.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                      />
                    )}
                    {/* Subtle dark overlay to make text readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
                  </div>

                  {/* Content at Bottom Center/Left */}
                  <div className="z-20 absolute bottom-10 left-0 right-0 px-8 flex flex-col justify-end text-left transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg mb-1">
                      {product.title}
                    </h3>
                    <p className="text-white/90 text-sm md:text-base font-medium drop-shadow-md">
                      {product.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
