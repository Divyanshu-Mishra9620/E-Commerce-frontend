"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`);
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();
      localStorage.setItem("cart", JSON.stringify(data.items));
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: product._id, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const updatedCart = await response.json();

      setCartItems(updatedCart.items);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setError(error.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const updatedCart = await response.json();
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== productId)
      );
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError(error.message);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      const updatedCart = await response.json();

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating item quantity:", error);
      setError(error.message);
    }
  };

  const clearCart = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }

      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }

      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        loading,
        error,
        addToCart,
        removeItem,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
