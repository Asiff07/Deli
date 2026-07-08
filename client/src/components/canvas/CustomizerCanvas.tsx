// @ts-nocheck
import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, ReactThreeFiber } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiber.IntrinsicElements {}
  }
}


interface CustomizerCanvasProps {
  category: 'LAMP' | 'DRONE';
  material: string;
  color: string;
  finish: string;
  lightingColor?: string;
  dimensions: { length: number; width: number; height: number };
  logoUrl?: string;
}

// Map color text to hex codes
const colorMap: Record<string, string> = {
  'matte black': '#111111',
  'jet black': '#080808',
  'frosted white': '#f0f0f0',
  'liquid copper': '#b87333',
  'aesthetic copper': '#cc7722',
  'chrome silver': '#c0c0c0',
  'space gray': '#4e5054',
  'brushed gold': '#ffd700',
  'carbon gray': '#242526',
  'carbon gloss': '#18191a',
  'cyan blue': '#00e5ff',
  'pulse red': '#ff3366',
  'neon red': '#ff0033',
  'neon green': '#39ff14',
};

const getColorHex = (name: string): string => {
  const norm = name.toLowerCase().trim();
  if (colorMap[norm]) return colorMap[norm];
  if (norm.startsWith('#')) return name;
  return '#666666'; // fallback
};

// 3D Custom Lamp Component
const CustomizerLamp: React.FC<Omit<CustomizerCanvasProps, 'category'>> = ({
  material,
  color,
  finish,
  lightingColor = '#e040fb',
  dimensions,
}) => {
  const lampRef = useRef<THREE.Group>(null);
  
  // Calculate dimensional scaling factors (relative to defaults: 180w x 320h)
  const widthScale = dimensions.width / 180;
  const heightScale = dimensions.height / 320;

  // Derive material qualities
  const isMetal = material.includes('Aluminum') || material.includes('Brass') || material.includes('Copper');
  const isResin = material.includes('Resin');
  const metalness = isMetal ? 0.95 : 0.05;
  const roughness = finish.includes('Gloss') ? 0.05 : finish.includes('Matte') ? 0.8 : 0.3;
  const hexColor = getColorHex(color);

  return (
    <group ref={lampRef} position={[0, -0.6, 0]}>
      {/* Dynamic Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5 * widthScale, 0.55 * widthScale, 0.25, 32]} />
        <meshStandardMaterial
          color={hexColor}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>

      {/* Dynamic Shaft Stem */}
      <mesh position={[0, 0.5 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8 * heightScale, 16]} />
        <meshStandardMaterial
          color={lightingColor}
          emissive={lightingColor}
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Outer Shade Cover */}
      <mesh position={[0, 0.65 * heightScale, 0]} castShadow>
        <cylinderGeometry args={[0.32 * widthScale, 0.42 * widthScale, 0.9 * heightScale, 32, 1, true]} />
        <meshStandardMaterial
          color={hexColor}
          metalness={metalness}
          roughness={roughness}
          transparent={finish.includes('Glass') || isResin}
          opacity={finish.includes('Glass') || isResin ? 0.45 : 1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing OLED Center Bulb */}
      <mesh position={[0, 0.8 * heightScale, 0]}>
        <sphereGeometry args={[0.12 * widthScale, 16, 16]} />
        <meshStandardMaterial
          color={lightingColor}
          emissive={lightingColor}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Dynamic Light Casting helper */}
      <pointLight position={[0, 0.8 * heightScale, 0]} color={lightingColor} intensity={2.0} decay={1.5} distance={5} />
    </group>
  );
};

// 3D Custom Drone Frame Component
const CustomizerDrone: React.FC<Omit<CustomizerCanvasProps, 'category'>> = ({
  material,
  color,
  finish,
  lightingColor = '#00e5ff',
  dimensions,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const prop1Ref = useRef<THREE.Mesh>(null);
  const prop2Ref = useRef<THREE.Mesh>(null);
  const prop3Ref = useRef<THREE.Mesh>(null);
  const prop4Ref = useRef<THREE.Mesh>(null);

  // Scaling arm diameters (default: 220mm frame arm lengths)
  const sizeScale = dimensions.length / 220;
  const thicknessScale = dimensions.height / 5;

  const hexColor = getColorHex(color);
  const isCarbon = material.toLowerCase().includes('carbon');
  const metalness = isCarbon ? 0.8 : 0.95;
  const roughness = isCarbon ? 0.6 : 0.2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.05;
    }
    const propSpeed = 0.15;
    if (prop1Ref.current) prop1Ref.current.rotation.y += propSpeed;
    if (prop2Ref.current) prop2Ref.current.rotation.y -= propSpeed;
    if (prop3Ref.current) prop3Ref.current.rotation.y += propSpeed;
    if (prop4Ref.current) prop4Ref.current.rotation.y -= propSpeed;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Core Electronics Pod */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.15 * thicknessScale, 8]} />
        <meshStandardMaterial color={hexColor} roughness={roughness} metalness={metalness} />
      </mesh>
      
      {/* Glow Center Canopy */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={lightingColor} emissive={lightingColor} emissiveIntensity={1.0} opacity={0.7} transparent />
      </mesh>

      {/* Frame Arms */}
      <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.6 * sizeScale, 0.04 * thicknessScale, 0.08]} />
        <meshStandardMaterial color={isCarbon ? '#1c1d1e' : hexColor} roughness={isCarbon ? 0.7 : roughness} metalness={metalness} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.6 * sizeScale, 0.04 * thicknessScale, 0.08]} />
        <meshStandardMaterial color={isCarbon ? '#1c1d1e' : hexColor} roughness={isCarbon ? 0.7 : roughness} metalness={metalness} />
      </mesh>

      {/* Propellers */}
      {[
        { pos: [0.57 * sizeScale, 0.06 * thicknessScale, 0.57 * sizeScale], ref: prop1Ref },
        { pos: [-0.57 * sizeScale, 0.06 * thicknessScale, -0.57 * sizeScale], ref: prop2Ref },
        { pos: [0.57 * sizeScale, 0.06 * thicknessScale, -0.57 * sizeScale], ref: prop3Ref },
        { pos: [-0.57 * sizeScale, 0.06 * thicknessScale, 0.57 * sizeScale], ref: prop4Ref },
      ].map((motor, idx) => (
        <group key={idx} position={motor.pos as [number, number, number]}>
          {/* Motor Pod */}
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.09 * thicknessScale, 12]} />
            <meshStandardMaterial color="#444" metalness={1.0} />
          </mesh>
          {/* Propeller Blades */}
          <mesh ref={motor.ref as any} position={[0, 0.06 * thicknessScale, 0]} castShadow>
            <boxGeometry args={[0.45 * sizeScale, 0.01, 0.02]} />
            <meshStandardMaterial color={lightingColor} opacity={0.65} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const CustomizerCanvas: React.FC<CustomizerCanvasProps> = (props) => {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[500px] relative select-none">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 4.0]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={2.0} color="#ffffff" castShadow />
        <pointLight position={[-3, 1, 2]} intensity={1.0} color={props.lightingColor || '#ffffff'} />
        
        {/* Studio spotlight */}
        <spotLight 
          position={[0, 4, 1]} 
          intensity={2.5} 
          angle={Math.PI / 6} 
          penumbra={1} 
          castShadow 
        />

        {/* Ambient Grid Floor */}
        <gridHelper args={[10, 10, '#222222', '#111111']} position={[0, -1.0, 0]} />

        <Suspense fallback={null}>
          {props.category === 'LAMP' ? (
            <CustomizerLamp {...props} />
          ) : (
            <CustomizerDrone {...props} />
          )}
        </Suspense>

        {/* Interactive Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={Math.PI / 4}
          maxDistance={6}
          minDistance={2.5}
        />
      </Canvas>
    </div>
  );
};
export default CustomizerCanvas;
