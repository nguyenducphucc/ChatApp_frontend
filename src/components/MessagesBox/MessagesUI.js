import React, { useState, useEffect } from "react";
import MessageCard from "./MessageCard";
import { getSomeMessages } from "../../services/messages";
import testImg from "../../images/test.png";

const currentTime = Date.now();
var alreadyInAction = false;

const showOldMessageCard = (oldMessages, setImageToView, setProfileInfo) => {
  const res = [];

  for (var i = 0; i < oldMessages.length; i++) {
    res.push(
      <MessageCard
        key={oldMessages[i].id}
        message={oldMessages[i]}
        setImageToView={setImageToView}
        setProfileInfo={setProfileInfo}
        currentTime={currentTime}
        lastMessage={i === oldMessages.length - 1 ? null : oldMessages[i + 1]}
      />
    );
  }

  return res;
};

const showNewMessageCard = (
  newMessages,
  setImageToView,
  setProfileInfo,
  lastOldMessage
) => {
  const res = [];

  for (var i = 0; i < newMessages.length; i++) {
    res.push(
      <MessageCard
        key={newMessages[i].id}
        message={newMessages[i]}
        setImageToView={setImageToView}
        setProfileInfo={setProfileInfo}
        currentTime={currentTime}
        lastMessage={i === 0 ? lastOldMessage : newMessages[i - 1]}
      />
    );
  }
  return res;
};

const MessagesUI = ({
  oldMessages,
  setOldMessages,
  newMessages,
  setImageToView,
  setProfileInfo,
}) => {
  const [oldHeight, setOldHeight] = useState(1000);
  const [newHeight, setNewHeight] = useState(1000);
  const [openingHeight, setOpeningHeight] = useState(0);
  const [UIStyle, setUIStyle] = useState({ transition: "ease-in-out 0ms" });

  useEffect(() => {
    const elemOld = document.getElementById("old_message_chatbox");
    new ResizeObserver((changes, observer) => {
      for (const change of changes) {
        if (change.contentRect.height === oldHeight) return;
        setOldHeight(change.contentRect.height);

        if (
          change.contentRect.height >=
          document.getElementById("auto-scroll").offsetHeight
        ) {
          observer.disconnect();
        }
      }
    }).observe(elemOld);

    const elemNew = document.getElementById("new_message_chatbox");
    new ResizeObserver((changes, observer) => {
      for (const change of changes) {
        if (change.contentRect.height === newHeight) return;
        setNewHeight(change.contentRect.height);

        if (
          change.contentRect.height >=
          document.getElementById("auto-scroll").offsetHeight
        ) {
          observer.disconnect();
        }
      }
    }).observe(elemNew);

    var forceDownId = setInterval(() => {
      const elem = document.getElementById("auto-scroll");
      elem.scrollTop = 9999;
      console.log("forcing...");
    }, 20);

    setTimeout(() => {
      clearInterval(forceDownId);
    }, 400);

    setTimeout(() => {
      setUIStyle({ transition: "ease-in-out 400ms" });
    }, 800);
  }, []);

  const lastOldMessage = oldMessages.length === 0 ? null : oldMessages[0];

  const handleNextButton = () => {
    getSomeMessages().then((res) => {
      if (res === null) {
        document.getElementById("load_next_button").disabled = true;
      } else {
        if (res.length <= 24) setOpeningHeight(300);

        const elem = document.getElementById("auto-scroll");
        elem.scrollTo({ top: elem.scrollTop + 5 });
        setOldMessages(oldMessages.concat(res));
        setTimeout(() => (alreadyInAction = false));
      }
    });
  };

  return (
    <div
      className="main_chatbox"
      id="auto-scroll"
      onScroll={() => {
        const targetedScroll = document.getElementById("auto-scroll").scrollTop;
        if (targetedScroll <= 250 && !alreadyInAction) {
          alreadyInAction = true;
          document.getElementById("load_next_button").click();
        }
      }}
    >
      <div
        style={{
          minHeight: `calc(100% - 8px - ${oldHeight}px - ${newHeight}px - ${openingHeight}px )`,
          ...UIStyle,
        }}
        className="padding_message_chatbox"
        onClick={() => {
          document.getElementById("load_next_button").click();
        }}
      />

      {openingHeight === 300 && (
        <div id="opening_chatbox" className="opening_chatbox">
          <img
            className="opening_chatbox_avatar"
            src={testImg}
            alt="opening_avatar"
          />
          <p className="opening_chatbox_title">Fest Group</p>
        </div>
      )}

      <div id="old_message_chatbox" className="old_message_chatbox">
        {showOldMessageCard(oldMessages, setImageToView, setProfileInfo)}
      </div>
      <button
        style={{ top: `calc(${oldHeight}px + ${newHeight}px - 20px)` }}
        id="load_next_button"
        className="load_next_button"
        onClick={handleNextButton}
      />
      <div id="new_message_chatbox" className="new_message_chatbox">
        {showNewMessageCard(
          newMessages,
          setImageToView,
          setProfileInfo,
          lastOldMessage
        )}
      </div>
      <div className="main_chatbox_breaking" />
    </div>
  );
};

export default MessagesUI;
