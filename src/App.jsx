import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CameraCapture from "./CameraCapture";
import HeadGroup from "./HeadGroup";
import hair from "./images/hair.png"; // transparent hair png

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [isRotating, setIsRotating] = useState(false);

  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <div>
        <CameraCapture onCapture={setPhoto} />

        {photo && <img src={photo} width={200} alt="Captured" />}

        <br />

        <button onClick={() => setIsRotating((p) => !p)}>
          {isRotating ? "Stop Rotation" : "Start Rotation"}
        </button>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} style={{ width: 420, height: 420 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {photo && (
          <HeadGroup
            faceImage={photo}
            hairImage={hair}
            isRotating={isRotating}
          />
        )}

        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  );
}