import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Compass, Cpu, Settings, Shield, HardDrive, Palette, HelpCircle, Save, Info, AlertCircle, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import CustomizerCanvas from '../components/canvas/CustomizerCanvas';

interface CustomizerProps {
  setPage: (page: string) => void;
  addToCartGlobal: (item: any) => void;
}

export const Customizer: React.FC<CustomizerProps> = ({ setPage, addToCartGlobal }) => {
  const { user } = useCartStore();

  // Customizer inputs state
  const [category, setCategory] = useState<'LAMP' | 'DRONE'>('LAMP');
  const [material, setMaterial] = useState('PLA Plastic');
  const [color, setColor] = useState('Frosted White');
  const [finish, setFinish] = useState('Frosted Glass');
  const [lighting, setLighting] = useState('Neon Purple Glow');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Dimensions
  const [dimensions, setDimensions] = useState({
    length: 180, // width in drone, base in lamp
    width: 180,  // length in drone, base in lamp
    height: 320, // height in lamp, arm-plate thickness in drone
  });

  const [price, setPrice] = useState(89);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Synchronize options when category changes
  useEffect(() => {
    if (category === 'LAMP') {
      setMaterial('PLA Plastic');
      setColor('Frosted White');
      setFinish('Frosted Glass');
      setLighting('Neon Purple Glow');
      setDimensions({ length: 180, width: 180, height: 320 });
    } else {
      setMaterial('Carbon Fiber Matte');
      setColor('Carbon Gray');
      setFinish('Matte');
      setLighting('Neon Cyan Glow');
      setDimensions({ length: 220, width: 220, height: 5 });
    }
  }, [category]);

  // Pricing math formula matching the server calculator
  useEffect(() => {
    let basePrice = category === 'LAMP' ? 89 : 120;
    
    let materialMultiplier = 1.0;
    if (material.toLowerCase().includes('carbon')) materialMultiplier = 1.5;
    else if (material.toLowerCase().includes('aluminum')) materialMultiplier = 1.8;
    else if (material.toLowerCase().includes('resin') || material.toLowerCase().includes('glass')) materialMultiplier = 1.3;

    let finishCost = 0;
    if (finish.toLowerCase().includes('anodized') || finish.toLowerCase().includes('metal')) finishCost = 15;
    else if (finish.toLowerCase().includes('gloss')) finishCost = 10;

    let lightCost = lighting && lighting !== 'None' ? 15 : 0;

    // Volume scale
    const volume = dimensions.length * dimensions.width * dimensions.height;
    const volumeMultiplier = Math.max(0.5, Math.min(2.5, volume / 1000000)); // normalized scale

    const calculatedPrice = Math.round((basePrice * materialMultiplier * volumeMultiplier + finishCost + lightCost) * 100) / 100;
    setPrice(calculatedPrice);
  }, [category, material, finish, lighting, dimensions]);

  // Derived options lists
  const materialOptions = category === 'LAMP' 
    ? ['PLA Plastic', 'Sintered Anodized Aluminum', 'Carbon Fiber Matrix', 'Polycarbonate Resin'] 
    : ['Carbon Fiber Matte', 'Carbon Fiber Gloss', 'Titanium Reinforced'];

  const colorOptions = category === 'LAMP'
    ? ['Frosted White', 'Matte Black', 'Liquid Copper', 'Brushed Gold', 'Chrome Silver']
    : ['Carbon Gray', 'Matte Black', 'Pulse Red', 'Neon Green', 'Space Gray'];

  const finishOptions = category === 'LAMP'
    ? ['Frosted Glass', 'Matte Sinter', 'High Gloss Vapor']
    : ['Matte', 'High Gloss Twill', 'Anodized Carbon'];

  const lightingOptions = category === 'LAMP'
    ? ['Neon Purple Glow', 'Neon Cyan Glow', 'White Warm Glow', 'None']
    : ['Neon Cyan Glow', 'Pulse Red Glow', 'Neon Green Glow', 'None'];

  // Map lighting text to color representation
  const getLightingHex = (light: string): string => {
    if (light.includes('Purple')) return '#e040fb';
    if (light.includes('Cyan')) return '#00e5ff';
    if (light.includes('Red') || light.includes('Rose') || light.includes('Pulse')) return '#ff3366';
    if (light.includes('Green')) return '#39ff14';
    if (light.includes('White') || light.includes('Warm')) return '#ffd54f';
    return '#ffffff';
  };

  const handleRequestBuild = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        category,
        material,
        color,
        finish,
        lighting,
        logoUrl,
        dimensions,
      };

      // Save customizer specs to database CustomBuild collection
      const res = await axios.post('/api/v1/products/custom-build', payload);
      
      if (res.data?.data?.customBuild) {
        const build = res.data.data.customBuild;
        
        // Add to Zustand Cart Store
        addToCartGlobal({
          productId: 'custom_build_product_id', // unique flag
          customBuildId: build.id,
          name: `Custom 3D ${category === 'LAMP' ? 'Lamp' : 'Drone Part'}`,
          price: build.price,
          image: category === 'LAMP' 
            ? 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=300' 
            : 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=300',
          specs: `${material} • ${color} • ${finish} • Size: ${dimensions.length}x${dimensions.width}x${dimensions.height}`,
        });

        setMessage('Custom design compiled and added to cart. Ready for manufacturing.');
      }
    } catch (err: any) {
      console.error('Error saving build:', err);
      setError(err.response?.data?.message || 'Error compiling CAD configurations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#050505] min-h-screen text-white pt-24 pb-16 px-6 md:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Left column: 3D interactive viewport canvas */}
        <div className="w-full md:w-2/3 glass-panel rounded-2xl border border-white/5 relative min-h-[400px] md:min-h-[600px] bg-black/40 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setCategory('LAMP')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                category === 'LAMP' ? 'bg-neon-magenta text-white' : 'bg-black/50 text-white/50 border border-white/5'
              }`}
            >
              3D LAMP SCENE
            </button>
            <button
              onClick={() => setCategory('DRONE')}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors cursor-pointer ${
                category === 'DRONE' ? 'bg-neon-cyan text-black' : 'bg-black/50 text-white/50 border border-white/5'
              }`}
            >
              DRONE FRAME SCENE
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10 bg-black/60 border border-white/5 rounded px-2 py-1 text-[9px] text-white/40 flex items-center gap-1.5">
            <Info size={11} /> Real-time CAD Rendering
          </div>

          {/* WebGL Rendering Viewport */}
          <div className="flex-1 w-full h-full relative">
            <CustomizerCanvas
              category={category}
              material={material}
              color={color}
              finish={finish}
              lightingColor={getLightingHex(lighting)}
              dimensions={dimensions}
              logoUrl={logoUrl}
            />
          </div>

          <div className="p-4 bg-black/50 text-[10px] text-white/30 text-center border-t border-white/5">
            Hold click and rotate to inspect multi-axis extrusion lines. Pinch or scroll to verify layer clearances.
          </div>
        </div>

        {/* Right column: Form customizer control panels */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-5 text-xs">
            
            {/* Header info */}
            <div>
              <span className="text-[9px] text-neon-cyan tracking-widest font-semibold uppercase">Bespoke Design Panel</span>
              <h2 className="font-display font-bold text-lg text-white mt-0.5">PARAMETRIC BUILDER</h2>
            </div>

            {error && (
              <div className="p-2.5 bg-neon-rose/5 border border-neon-rose/25 rounded text-[10px] text-neon-rose flex items-center gap-1.5 font-medium">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-2.5 bg-neon-cyan/5 border border-neon-cyan/25 rounded text-[10px] text-neon-cyan flex items-center gap-1.5 font-medium">
                <Save size={14} className="shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Step 1: Material and Finish Options */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                <HardDrive size={12} />
                01. Structural Components
              </span>

              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[10px]">Material Base Filament</label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  {materialOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[10px]">Synthesis Finish Vapor</label>
                <select
                  value={finish}
                  onChange={(e) => setFinish(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  {finishOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Colors and Lighting Options */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                <Palette size={12} />
                02. Aesthetic & Illumination
              </span>

              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[10px]">Base Sinter Color</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  {colorOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/60 text-[10px]">OLED Neon Lighting</label>
                <select
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-2 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  {lightingOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Dimensions Sliders */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase border-b border-white/5 pb-1 flex items-center gap-1">
                <Settings size={12} />
                03. Dimensional Scale Tolerances
              </span>

              {category === 'LAMP' ? (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-white/60">
                      <span>Base Diameter Width</span>
                      <span className="text-neon-cyan font-bold">{dimensions.width}mm</span>
                    </div>
                    <input
                      type="range"
                      min="140"
                      max="240"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: parseInt(e.target.value), length: parseInt(e.target.value) })}
                      className="accent-neon-cyan"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-white/60">
                      <span>Organic Height</span>
                      <span className="text-neon-cyan font-bold">{dimensions.height}mm</span>
                    </div>
                    <input
                      type="range"
                      min="240"
                      max="480"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
                      className="accent-neon-cyan"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-white/60">
                      <span>Arm-to-Arm Diameter Size</span>
                      <span className="text-neon-cyan font-bold">{dimensions.length}mm</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="330"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: parseInt(e.target.value), width: parseInt(e.target.value) })}
                      className="accent-neon-cyan"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] text-white/60">
                      <span>Core Plate Thickness</span>
                      <span className="text-neon-cyan font-bold">{dimensions.height}mm</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: parseInt(e.target.value) })}
                      className="accent-neon-cyan"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Brand Logo Upload Input (Mock) */}
            <div className="flex flex-col gap-1">
              <label className="text-white/60 text-[10px]">Branding Emblem Logo (SVG URL)</label>
              <input
                type="text"
                placeholder="http://domain.com/emblem.svg"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="bg-[#0a0a0a] border border-white/10 rounded px-2.5 py-2 text-white placeholder-white/20 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            {/* Price Calculations and CTA */}
            <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-white/40 block uppercase font-semibold">Estimated Assembly Price</span>
                  <span className="text-lg font-bold text-white">${price.toFixed(2)}</span>
                </div>
                <span className="bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 px-2 py-0.5 rounded text-[8px] font-bold">
                  SLA APPROVED
                </span>
              </div>

              <button
                onClick={handleRequestBuild}
                disabled={loading}
                className="w-full liquid-glass-magenta py-3 rounded-full text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-1"
              >
                <ShoppingCart size={14} />
                {loading ? 'Compiling Build...' : 'REQUEST MANUFACTURING'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
export default Customizer;
