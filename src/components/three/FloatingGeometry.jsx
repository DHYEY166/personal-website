import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';

export default function FloatingGeometry({ geometry = 'icosahedron', position = [0, 0, 0], color = '#667eea', speed = 1, distort = 0.3, size = 1 }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * speed;
      meshRef.current.rotation.x = t * 0.3;
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    }
  });

  const geometryMap = {
    icosahedron: <icosahedronGeometry args={[size, 1]} />,
    torus: <torusGeometry args={[size, size * 0.4, 16, 32]} />,
    octahedron: <octahedronGeometry args={[size, 0]} />,
    torusKnot: <torusKnotGeometry args={[size * 0.7, size * 0.25, 64, 16]} />,
    sphere: <sphereGeometry args={[size, 32, 32]} />,
    dodecahedron: <dodecahedronGeometry args={[size, 0]} />,
  };

  return (
    <mesh ref={meshRef} position={position}>
      {geometryMap[geometry] || geometryMap.icosahedron}
      <MeshDistortMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
        distort={distort}
        speed={speed * 2}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}
