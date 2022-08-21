/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { getGif } from "../../../services/giphy.js";
import { getTimezone } from "./TimezoneFunction.js";
import {
  AvatarCard,
  InfoCard,
  TextCard,
  ImageCard,
  ImagesHelper,
} from "./CardsHelper.js";

var messageTime = "";
var isSkip = false;

const MessageCard = ({
  message,
  setImageToView,
  setProfileInfo,
  currentTime,
  lastMessage,
}) => {
  const userId = message.user.id;
  const name = message.user.name;
  const role = message.user.role;
  const imageUrl = message.user.imageUrl;
  const content = message.content;
  const imageMessages = message.imageMessages;
  const gifMessage = message.gifMessage;

  const [gifUrl, setGifUrl] = useState(null);
  useEffect(() => {
    gifMessage &&
      gifMessage.gifId &&
      getGif(gifMessage.gifId).then((res) =>
        setGifUrl(res.images.original.webp)
      );
  }, []);

  // Function for time section
  messageTime = getTimezone(message.time, currentTime);

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

  const handleLookProfile = () => {
    setProfileInfo({ userId, name, imageUrl });
  };

  if (isSkip) {
    return (
      <div className="main_user_message_skipped">
        {content && <TextCard content={content} />}
        {imageMessages && (
          <ImagesHelper
            imageMessages={imageMessages}
            setImageToView={setImageToView}
          />
        )}
        {gifMessage && (
          <ImageCard
            key={gifMessage.gifId}
            width={gifMessage.width}
            height={gifMessage.height}
            ratio={Math.min(252 / gifMessage.height, 448 / gifMessage.width)}
            url={gifUrl}
            setImageToView={setImageToView}
          />
        )}
      </div>
    );
  }

  return (
    <div className="main_user_message">
      <AvatarCard imageUrl={imageUrl} handleLookProfile={handleLookProfile} />
      <div className="user_message_text">
        <InfoCard
          handleLookProfile={handleLookProfile}
          messageTime={messageTime}
          name={name}
          role={role}
          uniqueDeveloperStyle={uniqueDeveloperStyle}
        />
        {content && <TextCard content={content} />}
        {imageMessages && (
          <ImagesHelper
            imageMessages={imageMessages}
            setImageToView={setImageToView}
          />
        )}
        {gifMessage && (
          <ImageCard
            key={gifMessage.gifId}
            width={gifMessage.width}
            height={gifMessage.height}
            ratio={Math.min(252 / gifMessage.height, 448 / gifMessage.width)}
            url={gifUrl}
            setImageToView={setImageToView}
          />
        )}
      </div>
    </div>
  );
};

export default MessageCard;
