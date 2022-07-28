import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageUpload.css";
import "./UserMenu.css";

const UserMenu = ({
  socket,
  setOpenUserInfo,
  choice,
  setChoice,
  setErrorMessage,
}) => {
  const navigate = useNavigate();

  const handleWorkingOn = () => {
    setChoice(null);
    setErrorMessage("This function is still on development");
  };

  const handleFriend = () => {
    if (choice === "friend") setChoice(null);
    else setChoice("friend");
  };

  const handleLogout = () => {
    setOpenUserInfo(false);
    window.localStorage.removeItem("LoggedChatappUser");
    socket.disconnect();
    navigate("/login");
  };

  return (
    <div>
      <div className="user_avatar_info_box">
        <button className="user_menu_content" onClick={handleWorkingOn}>
          User profile
        </button>
        <button className="user_menu_content" onClick={handleFriend}>
          Friends
        </button>
        <button className="user_menu_content" onClick={handleWorkingOn}>
          Settings
        </button>
        <button className="user_menu_content" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
