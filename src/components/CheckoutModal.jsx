
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import {
  LuCheck,
  LuShieldCheck,
  LuCreditCard,
  LuTruck,
  LuLock,
  LuTag,
  LuX,
  LuLoader,
} from 'react-icons/lu';

import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, token } = useAuth();

  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const finalTotal = appliedPromo
    ? Math.max(0, Number(appliedPromo.finalTotal) || 0)
    : cartSubtotal;

  // Prefill authenticated user details
  useEffect(() => {
    if (!user) return;

    const parts = (user.name || '').trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email: user.email || prev.email,
      address: user.address || prev.address,
      city: user.city || prev.city,
      country: user.country || prev.country,
      postalCode: user.postalCode || prev.postalCode,
    }));
  }, [user]);

  // Reset promo and checkout state when opening the modal
  useEffect(() => {
    if (isOpen) {
      setAppliedPromo(null);
      setPromoInput('');
      setPromoError('');
      setStep(1);
      setOrderNumber('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate promo code using the existing backend API
  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      setPromoError('Please enter a promo code.');
      return;
    }

    setPromoLoading(true);
    setPromoError('');

    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code,
          cartTotal: cartSubtotal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setAppliedPromo(null);
        setPromoError(
          data.message || 'Invalid or expired promo code.'
        );
        return;
      }

      if (
        !Number.isFinite(Number(data.finalTotal)) ||
        Number(data.finalTotal) < 0
      ) {
        setAppliedPromo(null);
        setPromoError('The server returned an invalid discount total.');
        return;
      }

      setAppliedPromo(data);
      setPromoInput(data.code || code);
    } catch (error) {
      console.error('Promo validation error:', error);
      setPromoError(
        'Unable to validate promo code. Please try again.'
      );
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

    if (!cartItems.length) {
      setPromoError('Your cart is empty.');
      return;
    }

    const generatedId = `RLX-${Math.floor(
      100000 + Math.random() * 900000
    )}-GE`;

    setOrderNumber(generatedId);

    const clientEmail = (
      formData.email ||
      user?.email ||
      'client@rollex.ch'
    )
      .toLowerCase()
      .trim();

    const clientName =
      `${formData.firstName} ${formData.lastName}`.trim() ||
      user?.name ||
      'Client Privilege Member';

    // Save order through OrdersContext and the existing backend integration
    addOrder({
      id: generatedId,
      userEmail: clientEmail,
      userName: clientName,
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit / Debit Card',
      subtotal: cartSubtotal,
      discount: appliedPromo
        ? Number(appliedPromo.discountAmount) || 0
        : 0,
      promoCode: appliedPromo
        ? appliedPromo.code
        : undefined,
      total: finalTotal,
      totalQuantity: cartItems.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      ),
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
        serialNumber: `SN-${Math.floor(
          100000 + Math.random() * 900000
        )}-CH`,
      })),
      shippingAddress: {
        fullName: clientName,
        email: clientEmail,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: user?.phone || '',
      },
    });

    setStep(3);
    clearCart();
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const formatPrice = (amount) =>
    Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const renderSummary = (showShipping = false) => (
    <div className="checkout-order-summary-box">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>${formatPrice(cartSubtotal)}</span>
      </div>

      {appliedPromo && (
        <div className="summary-row discount-row">
          <span>Promo Discount ({appliedPromo.code})</span>
          <span className="text-emerald">
            −${formatPrice(appliedPromo.discountAmount)}
          </span>
        </div>
      )}

      {showShipping && (
        <div className="summary-row">
          <span>Insured Armored Express</span>
          <span className="text-gold">COMPLIMENTARY</span>
        </div>
      )}

      <div className="summary-row total-row">
        <span>Total Due</span>
        <span>${formatPrice(finalTotal)}</span>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="drawer-backdrop active"
        onClick={handleClose}
      />

      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
      >
        <div className="checkout-modal-header">
          <div className="checkout-steps">
            <span
              className={`checkout-step-badge ${
                step >= 1 ? 'active' : ''
              }`}
            >
              1. Shipping
            </span>

            <span className="checkout-step-divider">/</span>

            <span
              className={`checkout-step-badge ${
                step >= 2 ? 'active' : ''
              }`}
            >
              2. Payment
            </span>

            <span className="checkout-step-divider">/</span>

            <span
              className={`checkout-step-badge ${
                step >= 3 ? 'active' : ''
              }`}
            >
              3. Confirmation
            </span>
          </div>

          <button
            type="button"
            className="checkout-modal-close"
            onClick={handleClose}
            aria-label="Close checkout"
          >
            <IoIosClose size={26} />
          </button>
        </div>

        <div className="checkout-modal-body">
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div className="checkout-step-content">
              <div className="checkout-section-title">
                <h3>Complimentary Insured Courier Delivery</h3>
                <p>
                  All timepieces are hand-inspected, serialized,
                  and shipped via insured courier.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
              >
                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="given-name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">Delivery Address</label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="street-address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="address-level2"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="postal-code"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="country-name"
                      required
                    />
                  </div>
                </div>

                {/* PROMO CODE */}
                <div className="promo-section">
                  <div className="promo-section-header">
                    <LuTag size={15} color="#C6A15B" />
                    <span>Have a promo code?</span>
                  </div>

                  {!appliedPromo ? (
                    <div className="promo-input-row">
                      <input
                        type="text"
                        name="promoCode"
                        placeholder="Enter promo code"
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(
                            e.target.value.toUpperCase()
                          );
                          setPromoError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyPromo();
                          }
                        }}
                        className="account-input promo-code-input"
                      />

                      <button
                        type="button"
                        className="btn btn-secondary promo-apply-btn"
                        onClick={handleApplyPromo}
                        disabled={promoLoading}
                      >
                        {promoLoading ? (
                          <LuLoader
                            size={14}
                            className="promo-spinner"
                          />
                        ) : (
                          'APPLY'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="promo-applied-badge">
                      <LuCheck size={14} color="#22c55e" />

                      <span>
                        <strong>{appliedPromo.code}</strong>{' '}
                        applied —{' '}
                        {appliedPromo.discountType === 'percentage'
                          ? `${appliedPromo.discountValue}% OFF`
                          : `$${formatPrice(
                              appliedPromo.discountAmount
                            )} OFF`}
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

                  {promoError && (
                    <p className="promo-error-msg" role="alert">
                      {promoError}
                    </p>
                  )}
                </div>

                {renderSummary(true)}

                <button
                  type="submit"
                  className="btn btn-primary checkout-action-btn"
                  disabled={!cartItems.length || promoLoading}
                >
                  PROCEED TO PAYMENT
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div className="checkout-step-content">
              <div className="checkout-section-title">
                <h3>Secure Payment</h3>
                <p>
                  Complete your checkout using your payment
                  provider's secure payment process.
                </p>
              </div>

              <div className="payment-options">
                <div className="payment-option selected">
                  <LuCreditCard size={18} />
                  <span>
                    Credit / Debit Card (Visa, Mastercard, Amex)
                  </span>
                </div>
              </div>

              <form onSubmit={handleCompleteOrder}>
                <div
                  className="checkout-form-grid"
                  style={{ marginTop: '16px' }}
                >
                  <div className="form-group full-width">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="account-input"
                      placeholder="Enter card details in secure checkout"
                      autoComplete="cc-number"
                      inputMode="numeric"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="expDate">Expiration Date</label>
                    <input
                      id="expDate"
                      type="text"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleInputChange}
                      className="account-input"
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="cvv">CVV / CVC</label>
                    <input
                      id="cvv"
                      type="password"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="account-input"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                      required
                    />
                  </div>
                </div>

                <div className="checkout-security-badge">
                  <LuLock size={15} color="#C6A15B" />
                  <span>
                    Use a PCI-compliant payment gateway to process
                    card details securely. Do not store CVV data.
                  </span>
                </div>

                {renderSummary()}

                <div className="checkout-buttons-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setStep(1)}
                  >
                    ← BACK
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={!cartItems.length}
                  >
                    PLACE ORDER (${formatPrice(finalTotal)})
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && (
            <div className="checkout-success-view">
              <div className="success-icon-badge">
                <LuCheck size={36} color="#27AE60" />
              </div>

              <span className="section-label">
                ORDER REGISTERED
              </span>

              <h2>Thank You for Your Patronage</h2>

              <p className="order-number-display">
                Order Reference: <strong>{orderNumber}</strong>
              </p>

              <p className="success-description">
                Your order has been registered. You can review
                your order details in the My Orders section.
              </p>

              <div className="order-details-card">
                <div className="order-details-line">
                  <LuTruck size={18} color="#C6A15B" />

                  <div>
                    <strong>Insured Courier Delivery</strong>
                    <p>
                      Delivery estimates will be provided once
                      your order is confirmed and dispatched.
                    </p>
                  </div>
                </div>

                <div className="order-details-line">
                  <LuShieldCheck size={18} color="#C6A15B" />

                  <div>
                    <strong>Order Confirmation</strong>
                    <p>
                      Order details are associated with{' '}
                      {formData.email}.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                }}
              >
                <Link
                  to="/orders"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
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
