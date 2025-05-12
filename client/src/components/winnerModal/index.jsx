import React from "react"; // Додати цей імпорт
import "./winnerModal.css";

const WinnerModal = ({ fighter, onClose }) => {
  if (!fighter) return null;

  return (
    <div
      className="modal-layer"
      onClick={(e) => {
        if (e.target.className === "modal-layer") onClose();
      }}
    >
      <div className="modal-root">
        <div className="modal-header">
          <span>{fighter.name.toUpperCase()} WON!!</span>
          <div className="close-btn" onClick={onClose}>
            ×
          </div>
        </div>
        <div className="modal-body">
          <img
            src="https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif"
            alt={fighter.name}
            className="fighter-preview___img"
          />
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;
