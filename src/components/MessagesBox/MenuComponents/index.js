import "./MenuComponents.css";
import React, { useState } from "react";

import FriendMenu from "./FriendMenu";
import CloseIcon from "../../../images/close.png";

const MenuComponents = ({
  socket,
  user,
  friends,
  setFriends,
  choice,
  setChoice,
}) => {
  if (choice === null) return null;
  const [friendFilter, setFriendFilter] = useState("all");

  var allFriendList = [];
  // var onlineFriendList = [];
  var requestedFriendList = [];
  var pendingFriendList = [];
  // var blockedFriendList = [];

  for (const id in friends) {
    if (friends[id].status === 2) pendingFriendList.push(friends[id]);
    else if (friends[id].status === 1) requestedFriendList.push(friends[id]);
    else if (friends[id].status === 3) allFriendList.push(friends[id]);
  }

  var friendList = [];
  if (friendFilter === "all") friendList = allFriendList;
  else if (friendFilter === "pending") friendList = pendingFriendList;
  else if (friendFilter === "requested") friendList = requestedFriendList;

  return (
    <div className="menucomponents_main">
      <FriendMenu
        socket={socket}
        user={user}
        friends={friends}
        setFriends={setFriends}
        friendList={friendList}
        friendFilter={friendFilter}
        setFriendFilter={setFriendFilter}
      />
      <img
        className="menucomponents_closeIcon"
        src={CloseIcon}
        onClick={() => setChoice(null)}
        alt="Close_icon"
      />
    </div>
  );
};

export default MenuComponents;
