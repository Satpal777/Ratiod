import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function DemoVideoModal({ isOpen, onClose }) {
  const videoRef = useRef(null);

  const closeDemo = useCallback(() => {
    videoRef.current?.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeDemo();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeDemo]);

  if (!isOpen) return null;

  return createPortal(
    <div className="demo-modal" role="dialog" aria-modal="true" aria-label="Product demo video">
      <button className="demo-modal-backdrop" type="button" aria-label="Close demo" onClick={closeDemo} />

      <div className="demo-player-card">
        <div className="demo-player-topbar">
          <span className="panel-kicker">Product demo</span>
          <button className="demo-icon-button" type="button" aria-label="Close demo" onClick={closeDemo}>
            <span aria-hidden="true">❌</span>
          </button>
        </div>

        <div className="demo-video-frame">
          <video
            ref={videoRef}
            className="demo-video-element"
            src="/demo.mp4"
            autoPlay
            controls
            playsInline
          >
            Your browser does not support the demo video.
          </video>
        </div>
      </div>
    </div>,
    document.body,
  );
}
