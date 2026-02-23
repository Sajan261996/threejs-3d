// HeadGroup.jsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import FacePlane from "./FacePlane";
import HairModel from "./HairModel";

export default function HeadGroup({ faceImage, hairImage, isRotating }) {
  const ref = useRef();

  useFrame(() => {
    if (!isRotating || !ref.current) return;
    ref.current.rotation.y += 0.01;
  });

  return (
    <group ref={ref} scale={[1.1, 1.1, 1.1]} position={[0, -0.1, 0]}>
      <FacePlane image={faceImage} position={[0, 0, 0]} />
      <HairModel image={hairImage} position={[0, 0.55, 0.15]} />
    </group>
  );
}