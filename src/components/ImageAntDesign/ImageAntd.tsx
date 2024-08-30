import { Image, Space } from "antd";
import {
  DownloadOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

function ImageAntd({ buttonStyle = { fontSize: "18px" } }) {
  const onDownload = (imgUrl: string) => {
    fetch(imgUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement<"a">("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  return (
    <Image
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      preview={{
        maxScale: 5,
        scaleStep: 2,
        toolbarRender: (
          _,
          {
            image: { url },
            transform: { scale },
            actions: { onZoomOut, onZoomIn, onReset },
          }
        ) => (
          <Space size={24} className="toolbar-wrapper">
            <DownloadOutlined
              onClick={() => onDownload(url)}
              style={buttonStyle}
            />
            <ZoomOutOutlined
              disabled={scale === 1}
              onClick={onZoomOut}
              style={buttonStyle}
            />
            <ZoomInOutlined
              disabled={scale === 50}
              onClick={onZoomIn}
              style={buttonStyle}
            />
            <UndoOutlined onClick={onReset} style={buttonStyle} />
          </Space>
        ),
      }}
    />
  );
}

export default ImageAntd;
