import axios from "axios";
let apiKey;

export const getGifKey = async () => {
  const res = await axios.get("/api/gif");
  apiKey = res.data;
};

export const getGif = async (gifId) => {
  if(apiKey === undefined) return;
  const res = await axios.get(
    `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`
  );
  return res.data.data;
};
