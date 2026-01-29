import React, { useRef, useState, useCallback, Suspense } from "react";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

// 1. The 3D Avatar Component
function HairstyleAvatar({ photoUrl, styleType }) {
  // Safe fallback if no photo is taken
  const fallbackFace = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  
  // Load Textures (Ensure hair1.jpg, etc., are in public/assets/)
  const faceTex = useTexture(photoUrl || fallbackFace);
  const hairStyles = {
    short: "/assets/hair1.jpg",
    medium: "/assets/hair2.jpg",
    long: "/assets/hair3.jpg"
  };
  const hairTex = useTexture(hairStyles[styleType] || hairStyles.short);

  // Dynamic scaling for "Long" hair
  const hairScale = styleType === "long" ? [1.1, 1.6, 1.1] : [1, 1, 1];
  const hairPos = styleType === "long" ? [0, -0.3, 0] : [0, 0.3, 0];

  return (
    <group>
      {/* THE FACE: Your captured photo */}
      <mesh position={[0, 0, 0.55]}>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial map={faceTex} side={THREE.DoubleSide} transparent={true} key={photoUrl} />
      </mesh>

      {/* THE HAIR: The 3D style */}
      <mesh position={hairPos} scale={hairScale}>
        <sphereGeometry args={[1.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial map={hairTex} side={THREE.DoubleSide} transparent alphaTest={0.5} />
      </mesh>

      {/* THE SKULL: Solid base */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial color="#080808" />
      </mesh>
    </group>
  );
}

// 2. The Main App
export default function App() {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [style, setStyle] = useState("short");

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
    }
  }, [webcamRef]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", overflow: "hidden" }}>
      {/* UI Overlay */}
      <div style={{ position: "absolute", zIndex: 10, top: 20, left: 20, background: "rgba(0,0,0,0.85)", padding: 15, borderRadius: 12, border: "1px solid #333" }}>
        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={180} mirrored style={{ borderRadius: 8 }} />
        <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={capture} style={{ padding: 10, cursor: "pointer", fontWeight: "bold" }}>📸 Click to Apply Face</button>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
            <button onClick={() => setStyle("short")} style={styleBtn(style === "short")}>Short</button>
            <button onClick={() => setStyle("medium")} style={styleBtn(style === "medium")}>Med</button>
            <button onClick={() => setStyle("long")} style={styleBtn(style === "long")}>Long</button>
          </div>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 50] }}>
        <ambientLight intensity={1.5} />
        <Suspense fallback={<Html center><div style={{color: "white"}}>Loading...</div></Html>}>
          <HairstyleAvatar photoUrl={photo} styleType={style} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

const styleBtn = (active) => ({ padding: "20px", background: active ? "#fff" : "#333", color: active ? "#000" : "#fff", border: "none", borderRadius: 50, cursor: "pointer", fontSize: "11px" });