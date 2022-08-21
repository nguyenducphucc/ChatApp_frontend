import React, { useEffect } from "react";
import "./ImageView.css";

var imageViewStyle = {};
const ImageView = ({ imageToView, setImageToView }) => {
  useEffect(() => {
    const container = document.getElementById("image_view_container");
    container.addEventListener("mouseup", (e) => {
      if (e.path[1] !== container) {
        setImageToView(null);
      }
    });
  }, []);

  if (imageToView === null) {
    imageViewStyle = { display: "none" };
  } else {
    imageViewStyle = {};
  }

  const ImageView = ({ imageToView }) => {
    if (imageToView === null) return null;

    const url = imageToView.url;
    const ratioHeight = (0.8 * window.innerHeight) / imageToView.height;
    const ratioWidth = (0.6 * window.innerWidth) / imageToView.width;
    const ratio = Math.min(ratioHeight, ratioWidth);
    const height = imageToView.height * ratio;
    const width = imageToView.width * ratio;

    return (
      <img
        id="image_view_content"
        style={{ width: `${width}px`, height: `${height}px` }}
        className="image_view_content"
        src={url}
        alt="image_to_view"
      />
    );
  };

  return (
    <div style={imageViewStyle} className="image_view_main">
      <div id="image_view_container" className="image_view_container">
        {<ImageView imageToView={imageToView} />}
      </div>
    </div>
  );
};

export default ImageView;
