import React from "react";

var typingStatement;
var typingStyle;
const TypingStatusCard = ({ usersTyping }) => {
  if (usersTyping.length !== 0) {
    typingStatement = usersTyping[0].name;

    for (var i = 1; i < usersTyping.length; i++) {
      typingStatement +=
        i === usersTyping.length - 1
          ? ` and ${usersTyping[i].name}`
          : `, ${usersTyping[i].name}`;
    }

    typingStatement +=
      usersTyping.length === 1 ? " is typing..." : " are typing...";
    typingStyle = { height: "20px", opacity: "1" };
  } else {
    typingStatement = "Done";
    typingStyle = { height: "0px", opacity: "0.25" };
  }

  return (
    <div style={typingStyle} className="main-chatbox-typing">
      {typingStatement}
    </div>
  );
};

export default TypingStatusCard;
