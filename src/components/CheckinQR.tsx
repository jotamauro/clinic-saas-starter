"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function CheckinQR({ token }: { token: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, `${window.location.origin}/checkin/${token}`);
    }
  }, [token]);
  return <canvas ref={canvasRef} className="h-40 w-40" />;
}
