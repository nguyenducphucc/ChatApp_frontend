/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { getGif } from "../../services/giphy";

var messageTime = "";
var isSkip = false;

const MessageCard = ({ message, setImageToView, currentTime, lastMessage }) => {
  const name = message.user.name;
  const role = message.user.role;
  const imageUrl = message.user.imageUrl;
  const content = message.content;
  const imageMessages = message.imageMessages;
  const gifId = message.gifId;
  const gifMessage = message.gifMessage
    ? message.gifMessage
    : { gifId: message.gifId, width: 500, height: 500 };

  const [gifUrl, setGifUrl] = useState(null);
  useEffect(() => {
    gifMessage.gifId &&
      getGif(gifMessage.gifId).then((res) =>
        setGifUrl(res.images.original.webp)
      );
  }, []);

  // Function for time section
  const time = new Date(message.time);
  const localDayEndTime =
    currentTime +
    ((86400000 - (currentTime % 86400000) + time.getTimezoneOffset() * 60000) %
      86400000);

  const timediff = Math.abs(localDayEndTime - time.getTime());
  if (timediff < 172800000) {
    messageTime = `${
      timediff < 86400000 ? "Today" : "Yesterday"
    } at ${time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    messageTime = time.toLocaleTimeString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Function to skip info on message
  isSkip =
    lastMessage !== null &&
    lastMessage.user.name === name &&
    Math.abs(message.time - lastMessage.time) < 180000;

  // Style for developer role
  const uniqueDeveloperStyle =
    role === "Developer"
      ? {
          color: "white",
          backgroundImage:
            "radial-gradient( circle 939px at 94.7% 50%,  rgba(0,178,169,1) 0%, rgba(0,106,101,1) 76.9% )",
        }
      : {};

  if (isSkip) {
    return (
      <div style={{ margin: "0px 0px 0px 85px", width: "80%" }}>
        {content && <p className="user_message_content">{content}</p>}
        {imageMessages &&
          imageMessages.map((imageMessage) => (
            <div
              key={imageMessage.imageName}
              style={{
                width: "500px",
                height: `calc(${imageMessage.height} * 500 / ${imageMessage.width})`,
              }}
              className="user_message_image_container"
            >
              <img
                className="user_message_image"
                src={imageMessage.url}
                alt="image_message"
                onClick={() => setImageToView(imageMessage.url)}
              />
            </div>
          ))}
        {gifUrl && (
          <div
            key={gifMessage.gifId}
            style={{
              width: "500px",
              height: `calc(${gifMessage.height}px * 500 / ${gifMessage.width})`,
            }}
            className="user_message_image_container"
          >
            <img
              key={gifId}
              className="user_message_image"
              src={gifUrl}
              alt="gif_message"
              onClick={() => setImageToView(gifUrl)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="main_user_message">
      <img className="user_message_avatar" src={imageUrl} alt="my_avatar" />
      <div className="user_message_text">
        <div className="user_message">
          <p className="user_message_info">{name}</p>
          <p className="user_message_info">{messageTime}</p>
          {role ? (
            <p style={uniqueDeveloperStyle} className="user_message_info">
              {role}
            </p>
          ) : null}
        </div>
        {content && <p className="user_message_content">{content}</p>}
        {imageMessages &&
          imageMessages.map((imageMessage) => (
            <div
              key={imageMessage.imageName}
              style={{
                width: "500px",
                height: `calc(${imageMessage.height}px * 500 / ${imageMessage.width})`,
              }}
              className="user_message_image_container"
            >
              <img
                className="user_message_image"
                src={imageMessage.url}
                alt="image_message"
                onClick={() => setImageToView(imageMessage.url)}
              />
            </div>
          ))}
        {gifUrl && (
          <div
            key={gifMessage.gifId}
            style={{
              width: "500px",
              height: `calc(${gifMessage.height}px * 500 / ${gifMessage.width})`,
            }}
            className="user_message_image_container"
          >
            <img
              className="user_message_image"
              src={gifUrl}
              alt="gif_message"
              onClick={() => setImageToView(gifUrl)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
