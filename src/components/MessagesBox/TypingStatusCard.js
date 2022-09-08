import React from "react";

var typingStatement;
var typingStyle;
const TypingStatusCard = ({
  usersTyping,
  convoIdContainer,
  activeConvoFriendId,
}) => {
  const convoId = convoIdContainer[activeConvoFriendId].convoId;
  var lastPos = usersTyping.length - 1;
  var first = false;
  var length = 0;

  while (lastPos >= 0 && usersTyping[lastPos].convoId !== convoId) lastPos -= 1;
  for (var i = 0; i <= lastPos; i++) {
    if (!first && usersTyping[i].convoId === convoId) {
      first = true;
      length += 1;
      typingStatement = usersTyping[i].name;
    } else if (first && usersTyping[i].convoId === convoId) {
      length += 1;
      typingStatement +=
        i === lastPos
          ? ` and ${usersTyping[i].name}`
          : `, ${usersTyping[i].name}`;
    }
  }

  if (length) {
    typingStatement += length === 1 ? " is typing..." : " are typing...";
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
