import React, { useState } from "react";
import { storage } from "../../../services/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { createMessage, verifyToken } from "../../../services/messages";
import { v4 as uuidv4 } from "uuid";
import { setScrollStatement } from "../ScrollFunctions";
import { MemorizedEmoji } from "./Emoji";

import "./Emoji.css";
import SendIcon from "../../../images/send.png";
import Emote from "../../../images/emote.png";

var pickerStyle = { display: "none" };

const TextInput = ({
  socket,
  user,
  countUnread,
  newMessages,
  setNewMessages,
  messageToSubmit,
  setMessageToSubmit,
  imageMessageUrls,
  setImageMessageUrls,
  imageMessageFiles,
  setImageMessageFiles,
  handleTyping,
  setErrorMessage,
}) => {
  const [emojiToggle, setEmojiToggle] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState("");

  var submitButtonStyle = { opacity: "0%" };
  if (messageToSubmit !== "" || imageMessageUrls.length !== 0) {
    submitButtonStyle = { opacity: "60%", zIndex: "2" };
  } else {
    submitButtonStyle = { opacity: "0%", zIndex: "0" };
  }

  var inputPlaceholder;
  if (countUnread === 0) {
    inputPlaceholder = user ? `Welcome ${user.name}` : "Loading...";
  } else if (countUnread === 1) {
    inputPlaceholder = "1 unread message...";
  } else {
    inputPlaceholder = `${countUnread} unread messages...`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    verifyToken()
      .then(async (res) => {
        const imageMessages = [];
        for (var i = 0; i < imageMessageFiles.length; i++) {
          const imageName = uuidv4();
          const width = imageMessageFiles[i].width;
          const height = imageMessageFiles[i].height;
          const file = imageMessageFiles[i].file;
          const imageRef = ref(storage, `ImageMessages/${imageName}`);

          await uploadBytes(imageRef, file)
            .then(async () => {
              await getDownloadURL(imageRef)
                .then((url) =>
                  imageMessages.push({ url, imageName, width, height })
                )
                .catch((error) => setErrorMessage(error.message));
            })
            .catch((error) => setErrorMessage(error.message));
        }

        const newMessage = {
          content: messageToSubmit,
          time: Date.now(),
          imageMessages,
          userId: res.id,
        };

        createMessage(newMessage)
          .then((res) => {
            setScrollStatement("force");
            setNewMessages(newMessages.concat(res));
            socket.emit("message", res);
            socket.emit("typing", { type: "stop", name: user.name });
          })
          .catch((err) => {
            setErrorMessage(err.response.data.error);
          });
      })
      .catch((err) => {
        alert(err.response.data.error);

        if (err.response.data.name === "loginRequired") {
          window.localStorage.removeItem("LoggedChatappUser");
          window.location.href = "/login";
        }
      });

    setImageMessageFiles([]);
    imageMessageUrls.forEach((url) => URL.revokeObjectURL(url));
    setImageMessageUrls([]);
    setMessageToSubmit("");
  };

  if (emojiToggle) {
    pickerStyle = {};
  } else {
    pickerStyle = { display: "none" };
  }

  if (emojiToggle) {
    window.addEventListener("mouseup", function (e) {
      var emojiContainer = document.querySelector(".emoji-picker-react");
      var emojiToggleButton = document.getElementById("emoji_toggle");
      var userInput = document.getElementById("user_input_message");

      if (
        !emojiContainer.contains(e.target) &&
        e.target !== emojiToggleButton
      ) {
        setEmojiToggle(false);
      } else {
        if (userInput !== document.activeElement) {
          userInput.focus();
        }
      }
    });
  }

  if (chosenEmoji !== "") {
    var cursorPos = document.activeElement.selectionStart;
    var newMessageToSubmit =
      messageToSubmit.substr(0, cursorPos) +
      chosenEmoji.emoji +
      messageToSubmit.substr(cursorPos);
    setMessageToSubmit(newMessageToSubmit);
    setChosenEmoji("");
    setTimeout(() => {
      document.activeElement.setSelectionRange(
        cursorPos + chosenEmoji.emoji.length,
        cursorPos + chosenEmoji.emoji.length
      );
    });
  }

  return (
    <>
      <form className="user_input_message_container" onSubmit={handleSubmit}>
        <input
          id="user_input_message"
          className="user_input_message"
          value={messageToSubmit}
          placeholder={inputPlaceholder}
          autoComplete="off"
          onChange={({ target }) => {
            setMessageToSubmit(target.value);
            handleTyping(target.value);
          }}
        />

        <button
          style={submitButtonStyle}
          disabled={messageToSubmit === "" && imageMessageUrls === 0}
          className="user_submit_message"
          type="submit"
        >
          <img className="send_icon" src={SendIcon} alt="image_icon" />
        </button>

        <img
          id="emoji_toggle"
          className="emote_toggle"
          src={Emote}
          alt="emote"
          onClick={() => setEmojiToggle(!emojiToggle)}
        />
        <MemorizedEmoji
          setChosenEmoji={setChosenEmoji}
          pickerStyle={pickerStyle}
        />
      </form>
    </>
  );
};

export default TextInput;
