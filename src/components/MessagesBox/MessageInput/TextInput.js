import React, { useEffect, useState } from "react";
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
var isTyping = false;
var lastConvoId = "none";
var thisConvoId = "none";

const shorten = (text) => {
  var res = "";

  var indexLeft = 0;
  while (indexLeft < text.length && text[indexLeft] === " ") indexLeft++;

  var indexRight = text.length - 1;
  while (indexRight >= indexLeft && text[indexRight] === " ") indexRight--;

  for (; indexLeft <= indexRight; indexLeft++) res += text[indexLeft];
  return res;
};

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
  setErrorMessage,
  convoIdContainer,
  activeConvoFriendId,
  convoNewMessages,
  convoLastRead,
  setLastReadNotify,
  setIsSocketUpdate,
}) => {
  const [emojiToggle, setEmojiToggle] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState("");

  useEffect(() => {
    lastConvoId = thisConvoId;
    thisConvoId = convoIdContainer[activeConvoFriendId].convoId;

    if (user) {
      isTyping = false;
      setMessageToSubmit("");
      imageMessageUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageMessageUrls([]);
      setImageMessageFiles([]);
      socket.emit("typing", {
        type: "stop",
        id: user.id,
        convoId: lastConvoId,
      });
    }
  }, [activeConvoFriendId]);

  useEffect(() => {
    const isValidate =
      shorten(messageToSubmit) !== "" || imageMessageUrls.length !== 0;
    if (isValidate && !isTyping) {
      isTyping = true;
      socket.emit("typing", {
        type: "typing",
        id: user.id,
        name: user.name,
        convoId: convoIdContainer[activeConvoFriendId].convoId,
      });
    } else if (!isValidate && isTyping) {
      isTyping = false;
      socket.emit("typing", {
        type: "stop",
        id: user.id,
        convoId: convoIdContainer[activeConvoFriendId].convoId,
      });
    }
  }, [messageToSubmit, imageMessageUrls]);

  const shortenMessageToSubmit = shorten(messageToSubmit);
  const submitButton = document.getElementById("user_submit_message");
  if (submitButton)
    submitButton.disabled =
      shortenMessageToSubmit === "" && imageMessageUrls.length === 0;

  var submitButtonStyle = { opacity: "0%" };
  if (shortenMessageToSubmit !== "" || imageMessageUrls.length !== 0) {
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
    const convoId = convoIdContainer[activeConvoFriendId].convoId;

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
          content: shortenMessageToSubmit,
          time: Date.now(),
          imageMessages,
          userId: res.id,
          convoId,
        };

        createMessage(newMessage)
          .then((res) => {
            console.log("res", res);
            res.id = res._id;
            delete res._id;
            delete res.__v;

            convoLastRead[convoId] = res.id;
            setLastReadNotify({ ...convoLastRead });
            setIsSocketUpdate("update");

            setScrollStatement("force");
            setNewMessages(newMessages.concat(res));
            convoNewMessages[convoId].push(res); // after setNewMessages to avoid double message
            socket.emit("message", res);
            socket.emit("typing", {
              type: "stop",
              id: user.id,
              convoId,
            });
          })
          .catch((err) => {
            console.log(err);
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
      <form
        id="user_input_message_container"
        className="user_input_message_container"
        onSubmit={handleSubmit}
      >
        <input
          id="user_input_message"
          className="user_input_message"
          value={messageToSubmit}
          placeholder={inputPlaceholder}
          autoComplete="off"
          onChange={({ target }) => setMessageToSubmit(target.value)}
        />

        <button
          style={submitButtonStyle}
          id="user_submit_message"
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
