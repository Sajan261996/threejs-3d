import { useTexture } from "@react-three/drei";

export default function FacePlane({ image }) {
  const texture = useTexture(image);

  return (
    <mesh>
      <cylinderGeometry
        args={[1, 1, 2.2, 32, 1, true, Math.PI * 0.85, Math.PI * 0.6]}
      />
      <meshStandardMaterial map={texture} side={2} />
    </mesh>
  );
}