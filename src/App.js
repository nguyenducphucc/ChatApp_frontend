import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import MessagesBox from "./components/MessagesBox";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ErrorCard from "./components/ErrorCard";
import Test from "./components/Test";
import { getToken } from "./services/messages";
import { getGifKey } from "./services/giphy";

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("LoggedChatappUser");
    getGifKey();

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      getToken(user.token);
      navigate("/messages");
    } else {
      setUser(null);
      navigate("/login");
    }
  }, []);

  return (
    <div>
      <ErrorCard
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <Routes>
        <Route
          path="/messages"
          element={
            <MessagesBox
              user={user}
              setUser={setUser}
              setErrorMessage={setErrorMessage}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              setUser={setUser}
              user={user}
              setErrorMessage={setErrorMessage}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage setUser={setUser} setErrorMessage={setErrorMessage} />
          }
        />
        <Route path="/" element={<Test />} />
      </Routes>
    </div>
  );
};

export default App;
