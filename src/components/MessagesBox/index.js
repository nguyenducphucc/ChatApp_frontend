import "./index.css";
import React, { useState, useEffect } from "react";
import { getSomeMessages } from "../../services/messages";
import { getUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import TypingStatusCard from "./TypingStatusCard";
import MessageInput from "./MessageInput";
import MessagesUI from "./MessagesUI";
import ImageUpload from "./ImageUpload";
import ImageView from "./ImageView";
import {
  getScrollStatement,
  setScrollStatement,
  autoScroll,
  forceScroll,
  instantScroll,
} from "./ScrollFunctions";
import { getToken } from "../../services/messages";

var isTyping = false;
var messages_style = { left: "0%" };
var id;

var socket = io.connect("/messages");
socket.emit("online");

const MessagesBox = ({ user, setUser, setErrorMessage }) => {
  const [onlineCount, setOnlineCount] = useState(0);
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [countUnread, setCountUnread] = useState(0);
  const [usersTyping, setUsersTyping] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessageFiles, setImageMessageFiles] = useState([]);
  const [imageMessageUrls, setImageMessageUrls] = useState([]);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [imageToView, setImageToView] = useState(null);
  const navigate = useNavigate();

  socket.on("clientsCount", (data) => {
    if (data === "on") {
      setOnlineCount(onlineCount + 1);
    } else if (data === "off") {
      setOnlineCount(onlineCount - 1);
    } else {
      setOnlineCount(onlineCount + data);
    }
  });

  socket.on("message", (data) => {
    setScrollStatement("auto");
    setNewMessages([...newMessages, data]);
  });

  socket.on("typing", (data) => {
    if (data.type === "typing") {
      setUsersTyping(usersTyping.concat(data.name));
    } else if (data.type === "stop") {
      const newUsersTyping = usersTyping.filter((user) => user !== data.name);
      setUsersTyping(newUsersTyping);
    }
  });

  useEffect(() => {
    if (user) {
      id = user.id;
    } else {
      const loggedUserJSON = window.localStorage.getItem("LoggedChatappUser");
      const curUser = JSON.parse(loggedUserJSON);
      setUser(curUser);
      getToken(curUser.id);
      id = curUser.id;
    }

    getSomeMessages()
      .then((res) => {
        setOldMessages(res);
      })
      .catch(() =>
        setErrorMessage(">>> It looks like we can't get messages from database")
      );
  }, []);

  useEffect(() => {
    getUser(id)
      .then((res) => {
        setImageUrl(res.imageUrl);
      })
      .catch(() => {
        setErrorMessage("It looks like we can not get user. Login is required");
        window.localStorage.removeItem("LoggedChatappUser");
        navigate("/login");
      });
  }, [imageUrl]);

  useEffect(() => {
    if (getScrollStatement() === "instant") {
      setTimeout(() => {
        instantScroll(setCountUnread);
      }, 800);
    } else if (getScrollStatement() === "force") {
      setTimeout(() => {
        forceScroll(setCountUnread);
      }, 300);
    } else {
      setTimeout(() => {
        if (getScrollStatement() === "auto")
          autoScroll(countUnread, setCountUnread);
      }, 300);
    }
  }, [newMessages]);

  const handleTyping = (value) => {
    if (value !== "" && !isTyping) {
      isTyping = true;
      socket.emit("typing", { type: "typing", name: user.name });
    } else if (value === "" && isTyping) {
      isTyping = false;
      socket.emit("typing", { type: "stop", name: user.name });
    }
  };

  const handleUserToggle = () => {
    if (openUserInfo) {
      messages_style = { left: "0%" };
    } else {
      messages_style = { left: "325px" };
    }
    setOpenUserInfo(!openUserInfo);
  };
  return (
    <div>
      <ImageView imageToView={imageToView} setImageToView={setImageToView} />
      <ImageUpload
        socket={socket}
        user={user}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        setOpenUserInfo={setOpenUserInfo}
        setErrorMessage={setErrorMessage}
      />
      <div style={messages_style} className="messages_container">
        <MessagesUI
          oldMessages={oldMessages}
          setOldMessages={setOldMessages}
          newMessages={newMessages}
          setImageToView={setImageToView}
        />
        <TypingStatusCard usersTyping={usersTyping} />
        <MessageInput
          socket={socket}
          user={user}
          imageUrl={imageUrl}
          imageMessageUrls={imageMessageUrls}
          setImageMessageUrls={setImageMessageUrls}
          imageMessageFiles={imageMessageFiles}
          setImageMessageFiles={setImageMessageFiles}
          onlineCount={onlineCount}
          countUnread={countUnread}
          handleTyping={handleTyping}
          handleUserToggle={handleUserToggle}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};

export default MessagesBox;
