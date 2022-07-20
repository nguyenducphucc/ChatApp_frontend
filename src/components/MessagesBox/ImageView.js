import React from "react";
import "./ImageView.css";

const ImageView = ({ imageToView, setImageToView }) => {
  if (imageToView === null) return null;

  return (
    <div className="image_view_main">
      <div
        className="image_view_container"
        onClick={() => setImageToView(null)}
      >
        <img
          className="image_view_content"
          src={imageToView}
          alt="image_to_view"
        />
      </div>
    </div>
  );
};

export default ImageView;
