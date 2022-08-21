export const getTimezone = (messageTime, currentTime) => {
  const time = new Date(messageTime);
  const localDayEndTime =
    currentTime +
    ((86400000 - (currentTime % 86400000) + time.getTimezoneOffset() * 60000) %
      86400000);

  const timediff = Math.abs(localDayEndTime - time.getTime());
  if (timediff < 172800000) {
    return `${
      timediff < 86400000 ? "Today" : "Yesterday"
    } at ${time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return time.toLocaleTimeString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
