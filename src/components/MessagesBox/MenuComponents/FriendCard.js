import React, { useState, useEffect } from "react";

import {
  createFriendRelationship,
  cancelFriendRequest,
} from "../../../services/friends";

import CloseIcon from "../../../images/close.png";
import AcceptIcon from "../../../images/accept.png";
import RemoveIcon from "../../../images/remove.png";
import DeleteIcon from "../../../images/delete.png";
import MessageIcon from "../../../images/message.png";

const FriendCard = ({
  socket,
  user,
  friend,
  friends,
  setFriends,
  onlineFriends,
}) => {
  const userId = friend.recipient.id;
  const name = friend.recipient.name;
  const imageUrl = friend.recipient.imageUrl;
  const lastOnline = friend.recipient.lastOnline
    ? friend.recipient.lastOnline
    : null;
  const status = friend.status;

  const intoTime = (time) => {
    var curTime = parseInt(time / 1000);

    if (curTime < 60) return "Just active";
    if (curTime < 3600) return `Active ${parseInt(curTime / 60)}m ago`;
    if (curTime < 86400) return `Active ${parseInt(curTime / 3600)}h ago`;
    if (curTime < 2592000) return `Active ${parseInt(curTime / 86400)}d ago`;
    return "Offline";
  };
  const [smallDetail, setSmallDetail] = useState(
    status === 3 && lastOnline !== undefined
      ? intoTime(new Date() - lastOnline)
      : "Updating..."
  );

  const [intervalId, setIntervalId] = useState(null);
  useEffect(() => {
    if (status === 3) {
      if (onlineFriends[userId] !== undefined) {
        clearInterval(intervalId);
        setIntervalId(null);
        setSmallDetail("Online");
      } else if (lastOnline) {
        if (intervalId === null) {
          let interval = setInterval(() => {
            var time = new Date() - lastOnline;
            setSmallDetail(intoTime(time));
          }, 60000);
          setIntervalId(interval);
        }
      } else {
        setSmallDetail("Friend");
      }
    } else if (status === 1) setSmallDetail("Waiting For Response");
    else if (status === 2) setSmallDetail("New Friend Request");
  }, [onlineFriends]);

  return (
    <div className="friend_card">
      <img className="friend_avatar" src={imageUrl} alt="friend_card" />
      <div>
        <p className="friend_name">{name}</p>
        <p className="friend_status">{smallDetail}</p>
      </div>
      {status === 3 && (
        <div className="friend_iconContainer">
          <img
            style={{ padding: "10px 10px 8px" }}
            className="friend_imageIcon"
            src={MessageIcon}
            alt="message_icon"
          />
          <img
            className="friend_imageIcon"
            src={RemoveIcon}
            alt="remove_icon"
            onClick={() => {
              const requestRelationship = {
                requesterId: user.id,
                recipientId: userId,
              };

              const socketUpdateStatusData = {
                type: "update_status",
                requesterId: user.id,
                recipientId: userId,
                status: -1,
              };

              socket.emit("friendRelationship", socketUpdateStatusData);
              const loadingFriends = friends;
              loadingFriends[userId].status = -1;
              setFriends({ ...loadingFriends });

              cancelFriendRequest(requestRelationship).then(() => {
                const socketDeleteData = {
                  type: "delete",
                  requesterId: user.id,
                  recipientId: userId,
                };
                socket.emit("friendRelationship", socketDeleteData);

                const newFriends = friends;
                delete newFriends[userId];
                setFriends({ ...newFriends });
              });
            }}
          />
        </div>
      )}
      {status === 2 && (
        <div className="friend_iconContainer">
          <img
            className="friend_imageIcon"
            src={AcceptIcon}
            alt="accept_icon"
            onClick={() => {
              const time = Date.now();
              const requestRelationship = {
                requesterId: user.id,
                recipientId: userId,
                time,
              };

              const socketUpdateStatusDataLoading = {
                type: "update_status",
                requesterId: user.id,
                recipientId: userId,
                status: -1,
              };

              socket.emit("friendRelationship", socketUpdateStatusDataLoading);
              const loadingFriends = friends;
              loadingFriends[userId].status = -1;
              setFriends({ ...loadingFriends });

              createFriendRelationship(requestRelationship).then(() => {
                const socketUpdateStatusData = {
                  type: "update_status",
                  requesterId: user.id,
                  recipientId: userId,
                  status: 3,
                  time,
                };
                socket.emit("friendRelationship", socketUpdateStatusData);

                const onlineFriendId = {};
                onlineFriendId[userId] = 1;
                socket.emit("initFriendOnline", onlineFriendId);

                const newFriends = friends;
                newFriends[userId].status = 3;
                newFriends[userId].time = time;
                setFriends({ ...newFriends });
              });
            }}
          />
          <img
            className="friend_imageIcon"
            src={CloseIcon}
            alt="close_icon"
            onClick={() => {
              const requestRelationship = {
                requesterId: user.id,
                recipientId: userId,
              };

              const socketUpdateStatusData = {
                type: "update_status",
                requesterId: user.id,
                recipientId: userId,
                status: -1,
              };

              socket.emit("friendRelationship", socketUpdateStatusData);
              const loadingFriends = friends;
              loadingFriends[userId].status = -1;
              setFriends({ ...loadingFriends });

              cancelFriendRequest(requestRelationship).then(() => {
                const socketDeleteData = {
                  type: "delete",
                  requesterId: user.id,
                  recipientId: userId,
                };
                socket.emit("friendRelationship", socketDeleteData);

                const newFriends = friends;
                delete newFriends[userId];
                setFriends({ ...newFriends });
              });
            }}
          />
        </div>
      )}
      {status === 1 && (
        <div
          style={{ left: "max(calc(100% - 94px), 638px)" }}
          className="friend_iconContainer"
        >
          <img
            className="friend_imageIcon"
            src={DeleteIcon}
            alt="delete_icon"
            onClick={() => {
              const requestRelationship = {
                requesterId: user.id,
                recipientId: userId,
              };

              const socketUpdateStatusData = {
                type: "update_status",
                requesterId: user.id,
                recipientId: userId,
                status: -1,
              };

              socket.emit("friendRelationship", socketUpdateStatusData);
              const loadingFriends = friends;
              loadingFriends[userId].status = -1;
              setFriends({ ...loadingFriends });

              cancelFriendRequest(requestRelationship).then(() => {
                const socketDeleteData = {
                  type: "delete",
                  requesterId: user.id,
                  recipientId: userId,
                };
                socket.emit("friendRelationship", socketDeleteData);

                const newFriends = friends;
                delete newFriends[userId];
                setFriends({ ...newFriends });
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FriendCard;
