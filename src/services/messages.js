import axios from "axios";

const baseUrl = "/api/messages";

let token = null;
export const getToken = (key) => {
  token = `bearer ${key}`;
};

export const getSomeMessages = async ({ activeConvoId, targetMessageId }) => {
  const res = await axios.get(`${baseUrl}/${activeConvoId}/${targetMessageId}`);
  if (res.data.length === 0) return null;
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
