import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";

export const DEFAULT_ZOOM_LEVEL = 1;
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
  const [initDrag, setInitDrag] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 }); // offset from first drag
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);
  const [middlePoint, setMiddlePoint] = useState({ x: 0, y: 0 });
  const [currentPoint, setCurrentPoint] = useState(middlePoint);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageDraggerRef = useRef(null);

  const handleDragStart = (e) => {
    if (zoomLevel === DEFAULT_ZOOM_LEVEL) {
      setCurrentPoint(middlePoint);
      setCurrentOffset({ x: 0, y: 0 });
      return;
    }
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
    if (zoomLevel === DEFAULT_ZOOM_LEVEL) return;
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
        // update current point by substract current offset and add new offset
        let newCurrentPoint = {
          x:
            newCurrentOffset.x !== currentOffset.x
              ? currentPoint.x - currentOffset.x + newCurrentOffset.x
              : currentPoint.x,
          y:
            newCurrentOffset.y !== currentOffset.y
              ? currentPoint.y - currentOffset.y + newCurrentOffset.y
              : currentPoint.y,
        };
        // new current point must not be outside of bound
        const xDifferent = Math.abs(newCurrentPoint.x - middlePoint.x);
        const yDifferent = Math.abs(newCurrentPoint.y - middlePoint.y);
        newCurrentPoint = {
          x:
            xDifferent > imageSize.width / 4
              ? currentPoint.x
              : newCurrentPoint.x,
          y:
            yDifferent > imageSize.height / 4
              ? currentPoint.y
              : newCurrentPoint.y,
        };
        setCurrentPoint(newCurrentPoint);
      }
    }
  };
  // 2 level zoom
  const handleZoom = (e) => {
    if (zoomLevel !== maxZoomLevel) {
      setZoomLevel(maxZoomLevel);
    } else {
      setCurrentPoint(middlePoint);
      setCurrentOffset({ x: 0, y: 0 });
      setZoomLevel(DEFAULT_ZOOM_LEVEL);
    }
  };
  const handleClickOutsideImageZoom = () => {
    setIsShowFullScreen(false);
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };

  useClickOutside({ ref: imageZoomRef, cb: handleClickOutsideImageZoom });
  // init middlePoint, currentPoint
  useEffect(() => {
    if (imageDraggerRef.current) {
      const imageDraggerRect = imageDraggerRef.current?.getBoundingClientRect();
      const newMiddlePoint = {
        x: (imageDraggerRect?.bottom - imageDraggerRect?.top) / 2,
        y: (imageDraggerRect?.right - imageDraggerRect?.left) / 2,
      };
      setMiddlePoint(newMiddlePoint);
      setCurrentPoint(newMiddlePoint);
    }
  }, []);

  useEffect(() => {
    const imageZoomRect = imageZoomRef.current?.getBoundingClientRect();
    const currentImageSize = {
      height: imageZoomRect?.bottom - imageZoomRect?.top,
      width: imageZoomRect?.right - imageZoomRect?.left,
    };
    setImageSize(currentImageSize);
  }, [zoomLevel]);

  return (
    <div
      ref={imageDraggerRef}
      className="Image_Dragger"
      style={{
        width: "80vw",
        height: "80vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        draggable
        ref={imageZoomRef}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        style={{
          display: "flex",
          position: "relative",
          left: `${currentPoint.x - middlePoint.x}px`,
          top: `${currentPoint.y - middlePoint.y}px`,
          cursor: zoomLevel < maxZoomLevel ? "zoom-in" : "zoom-out",
          transform: `scale(${zoomLevel})`,
          overflow: "hidden",
        }}
        onClick={handleZoom}
      >
        {children}
      </div>
    </div>
  );
}

export default ImageDragger;
