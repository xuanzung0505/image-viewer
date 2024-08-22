import React, { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

export const DEFAULT_MAX_ZOOM_LEVEL = 2;

function ImageDragger({
  children,
  imageZoomRef,
  maxZoomLevel = DEFAULT_MAX_ZOOM_LEVEL,
  setIsShowFullScreen,
}: {
  children: React.ReactNode;
  imageZoomRef: React.MutableRefObject<null>;
  maxZoomLevel: number | undefined;
  setIsShowFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const middlePoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const [currentPoint, setCurrentPoint] = useState(middlePoint);
  const [initDrag, setInitDrag] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 }); // offset from first drag
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleDragStart = (e) => {
    // get first drag
    setInitDrag({
      x: e.clientX,
      y: e.clientY,
    });
    setCurrentOffset({ x: 0, y: 0 });
    // this remove the preview with a blank img
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };
  const handleDrag = (e) => {
    if (e.clientX + e.clientY > 0) {
      const newCurrentOffset = {
        x: e.clientX - initDrag.x,
        y: e.clientY - initDrag.y,
      };
      if (
        newCurrentOffset.x !== currentOffset.x ||
        newCurrentOffset.y !== currentOffset.y
      ) {
        setCurrentOffset(newCurrentOffset);
        setCurrentPoint((val) => ({
          x:
            newCurrentOffset.x !== currentOffset.x
              ? val.x - currentOffset.x + newCurrentOffset.x
              : val.x,
          y:
            newCurrentOffset.y !== currentOffset.y
              ? val.y - currentOffset.y + newCurrentOffset.y
              : val.y,
        }));
      }
    }
  };

  const handleClickOutsideImageZoom = () => {
    setIsShowFullScreen(false);
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };
  useClickOutside({ ref: imageZoomRef, cb: handleClickOutsideImageZoom });

  // 2 level zoom
  const handleZoom: React.MouseEventHandler = (e) => {
    if (zoomLevel !== maxZoomLevel) setZoomLevel(maxZoomLevel);
    else setZoomLevel(1);
  };

  return (
    <div
      draggable
      ref={imageZoomRef}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      style={{
        display: "flex",
        position: "relative",
        left: `${currentPoint.x - middlePoint.x}px`,
        top: `${currentPoint.y - middlePoint.y}px`,
        cursor: zoomLevel < maxZoomLevel ? "zoom-in" : "zoom-out",
        transform: `scale(${zoomLevel})`,
      }}
      onClick={handleZoom}
    >
      {children}
    </div>
  );
}

export default ImageDragger;
