// contexts/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const addToFavorites = (item) => {
    setFavorites((prevFavorites) => [...prevFavorites, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const removeFromFavorites = (itemId) => {
    setFavorites(favorites.filter(item => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cart, favorites, addToCart, addToFavorites, removeFromCart, removeFromFavorites }}>
      {children}
    </CartContext.Provider>
  );
};
