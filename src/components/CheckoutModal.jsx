import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { LuCheck, LuShieldCheck, LuCreditCard, LuTruck, LuLock, LuTag, LuX, LuLoader } from 'react-icons/lu';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Harrison',
    lastName: 'Vance',
    email: 'harrison.vance@rollex-luxury.com',
    address: '450 Park Avenue, Suite 1800',
    city: 'New York',
    postalCode: '10022',
    country: 'United States',
    cardNumber: '•••• •••• •••• 4242',
    expDate: '08/29',
    cvv: '•••'
  });
  const [orderNumber, setOrderNumber] = useState('');

  // Promo Code State
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountType, discountValue, discountAmount, finalTotal }

  const finalTotal = appliedPromo ? appliedPromo.finalTotal : cartSubtotal;

  // Prefill with authenticated client details if available
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      const fName = parts[0] || 'Harrison';
      const lName = parts.slice(1).join(' ') || (parts.length === 1 ? '' : 'Vance');

      setFormData((prev) => ({
        ...prev,
        firstName: fName,
        lastName: lName,
        email: user.email || prev.email,
        address: user.address || prev.address,
        city: user.city || prev.city,
        country: user.country || prev.country,
        postalCode: user.postalCode || prev.postalCode,
      }));
    }
  }, [user, isOpen]);

  // Reset promo on modal open
  useEffect(() => {
    if (isOpen) {
      setAppliedPromo(null);
      setPromoInput('');
      setPromoError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Promo Code Validation ──────────────────────────────────────────────────
  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }
    setPromoLoading(true);
    setPromoError('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: promoInput.trim().toUpperCase(),
          cartTotal: cartSubtotal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedPromo(data);
      } else {
        setPromoError(data.message || 'Invalid or expired promo code.');
      }
    } catch {
      setPromoError('Unable to validate promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const generatedId = `RLX-${Math.floor(100000 + Math.random() * 900000)}-GE`;
    setOrderNumber(generatedId);

    const clientEmail = (formData.email || user?.email || 'client@rollex.ch').toLowerCase().trim();
    const clientName = `${formData.firstName} ${formData.lastName}`.trim() || user?.name || 'Client Privilege Member';

    // Save order into client dossier via OrdersContext & MongoDB
    addOrder({
      id: generatedId,
      userEmail: clientEmail,
      userName: clientName,
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentMethod: 'Centurion Platinum Reserve (••• 4242)',
      subtotal: cartSubtotal,
      discount: appliedPromo ? appliedPromo.discountAmount : 0,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      total: finalTotal,
      totalQuantity: cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand || 'ROLLEX',
        collection: item.brand || 'Geneva Collection',
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        dialColor: item.color || 'Standard Dial',
        caseSize: item.caseSize || '41mm',
        strap: item.strap || 'Oystersteel Bracelet',
        calibre: 'Rolex Manufacture Calibre Superlative',
        serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}-CH`,
      })),
      shippingAddress: {
        fullName: clientName,
        email: clientEmail,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: user?.phone || '+1 (212) 555-0199',
      },
    });

    setStep(3);
    clearCart();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <>
      <div className="drawer-backdrop active" onClick={handleClose} />
      <div className="checkout-modal">
        <div className="checkout-modal-header">
          <div className="checkout-steps">
            <span className={`checkout-step-badge ${step >= 1 ? 'active' : ''}`}>1. Shipping</span>
            <span className="checkout-step-divider">/</span>
            <span className={`checkout-step-badge ${step >= 2 ? 'active' : ''}`}>2. Payment</span>
            <span className="checkout-step-divider">/</span>
            <span className={`checkout-step-badge ${step >= 3 ? 'active' : ''}`}>3. Confirmation</span>
          </div>
          <button className="checkout-modal-close" onClick={handleClose} aria-label="Close checkout">
            <IoIosClose size={26} />
          </button>
        </div>

        <div className="checkout-modal-body">
          {step === 1 && (
            <div className="checkout-step-content">
              <div className="checkout-section-title">
                <h3>Complimentary Insured Courier Delivery</h3>
                <p>All timepieces are hand-inspected, serialized, and shipped via armored courier.</p>
              </div>

              <div className="checkout-form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
              </div>

              {/* ── Promo Code Section ── */}
              <div className="promo-section">
                <div className="promo-section-header">
                  <LuTag size={15} color="#C6A15B" />
                  <span>Have a promo code?</span>
                </div>

                {!appliedPromo ? (
                  <div className="promo-input-row">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        setPromoError('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                      className="account-input promo-code-input"
                    />
                    <button
                      type="button"
                      className="btn btn-secondary promo-apply-btn"
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                    >
                      {promoLoading ? <LuLoader size={14} className="promo-spinner" /> : 'APPLY'}
                    </button>
                  </div>
                ) : (
                  <div className="promo-applied-badge">
                    <LuCheck size={14} color="#22c55e" />
                    <span>
                      <strong>{appliedPromo.code}</strong> applied —{' '}
                      {appliedPromo.discountType === 'percentage'
                        ? `${appliedPromo.discountValue}% OFF`
                        : `$${appliedPromo.discountAmount?.toLocaleString()} OFF`}
                    </span>
                    <button
                      type="button"
                      className="promo-remove-btn"
                      onClick={handleRemovePromo}
                      aria-label="Remove promo code"
                    >
                      <LuX size={13} />
                    </button>
                  </div>
                )}
                {promoError && <p className="promo-error-msg">{promoError}</p>}
              </div>

              <div className="checkout-order-summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {appliedPromo && (
                  <div className="summary-row discount-row">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span className="text-emerald">
                      −${appliedPromo.discountAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Insured Armored Express</span>
                  <span className="text-gold">COMPLIMENTARY</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total Due</span>
                  <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary checkout-action-btn"
                onClick={() => setStep(2)}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step-content">
              <div className="checkout-section-title">
                <h3>Secure Luxury Escrow &amp; Payment</h3>
                <p>256-bit encrypted bank-grade transaction with full client privacy protection.</p>
              </div>

              <div className="payment-options">
                <div className="payment-option selected">
                  <LuCreditCard size={18} />
                  <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                </div>
              </div>

              <div className="checkout-form-grid" style={{ marginTop: '16px' }}>
                <div className="form-group full-width">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>Expiration Date</label>
                  <input
                    type="text"
                    name="expDate"
                    value={formData.expDate}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>CVV / CVC</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="account-input"
                  />
                </div>
              </div>

              <div className="checkout-security-badge">
                <LuLock size={15} color="#C6A15B" />
                <span>Funds held in Swiss bank escrow until your signature is recorded on delivery.</span>
              </div>

              {/* Payment summary with discount visible */}
              <div className="checkout-order-summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {appliedPromo && (
                  <div className="summary-row discount-row">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span className="text-emerald">
                      −${appliedPromo.discountAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                <div className="summary-row total-row">
                  <span>Total Due</span>
                  <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="checkout-buttons-group">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  ← BACK
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleCompleteOrder}
                >
                  PLACE ORDER (${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-success-view">
              <div className="success-icon-badge">
                <LuCheck size={36} color="#27AE60" />
              </div>
              <span className="section-label">ORDER REGISTERED</span>
              <h2>Thank You for Your Patronage</h2>
              <p className="order-number-display">Order Reference: <strong>{orderNumber}</strong></p>
              <p className="success-description">
                Your luxury timepiece will be retrieved from the climate-controlled vault, tested on our Witschi Chronoscope for timing precision, and dispatched with tamper-evident security seals.
              </p>

              <div className="order-details-card">
                <div className="order-details-line">
                  <LuTruck size={18} color="#C6A15B" />
                  <div>
                    <strong>Insured Armored Express</strong>
                    <p>Estimated arrival: 2–3 business days with direct signature verification.</p>
                  </div>
                </div>
                <div className="order-details-line">
                  <LuShieldCheck size={18} color="#C6A15B" />
                  <div>
                    <strong>5-Year International Guarantee Activated</strong>
                    <p>Digital certificate registered to {formData.email}</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <Link
                  to="/orders"
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={handleClose}
                >
                  VIEW IN MY ORDERS
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={handleClose}
                >
                  RETURN TO BOUTIQUE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
