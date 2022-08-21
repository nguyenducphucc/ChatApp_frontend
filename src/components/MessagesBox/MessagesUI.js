import React, { useState, useEffect } from "react";
import MessageCard from "./MessageCard";
import { getSomeMessages } from "../../services/messages";
import testImg from "../../images/test.png";
import arrowDownImg from "../../images/arrowDown.png";

const currentTime = Date.now();
var alreadyInAction = false;
var toggleScrollBar = false;
var toggleJTP = false;

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
  const [mainStyle, setMainStyle] = useState("main_chatbox hidden_scroll");
  const [oldHeight, setOldHeight] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [openingHeight, setOpeningHeight] = useState(0);
  const [UIStyle, setUIStyle] = useState({ transition: "ease-in-out 0ms" });

  useEffect(() => {
    const messagesUI = document.getElementById("auto-scroll");
    const JTP = document.getElementById("jump_chatbox");

    const elemOld = document.getElementById("old_message_chatbox");
    new ResizeObserver((changes, observer) => {
      for (const change of changes) {
        if (change.contentRect.height === oldHeight) return;
        setOldHeight(change.contentRect.height);

        if (change.contentRect.height >= messagesUI.offsetHeight) {
          observer.disconnect();
        }
      }
    }).observe(elemOld);

    const elemNew = document.getElementById("new_message_chatbox");
    new ResizeObserver((changes, observer) => {
      for (const change of changes) {
        if (change.contentRect.height === newHeight) return;
        setNewHeight(change.contentRect.height);

        if (change.contentRect.height >= messagesUI.offsetHeight) {
          observer.disconnect();
        }
      }
    }).observe(elemNew);

    messagesUI.addEventListener("scroll", () => {
      if (!toggleScrollBar) {
        messagesUI.style.transition = "color 150ms ease-in-out";
        messagesUI.style.color = "#696969d0";
        toggleScrollBar = !toggleScrollBar;
      }

      const thisHeight = messagesUI.scrollTop;
      setTimeout(() => {
        if (thisHeight === messagesUI.scrollTop && toggleScrollBar) {
          messagesUI.style.transition = "color 250ms ease-in-out";
          messagesUI.style.color = "#69696900";
          toggleScrollBar = !toggleScrollBar;
        }
      }, 400);

      const distance =
        messagesUI.scrollHeight - messagesUI.clientHeight - thisHeight;
      const targetDistance = 4000;
      if (distance >= targetDistance && toggleJTP === false) {
        toggleJTP = true;
        JTP.style.bottom = "85px";
      } else if (distance < targetDistance && toggleJTP === true) {
        toggleJTP = false;
        JTP.style.bottom = "0px";
      }
    });

    setTimeout(() => {
      setUIStyle({ transition: "ease-in-out 400ms" });
    }, 800);
  }, []);

  useEffect(() => {
    if (oldMessages.length <= 25) {
      const elem = document.getElementById("auto-scroll");
      elem.scrollTop = elem.scrollHeight;
    }
  }, [oldMessages]);

  useEffect(() => {
    if (
      mainStyle === "main_chatbox hidden_scroll" &&
      oldHeight + newHeight + openingHeight >
        document.getElementById("auto-scroll").offsetHeight
    ) {
      setMainStyle("main_chatbox visible_scroll");
    }
  }, [oldHeight, newHeight, openingHeight]);

  const lastOldMessage = oldMessages.length === 0 ? null : oldMessages[0];

  const handleNextButton = () => {
    getSomeMessages().then((res) => {
      if (res === null) {
        document.getElementById("load_next_button").disabled = true;
        setOpeningHeight(302);
      } else {
        if (res.length <= 24) setOpeningHeight(302);

        const elem = document.getElementById("auto-scroll");
        elem.scrollTo({ top: elem.scrollTop + 5 });
        setOldMessages(oldMessages.concat(res));
        setTimeout(() => (alreadyInAction = false));
      }
    });
  };

  return (
    <div
      className={mainStyle}
      id="auto-scroll"
      onScroll={() => {
        const targetedScroll = document.getElementById("auto-scroll").scrollTop;
        if (targetedScroll <= 250 && !alreadyInAction) {
          alreadyInAction = true;
          document.getElementById("load_next_button").click();
        }
      }}
    >
      <label
        id="jump_chatbox"
        className="jump_chatbox"
        onClick={() => {
          const messagesUI = document.getElementById("auto-scroll");
          const scrHei = messagesUI.scrollHeight;
          const cliHei = messagesUI.clientHeight;
          const scrTop = messagesUI.scrollTop;
          if (scrHei - cliHei - scrTop >= 8000) {
            messagesUI.scrollTop = scrHei - cliHei - 3999;
          }
          messagesUI.scrollTo({
            top: scrHei,
            behavior: "smooth",
          });
        }}
      >
        <img
          className="jump_to_present_icon"
          src={arrowDownImg}
          alt="jump_to_present_icon"
        />
      </label>

      <div
        style={{
          minHeight: `calc(100% - 8px - ${oldHeight}px - ${newHeight}px - ${openingHeight}px )`,
          ...UIStyle,
        }}
        id="padding_message_chatbox"
        className="padding_message_chatbox"
        onClick={() => {
          document.getElementById("load_next_button").click();
        }}
      />

      {openingHeight !== 0 && (
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
