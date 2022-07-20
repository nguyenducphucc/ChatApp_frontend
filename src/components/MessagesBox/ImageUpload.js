import "./ImageUpload.css";
import React from "react";
import { storage } from "../../services/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

import { uploadImage } from "../../services/users";
import UserMenu from "./UserMenu";
import Edit from "../../images/edit.png";

const ImageUpload = ({
  socket,
  user,
  imageUrl,
  setImageUrl,
  setOpenUserInfo,
  setErrorMessage,
}) => {
  const handleImageChange = async (e) => {
    const type = e.target.files[0].type;

    if (
      type === "image/jpeg" ||
      type === "image/png" ||
      type === "image/svg+xml"
    ) {
      const image = e.target.files[0];
      const imageRef = ref(storage, `avatar/${user.id}`);
      await uploadBytes(imageRef, image)
        .then(async () => {
          await getDownloadURL(imageRef)
            .then((url) => {
              setImageUrl(url);
              uploadImage(user.id, { imageUrl: url });
            })
            .catch((error) => setErrorMessage(error.message));
        })
        .catch((error) => setErrorMessage(error.message));
    } else {
      setErrorMessage(
        "It looks like you put a wrong file. The file must be an image."
      );
    }
  };

  return (
    <div className="main_user_image">
      <div className="main_user_image_container">
        <div className="user_avatar_container">
          <img
            className="user_avatar"
            src={imageUrl}
            alt={imageUrl === null ? "Loading" : "user_avatar"}
          />
          <label className="user_avatar_input">
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleImageChange}
            />
            <img className="edit_avatar_icon" src={Edit} alt="edit" />
          </label>
        </div>
        {user === null ? null : <p className="user_avatar_name">{user.name}</p>}
      </div>

      <UserMenu
        socket={socket}
        setOpenUserInfo={setOpenUserInfo}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default ImageUpload;
