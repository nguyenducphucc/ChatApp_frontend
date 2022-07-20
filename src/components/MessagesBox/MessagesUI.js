import React from "react";
import MessageCard from "./MessageCard";
import { getSomeMessages } from "../../services/messages";

const currentTime = Date.now();
var alreadyInAction = false;

const showOldMessageCard = (oldMessages, setImageToView) => {
  const res = [];

  for (var i = 0; i < oldMessages.length; i++) {
    res.push(
      <MessageCard
        key={oldMessages[i].id}
        message={oldMessages[i]}
        setImageToView={setImageToView}
        currentTime={currentTime}
        lastMessage={i === oldMessages.length - 1 ? null : oldMessages[i + 1]}
      />
    );
  }

  return res;
};

const showNewMessageCard = (newMessages, setImageToView, lastOldMessage) => {
  const res = [];

  for (var i = 0; i < newMessages.length; i++) {
    res.push(
      <MessageCard
        key={newMessages[i].id}
        message={newMessages[i]}
        setImageToView={setImageToView}
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
}) => {
  const lastOldMessage = oldMessages.length === 0 ? null : oldMessages[0];

  const handleButton = () => {
    getSomeMessages().then((res) => {
      if (res === null) {
        document.getElementById("load_next_button").disabled = true;
      } else {
        const elem = document.getElementById("auto-scroll");
        elem.scrollTo({ top: elem.scrollTop + 3 });
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
        if (targetedScroll <= 10 && !alreadyInAction) {
          alreadyInAction = true;
          document.getElementById("load_next_button").click();
        }
      }}
    >
      <div className="old_message_chatbox">
        {showOldMessageCard(oldMessages, setImageToView)}
      </div>
      <button
        id="load_next_button"
        className="load_next_button"
        onClick={handleButton}
      >
        Load next
      </button>
      <div className="new_message_chatbox">
        {showNewMessageCard(newMessages, setImageToView, lastOldMessage)}
      </div>
      <div className="main_chatbox_breaking" />
    </div>
  );
};

export default MessagesUI;
