import React from "react";

import FriendCard from "./FriendCard";

const FriendMenu = ({
  socket,
  user,
  friends,
  setFriends,
  onlineFriends,
  friendList,
  friendFilter,
  setFriendFilter,
}) => {
  var title = "";
  if (friendFilter === "all") title = "Friend";
  else if (friendFilter === "online") title = "Online";
  else if (friendFilter === "pending") title = "Pending";
  else if (friendFilter === "requested") title = "Request";

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
          onClick={() => setFriendFilter("online")}
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
        {title} {" – "} {friendList.length}
        {/* {friendList.length > 1 && "s"} */}
      </p>
      <div className="friend_card_container">
        {friendList.map((friend) => (
          <FriendCard
            key={friend.id}
            socket={socket}
            user={user}
            friend={friend}
            friends={friends}
            setFriends={setFriends}
            onlineFriends={onlineFriends}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendMenu;
