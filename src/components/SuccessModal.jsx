import React from 'react';
import '../styles/Modal.css'; // Modal tasarımı için CSS

const SuccessModal = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Başarılı!</h2>
        <p>{message}</p>
        <button onClick={onClose}>Tamam</button>
      </div>
    </div>
  );
};

export default SuccessModal;
