import React from 'react';
import { motion } from 'framer-motion';

interface Product {
  preTitle: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const featuredProducts: Product[] = [
  {
    preTitle: "Walksnail",
    title: "AVATAR HD SYSTEM",
    subtitle: "The ultimate digital FPV experience",
    image: "/images/drone1.jpeg",
    link: "shop"
  },
  {
    preTitle: "GoFilm",
    title: "CINEMATIC DRONE",
    subtitle: "Capture the world in stunning detail",
    image: "/images/drone2.jpeg",
    link: "shop"
  },
  {
    preTitle: "3D Printed",
    title: "CUSTOM LAMP",
    subtitle: "Illuminate your space with style",
    image: "/images/lamp.jpeg",
    link: "shop"
  },
  {
    preTitle: "High Speed RC",
    title: "FPV CAR",
    subtitle: "Experience ground-level thrills",
    image: "/images/car.jpeg",
    link: "shop"
  }
];

const ProductCard = ({ product, setPage }: { product: Product, setPage: (p: string) => void }) => {
  return (
    <div className="group relative w-full h-[500px] md:h-[600px] bg-[#F7F8FA] overflow-hidden flex flex-col items-center justify-start pt-16">
      
      {/* Product Image Background (Full Cover) */}
      <div className="absolute inset-0 z-0">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle gradient overlay to ensure text is readable if image is light/dark */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] group-hover:bg-white/10 transition-colors duration-500" />
      </div>

      {/* Top Center Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <span className="text-[#E66212] text-xs font-semibold tracking-wider mb-2 uppercase drop-shadow-sm">
          {product.preTitle}
        </span>
        <h3 className="text-3xl md:text-5xl font-display font-bold text-[#111111] tracking-tight mb-2 drop-shadow-sm">
          {product.title}
        </h3>
        <p className="text-base md:text-lg text-[#333333] font-medium tracking-wide mb-6 drop-shadow-sm">
          {product.subtitle}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setPage(product.link)}
            className="bg-[#0070F3] hover:bg-[#0057C2] text-white text-sm font-medium py-2 px-6 rounded-full transition-colors shadow-md"
          >
            Buy Now
          </button>
          <button
            onClick={() => setPage(product.link)}
            className="bg-white/80 backdrop-blur-sm border border-gray-400 hover:border-black text-[#111111] text-sm font-medium py-2 px-6 rounded-full transition-colors shadow-sm"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export const FeaturedProducts = ({ setPage }: { setPage: (page: string) => void }) => {
  return (
    <section className="w-full bg-white relative z-20 py-8">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <ProductCard product={product} setPage={setPage} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
