import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import FacePlane from "./FacePlane";
import HairModel from "./HairModel";

export default function HeadGroup({ faceImage, hairImage, isRotating }) {
  const ref = useRef();

  useFrame(() => {
    if (!isRotating || !ref.current) return;
    ref.current.rotation.x += 0.008;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.z += 0.004;
  });

  return (
    <group ref={ref}>
      <FacePlane image={faceImage} />
      <HairModel image={hairImage} position={[0, 0.12, 0.05]} />
    </group>
  );
}