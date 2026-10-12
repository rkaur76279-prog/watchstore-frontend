import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuTrash2, LuPlus, LuMinus, LuShieldCheck, LuTruck, LuLock, LuArrowRight } from 'react-icons/lu';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VIPROLLEX' || promoCode.trim().toUpperCase() === 'FIRST10' || promoCode.trim().toUpperCase() === 'VIPHOROLOGY') {
      setDiscount(cartSubtotal * 0.1);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promotion code. Try "VIPROLLEX" for 10% privilege discount.');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - discount);

  return (
    <div className="page-cart">
      <div className="container">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link to="/" className="breadcrumb-item">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Shopping Bag</span>
        </nav>

        <h1 className="cart-page-title">Your Shopping Bag</h1>

        {cartItems.length === 0 ? (
          <div className="cart-page-empty">
            <div className="empty-cart-circle">
              <LuShieldCheck size={36} color="#999999" />
            </div>
            <h2>Your bag is empty</h2>
            <p>You have not yet reserved any timepieces in your bag.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '20px' }}>
              EXPLORE OUR COLLECTION
            </Link>
          </div>
        ) : (
          <div className="cart-page-grid">
            {/* Left Column: Cart Items List */}
            <div className="cart-page-items-col">
              <div className="cart-table-header">
                <span>TIMEPIECE</span>
                <span className="col-center">QUANTITY</span>
                <span className="col-right">TOTAL</span>
              </div>

              <div className="cart-table-body">
                {cartItems.map((item) => (
                  <div key={item.key} className="cart-table-row">
                    <div className="cart-table-product">
                      <img src={item.image} alt={item.name} className="cart-table-thumb" />
                      <div className="cart-table-info">
                        <span className="cart-table-brand">{item.brand}</span>
                        <Link to={`/product/${item.id}`} className="cart-table-name">
                          {item.name}
                        </Link>
                        <div className="cart-table-options">
                          <span>Size: {item.caseSize}</span>
                          <span>•</span>
                          <span>Strap: {item.strap}</span>
                        </div>
                        <span className="cart-table-unit-price">
                          ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} each
                        </span>
                        <button
                          type="button"
                          className="cart-table-remove-btn"
                          onClick={() => removeFromCart(item.key)}
                        >
                          <LuTrash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="cart-table-qty col-center">
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
                    </div>

                    <div className="cart-table-subtotal col-right">
                      ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-page-perks">
                <div className="perk-box">
                  <LuTruck size={20} color="#C6A15B" />
                  <div>
                    <strong>Armored Insured Courier</strong>
                    <p>Complimentary signature-required delivery.</p>
                  </div>
                </div>
                <div className="perk-box">
                  <LuShieldCheck size={20} color="#C6A15B" />
                  <div>
                    <strong>5-Year Guarantee</strong>
                    <p>Direct manufacturer & atelier coverage.</p>
                  </div>
                </div>
                <div className="perk-box">
                  <LuLock size={20} color="#C6A15B" />
                  <div>
                    <strong>Swiss Bank Escrow</strong>
                    <p>Zero risk, certified authenticity verification.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="cart-page-summary-col">
              <div className="cart-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {discount > 0 && (
                  <div className="summary-line discount-line">
                    <span>VIP Promotion (10%)</span>
                    <span>-${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="summary-line">
                  <span>Insured Courier Delivery</span>
                  <span className="text-gold">COMPLIMENTARY</span>
                </div>

                <div className="summary-line">
                  <span>Estimated Taxes</span>
                  <span>Calculated at Checkout</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-line total-line">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Promo Code Form */}
                {/* <form onSubmit={handleApplyPromo} className="promo-code-form">
                  <div className="promo-input-group">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. VIPHOROLOGY)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="promo-input"
                    />
                    <button type="submit" className="btn btn-secondary promo-btn">
                      APPLY
                    </button>
                  </div>
                  {promoApplied && (
                    <span className="promo-success-msg">✓ 10% VIP Privilege discount applied</span>
                  )}
                  {promoError && (
                    <span className="promo-error-msg">{promoError}</span>
                  )}
                </form> */}

                <button
                  type="button"
                  className="btn btn-primary btn-summary-checkout"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <LuArrowRight size={14} />
                </button>

                <div className="summary-guarantee-note">
                  <span>30-Day Effortless Worldwide Returns</span>
                  <span>•</span>
                  <span>Authenticity Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default Cart;
