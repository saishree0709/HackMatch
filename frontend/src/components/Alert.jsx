import React from "react";

export const Alert = ({ type = "error", message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`alert-box alert-${type}`}>
      <span className="alert-icon">
        {type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️"}
      </span>
      <div className="alert-content">{message}</div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};
