import { useState } from "react";
import "./ImageZoom.css"; // For styling

const ImageZoom = ({ src, alt }: { src: string; alt: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [initialPosition, setInitialPosition] = useState({ top: 0, left: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setZoomLevel(100);
    setTransformOrigin("center center");
    setPosition({ top: 0, left: 0 });
  };

  const handleZoomToggle = (e) => {
    e.stopPropagation();
    if (zoomLevel < 200) {
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
      setZoomLevel(zoomLevel + 100);
    } else {
      setZoomLevel(100);
      setTransformOrigin("center center");
      setPosition({ top: 0, left: 0 });
    }
  };

  const increaseZoom = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 100);
    }
  };

  const decreaseZoom = () => {
    if (zoomLevel > 100) {
      setZoomLevel(zoomLevel - 100);
    }
  };

  const startDrag = (e) => {
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ top: position.top, left: position.left });
  };

  const duringDrag = (e) => {
    if (dragging) {
      const deltaX = e.clientX - start.x;
      const deltaY = e.clientY - start.y;
      setPosition({
        top: initialPosition.top + deltaY,
        left: initialPosition.left + deltaX,
      });
    }
  };

  const endDrag = () => {
    setDragging(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <img
        src={src}
        alt={alt}
        style={{ cursor: "pointer" }} // Small image
        onClick={openModal}
      />
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img
              src={src}
              alt={alt}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transition: dragging ? "none" : "transform 0.3s ease-in-out",
                transformOrigin: transformOrigin,
                cursor: dragging
                  ? "grabbing"
                  : zoomLevel > 100
                  ? "grab"
                  : "zoom-in",
                position: "relative",
                top: `${position.top}px`,
                left: `${position.left}px`,
              }}
              onClick={handleZoomToggle}
              onMouseDown={startDrag}
              onMouseMove={duringDrag}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
            />
            <div className="zoom-controls">
              <button onClick={decreaseZoom} disabled={zoomLevel === 100}>
                -
              </button>
              <button onClick={increaseZoom} disabled={zoomLevel === 500}>
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
