import React, { useState } from "react";
import { getUploadedFileDimensions } from "../UtilFunctions";

import ImageIcon from "../../../images/image.png";
import AddIcon from "../../../images/addImage.png";
import CloseIcon from "../../../images/close.png";
import Giphy from "../Giphy";
import TextInput from "./TextInput";

const MessageInput = ({
  socket,
  user,
  imageUrl,
  imageMessageUrls,
  setImageMessageUrls,
  imageMessageFiles,
  setImageMessageFiles,
  onlineCount,
  countUnread,
  handleTyping,
  handleUserToggle,
  newMessages,
  setNewMessages,
  setErrorMessage,
}) => {
  const [toggleOpen, setToggleOpen] = useState(true);
  const [messageToSubmit, setMessageToSubmit] = useState("");

  const userInputImageClose = () => {
    imageMessageUrls.forEach((url) => URL.revokeObjectURL(url));
    setImageMessageUrls([]);
    setImageMessageFiles([]);
  };

  const checkImagesMessage = async (target) => {
    var acceptImageFiles = [];
    var acceptImageUrls = [];
    var unacceptCount = 0;

    for (var i = 0; i < target.files.length; i++) {
      const type = target.files[i].type;

      if (
        type === "image/jpeg" ||
        type === "image/png" ||
        type === "image/svg+xml" ||
        type === "image/gif"
      ) {
        const url = URL.createObjectURL(target.files[i]);

        await getUploadedFileDimensions(url)
          .then(({ width, height }) => {
            acceptImageFiles.push({ file: target.files[i], width, height });
            acceptImageUrls.push(url);
          })
          .catch(() =>
            setErrorMessage("Something is wrong in checkImagesMessage function")
          );
      } else unacceptCount++;
    }

    return { acceptImageFiles, acceptImageUrls, unacceptCount };
  };

  const handleImagesMessageChange = ({ target }) => {
    checkImagesMessage(target)
      .then((res) => {
        if (res.unacceptCount !== 0) {
          setErrorMessage(
            `It looks like you put ${res.unacceptCount} wrong files. These files must be images`
          );
        }

        if (res.unacceptCount !== target.files.length) {
          setImageMessageUrls(res.acceptImageUrls);
          setImageMessageFiles(res.acceptImageFiles);
        }
      })
      .catch(() =>
        setErrorMessage("Something happens in handleImagesMessageChange")
      );
  };

  const handleImagesMessageAdd = ({ target }) => {
    checkImagesMessage(target)
      .then((res) => {
        if (res.unacceptCount !== 0) {
          setErrorMessage(
            `It looks like you put ${res.unacceptCount} wrong files. These files must be images`
          );
        }

        if (res.unacceptCount !== target.files.length) {
          setImageMessageUrls(imageMessageUrls.concat(res.acceptImageUrls));
          setImageMessageFiles(imageMessageFiles.concat(res.acceptImageFiles));
        }
      })
      .catch(() =>
        setErrorMessage("Something happens in handleImagesMessageAdd")
      );
  };

  return (
    <div className="main_user_interact">
      <label className="open_user_info">
        <p className="open_user_info_toggle_text">
          {toggleOpen ? "Open" : "Close"}
        </p>
        {imageUrl === null ? null : (
          <img
            className="open_user_info_avatar"
            src={imageUrl}
            alt="open_user_info_avatar"
          />
        )}
        <button
          style={{ display: "none" }}
          onClick={(e) => {
            handleUserToggle(e);
            setTimeout(() => {
              setToggleOpen(!toggleOpen);
            }, 500);
          }}
        />
      </label>

      <TextInput
        socket={socket}
        user={user}
        countUnread={countUnread}
        newMessages={newMessages}
        setNewMessages={setNewMessages}
        messageToSubmit={messageToSubmit}
        setMessageToSubmit={setMessageToSubmit}
        imageMessageUrls={imageMessageUrls}
        setImageMessageUrls={setImageMessageUrls}
        imageMessageFiles={imageMessageFiles}
        setImageMessageFiles={setImageMessageFiles}
        handleTyping={handleTyping}
        setErrorMessage={setErrorMessage}
      />

      {imageMessageUrls.length === 0 ? null : (
        <div className="user_input_image">
          {imageMessageUrls.map((url, index) => (
            <img
              key={index}
              className="image_message"
              src={url}
              alt="test_image"
            />
          ))}
          <label className="add_image_icon_container">
            <img className="add_image_icon" src={AddIcon} alt="add_icon" />
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/gif"
              onChange={handleImagesMessageAdd}
              onClick={({ target }) => {
                target.value = null;
              }}
              multiple
            />
          </label>
          <button
            className="user_input_image_close"
            onClick={userInputImageClose}
          >
            <img
              className="user_input_image_close_icon"
              src={CloseIcon}
              alt="close_icon"
            />
          </button>
        </div>
      )}

      <div className="messages_util">
        <label className="image_icon_container">
          <img className="image_icon" src={ImageIcon} alt="image_icon" />
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/png, image/jpeg, image/svg+xml, image/gif"
            onChange={handleImagesMessageChange}
            onClick={({ target }) => {
              target.value = null;
            }}
            multiple
          />
        </label>

        <Giphy
          socket={socket}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          setErrorMessage={setErrorMessage}
        />
      </div>

      <p className="online_count_text">{onlineCount} online</p>
    </div>
  );
};

export default MessageInput;
