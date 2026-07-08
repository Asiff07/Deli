// @ts-nocheck
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree, ReactThreeFiber } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactThreeFiber.IntrinsicElements {}
  }
}


// Procedural Drone Mesh Model
const ProceduralDrone: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const arm1Ref = useRef<THREE.Mesh>(null);
  const arm2Ref = useRef<THREE.Mesh>(null);
  const prop1Ref = useRef<THREE.Group>(null);
  const prop2Ref = useRef<THREE.Group>(null);
  const prop3Ref = useRef<THREE.Group>(null);
  const prop4Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Slow float and pitch oscillation
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 1.5) * 0.05;
      groupRef.current.rotation.z = Math.cos(t * 1.5) * 0.05;
    }
    // High-speed propeller rotation
    const propSpeed = 22;
    if (prop1Ref.current) prop1Ref.current.rotation.y += propSpeed;
    if (prop2Ref.current) prop2Ref.current.rotation.y -= propSpeed;
    if (prop3Ref.current) prop3Ref.current.rotation.y += propSpeed;
    if (prop4Ref.current) prop4Ref.current.rotation.y -= propSpeed;
  });

  return (
    <group ref={groupRef} position={[-2, 0.5, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Central Carbon Fiber Core Pod */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.15, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.9} />
      </mesh>
      {/* Top Protective Glass Core */}
      <mesh castShadow position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} opacity={0.6} transparent roughness={0.1} />
      </mesh>

      {/* Arm 1 (X Frame structure) */}
      <mesh ref={arm1Ref} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.03, 0.08]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} metalness={0.9} />
      </mesh>
      {/* Arm 2 */}
      <mesh ref={arm2Ref} rotation={[0, -Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.5, 0.03, 0.08]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} metalness={0.9} />
      </mesh>

      {/* Motors & Propellers at Arm ends */}
      {[
        { pos: [0.53, 0.06, 0.53], ref: prop1Ref },
        { pos: [-0.53, 0.06, -0.53], ref: prop2Ref },
        { pos: [0.53, 0.06, -0.53], ref: prop3Ref },
        { pos: [-0.53, 0.06, 0.53], ref: prop4Ref },
      ].map((motor, idx) => (
        <group key={idx} position={motor.pos as [number, number, number]}>
          {/* Motor Pod */}
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
            <meshStandardMaterial color="#333333" metalness={1.0} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
            <meshStandardMaterial color="#ffd600" />
          </mesh>
          {/* Propellers */}
          <group ref={motor.ref}>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.42, 0.008, 0.02]} />
              <meshStandardMaterial color="#00e5ff" opacity={0.5} transparent roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.04, 0.012, 0.03]} />
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

// Procedural Glowing Lamp Mesh Model
const ProceduralLamp: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Rotation and float
      groupRef.current.position.y = Math.cos(t * 0.9) * 0.12 - 0.2;
      groupRef.current.rotation.y = -t * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Aluminum Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.25, 32]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.15} metalness={0.9} />
      </mesh>
      
      {/* Brass ring interface */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.06, 32]} />
        <meshStandardMaterial color="#c5a059" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Internal OLED Light Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 16]} />
        <meshStandardMaterial color="#e040fb" emissive="#e040fb" emissiveIntensity={1.8} roughness={0.5} />
      </mesh>

      {/* Organic Glass Diffuser Shade */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.8, 32, 1, true]} />
        <meshStandardMaterial
          color="#e040fb"
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Solid Shade Top Cap */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 32]} />
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} />
      </mesh>

      {/* Emissive glow bulb */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#e040fb" emissive="#e040fb" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
};

// Scene mouse handler to trigger subtle tilt
const InteractiveCamera: React.FC = () => {
  const { camera, mouse } = useThree();
  useFrame(() => {
    // Parallax mouse tilt
    camera.position.x += (mouse.x * 2.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 1.5 + 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

export const Hero3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[450px] md:min-h-[600px] relative select-none">
      {/* Background radial gradients overlays */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-transparent via-[#000]/10 to-[#000]/90 z-10 pointer-events-none" />
      
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 5.5]} fov={50} />
        
        {/* Mouse parallax controller */}
        <InteractiveCamera />

        {/* Cinematic Lighting System */}
        <ambientLight intensity={0.4} />
        
        {/* Cyan accent light hitting left (Drone side) */}
        <pointLight position={[-4, 2, 2]} intensity={2.5} color="#00e5ff" decay={1.5} castShadow />
        
        {/* Magenta accent light hitting right (Lamp side) */}
        <pointLight position={[4, 2, 2]} intensity={2.5} color="#e040fb" decay={1.5} castShadow />
        
        {/* Main studio spotlight */}
        <spotLight 
          position={[0, 5, 2]} 
          intensity={3} 
          angle={Math.PI / 4} 
          penumbra={1} 
          color="#ffffff" 
          castShadow 
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Ground grid helper projection */}
        <gridHelper args={[20, 20, '#111111', '#060606']} position={[0, -1.8, 0]} />

        {/* Ambient atmospheric particles */}
        <Sparkles count={150} scale={7} size={2.5} speed={0.4} color="#00e5ff" opacity={0.6} />
        <Sparkles count={100} scale={7} size={2.0} speed={0.3} color="#e040fb" opacity={0.4} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <ProceduralDrone />
            <ProceduralLamp />
          </Float>
        </Suspense>

        {/* Smooth limit orbit controls */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
export default Hero3D;
