import React from "react";

export const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
};
