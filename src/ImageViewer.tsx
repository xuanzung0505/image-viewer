import { DragEventHandler, ReactNode, useRef, useState } from "react";
import useClickOutside from "./hooks/useClickOutside";

function ImageViewer({ children }: { children: ReactNode }) {
  const [isShowButton, setIsShowButton] = useState(false);
  const [isShowFullScreen, setIsShowFullScreen] = useState(false);
  const imageZoomRef = useRef(null);

  const handleClickOutsideImageZoom = () => {
    setIsShowFullScreen(false);
    document.getElementsByTagName("body")[0].style.overflow = "auto";
  };
  useClickOutside({ ref: imageZoomRef, cb: handleClickOutsideImageZoom });
  const handleMouseEnterAndLeave = () => {
    setIsShowButton((value) => !value);
  };
  const handleClickZoomButton = () => {
    setIsShowFullScreen(true);
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  };

  return (
    <div id="image-viewer">
      <div
        onMouseEnter={handleMouseEnterAndLeave}
        onMouseLeave={handleMouseEnterAndLeave}
        style={{ position: "relative", width: "fit-content" }}
      >
        {isShowButton && (
          <button
            onClick={handleClickZoomButton}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "white",
            }}
          >
            Zoom
          </button>
        )}
        {children}
      </div>
      {isShowFullScreen && (
        <FullScreenViewer imageZoomRef={imageZoomRef}>
          {children}
        </FullScreenViewer>
      )}
    </div>
  );
}

const FullScreenViewer = ({
  children,
  imageZoomRef,
}: {
  children: ReactNode;
  imageZoomRef: React.MutableRefObject<null>;
}) => {
  const middlePoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const [currentPoint, setCurrentPoint] = useState(middlePoint);
  const [initDrag, setInitDrag] = useState({ x: 0, y: 0 });
  const [currentOffset, setCurrentOffset] = useState({ x: 0, y: 0 }); // offset from first drag

  const handleDragStart: DragEventHandler = (e) => {
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
  const handleDrag: DragEventHandler = (e) => {
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

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "white",
        zIndex: "1",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        ref={imageZoomRef}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        style={{
          display: "flex",
          position: "relative",
          left: `${currentPoint.x - middlePoint.x}px`,
          top: `${currentPoint.y - middlePoint.y}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ImageViewer;
