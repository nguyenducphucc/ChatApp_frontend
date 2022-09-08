import axios from "axios";

const baseUrl = "/api/convos";

export const createConvo = async (data) => {
  const res = await axios.post(baseUrl, data);
  return res.data;
};
