import { useState } from "react";

function ImageViewer() {
  const [isShowButton, setIsShowButton] = useState(false);
  const handleMouseEnterAndLeave = () => {
    setIsShowButton((value) => !value);
  };
  const handleClickZoomButton = () => {};
  return (
    <div>
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
        <img src="https://i.pinimg.com/564x/1f/bc/df/1fbcdf26cffe1f066edb2e4efed54d4a.jpg" />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          background: "white",
          zIndex: "1",
        }}
      >
        hehe
      </div>
    </div>
  );
}

export default ImageViewer;
