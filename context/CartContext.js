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
      const response = await fetch(`${BACKEND_URI}/api/cart/${savedUser?._id}`);
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
    setCartItems((prev) => [...prev, { product, quantity }]);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }
      await fetch(`${BACKEND_URI}/api/cart/${savedUser?._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: product._id, quantity }),
      });
    } catch (error) {
      console.error(err);
      toast.error("Failed to add to cart");
      setCartItems((prev) =>
        prev.forEach((item) => {
          if (item.product._id === product._id) item.quantity--;
        })
      );
    }
  };

  const removeItem = async (productId) => {
    const old = cartItems;
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }
      const response = await fetch(
        `${BACKEND_URI}/api/cart/${savedUser?._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
    } catch (error) {
      console.error(err);
      toast.error("Failed to remove item");
      setCartItems(old);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const old = cartItems;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }
      const response = await fetch(
        `${BACKEND_URI}/api/cart/${savedUser?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: productId, quantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }
    } catch (error) {
      console.error(err);
      toast.error("Failed to update quantity");
      setCartItems(old);
    }
  };

  const clearCart = async () => {
    const old = cartItems;
    setCartItems([]);
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser?._id) {
        throw new Error("User not found in local storage");
      }
      const response = await fetch(
        `${BACKEND_URI}/api/cart/${savedUser?._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError(error.message);
      setCartItems(old);
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
