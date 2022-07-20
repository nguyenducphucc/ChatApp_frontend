import axios from "axios";
const apiKey = "2W5NiFJlbsk5SmL3ySL8KEmGahppsoGm";

export const getGif = async (gifId) => {
  console.log(gifId);
  const res = await axios.get(
    `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`
  );
  return res.data.data;
};
