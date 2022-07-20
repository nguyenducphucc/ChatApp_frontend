import axios from "axios";

const baseUrl = "/api/messages";

let token = null;
export const getToken = (key) => {
  token = `bearer ${key}`;
};

let firstMessageId = null;
export const getSomeMessages = async () => {
  const res =
    firstMessageId === null
      ? await axios.get(baseUrl)
      : await axios.get(`${baseUrl}/${firstMessageId}`);
  if (res.data.length === 0) return null;
  firstMessageId = res.data[res.data.length - 1].id;
  return res.data;
};

export const createMessage = async (newMessage) => {
  const res = await axios.post(baseUrl, newMessage);
  return res.data;
};

export const verifyToken = async () => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(`${baseUrl}/verify`, null, config);
  return res.data;
};
