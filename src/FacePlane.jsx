// FacePlane.jsx
import { useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";
import { useEffect, useState } from "react";

export default function FacePlane({ image, position = [0, 0, 0] }) {
  const texture = useLoader(TextureLoader, image);
  const [scale, setScale] = useState([2.2, 2.6, 1]);

  useEffect(() => {
    if (texture?.image) {
      const { width, height } = texture.image;
      const aspect = width / height;

      // Keep face proportions correct
      const baseHeight = 2.6;
      const baseWidth = baseHeight * aspect;

      setScale([baseWidth, baseHeight, 1]);
    }
  }, [texture]);

  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}