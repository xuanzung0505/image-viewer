import Image from "rc-image";

function ImageRC() {
  return (
    <div>
      <Image
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        preview={{
          maxScale: 5,
          scaleStep: 2,
          toolbarRender: (_, { actions: { onZoomOut, onZoomIn, onReset } }) => (
            <div className="toolbar-wrapper">
              <button onClick={onZoomOut} style={{ fontSize: "18px" }}></button>
              <button onClick={onZoomIn} style={{ fontSize: "18px" }}></button>
              <button onClick={onReset} style={{ fontSize: "18px" }}></button>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default ImageRC;
