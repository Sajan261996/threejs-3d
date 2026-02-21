// CameraCapture.jsx
import { useRef } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const img = canvas.toDataURL("image/png");
    onCapture(img);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline width="200" />
      <br />
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capture}>Capture</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}