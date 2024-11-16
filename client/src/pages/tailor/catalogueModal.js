import React from 'react';

const Modal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        
        {/* Centering the button */}
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
