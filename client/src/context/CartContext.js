import React, { createContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload.id);
    case 'SET_CART':
      return action.payload;
    default:
      return state;
    
  }
  //cart
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
                                                                                                
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem('cart'));
    if (storedCart) {
      dispatch({ type: 'SET_CART', payload: storedCart });
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
