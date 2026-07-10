import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'wait' | 'sweep' | 'hold'>('wait');

  useEffect(() => {
    let isMounted = true;

    const runSequence = async () => {
      // 1. Wait a moment on black screen
      await new Promise(r => setTimeout(r, 500));
      if (!isMounted) return;

      // 2. Trigger the sweep
      setPhase('sweep');
      await new Promise(r => setTimeout(r, 1600)); // wait for sweep to finish
      if (!isMounted) return;

      // 3. Hold and let the glow fade slightly
      setPhase('hold');
      await new Promise(r => setTimeout(r, 1200));
      if (!isMounted) return;

      // 4. Slide up curtain
      onComplete();
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  return (
    <motion.div
      key="intro-screen"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      style={{ backgroundColor: 'black' }}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full">

        <AnimatePresence>
          {(phase === 'sweep' || phase === 'hold') && (
            <div className="relative w-max px-4 py-8 flex items-center justify-center">

              {/* Sweeping Light Beam */}
              {phase === 'sweep' && (
                <motion.div
                  initial={{ left: '0%', opacity: 0 }}
                  animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-0 bottom-0 w-[4px] bg-white rounded-full z-20 shadow-[0_0_25px_8px_rgba(255,255,255,1)]"
                />
              )}

              {/* Logo Reveal using Clip-Path */}
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 -20% 0 0)', opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Bloom layer behind the text */}
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: phase === 'hold' ? 0 : 0.5 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute inset-0 bg-white/20 blur-[20px] rounded-full pointer-events-none"
                />

                <div 
                  role="heading" 
                  aria-level={1}
                  className="text-4xl md:text-6xl tracking-[8px] md:tracking-[12px] whitespace-nowrap flex items-center font-black uppercase"
                  style={{ 
                    color: '#ffffff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    textShadow: '0 0 5px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(255,255,255,0.4)'
                  }}
                >
                  PROJECT DELI
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
