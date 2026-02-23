// HairModel.jsx
import { useRef, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, SRGBColorSpace } from "three";

export default function HairModel({ image, position = [0, 0.55, 0.15] }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(position);
  const [scale, setScale] = useState([2.5, 2.5, 1]);

  const texture = useLoader(TextureLoader, image);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  // 🖱️ Drag to move
  const onPointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
  };

  const onPointerUp = () => setDragging(false);

  const onPointerMove = (e) => {
    if (!dragging) return;
    e.stopPropagation();

    const deltaX = e.movementX * 0.01;
    const deltaY = -e.movementY * 0.01;

    setPos(([x, y, z]) => [x + deltaX, y + deltaY, z]);
  };

  // 🔍 Scroll to scale
  const onWheel = (e) => {
    e.stopPropagation();
    const delta = e.deltaY * -0.001;

    setScale(([sx, sy, sz]) => {
      const next = Math.max(0.6, sx + delta);
      return [next, next, sz];
    });
  };

  return (
    <mesh
      ref={ref}
      position={pos}
      scale={scale}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onWheel={onWheel}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
    </mesh>
  );
}