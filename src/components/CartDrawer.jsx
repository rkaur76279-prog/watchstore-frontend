import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { LuTrash2, LuPlus, LuMinus, LuShieldCheck, LuTruck } from 'react-icons/lu';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="drawer-backdrop active"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="cart-drawer-container active" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h3>Your Bag</h3>
            <span className="cart-drawer-count">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
          </div>
          <button
            className="cart-drawer-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <IoIosClose size={28} />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="cart-shipping-banner">
          <div className="shipping-banner-text">
            <LuTruck size={15} color="#C6A15B" />
            <span>Complimentary Insured Courier Shipping applied</span>
          </div>
          <div className="shipping-progress-bar">
            <div className="shipping-progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-circle">
                <LuShieldCheck size={32} color="#999999" />
              </div>
              <h4>Your bag is currently empty</h4>
              <p>Explore our curated vault of Swiss mechanical and automatic timepieces.</p>
              <Link
                to="/shop"
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
                style={{ marginTop: '16px' }}
              >
                EXPLORE WATCHES
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.key} className="cart-item-card">
                  <div className="cart-item-image-wrapper">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <span className="cart-item-brand">{item.brand}</span>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <LuTrash2 size={15} />
                      </button>
                    </div>

                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-title"
                      onClick={() => setIsCartOpen(false)}
                    >
                      {item.name}
                    </Link>

                    <div className="cart-item-variants">
                      <span>Size: {item.caseSize}</span>
                      <span>•</span>
                      <span>Strap: {item.strap}</span>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.key, -1)}
                          aria-label="Decrease quantity"
                        >
                          <LuMinus size={12} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateQuantity(item.key, 1)}
                          aria-label="Increase quantity"
                        >
                          <LuPlus size={12} />
                        </button>
                      </div>

                      <div className="cart-item-price">
                        ₹{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">
                ₹{cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <p className="cart-shipping-note">
              Taxes calculated at checkout. Worldwide armored courier delivery included.
            </p>

            <div className="cart-drawer-cta-group">
              <button
                type="button"
                className="btn btn-primary cart-checkout-btn"
                onClick={() => setIsCheckoutOpen(true)}
              >
                PROCEED TO CHECKOUT
              </button>

              <Link
                to="/cart"
                className="btn btn-secondary cart-view-full-btn"
                onClick={() => setIsCartOpen(false)}
              >
                VIEW FULL BAG DETAILS
              </Link>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default CartDrawer;
