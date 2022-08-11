import "./index.css";
import React, { useState, useEffect } from "react";
// import { getSomeMessages } from "../../services/messages";
import { getUser } from "../../services/users";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import TypingStatusCard from "./TypingStatusCard";
import MessageInput from "./MessageInput";
import MessagesUI from "./MessagesUI";
import ImageUpload from "./ImageUpload";
import ImageView from "./ImageView";
import UserProfile from "./UserProfile";
import MenuComponents from "./MenuComponents";
import {
  getScrollStatement,
  setScrollStatement,
  autoScroll,
  forceScroll,
  // instantScroll,
} from "./ScrollFunctions";
import { getToken } from "../../services/messages";

var isTyping = false;
var messages_style = { left: "0%" };
var id = null;

var socket = io.connect();

const MessagesBox = ({ user, setUser, setErrorMessage }) => {
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [countUnread, setCountUnread] = useState(0);
  const [usersTyping, setUsersTyping] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessageFiles, setImageMessageFiles] = useState([]);
  const [imageMessageUrls, setImageMessageUrls] = useState([]);
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [imageToView, setImageToView] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [choice, setChoice] = useState(null);
  const [friends, setFriends] = useState({});
  const [onlineFriends, setOnlineFriends] = useState({});

  const navigate = useNavigate();

  socket.on("newConnection", () => {
    if (id !== null) socket.emit("initRoom", id);
  });

  socket.on("message", (data) => {
    setScrollStatement("auto");
    setNewMessages([...newMessages, data]);
  });

  socket.on("typing", (data) => {
    if (data.id !== undefined) {
      const type = data.type;
      const name = data.name;
      const id = data.id;

      if (type === "typing") {
        setUsersTyping(usersTyping.concat({ id, name }));
      } else if (type === "stop") {
        const newUsersTyping = usersTyping.filter((user) => user.id !== id);
        setUsersTyping(newUsersTyping);
      }
    }
  });

  socket.on("friendRelationship", (data) => {
    const newFriends = friends;

    if (data.type === "create") {
      newFriends[data.requester.id] = {
        recipient: data.requester,
        status: data.status,
        time: data.time,
      };
    }

    if (data.type === "update_status") {
      if (data.time !== undefined) {
        newFriends[data.requesterId] = {
          ...newFriends[data.requesterId],
          status: data.status,
          time: data.time,
        };
      } else {
        newFriends[data.requesterId] = {
          ...newFriends[data.requesterId],
          status: data.status,
        };
      }
    }

    if (data.type === "delete") {
      delete newFriends[data.requesterId];
    }

    setFriends({ ...newFriends });
  });

  socket.on("friendOnlineNotify", (data) => {
    const requesterId = data.requesterId;
    const newOnlineFriends = onlineFriends;

    newOnlineFriends[requesterId] = 1;
    setOnlineFriends({ ...newOnlineFriends });
  });

  socket.on("friendOnlineReturn", (onlineFriendList) => {
    setOnlineFriends({
      ...onlineFriends,
      ...onlineFriendList,
    });
  });

  socket.on("offlineNotify", (data) => {
    const userId = data.userId;
    const lastOnline = data.lastOnline;

    if (friends[userId] !== undefined) {
      const newFriends = friends;
      newFriends[userId].recipient.lastOnline = lastOnline;
      setFriends({ ...newFriends });

      const newOnlineFriends = onlineFriends;
      delete newOnlineFriends[userId];
      setOnlineFriends({ ...newOnlineFriends });
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

    document.getElementById("load_next_button").click();

    // getSomeMessages()
    //   .then((res) => {
    //     if (res !== null) {
    //       setOldMessages(res);
    //     }
    //   })
    //   .catch(() =>
    //     setErrorMessage(">>> It looks like we can't get messages from database")
    //   );
  }, []);

  useEffect(() => {
    getUser(id)
      .then((res) => {
        setImageUrl(res.imageUrl);

        const relationshipList = {};
        const friendList = {};
        res.friends.map((friend) => {
          relationshipList[friend.recipient.id] = friend;

          if (friend.status === 3) {
            friendList[friend.recipient.id] = 1;
          }
        });
        setFriends(relationshipList);

        if (Object.keys(friendList).length > 0) {
          socket.emit("initFriendOnline", friendList);
        }
      })
      .catch(() => {
        setErrorMessage("It looks like we can not get user. Login is required");
        window.localStorage.removeItem("LoggedChatappUser");
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    if (getScrollStatement() === "instant") {
      // setTimeout(() => {
      //   instantScroll(setCountUnread);
      // }, 600);
    } else if (getScrollStatement() === "force") {
      setTimeout(() => {
        forceScroll(setCountUnread);
      }, 200);
    } else {
      setTimeout(() => {
        if (getScrollStatement() === "auto")
          autoScroll(countUnread, setCountUnread);
      }, 200);
    }
  }, [newMessages]);

  const handleTyping = (value) => {
    if (value !== "" && !isTyping) {
      isTyping = true;
      socket.emit("typing", { type: "typing", id: user.id, name: user.name });
    } else if (value === "" && isTyping) {
      isTyping = false;
      socket.emit("typing", { type: "stop", id: user.id, name: user.name });
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
      <UserProfile
        socket={socket}
        user={user}
        userImageUrl={imageUrl}
        profileInfo={profileInfo}
        setProfileInfo={setProfileInfo}
        friends={friends}
        setFriends={setFriends}
      />
      <ImageUpload
        socket={socket}
        user={user}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        setOpenUserInfo={setOpenUserInfo}
        choice={choice}
        setChoice={setChoice}
        setErrorMessage={setErrorMessage}
      />
      <MenuComponents
        socket={socket}
        user={user}
        choice={choice}
        setChoice={setChoice}
        friends={friends}
        setFriends={setFriends}
        onlineFriends={onlineFriends}
      />
      <div style={messages_style} className="messages_container">
        <MessagesUI
          oldMessages={oldMessages}
          setOldMessages={setOldMessages}
          newMessages={newMessages}
          setImageToView={setImageToView}
          setProfileInfo={setProfileInfo}
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
