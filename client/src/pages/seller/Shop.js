import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import Shopping from './Shop.json'; 
import './Shop.css';

const Shop = () => {
  const [isShopCreated, setIsShopCreated] = useState(false);
  const navigate = useNavigate();

  const handleCreateShop = () => {
    navigate('/seller/Shop/Create');
  };

  const handleEditShop = () => {
    alert('Edit Shop clicked');
  };

  const handleDeleteShop = () => {
    setIsShopCreated(false);
    alert('Shop deleted');
  };

  return (
    <div className="shop-page">
      <div className="animation-container">
        <Player
          autoplay
          loop
          src={Shopping}
          style={{ height: '400px', width: '700px' }}
        />
      </div>
      <div className="button-container">
        {!isShopCreated ? (
          <button className="create-button" onClick={handleCreateShop}>
            Create Shop
          </button>
        ) : (
          <>
            <button className="edit-button" onClick={handleEditShop}>
              Edit Shop
            </button>
            <button className="delete-button" onClick={handleDeleteShop}>
              Delete Shop
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
