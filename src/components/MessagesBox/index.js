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

var messages_style = { left: "0%" };
var id = null;
var convoLastRead = { none: "" }; // { ConvoId: StringId }

var convoIdContainer = {
  none: {
    convoId: "none",
    name: "Fest Group",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/fest-d765b.appspot.com/o/avatar%2Ffavicon.png?alt=media&token=9b54fb70-886d-400d-b8a1-c71fe3341b7a",
  },
}; // { FriendId: { convoId, name, imageUrl } }
var convoOldMessages = { none: [] }; // { ConvoId: Message[] }
var convoNewMessages = { none: [] }; // { ConvoId: Message[] }
var messageQueue = [];
var typingUsersState = [];
var friendsState = {};
var onlineFriendsState = {};

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
  const [activeConvoFriendId, setActiveConvoFriendId] = useState("none");
  const [lastReadNotify, setLastReadNotify] = useState({});
  const [isSocketUpdate, setIsSocketUpdate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setInterval(() => {
      console.log("---------------------------");
      console.log("lastRead", convoLastRead);
      console.log("friend", friendsState);
      console.log("onlineFriend", onlineFriendsState);
      console.log("convoOldMessages", convoOldMessages);
      console.log("convoNewMessages", convoNewMessages);
      console.log("convoIdContainer", convoIdContainer);
    }, 5000);

    socket.on("newConnection", () => {
      if (id !== null) socket.emit("initRoom", id);
    });

    socket.on("message", (data) => {
      setScrollStatement("auto");
      messageQueue.push(data);
      setIsSocketUpdate("msg");
    });

    socket.on("typing", (data) => {
      if (data.id !== undefined) {
        const type = data.type;
        const name = data.name;
        const id = data.id;
        const convoId = data.convoId;

        if (type === "typing") {
          typingUsersState.push({ id, name, convoId });
        } else if (type === "stop") {
          typingUsersState = typingUsersState.filter(
            (user) => user.id !== id || user.convoId !== convoId
          );
        }

        setIsSocketUpdate("typing");
      }
    });

    socket.on("friendRelationship", (data) => {
      if (data.type === "create") {
        friendsState[data.requester.id] = {
          recipient: data.requester,
          status: data.status,
          time: data.time,
        };
      }

      if (data.type === "update_status") {
        if (data.time !== undefined) {
          friendsState[data.requesterId] = {
            ...friendsState[data.requesterId],
            status: data.status,
            time: data.time,
          };
        } else {
          friendsState[data.requesterId] = {
            ...friendsState[data.requesterId],
            status: data.status,
          };
        }
      }

      if (data.type === "delete") {
        delete friendsState[data.requesterId];
      }

      setIsSocketUpdate("friend");
    });

    socket.on("friendOnlineNotify", (data) => {
      const requesterId = data.requesterId;
      onlineFriendsState[requesterId] = 1;
      console.log(data);

      setIsSocketUpdate("online");
    });

    socket.on("friendOnlineReturn", (onlineFriendList) => {
      onlineFriendsState = { ...onlineFriends, ...onlineFriendList };
      setIsSocketUpdate("online");
    });

    socket.on("newConvoNotify", (data) => {
      console.log("someone create convos", data);
      convoOldMessages[data.convoId] = [];
      convoNewMessages[data.convoId] = [];
      convoIdContainer[data.requesterId] = {
        convoId: data.convoId,
        name: data.requesterName,
        imageUrl: data.requesterImageUrl,
      };
    });

    socket.on("offlineNotify", (data) => {
      const userId = data.userId;
      const lastOnline = data.lastOnline;

      if (friendsState[userId] !== undefined) {
        friendsState[userId].recipient.lastOnline = lastOnline;
        delete onlineFriendsState[userId];
        console.log("after", onlineFriendsState);

        setIsSocketUpdate("online");
      }
    });
  }, []);

  useEffect(() => {
    if (isSocketUpdate === "msg") {
      while (messageQueue.length) {
        const msg = messageQueue.shift();
        console.log(msg);

        const convoId = msg.convo || "none";

        if (convoId === convoIdContainer[activeConvoFriendId].convoId) {
          const messagesUI = document.getElementById("auto-scroll");
          const scrHei = messagesUI.scrollHeight;
          const cliHei = messagesUI.clientHeight;
          const scrTop = messagesUI.scrollTop;

          if (scrHei - cliHei - scrTop <= 5) {
            convoLastRead[convoId] = msg.id;
            socket.emit("update", convoLastRead);
            setLastReadNotify(msg.id);
          }
          setNewMessages([...newMessages, msg]);
        }

        if (convoNewMessages[convoId] === undefined) {
          convoNewMessages[convoId] = [];
        }
        convoNewMessages[convoId].push(msg);
      }
    } else if (isSocketUpdate === "typing") {
      setUsersTyping(typingUsersState);
    } else if (isSocketUpdate === "friend") {
      setFriends({ ...friendsState });
    } else if (isSocketUpdate === "online") {
      setOnlineFriends({ ...onlineFriendsState });
    } else if (isSocketUpdate === "update") {
      socket.emit("update", convoLastRead);
    }

    setIsSocketUpdate("");
  }, [isSocketUpdate]);

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
  }, []);

  useEffect(() => {
    getUser(id)
      .then((res) => {
        // console.log(res);

        // Convo initial process
        res.convos.map((convo) => {
          // Get Lastread process
          const lastRead = res.lastRead || {};
          convoLastRead[convo.id] = lastRead[convo.id] || "";

          const isMe =
            convo.users[0].id === id || convo.users[0].id === undefined;
          const partnerInfo = isMe ? convo.users[1] : convo.users[0];

          convoIdContainer[partnerInfo.id] = {
            ...partnerInfo,
            convoId: convo.id,
          };
          delete convoIdContainer[partnerInfo.id].id;

          convoOldMessages[convo.id] = [];
          convoNewMessages[convo.id] = [];
        });

        // Lastread initial process
        setLastReadNotify({ ...convoLastRead });

        // Avatar initial process
        setImageUrl(res.imageUrl);

        // Friend initial process
        const festGroup = {
          id: "0",
          recipient: {
            id: "none",
            name: "Fest Group",
            imageUrl:
              "https://firebasestorage.googleapis.com/v0/b/fest-d765b.appspot.com/o/avatar%2Ffavicon.png?alt=media&token=9b54fb70-886d-400d-b8a1-c71fe3341b7a",
            lastOnline: Date.now(),
          },
          status: 3,
          time: Date.now(),
        };
        const relationshipList = { none: festGroup };
        const friendList = {};
        res.friends.map((friend) => {
          relationshipList[friend.recipient.id] = friend;

          if (friend.status === 3) {
            friendList[friend.recipient.id] = 1;
          }
        });
        setFriends(relationshipList);
        friendsState = relationshipList;

        if (Object.keys(friendList).length > 0) {
          socket.emit("initFriendOnline", friendList);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("It looks like we can not get user. Login is required");
        window.localStorage.removeItem("LoggedChatappUser");
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    if (getScrollStatement() === "instant" || newMessages.length === 0) {
      // setTimeout(() => {
      //   instantScroll(setCountUnread);
      // }, 600);
    } else if (getScrollStatement() === "force") {
      setTimeout(() => {
        forceScroll(setCountUnread);
      }, 40);
    } else {
      setTimeout(() => {
        if (getScrollStatement() === "auto")
          autoScroll(countUnread, setCountUnread);
      }, 40);
    }
  }, [newMessages]);

  const handleUserToggle = () => {
    if (openUserInfo) {
      messages_style = { left: "0px" };
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
        friendsState={friendsState}
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
        friendsState={friendsState}
        onlineFriends={onlineFriends}
        activeConvoFriendId={activeConvoFriendId}
        setActiveConvoFriendId={setActiveConvoFriendId}
        convoIdContainer={convoIdContainer}
        convoOldMessages={convoOldMessages}
        convoNewMessages={convoNewMessages}
        convoLastRead={convoLastRead}
      />
      <div style={messages_style} className="messages_container">
        <MessagesUI
          oldMessages={oldMessages}
          setOldMessages={setOldMessages}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          lastReadNotify={lastReadNotify}
          setLastReadNotify={setLastReadNotify}
          countUnread={countUnread}
          setCountUnread={setCountUnread}
          setImageToView={setImageToView}
          setProfileInfo={setProfileInfo}
          setScrollStatement={setScrollStatement}
          activeConvoFriendId={activeConvoFriendId}
          convoIdContainer={convoIdContainer}
          convoOldMessages={convoOldMessages}
          convoNewMessages={convoNewMessages}
          convoLastRead={convoLastRead}
        />
        <TypingStatusCard
          usersTyping={usersTyping}
          convoIdContainer={convoIdContainer}
          activeConvoFriendId={activeConvoFriendId}
        />
        <MessageInput
          socket={socket}
          user={user}
          imageUrl={imageUrl}
          imageMessageUrls={imageMessageUrls}
          setImageMessageUrls={setImageMessageUrls}
          imageMessageFiles={imageMessageFiles}
          setImageMessageFiles={setImageMessageFiles}
          countUnread={countUnread}
          handleUserToggle={handleUserToggle}
          newMessages={newMessages}
          setNewMessages={setNewMessages}
          setErrorMessage={setErrorMessage}
          convoIdContainer={convoIdContainer}
          activeConvoFriendId={activeConvoFriendId}
          convoNewMessages={convoNewMessages}
          convoLastRead={convoLastRead}
          setLastReadNotify={setLastReadNotify}
          setIsSocketUpdate={setIsSocketUpdate}
        />
      </div>
    </div>
  );
};

export default MessagesBox;
