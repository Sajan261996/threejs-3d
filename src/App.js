import React, { useRef, useState, useCallback, Suspense, useMemo } from "react";
import Webcam from "react-webcam";
import { Canvas } from "@react-three/fiber";
import {
  useTexture,
  Html,
  PivotControls,
  Stars,
  Environment
} from "@react-three/drei";
import * as THREE from "three";

/* -------------------- SCENE COMPONENT -------------------- */

function Scene({ photoUrl, hairScale }) {
  const placeholder =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  // useMemo prevents texture reload flicker when scaling
  const faceSource = useMemo(() => photoUrl || placeholder, [photoUrl]);

  // Load Textures
  const faceTex = useTexture(faceSource);
  // Ensure this path is correct in your public/assets folder
  const hairTex = useTexture("/assets/hair1.jpg"); 

  return (
    <group>
      {/* BACKGROUND EFFECTS */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />

      {/* STATIC PHOTO PLANE (The Face) */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial map={faceTex} />
      </mesh>

      {/* TRANSFORMABLE HAIR OVERLAY */}
      {/* PivotControls allow the user to manually nudge the hair into place */}
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        scale={0.8}
        lineWidth={3}
        fixed
      >
        <mesh position={[0, 0, 0.2]} scale={[hairScale, hairScale, 1]}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial
            map={hairTex}
            transparent
            alphaTest={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </PivotControls>

      <Environment preset="city" />
    </group>
  );
}

/* -------------------- MAIN APP -------------------- */

export default function App() {
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [hairScale, setHairScale] = useState(1);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) setPhoto(imageSrc);
  }, [webcamRef]);

  return (
    <div style={containerStyle}>
      {/* SIDEBAR CONTROLS */}
      <div style={sidebarStyle}>
        <div style={glassCard}>
          <div style={webcamBorder}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={220}
              mirrored
              audio={false}
            />
          </div>
          <button onClick={capture} style={captureBtn}>
            📸 CAPTURE PHOTO
          </button>
        </div>

        {/* SIZE PRESETS */}
        <div style={glassCard}>
          <p style={title}>Choose Size</p>
          <div style={buttonRow}>
            {[0.7, 1, 1.4].map((size, index) => {
              const labels = ["Small", "Med", "Large"];
              return (
                <button
                  key={size}
                  onClick={() => setHairScale(size)}
                  style={{
                    ...sizeBtn,
                    border: hairScale === size ? "2px solid #007bff" : "1px solid #444",
                    color: hairScale === size ? "#fff" : "#ccc"
                  }}
                >
                  {labels[index]}
                </button>
              );
            })}
          </div>
        </div>

        <div style={glassCard}>
          <p style={title}>Fine-Tune</p>
          <p style={{ color: "#888", fontSize: "11px" }}>
            Use the 3D axis handles on the screen to move, rotate, or scale the hair overlay.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={resetBtn}
        >
          Reset All
        </button>
      </div>

      {/* 3D VIEWPORT */}
      <div style={{ flex: 1, position: "relative" }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <color attach="background" args={["#020205"]} />
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} />

          <Suspense
            fallback={
              <Html center>
                <div style={{ color: "white", fontFamily: "sans-serif" }}>LOADING…</div>
              </Html>
            }
          >
            <Scene photoUrl={photo} hairScale={hairScale} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const containerStyle = {
  width: "100vw",
  height: "100vh",
  background: "#000",
  display: "flex",
  overflow: "hidden",
  fontFamily: "sans-serif"
};

const sidebarStyle = {
  width: "280px",
  background: "rgba(5,5,10,0.95)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  borderRight: "1px solid #222",
  zIndex: 10
};

const glassCard = {
  background: "rgba(255,255,255,0.05)",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)"
};

const webcamBorder = {
  borderRadius: "10px",
  overflow: "hidden",
  border: "1px solid #333",
  marginBottom: "12px",
  lineHeight: 0
};

const captureBtn = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(45deg,#007bff,#00c6ff)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

const title = {
  color: "#fff",
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "14px"
};

const buttonRow = {
  display: "flex",
  gap: "8px",
  justifyContent: "center"
};

const sizeBtn = {
  flex: 1,
  padding: "8px 0",
  background: "#222",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  transition: "0.2s"
};

const resetBtn = {
  marginTop: "auto",
  background: "transparent",
  color: "#666",
  border: "1px solid #222",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer"
};