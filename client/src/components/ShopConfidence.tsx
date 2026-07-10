import React from 'react';
import { Package, HelpCircle, Gift, ShieldCheck, PenTool, Smile } from 'lucide-react';

const features = [
  {
    title: "FAST, FREE DELIVERY",
    desc: "Free shipping orders over $299",
    icon: <Package size={24} className="text-[#FFB800]" />,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false
  },
  {
    title: "BANNER", // special case
    colSpan: "col-span-2",
    rowSpan: "row-span-1",
    hasImage: true
  },
  {
    title: "LIFETIME CUSTOMER",
    desc: "Our experts are here to help",
    icon: <HelpCircle size={24} className="text-[#FFB800]" />,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false
  },
  {
    title: "CADDX REWARDS",
    desc: "Buy more, save more, and earn more",
    icon: <Gift size={24} className="text-[#FFB800]" />,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false
  },
  {
    title: "PAY WITH EASE",
    desc: "Pay securely with credit card or PayPal",
    icon: <ShieldCheck size={24} className="text-[#FFB800]" />,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false
  },
  {
    title: "1 YEAR HASSLE-FREE WARRANTY",
    desc: "Effortlessly protect your valuable purchases",
    icon: <PenTool size={24} className="text-[#FFB800]" />,
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false
  },
  {
    title: "EASY AFTER SALES SERVICE",
    desc: "Easy returns, quality guaranteed",
    icon: <Smile size={24} className="text-[#FFB800]" />, // Could be an image instead
    colSpan: "col-span-1",
    rowSpan: "row-span-1",
    hasImage: false,
    personImage: true
  }
];

export const ShopConfidence = () => {
  return (
    <section className="w-full py-20 bg-[#F8F9FA] relative z-20">
      <div className="w-full max-w-[1920px] mx-auto px-6 md:px-16">
        <h2 className="text-3xl md:text-4xl font-display font-semibold text-[#111111] tracking-tight mb-10">
          Shop With Confidence At Project Deli
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px]">
          {/* Box 1: Fast Delivery */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">FAST, FREE DELIVERY</h3>
              <p className="text-gray-800 text-sm font-medium">Free shipping orders over $299</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Package size={24} className="text-[#FFB800]" />
              </div>
            </div>
          </div>

          {/* Box 2: Banner (Spans 2 columns) */}
          <div className="col-span-1 md:col-span-2 bg-[#2a303c] rounded-2xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow flex items-center justify-center flex-col">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src="/images/drone1.jpeg" 
              alt="Brand Banner" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="relative z-20 text-center px-6">
              <h3 className="text-white font-bold text-4xl italic tracking-wider mb-2">PROJECT DELI</h3>
              <p className="text-white/90 text-sm font-medium tracking-wide">Technology Innovator and Ecosystem Builder</p>
            </div>
          </div>

          {/* Box 3: Lifetime Customer */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">LIFETIME CUSTOMER</h3>
              <p className="text-gray-800 text-sm font-medium">Our experts are here to help</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <HelpCircle size={24} className="text-[#FFB800]" />
              </div>
            </div>
          </div>

          {/* Box 4: Rewards */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">DELI REWARDS</h3>
              <p className="text-gray-800 text-sm font-medium">Buy more, save more, and earn more</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <Gift size={24} className="text-[#FFB800]" />
              </div>
            </div>
          </div>

          {/* Box 5: Pay with ease */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">PAY WITH EASE</h3>
              <p className="text-gray-800 text-sm font-medium">Pay securely with credit card or PayPal</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <ShieldCheck size={24} className="text-[#FFB800]" />
              </div>
            </div>
          </div>

          {/* Box 6: Warranty */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">1 YEAR HASSLE-FREE WARRANTY</h3>
              <p className="text-gray-800 text-sm font-medium">Effortlessly protect your valuable purchases</p>
            </div>
            <div className="flex justify-end">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                <PenTool size={24} className="text-[#FFB800]" />
              </div>
            </div>
          </div>

          {/* Box 7: After sales service */}
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-[#FFB800] font-bold text-sm tracking-wide mb-2">EASY AFTER SALES SERVICE</h3>
              <p className="text-gray-800 text-sm font-medium">Easy returns, quality guaranteed</p>
            </div>
            {/* We simulate the person image in bottom right */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-100 rounded-tl-full flex items-center justify-center">
              <Smile size={48} className="text-gray-300 ml-4 mt-4" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
