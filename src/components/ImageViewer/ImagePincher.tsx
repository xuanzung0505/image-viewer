import React, { useEffect, useRef } from "react";
import PinchZoom from "../PinchZoom/pinch-zoom.min";

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

  useEffect(() => {
    if (pinchZoomRef.current) new PinchZoom(pinchZoomRef.current, {});
  }, []);

  return (
    <div
      className="my_wrapper"
      style={{ width: "100vw", height: "100vh" }}
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
