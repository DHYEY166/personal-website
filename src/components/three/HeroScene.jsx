import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingGeometry from './FloatingGeometry';
import ParticleField from './ParticleField';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, -3]} color="#667eea" intensity={1} />
      <pointLight position={[3, -2, 2]} color="#f093fb" intensity={0.6} />

      <FloatingGeometry geometry="icosahedron" position={[-2.5, 1, -1]} color="#667eea" speed={0.6} distort={0.4} size={0.8} />
      <FloatingGeometry geometry="torus" position={[2.8, -0.5, -2]} color="#764ba2" speed={0.8} distort={0.2} size={0.6} />
      <FloatingGeometry geometry="octahedron" position={[-1, -1.5, -1.5]} color="#f093fb" speed={0.5} distort={0.3} size={0.5} />
      <FloatingGeometry geometry="torusKnot" position={[1.5, 1.8, -2.5]} color="#667eea" speed={0.7} distort={0.2} size={0.4} />
      <FloatingGeometry geometry="dodecahedron" position={[0, -2, -1]} color="#764ba2" speed={0.4} distort={0.35} size={0.45} />

      <ParticleField count={300} spread={12} color="#667eea" />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
