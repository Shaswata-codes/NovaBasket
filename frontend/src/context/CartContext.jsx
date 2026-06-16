/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { authFetch } from "../utils/auth";

const CartContext = createContext();

const getOrCreateCartId = () => {
  let cartId = localStorage.getItem("cart_id");

  if (!cartId) {
    cartId =
      "cart_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    localStorage.setItem("cart_id", cartId);
  }

  return cartId;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cartId] = useState(getOrCreateCartId);

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const fetchCart = useCallback(async () => {
    try {
      const response = await authFetch(`${apiUrl}/api/cart/`, {
        headers: {
          "X-Cart-ID": cartId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, cartId]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await authFetch(`${apiUrl}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cart-ID": cartId,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
        setIsCartOpen(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await authFetch(`${apiUrl}/api/cart/remove/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cart-ID": cartId,
        },
        body: JSON.stringify({
          product_id: productId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await authFetch(`${apiUrl}/api/cart/update/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cart-ID": cartId,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await authFetch(`${apiUrl}/api/cart/clear/`, {
        method: "POST",
        headers: {
          "X-Cart-ID": cartId,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, [fetchCart]);

  const totalItemsCount = cart.items
    ? cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items || [],
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider"
    );
  }

  return context;
};