import { useRef, useState } from "react";
import ImageDragger, { DEFAULT_MAX_ZOOM_LEVEL } from "./ImageDragger";
import ImagePincher from "./ImagePincher";

function ImageViewer({ children }: { children: React.ReactNode }) {
  const [isShowFullScreen, setIsShowFullScreen] = useState(false);
  const imageZoomRef = useRef(null);

  return (
    <div id="image-viewer">
      <div
        style={{
          position: "relative",
          width: "fit-content",
          cursor: "zoom-in",
        }}
        onClick={() => {
          setIsShowFullScreen(true);
        }}
      >
        {children}
      </div>
      {isShowFullScreen && (
        <FullScreenViewer
          {...{ imageZoomRef, maxZoomLevel: 2, setIsShowFullScreen }}
        >
          {children}
        </FullScreenViewer>
      )}
    </div>
  );
}

const FullScreenViewer = ({
  children,
  imageZoomRef,
  setIsShowFullScreen,
}: {
  children: React.ReactNode;
  imageZoomRef: React.MutableRefObject<null>;
  maxZoomLevel: number;
  setIsShowFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isMobile = false;

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
      {isMobile ? (
        <ImagePincher
          {...{
            children,
            imageZoomRef,
            setIsShowFullScreen,
          }}
        >
          {children}
        </ImagePincher>
      ) : (
        <ImageDragger
          {...{
            setIsShowFullScreen,
            imageZoomRef,
            maxZoomLevel: DEFAULT_MAX_ZOOM_LEVEL,
          }}
        >
          {children}
        </ImageDragger>
      )}
    </div>
  );
};

export default ImageViewer;
