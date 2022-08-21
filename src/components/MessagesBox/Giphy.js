import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "./Giphy.css";
import GifImage from "../../images/gifbox.png";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { verifyToken, createMessage } from "../../services/messages";
import { setScrollStatement } from "./ScrollFunctions";

const gf = new GiphyFetch("2W5NiFJlbsk5SmL3ySL8KEmGahppsoGm");
var toggleStyle = { display: "none" };
var mainStyle = { minHeight: "40px" };
var fetchGifs = (offset) => gf.trending({ offset, limit: 10 });
var key = uuidv4();

const Giphy = ({ socket, newMessages, setNewMessages, setErrorMessage }) => {
  const [toggleOpen, setToggleOpen] = useState(false);
  const [search, setSearch] = useState("");

  if (toggleOpen) {
    toggleStyle = {};
    mainStyle = { minHeight: "434px" };
  } else {
    toggleStyle = { display: "none" };
    mainStyle = { minHeight: "40px" };
  }

  useEffect(() => {
    var giphyContainer = document.getElementById("gifContainer");
    var giphyInput = document.getElementById("gif_input");
    var giphyIcon = document.getElementById("gif_icon");

    window.addEventListener("mouseup", (e) => {
      if (!giphyContainer.contains(e.target) && e.target !== giphyIcon) {
        setToggleOpen(false);
      }
    });

    window.addEventListener("mouseup", function (e) {
      if (e.target === giphyIcon) {
        setTimeout(() => giphyInput.focus(), 100);
      }
    });
  }, []);

  const handleChange = ({ target }) => {
    setSearch(target.value);

    if (target.value === "") {
      key = uuidv4();
      fetchGifs = (offset) => gf.trending({ offset, limit: 10 });
    } else {
      key = uuidv4();
      fetchGifs = (offset) => gf.search(target.value, { offset, limit: 10 });
    }
  };

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    verifyToken()
      .then(({ id }) => {
        const newMessage = {
          time: Date.now(),
          gifMessage: {
            gifId: gif.id,
            width: gif.images.original.width,
            height: gif.images.original.height,
          },
          userId: id,
        };

        createMessage(newMessage)
          .then((res) => {
            setScrollStatement("force");
            setNewMessages(newMessages.concat(res));
            socket.emit("message", res);
          })
          .catch((err) => {
            setErrorMessage(err.response.data.error);
          });
      })
      .catch((err) => {
        alert(err.response.data.error);

        if (err.response.data.name === "loginRequired") {
          window.localStorage.removeItem("LoggedChatappUser");
          window.location.href = "/login";
        }
      });
  };

  return (
    <div style={mainStyle} className="gif_main">
      <div id="gifContainer">
        <input
          id="gif_input"
          style={toggleStyle}
          className="gif_input"
          value={search}
          placeholder="Search..."
          onChange={handleChange}
        />

        <div style={toggleStyle} className="gif_container">
          <Grid
            key={key}
            width={600}
            columns={3}
            fetchGifs={fetchGifs}
            onGifClick={handleGifClick}
          />
        </div>
      </div>

      <img
        id="gif_icon"
        className="gif_icon"
        src={GifImage}
        alt="gif_icon"
        onClick={() => setToggleOpen(!toggleOpen)}
      />
    </div>
  );
};

export default Giphy;
