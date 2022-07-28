import React from "react";

import FriendCard from "./FriendCard";

const FriendMenu = ({
  socket,
  user,
  friends,
  setFriends,
  friendList,
  friendFilter,
  setFriendFilter,
}) => {
  return (
    <div className="friend_main">
      <div className="friend_bar">
        <p className="friend_title">Friends</p>
        <button
          style={friendFilter === "all" ? { color: "white" } : {}}
          className="friend_button"
          onClick={() => setFriendFilter("all")}
        >
          All
        </button>
        <button
          style={friendFilter === "online" ? { color: "white" } : {}}
          className="friend_button"
          onClick={() => setFriendFilter("all")}
        >
          Online
        </button>
        <button
          style={friendFilter === "pending" ? { color: "white" } : {}}
          className="friend_button"
          onClick={() => setFriendFilter("pending")}
        >
          Pending
        </button>
        <button
          style={friendFilter === "requested" ? { color: "white" } : {}}
          className="friend_button"
          onClick={() => setFriendFilter("requested")}
        >
          Waiting
        </button>
        <button
          style={friendFilter === "blocked" ? { color: "white" } : {}}
          className="friend_button"
          onClick={() => setFriendFilter("all")}
        >
          Blocked
        </button>
      </div>
      <p className="friend_count">
        {friendList.length} {friendList.length <= 1 ? "Friend" : "Friends"}
      </p>
      <div className="friend_card_container">
        {friendList.map((friend, index) => (
          <FriendCard
            key={index}
            socket={socket}
            user={user}
            friend={friend}
            friends={friends}
            setFriends={setFriends}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendMenu;
