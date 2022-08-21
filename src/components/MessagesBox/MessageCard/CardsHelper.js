import React from "react";

export const AvatarCard = ({ imageUrl, handleLookProfile }) => {
  return (
    <img
      className="user_message_avatar"
      src={imageUrl}
      alt="my_avatar"
      onClick={handleLookProfile}
    />
  );
};

export const InfoCard = ({
  handleLookProfile,
  messageTime,
  name,
  role,
  uniqueDeveloperStyle,
}) => {
  return (
    <div className="user_message">
      <p
        style={{ cursor: "pointer" }}
        className="user_message_info"
        onClick={handleLookProfile}
      >
        {name}
      </p>
      <p className="user_message_info">{messageTime}</p>
      {role ? (
        <p style={uniqueDeveloperStyle} className="user_message_info">
          {role}
        </p>
      ) : null}
    </div>
  );
};

export const TextCard = ({ content }) => {
  return <p className="user_message_content">{content}</p>;
};

export const ImageCard = ({
  id,
  width,
  height,
  ratio,
  url,
  setImageToView,
}) => {
  return (
    <div
      key={id}
      style={{
        width: `calc(${width}px * ${ratio})`,
        height: `calc(${height}px * ${ratio})`,
      }}
      className="user_message_image_container"
    >
      {url && (
        <img
          className="user_message_image"
          src={url}
          alt="image_message"
          onClick={() => setImageToView({ url, width, height })}
        />
      )}
    </div>
  );
};

export const ImagesHelper = ({ imageMessages, setImageToView }) => {
  const res = [];

  for (let imageMessage of imageMessages) {
    const imageName = imageMessage.imageName;
    const url = imageMessage.url;
    const height = imageMessage.height;
    const width = imageMessage.width;
    const ratio = Math.min(252 / height, 448 / width);

    res.push(
      <ImageCard
        id={imageName}
        width={width}
        height={height}
        ratio={ratio}
        url={url}
        setImageToView={setImageToView}
      />
    );
  }

  return res;
};
