import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('horology_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('horology_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, options = {}, quantity = 1) => {
    const caseSize = options.caseSize || (product.caseSizes ? product.caseSizes[0] : product.caseSize);
    const strap = options.strap || (product.straps ? product.straps[0] : product.strap);
    const color = options.dialColor || product.dialColor || "Standard";

    const itemKey = `${product.id}-${caseSize}-${strap}`;

    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.key === itemKey);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            key: itemKey,
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            caseSize,
            strap,
            color,
            quantity
          }
        ];
      }
    });

    showToast(`Added "${product.brand} ${product.name}" to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemKey) => {
    setCartItems(prev => prev.filter(item => item.key !== itemKey));
  };

  const updateQuantity = (itemKey, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.key === itemKey) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
