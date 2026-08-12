import { createContext, useContext, useState, useCallback } from "react";
import API from "../api/axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await API.get("/cart");
      setCart(data.cart);
    } catch {
      setCart({ items: [] });
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post("/cart", { productId, quantity });
    setCart(data.cart);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put(`/cart/${productId}`, { quantity });
    setCart(data.cart);
  };

  const removeItem = async (productId) => {
    const { data } = await API.delete(`/cart/${productId}`);
    setCart(data.cart);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, fetchCart, addToCart, updateQuantity, removeItem, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
