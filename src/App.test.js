import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Fix for ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// 1. MOCK THE 3D CANVAS
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }) => <div data-testid="canvas-mock">{children}</div>
}));

// 2. MOCK DREI
jest.mock("@react-three/drei", () => ({
  useTexture: () => ({}),
  Html: ({ children }) => <div>{children}</div>,
  PivotControls: ({ children }) => <div>{children}</div>,
  Stars: () => null,
  Environment: () => null
}));

// 3. MOCK WEBCAM (Using require to avoid scoping errors)
jest.mock("react-webcam", () => {
  const React = require('react'); // Import locally inside the mock factory
  return React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      getScreenshot: () => "mock-image"
    }));
    return <div data-testid="webcam-mock" />;
  });
});

describe("Hair Try-On App", () => {
  test("renders the sidebar and capture button", () => {
    render(<App />);
    const captureBtn = screen.getByText(/CAPTURE PHOTO/i);
    expect(captureBtn).toBeInTheDocument();
  });

  test("can change hair size", () => {
    render(<App />);
    const largeBtn = screen.getByText(/Large/i);
    fireEvent.click(largeBtn);
    expect(largeBtn).toHaveStyle("border: 2px solid #007bff");
  });
});