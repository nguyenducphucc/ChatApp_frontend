import "./UserProfile.css";
import React, { useState } from "react";
import {
  doFriendRequest,
  cancelFriendRequest,
  createFriendRelationship,
} from "../../services/friends";

const UserProfile = ({
  socket,
  user,
  userImageUrl,
  profileInfo,
  setProfileInfo,
  friends,
  setFriends,
}) => {
  if (profileInfo === null) return null;

  const name = profileInfo.name;
  const imageUrl = profileInfo.imageUrl;
  const userId = profileInfo.userId;
  const [loading, setLoading] = useState(false);

  window.addEventListener("mouseup", function clickOutOfProfile(e) {
    var profileUserContainer = document.getElementById(
      "profile_user_container"
    );

    if (e.target === profileUserContainer) {
      setProfileInfo(null);
      window.removeEventListener("mouseup", clickOutOfProfile);
    }
  });

  const showGreenButton = () => {
    if (userId === user.id) return null;
    if (friends[userId] !== undefined && friends[userId].status === 3)
      return null;
    if (
      loading ||
      (friends[userId] !== undefined && friends[userId].status === -1)
    )
      return <button className="profile_user_loadingbutton">Updating</button>;
    if (friends[userId] !== undefined && friends[userId].status === 1)
      return (
        <button
          className="profile_user_cancelfriend"
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

            setLoading(true);
            socket.emit("friendRelationship", socketUpdateStatusData);

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
              setLoading(false);
            });
          }}
        >
          Cancel
        </button>
      );
    if (friends[userId] !== undefined && friends[userId].status === 2)
      return (
        <div>
          <button
            className="profile_user_acceptfriend"
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

              setLoading(true);
              socket.emit("friendRelationship", socketUpdateStatusDataLoading);

              createFriendRelationship(requestRelationship).then(() => {
                const socketUpdateStatusData = {
                  type: "update_status",
                  requesterId: user.id,
                  recipientId: userId,
                  status: 3,
                  time,
                };
                socket.emit("friendRelationship", socketUpdateStatusData);

                const newFriends = friends;
                newFriends[userId].status = 3;
                newFriends[userId].time = time;
                setFriends({ ...newFriends });

                setLoading(false);
              });
            }}
          >
            Accept
          </button>
          <button
            className="profile_user_declinefriend"
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

              setLoading(true);
              socket.emit("friendRelationship", socketUpdateStatusData);

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
                setLoading(false);
              });
            }}
          >
            Decline
          </button>
        </div>
      );

    return (
      <button
        className="profile_user_addfriend"
        onClick={() => {
          const time = Date.now();
          const requestRelationship = {
            requesterId: user.id,
            recipientId: userId,
            time,
          };

          const socketCreateData = {
            type: "create",
            requester: {
              id: user.id,
              name: user.name,
              imageUrl: userImageUrl,
            },
            recipientId: userId,
            status: -1,
            time,
          };

          setLoading(true);
          socket.emit("friendRelationship", socketCreateData);

          doFriendRequest(requestRelationship).then((res) => {
            const socketUpdateStatusData = {
              type: "update_status",
              requesterId: user.id,
              recipientId: userId,
              status: 2,
              time,
            };
            socket.emit("friendRelationship", socketUpdateStatusData);

            const newFriends = friends;
            newFriends[userId] = res;
            setFriends({ ...newFriends });

            setLoading(false);
          });
        }}
      >
        Add Friend
      </button>
    );
  };

  return (
    <div className="profile_user_container" id="profile_user_container">
      <div className="profile_user_main">
        <img
          className="profile_user_avatar"
          src={imageUrl}
          alt="profile_user_avatar"
        />
        <p className="profile_user_name">{name}</p>
        {showGreenButton()}
        <div className="profile_user_aboutme_container">
          <p className="profile_user_aboutme_title">About me</p>
          <p className="profile_user_aboutme_content">Nothing to show</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
