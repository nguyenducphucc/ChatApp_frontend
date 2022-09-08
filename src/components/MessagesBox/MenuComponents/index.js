import "./MenuComponents.css";
import React, { useState } from "react";

import FriendMenu from "./FriendMenu";
import CloseIcon from "../../../images/close.png";

const MenuComponents = ({
  socket,
  user,
  friends,
  setFriends,
  friendsState,
  choice,
  setChoice,
  onlineFriends,
  activeConvoFriendId,
  setActiveConvoFriendId,
  convoIdContainer,
  convoOldMessages,
  convoNewMessages,
  convoLastRead,
}) => {
  if (choice === null) return null;
  const [friendFilter, setFriendFilter] = useState("online");

  var allFriendList = [];
  var onlineFriendList = [];
  var requestedFriendList = [];
  var pendingFriendList = [];
  // var blockedFriendList = [];

  for (const id in friends) {
    if (friends[id].status === 2) pendingFriendList.push(friends[id]);
    else if (friends[id].status === 1) requestedFriendList.push(friends[id]);
    else if (friends[id].status === 3) {
      allFriendList.push(friends[id]);

      if (onlineFriends[friends[id].recipient.id] !== undefined) {
        onlineFriendList.push(friends[id]);
      }
    }
  }

  var friendList = [];
  if (friendFilter === "all") friendList = allFriendList;
  else if (friendFilter === "online") friendList = onlineFriendList;
  else if (friendFilter === "pending") friendList = pendingFriendList;
  else if (friendFilter === "requested") friendList = requestedFriendList;

  return (
    <div className="menucomponents_main">
      <FriendMenu
        socket={socket}
        user={user}
        friends={friends}
        setFriends={setFriends}
        friendsState={friendsState}
        onlineFriends={onlineFriends}
        friendList={friendList}
        friendFilter={friendFilter}
        setFriendFilter={setFriendFilter}
        activeConvoFriendId={activeConvoFriendId}
        setActiveConvoFriendId={setActiveConvoFriendId}
        convoIdContainer={convoIdContainer}
        convoOldMessages={convoOldMessages}
        convoNewMessages={convoNewMessages}
        convoLastRead={convoLastRead}
      />
      <img
        id="menucomponents_closeIcon"
        className="menucomponents_closeIcon"
        src={CloseIcon}
        onClick={() => setChoice(null)}
        alt="Close_icon"
      />
    </div>
  );
};

export default MenuComponents;
