import axios from "axios";

const baseUrl = "/api/users";

export const createUser = async (newUser) => {
  const res = await axios.post(baseUrl, newUser);
  return res.data;
};

export const uploadImage = async (id, newImageUrl) => {
  const res = await axios.put(`${baseUrl}/avatar/${id}`, newImageUrl);
  return res.data;
};

export const getUser = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`);
  return res.data;
};
