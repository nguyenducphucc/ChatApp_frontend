import "./LoginPage.css";
import React, { useState, useEffect } from "react";
import { getGif } from "../services/giphy";

const Test = () => {
  const [gif, setGif] = useState(null);
  useEffect(() => {
    getGif(null).then((res) => setGif(res));
  }, []);
  console.log(gif);

  return (
    <div className="main_background">
      <img
        src="https://media0.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.webp?cid=9461e49bd53cf16050528082b1043a0f6829d0a5e521cfaa&rid=giphy.webp&ct=g"
        alt="dsa"
      />
    </div>
  );
};

export default Test;
