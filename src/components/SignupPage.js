import "./LoginPage.css";
import React, { useState } from "react";
import { getToken } from "../services/messages";
import { createUser } from "../services/users";
import { login } from "../services/login";

const SignupPage = ({ setUser, setErrorMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAnotherSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
      name,
    };

    try {
      const returnedUser = await createUser(newUser);
      console.log(returnedUser);
      const loginUser = await login({ username, password });
      if (loginUser) {
        window.localStorage.setItem(
          "LoggedChatappUser",
          JSON.stringify(loginUser)
        );
      }
      getToken(loginUser.token);
      setUser(loginUser);

      setName("");
      setUsername("");
      setPassword("");
      window.location.href = "/messages";
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
    }
  };

  return (
    <div className="main_background">
      <div className="login-main-container">
        <form className="login-box" onSubmit={handleAnotherSubmit}>
          <h2>Signup</h2>
          <input
            placeholder="Your name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
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
          <br />
          <button className="continue-button" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
