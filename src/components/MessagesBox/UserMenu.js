import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageUpload.css";
import "./UserMenu.css";

const UserMenu = ({ socket, setOpenUserInfo, setErrorMessage }) => {
  const navigate = useNavigate();

  const handleWorkingOn = () => {
    setErrorMessage("This function is still on development");
  };

  const handleLogout = () => {
    setOpenUserInfo(false);
    window.localStorage.removeItem("LoggedChatappUser");
    socket.disconnect();
    navigate("/login");
  };

  return (
    <div className="user_avatar_info_box">
      <button className="user_menu_content" onClick={handleWorkingOn}>
        User profile
      </button>
      <button className="user_menu_content" onClick={handleWorkingOn}>
        Friends
      </button>
      <button className="user_menu_content" onClick={handleWorkingOn}>
        Settings
      </button>
      <button className="user_menu_content" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
};

export default UserMenu;
