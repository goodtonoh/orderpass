import React from "react";

function Modal({ img, onClose }) {
  return (
    <div className="modal show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-transparent border-0">
          <img src={img} alt="Popup" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default Modal;
