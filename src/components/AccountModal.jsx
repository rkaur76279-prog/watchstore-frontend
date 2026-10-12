import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import {
  LuShieldCheck,
  LuSparkles,
  LuKey,
  LuCrown,
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuAward,
  LuLogOut,
  LuCheck
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

const AccountModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, sendOtp, verifyOtp, updateUserDossier, logout } = useAuth();

  // Mode for unauthenticated: 'login' or 'register'
  const [authMode, setAuthMode] = useState('login');

  // Registration & Login Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Switzerland');
  const [tier, setTier] = useState('Oystersteel Privilege');

  // OTP Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync logged-in user details when modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setCountry(user.country || 'Switzerland');
      setTier(user.tier || 'Oystersteel Privilege');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setStep(1);
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [user, isOpen]);

  if (!isOpen) return null;

  // SEND OTP TO BACKEND
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please provide your client email.');
      return;
    }
    if (authMode === 'register' && !name.trim()) {
      setErrorMessage('Please provide your full client name or title.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const res = await sendOtp(email.trim());
    setLoading(false);

    if (res.success) {
      if (res.devCode) setDevOtp(res.devCode);
      setStep(2);
    } else {
      setErrorMessage(res.message || 'Failed to dispatch verification code from backend');
    }
  };

  // VERIFY OTP & SAVE ALL DATA TO BACKEND
  const handleVerifyOtpAndSave = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Send request to backend with all client fields
    const res = await verifyOtp({
      email: email.trim(),
      otp: code,
      name: name.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      tier,
    });
    setLoading(false);

    if (res.success) {
      setStep(3);
      setSuccessMessage('Client dossier authenticated and stored in backend database!');
      setTimeout(() => {
        setStep(1);
        setOtp(['', '', '', '', '', '']);
        onClose();
      }, 1800);
    } else {
      setErrorMessage(res.error || 'Verification failed. Please check the code.');
    }
  };

  // UPDATE EXISTING USER DOSSIER IN BACKEND
  const handleUpdateDossier = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await updateUserDossier({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      country: country.trim(),
      tier,
    });
    setLoading(false);

    if (res.success) {
      setSuccessMessage('✓ All account dossier data successfully saved in backend database!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(res.error || 'Failed to save dossier to backend database.');
    }
  };

  const handleDigitChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`modal-otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const autoFillDevCode = () => {
    if (devOtp && devOtp.length === 6) {
      setOtp(devOtp.split(''));
    }
  };

  return (
    <>
      <div className="drawer-backdrop active" onClick={onClose} />
      <div className="account-modal" style={{ maxWidth: '480px' }}>
        <button className="account-modal-close" onClick={onClose} aria-label="Close modal">
          <IoIosClose size={26} />
        </button>

        <div className="account-modal-content">
          <div className="account-modal-icon">
            <LuSparkles size={24} color="#C6A15B" />
          </div>
          <span className="section-label">ROLLEX CLIENT PRIVILEGE</span>
          <h2 className="account-modal-title">
            {isAuthenticated ? 'Client Privilege Dossier' : 'Sign In or Create Account'}
          </h2>
          <p className="account-modal-subtitle">
            {isAuthenticated
              ? 'Manage your confidential client registry, insured delivery coordinates, and timepiece warranties.'
              : 'Access private vault previews, track complimentary insured deliveries, and manage your timepiece guarantees.'}
          </p>

          {/* Feedback messages */}
          {errorMessage && (
            <div
              style={{
                background: 'rgba(231, 76, 60, 0.1)',
                border: '1px solid rgba(231, 76, 60, 0.3)',
                color: '#e74c3c',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '14px',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: 'rgba(46, 204, 113, 0.12)',
                border: '1px solid rgba(46, 204, 113, 0.4)',
                color: '#2ecc71',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '14px',
                textAlign: 'center',
                fontWeight: '600',
              }}
            >
              {successMessage}
            </div>
          )}

          {/* ================= IF USER IS LOGGED IN: EDIT & SAVE TO BACKEND ================= */}
          {isAuthenticated ? (
            <form onSubmit={handleUpdateDossier} className="account-modal-form">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(198, 161, 91, 0.1)',
                  border: '1px solid rgba(198, 161, 91, 0.3)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>
                    Serial Identifier
                  </div>
                  <div style={{ color: '#C6A15B', fontWeight: '700', fontSize: '12px' }}>
                    {user?.serialId || 'RLX-094812'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>
                    Geneva Guarantee
                  </div>
                  <div style={{ color: '#2ecc71', fontWeight: '600', fontSize: '12px' }}>
                    Superlative (Active)
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="account-label">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="account-input"
                  placeholder="Lord Harrison Sterling"
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="account-label">Client Email (Confidential)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="account-input"
                  style={{ background: 'rgba(0,0,0,0.04)', color: '#777', cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label className="account-label">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="account-input"
                    placeholder="+41 22 555 0199"
                  />
                </div>
                <div>
                  <label className="account-label">Privilege Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="account-input"
                    style={{ background: '#fff' }}
                  >
                    <option value="Oystersteel Privilege">Oystersteel Privilege</option>
                    <option value="Gold Reserve">Gold Reserve</option>
                    <option value="Master Collector">Master Collector</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="account-label">Delivery Address / Residence</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="account-input"
                  placeholder="Rue du Rhône 12"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label className="account-label">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="account-input"
                    placeholder="Geneva"
                  />
                </div>
                <div>
                  <label className="account-label">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="account-input"
                    placeholder="Switzerland"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '10px' }}
              >
                {loading ? 'SAVING TO BACKEND DATABASE...' : 'SAVE DOSSIER TO BACKEND'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to="/orders"
                    onClick={onClose}
                    style={{
                      fontSize: '11px',
                      color: '#C6A15B',
                      fontWeight: '700',
                      textDecoration: 'underline',
                    }}
                  >
                    My Orders ({' '}&rarr;)
                  </Link>
                  <Link
                    to="/auth"
                    onClick={onClose}
                    style={{
                      fontSize: '11px',
                      color: '#9ca3af',
                      fontWeight: '600',
                      textDecoration: 'underline',
                    }}
                  >
                    Vault Portal →
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#e74c3c',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  <LuLogOut size={14} /> Sign Out
                </button>
              </div>
            </form>
          ) : (
            /* ================= IF USER IS NOT LOGGED IN ================= */
            <>
              {/* Tab Selector: Sign In vs Register */}
              {step === 1 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '16px',
                    background: 'rgba(0,0,0,0.05)',
                    padding: '3px',
                    borderRadius: '6px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setErrorMessage('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderRadius: '4px',
                      background: authMode === 'login' ? '#fff' : 'transparent',
                      color: authMode === 'login' ? '#111' : '#777',
                      boxShadow: authMode === 'login' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Sign In with OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMessage('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      borderRadius: '4px',
                      background: authMode === 'register' ? '#fff' : 'transparent',
                      color: authMode === 'register' ? '#111' : '#777',
                      boxShadow: authMode === 'register' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Register Dossier
                  </button>
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="account-modal-form">
                  {authMode === 'register' && (
                    <div style={{ marginBottom: '12px' }}>
                      <label className="account-label">Full Name & Title</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Lord Harrison Sterling"
                        className="account-input"
                      />
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <label htmlFor="account-email" className="account-label">
                      Client Email Address
                    </label>
                    <input
                      id="account-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@rollex.ch"
                      className="account-input"
                    />
                  </div>

                  {authMode === 'register' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <label className="account-label">Phone (Optional)</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+41 22 555 0199"
                          className="account-input"
                        />
                      </div>
                      <div>
                        <label className="account-label">Privilege Tier</label>
                        <select
                          value={tier}
                          onChange={(e) => setTier(e.target.value)}
                          className="account-input"
                          style={{ background: '#fff' }}
                        >
                          <option value="Oystersteel Privilege">Oystersteel</option>
                          <option value="Gold Reserve">Gold Reserve</option>
                          <option value="Master Collector">Master Collector</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {loading
                      ? 'DISPATCHING FROM BACKEND...'
                      : authMode === 'register'
                      ? 'SEND VERIFICATION OTP & REGISTER'
                      : 'CONTINUE WITH OTP'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Link
                      to="/auth"
                      onClick={onClose}
                      style={{
                        fontSize: '11px',
                        color: '#C6A15B',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      Open Full Privilege Portal & Register →
                    </Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtpAndSave} className="account-modal-form">
                  <label className="account-label">
                    Enter 6-Digit Code sent to <strong>{email}</strong>
                  </label>

                  {devOtp && (
                    <div style={{ textAlign: 'center', margin: '6px 0 10px 0' }}>
                      <button
                        type="button"
                        onClick={autoFillDevCode}
                        style={{
                          background: 'rgba(198, 161, 91, 0.15)',
                          border: '1px dashed #C6A15B',
                          color: '#C6A15B',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        ⚡ Auto-Fill Code ({devOtp})
                      </button>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        id={`modal-otp-${i}`}
                        type="text"
                        maxLength="1"
                        value={d}
                        onChange={(e) => handleDigitChange(e.target.value, i)}
                        style={{
                          width: '100%',
                          height: '44px',
                          textAlign: 'center',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#C6A15B',
                          border: '1px solid #E8E8E8',
                          borderRadius: '4px',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {loading ? 'STORING DATA IN BACKEND...' : 'VERIFY & STORE IN BACKEND'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        fontSize: '11px',
                        color: '#666',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        textDecoration: 'underline',
                      }}
                    >
                      ← Back to Details
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <div className="account-modal-success">
                  <LuCrown size={32} color="#C6A15B" />
                  <h4>Welcome to Rollex Privilege</h4>
                  <p>Client dossier authenticated and securely stored in backend database.</p>
                </div>
              )}
            </>
          )}

          <div className="account-modal-footer">
            <span>Complimentary Concierge Service</span>
            <span>•</span>
            <span>Swiss Guarantee Registry</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountModal;
