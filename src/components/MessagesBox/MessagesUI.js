import React, { useState, useEffect } from "react";
import MessageCard from "./MessageCard";
import { getSomeMessages } from "../../services/messages";
import arrowDownImg from "../../images/arrowDown.png";

const currentTime = Date.now();
var toggleJTP = false;
var inNeedSetup = false;
var alreadyInAction = false;

const showOldMessageCard = (
  oldMessages,
  setImageToView,
  setProfileInfo,
  lastReadMsgId
) => {
  const res = [];

  for (var i = 0; i < oldMessages.length; i++) {
    const isLastRead =
      i + 1 === oldMessages.length
        ? false
        : oldMessages[i + 1].id === lastReadMsgId;

    res.push(
      <MessageCard
        key={oldMessages[i].id}
        message={oldMessages[i]}
        setImageToView={setImageToView}
        setProfileInfo={setProfileInfo}
        currentTime={currentTime}
        lastMessage={i === oldMessages.length - 1 ? null : oldMessages[i + 1]}
        isLastRead={isLastRead}
      />
    );
  }

  return res;
};

const showNewMessageCard = (
  oldMessages,
  newMessages,
  setImageToView,
  setProfileInfo,
  lastOldMessage,
  lastReadMsgId
) => {
  const res = [];
  var lastReadDelay = oldMessages.length === 0 && lastReadMsgId === "";

  for (var i = 0; i < newMessages.length; i++) {
    const isLastRead = lastReadDelay;

    res.push(
      <MessageCard
        key={newMessages[i].id}
        message={newMessages[i]}
        setImageToView={setImageToView}
        setProfileInfo={setProfileInfo}
        currentTime={currentTime}
        lastMessage={i === 0 ? lastOldMessage : newMessages[i - 1]}
        isLastRead={isLastRead}
      />
    );

    lastReadDelay = newMessages[i].id === lastReadMsgId;
  }
  return res;
};

const MessagesUI = ({
  oldMessages,
  setOldMessages,
  newMessages,
  setNewMessages,
  lastReadNotify,
  setLastReadNotify,
  countUnread,
  setCountUnread,
  setImageToView,
  setProfileInfo,
  setScrollStatement,
  activeConvoFriendId,
  convoIdContainer,
  convoOldMessages,
  convoNewMessages,
  convoLastRead,
}) => {
  const [mainStyle, setMainStyle] = useState("main_chatbox visible_scroll");
  const [oldHeight, setOldHeight] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [openingHeight, setOpeningHeight] = useState(0);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const avatar = convoIdContainer[activeConvoFriendId].imageUrl;
  const name = convoIdContainer[activeConvoFriendId].name;
  const lastReadMsgId =
    lastReadNotify[convoIdContainer[activeConvoFriendId].convoId];

  useEffect(() => {
    const messagesUI = document.getElementById("auto-scroll");
    const JTP = document.getElementById("jump_chatbox");
    const paddingChatbox = document.getElementById("padding_message_chatbox");

    const elemOld = document.getElementById("old_message_chatbox");
    new ResizeObserver((changes) => {
      for (const change of changes) {
        if (change.contentRect.height === oldHeight) return;
        setOldHeight(change.contentRect.height);
      }
    }).observe(elemOld);

    const elemNew = document.getElementById("new_message_chatbox");
    new ResizeObserver((changes) => {
      for (const change of changes) {
        if (change.contentRect.height === newHeight) return;
        setNewHeight(change.contentRect.height);
      }
    }).observe(elemNew);

    messagesUI.addEventListener("scroll", () => {
      const distance =
        messagesUI.scrollHeight -
        messagesUI.clientHeight -
        messagesUI.scrollTop;
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
      paddingChatbox.style.transition = "ease-in-out 350ms";
    }, 800);
  }, []);

  useEffect(() => {
    if (inNeedSetup) {
      setTimeout(() => {
        const elem = document.getElementById("auto-scroll");
        elem.scrollTop = elem.scrollHeight - elem.clientHeight - 3;
        setLoadingMessages(false);
      }, 100);
      setTimeout(() => {
        inNeedSetup = false;
        alreadyInAction = false;
      }, 400);
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

  useEffect(() => {
    inNeedSetup = true;
    alreadyInAction = false;
    setLoadingMessages(true);
    setScrollStatement("instant");

    const paddingChatbox = document.getElementById("padding_message_chatbox");

    const newmsgs =
      convoNewMessages[convoIdContainer[activeConvoFriendId].convoId];
    setNewMessages(newmsgs);
    setOldHeight(0);
    setNewHeight(0);
    setOpeningHeight(0);

    document.getElementById("load_next_button").disabled = false;

    paddingChatbox.style.transition = "all 0ms ease-in-out";
    document.getElementById("load_next_button").click();
    setTimeout(() => {
      paddingChatbox.style.transition = "all 350ms ease-in-out";
    }, 1000);
  }, [activeConvoFriendId]);

  const lastOldMessage = oldMessages.length === 0 ? null : oldMessages[0];

  const handleNextButton = () => {
    const convoId = convoIdContainer[activeConvoFriendId].convoId;
    const convoOldMsgLength = convoOldMessages[convoId].length;
    const convoNewMsgLength = convoNewMessages[convoId].length;

    var msgId = "none";
    if (convoOldMsgLength > 0) {
      msgId = convoOldMessages[convoId][convoOldMsgLength - 1].id;
    } else if (convoNewMsgLength > 0) {
      msgId = convoNewMessages[convoId][0].id;
    }

    const data = { activeConvoId: convoId, targetMessageId: msgId };
    if (inNeedSetup) {
      if (convoOldMsgLength === 0) {
        getSomeMessages(data).then((msgs) => {
          const elem = document.getElementById("auto-scroll");
          elem.scrollTo({ top: elem.scrollTop + 5 });

          msgs && msgs.forEach((msg) => convoOldMessages[convoId].push(msg));
          setOldMessages(convoOldMessages[convoId]);
          if (!msgs || msgs.length < 25) {
            setOpeningHeight(265);
            document.getElementById("load_next_button").disabled = true;
          }
        });
      } else {
        const oldmsgs = [...convoOldMessages[convoId]];
        setOldMessages(oldmsgs);

        if (convoOldMsgLength % 25) {
          setOpeningHeight(265);
          document.getElementById("load_next_button").disabled = true;
        }

        setTimeout(() => {
          const elem = document.getElementById("auto-scroll");
          elem.scrollTop = elem.scrollHeight - elem.clientHeight - 1;
        });
      }
    } else {
      getSomeMessages(data).then((msgs) => {
        if (msgs && convoId === convoIdContainer[activeConvoFriendId].convoId) {
          const elem = document.getElementById("auto-scroll");
          elem.scrollTo({ top: elem.scrollTop + 7 });

          setOldMessages(oldMessages.concat(msgs));
          if (msgs.length < 25) {
            setOpeningHeight(265);
            document.getElementById("load_next_button").disabled = true;
          }
          msgs.forEach((msg) => convoOldMessages[convoId].push(msg)); // avoid double messages
          alreadyInAction = false;
        } else {
          setOpeningHeight(265);
          document.getElementById("load_next_button").disabled = true;
        }
      });
    }
  };

  return (
    <div
      className={mainStyle}
      id="auto-scroll"
      onScroll={() => {
        const messagesUI = document.getElementById("auto-scroll");
        const scrHei = messagesUI.scrollHeight;
        const cliHei = messagesUI.clientHeight;
        const scrTop = messagesUI.scrollTop;
        if (!inNeedSetup && scrTop <= 275 && !alreadyInAction) {
          alreadyInAction = true;
          document.getElementById("load_next_button").click();
        }

        const convoId = convoIdContainer[activeConvoFriendId].convoId;
        if (scrHei - cliHei - scrTop <= 5) {
          const newLen = convoNewMessages[convoId].length;
          const oldLen = convoOldMessages[convoId].length;

          if (newLen !== 0) {
            convoLastRead[convoId] = convoNewMessages[convoId][newLen - 1].id;
          } else if (oldLen !== 0) {
            convoLastRead[convoId] = convoOldMessages[convoId][0].id;
          } else {
            convoLastRead[convoId] = "";
          }

          if (countUnread) {
            setCountUnread(0);
          }

          if (convoLastRead[convoId] !== lastReadNotify[convoId]) {
            setLastReadNotify({ ...convoLastRead });
          }
        }
      }}
    >
      {loadingMessages && <div className="loading_chatbox" />}
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
          minHeight: `max(0px, calc(100% - 8px - ${oldHeight}px - ${newHeight}px - ${openingHeight}px ))`,
        }}
        id="padding_message_chatbox"
        className="padding_message_chatbox"
      />
      {openingHeight !== 0 && (
        <div id="opening_chatbox" className="opening_chatbox">
          <img
            className="opening_chatbox_avatar"
            src={avatar}
            alt="opening_avatar"
          />
          <p className="opening_chatbox_title">{name}</p>
        </div>
      )}

      <div id="old_message_chatbox" className="old_message_chatbox">
        {showOldMessageCard(
          oldMessages,
          setImageToView,
          setProfileInfo,
          lastReadMsgId
        )}
      </div>
      <button
        style={{ top: `calc(${oldHeight}px + ${newHeight}px - 20px)` }}
        id="load_next_button"
        className="load_next_button"
        onClick={handleNextButton}
      />
      <div id="new_message_chatbox" className="new_message_chatbox">
        {showNewMessageCard(
          oldMessages,
          newMessages,
          setImageToView,
          setProfileInfo,
          lastOldMessage,
          lastReadMsgId
        )}
      </div>
      <div className="main_chatbox_breaking" />
    </div>
  );
};

export default MessagesUI;
