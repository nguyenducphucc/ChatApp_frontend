import React from "react";

var typingStatement;
var typingStyle;
const TypingStatusCard = ({ usersTyping }) => {
  if (usersTyping.length !== 0) {
    typingStatement = usersTyping.join(", ");
    typingStatement += " typing...";
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
