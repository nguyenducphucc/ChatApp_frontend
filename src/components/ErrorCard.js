import "./ErrorCard.css";
import React from "react";

const ErrorCard = ({ errorMessage, setErrorMessage }) => {
  const styleHide = {
    bottom: "110%",
  };

  const styleShow = {
    bottom: "69.5%",
  };

  const curStyle = errorMessage === null ? styleHide : styleShow;
  const curMessage = errorMessage === null ? "" : errorMessage;

  return (
    <div className="main-error-background" style={curStyle}>
      <p className="error-announcement">Something went wrong</p>
      <p className="error-details">{curMessage}</p>
      <button className="error-dismiss" onClick={() => setErrorMessage(null)}>
        Dismiss
      </button>
    </div>
  );
};

export default ErrorCard;
