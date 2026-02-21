import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CameraCapture from "./CameraCapture";
import HeadGroup from "./HeadGroup";
import hair from "./images/hair.png";
import { removeBackgroundApi } from "./removeBg";

export default function App() {
  const [photo, setPhoto] = useState(null);
  const [cleanPhoto, setCleanPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleCapture = async (img) => {
    setPhoto(img);                 // ✅ now used
    setLoading(true);
    try {
      const noBg = await removeBackgroundApi(img);
      setCleanPhoto(noBg);
    } catch {
      setCleanPhoto(img);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div>
        <CameraCapture onCapture={handleCapture} />

        {photo && <img src={photo} width={160} alt="Preview" />} {/* ✅ photo used */}

        <br />
        <button onClick={() => setIsRotating((p) => !p)}>
          {isRotating ? "Stop Rotation" : "Start Rotation"}
        </button>

        {loading && <p>Removing background...</p>}
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} />
        {cleanPhoto && (
          <HeadGroup
            faceImage={cleanPhoto}
            hairImage={hair}
            isRotating={isRotating}
          />
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}