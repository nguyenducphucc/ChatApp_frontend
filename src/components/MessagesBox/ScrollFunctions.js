let scrollStatement = "instant";
let lastHeight = -1;

export const getScrollStatement = () => scrollStatement;
export const setScrollStatement = (statement) => {
  scrollStatement = statement;
};

export const autoScroll = (countUnread, setCountUnread) => {
  const elem = document.getElementById("auto-scroll");

  if (elem.scrollTop + elem.clientHeight + 1 >= lastHeight) {
    elem.scrollTo({ top: elem.scrollHeight, behavior: "smooth" });
    setCountUnread(0);
  } else {
    setCountUnread(countUnread + 1);
  }

  setTimeout(() => {
    lastHeight = elem.scrollHeight;
  });
};

export const forceScroll = (setCountUnread) => {
  document.getElementById("jump_chatbox").click();
  setCountUnread(0);
  lastHeight = document.getElementById("auto-scroll").scrollHeight;
};

export const instantScroll = (setCountUnread) => {
  const elem = document.getElementById("auto-scroll");
  elem.scrollTo({ top: elem.scrollHeight });
  setCountUnread(0);
  setTimeout(() => {
    lastHeight = elem.scrollHeight;
  });
};
