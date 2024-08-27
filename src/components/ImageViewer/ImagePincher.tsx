import React, { useEffect, useRef, useState } from "react";
import PinchZoom from "../PinchZoom/pinch-zoom";

function ImagePincher({
  children,
  imageZoomRef,
  setIsShowFullScreen,
}: {
  children: React.ReactNode;
  imageZoomRef: React.MutableRefObject<null>;
  setIsShowFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pinchZoomRef = useRef(null);
  const pinchZoomInstance = useRef(null);
  const [viewerHeight, setViewerHeight] = useState(0);

  useEffect(() => {
    if (pinchZoomRef.current && !pinchZoomInstance.current) {
      pinchZoomInstance.current = new PinchZoom(pinchZoomRef.current, {
        draggableUnzoomed: false,
      });
      const viewerHeight = pinchZoomRef.current?.getBoundingClientRect().height;
      setViewerHeight(viewerHeight);
    }
  }, []);

  return (
    <div
      className="my_wrapper"
      style={{
        width: "100vw",
        height: viewerHeight > 0 ? viewerHeight : "80vh",
        display: "flex",
        alignItems: "center",
      }}
      ref={imageZoomRef}
    >
      <button
        style={{ position: "absolute", right: 0, top: 0, zIndex: 1 }}
        onClick={() => {
          setIsShowFullScreen(false);
        }}
      >
        x
      </button>
      <div
        className="pinch-zoom"
        style={{
          display: "flex",
          position: "relative",
        }}
        ref={pinchZoomRef}
      >
        {children}
      </div>
    </div>
  );
}

export default ImagePincher;
