import React from 'react';
import Modal from 'react-modal';
import Completed from '../pages/buyer/Giff/gif-success.gif';
// Initialize the Modal
Modal.setAppElement('#root'); 

const CheckoutModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Order Success"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
        },
      }}
    >
      <h2>Order Placed Successfully!</h2>
      <img src={Completed} alt="Success" style={{ width: '150px', margin: '20px auto' }} />
      <p>Your order has been placed. Please wait for confirmation.</p>
      <button onClick={onClose} style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}>
        Close
      </button>
    </Modal>
  );
};

export default CheckoutModal;
