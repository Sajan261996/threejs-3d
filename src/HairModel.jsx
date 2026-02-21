import { useTexture } from "@react-three/drei";

export default function HairModel({ image, position = [0, 0, 0] }) {
  const texture = useTexture(image);

  return (
    <mesh position={position}>
      {/* Curved surface instead of flat card */}
      <cylinderGeometry
        args={[1.05, 1.05, 2.2, 32, 1, true, Math.PI * 0.85, Math.PI * 0.6]}
      />
      <meshStandardMaterial
        map={texture}
        transparent
        side={2}
        roughness={0.8}
      />
    </mesh>
  );
}