import "./LoginPage.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { getToken } from "../services/messages";
import { login } from "../services/login";
const LoginPage = ({ setUser, setErrorMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = {
        username,
        password,
      };

      const loginUser = await login(user);

      if (loginUser) {
        window.localStorage.setItem(
          "LoggedChatappUser",
          JSON.stringify(loginUser)
        );
      }

      getToken(loginUser.token);
      setUser(loginUser);

      setUsername("");
      setPassword("");
      window.location.href = "/messages";
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
    }
  };

  return (
    <div>
      <div className="main_background">
        <div className="login-main-container">
          <form className="login-box" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
              placeholder="Username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <button className="login-button" type="submit">
              Login
            </button>
            <div className="line-break" />
            <Link to="/signup" className="signup-button">
              Create new account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
