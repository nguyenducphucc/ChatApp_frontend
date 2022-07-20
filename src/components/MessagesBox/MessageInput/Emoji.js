import React from "react";
import EmojiPicker from "emoji-picker-react";
import "./Emoji.css";

const Emoji = ({ setChosenEmoji, pickerStyle }) => {
  return (
    <div className="EmojiPiacker_container">
      <EmojiPicker
        onEmojiClick={(e, emojiObject) => setChosenEmoji(emojiObject)}
        pickerStyle={pickerStyle}
      />
    </div>
  );
};

function isPropChange(prevProp, nextProp) {
  return (
    JSON.stringify(prevProp.pickerStyle) ===
    JSON.stringify(nextProp.pickerStyle)
  );
}

export const MemorizedEmoji = React.memo(Emoji, isPropChange);
