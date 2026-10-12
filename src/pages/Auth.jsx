import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  LuShieldCheck,
  LuLock,
  LuMail,
  LuUser,
  LuEye,
  LuEyeOff,
  LuArrowRight,
  LuCheck,
  LuCrown,
  LuKey,
  LuFingerprint,
  LuClock,
  LuSparkles,
  LuLogOut,
} from 'react-icons/lu';
import { Package } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import OrdersDashboard from '../components/orders/OrdersDashboard';
import './Auth.css';

const Auth = ({ initialMode }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, register, logout, sendOtp, verifyOtp, isLoading, error: authError } = useAuth();
  const { stats } = useOrders();
  const { showToast } = useCart();
  const [devOtpHint, setDevOtpHint] = useState('');

  const modeParam = searchParams.get('mode');
  const [mode, setMode] = useState(initialMode || modeParam || 'login');

  const tabParam = searchParams.get('tab');
  const [dashboardTab, setDashboardTab] = useState(tabParam || 'orders');

  const [loginMethod, setLoginMethod] = useState('password');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regTier] = useState('Oystersteel Privilege');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (modeParam && (modeParam === 'login' || modeParam === 'register')) {
      setMode(modeParam);
    }
  }, [modeParam]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setFormError('');
    setSearchParams({ mode: newMode });
  };

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', class: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const classes = ['', 'strength-weak', 'strength-fair', 'strength-good', 'strength-superlative'];
    return { score, label: labels[score] || 'Weak', class: classes[score] || 'strength-weak' };
  };

  const strength = calculatePasswordStrength(regPassword);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!loginEmail) { setFormError('Please enter your email address.'); return; }

    if (loginMethod === 'otp') {
      const code = otpCode.join('');
      if (code.length < 6) { setFormError('Please enter the complete 6-digit code.'); return; }
      const res = await verifyOtp({ email: loginEmail, otp: code });
      if (res.success) showToast(`Welcome back, ${res.user.name}!`);
      else setFormError(res.error || 'Invalid verification code.');
      return;
    }

    if (!loginPassword) { setFormError('Please enter your password.'); return; }
    const res = await login({ email: loginEmail, password: loginPassword, rememberMe });
    if (res.success) showToast(`Welcome back, ${res.user.name}!`);
    else setFormError(res.error || 'Invalid email or password.');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!regName.trim()) { setFormError('Please enter your full name.'); return; }
    if (!regEmail.trim()) { setFormError('Please enter your email address.'); return; }
    if (regPassword.length < 6) { setFormError('Password must be at least 6 characters.'); return; }
    if (regPassword !== regConfirmPassword) { setFormError('Passwords do not match.'); return; }
    if (!acceptTerms) { setFormError('Please accept the terms to continue.'); return; }

    const res = await register({ name: regName, email: regEmail, password: regPassword, tier: regTier });
    if (res.success) showToast(`Account created! Welcome, ${res.user.name}.`);
    else setFormError(res.error || 'Registration failed. Try again.');
  };

  const handleSendOtp = async () => {
    if (!loginEmail) { setFormError('Enter your email address first.'); return; }
    setFormError('');
    const res = await sendOtp(loginEmail);
    if (res.success) {
      setOtpSent(true);
      setOtpTimer(60);
      if (res.devCode) setDevOtpHint(res.devCode);
      showToast('Verification code sent to your email.');
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      setFormError(res.message || 'Failed to send verification code.');
    }
  };

  const handleOtpInputChange = (val, idx) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpCode];
    newOtp[idx] = val.slice(-1);
    setOtpCode(newOtp);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-box-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleForgotSubmitEmail = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStep(2);
  };

  const handleForgotResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) return;
    setForgotStep(3);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setMode('login');
    }, 2000);
  };

  // ─── AUTHENTICATED DASHBOARD ─────────────────────────────────────────────
  if (isAuthenticated && user) {
    return (
      <div className="auth-light-dashboard">
        <div className="auth-light-dashboard-inner">
          {/* Tab switcher */}
          <div className="auth-light-tabs">
            <button
              type="button"
              className={`auth-light-tab ${dashboardTab === 'orders' ? 'active' : ''}`}
              onClick={() => setDashboardTab('orders')}
            >
              <Package size={15} />
              My Orders ({stats.totalOrders})
            </button>
            <button
              type="button"
              className={`auth-light-tab ${dashboardTab === 'dossier' ? 'active' : ''}`}
              onClick={() => setDashboardTab('dossier')}
            >
              <LuUser size={15} />
              My Account
            </button>
          </div>

          {dashboardTab === 'orders' ? (
            <OrdersDashboard />
          ) : (
            <div className="auth-light-profile-card">
              <div className="auth-light-profile-header">
                <div className="auth-light-avatar">{(user.name || 'C').charAt(0)}</div>
                <div>
                  <h2 className="auth-light-profile-name">{user.name}</h2>
                  <p className="auth-light-profile-email">{user.email}</p>
                  <span className="auth-light-tier-badge">
                    <LuCrown size={11} /> {user.tier || 'Oystersteel Privilege'}
                  </span>
                </div>
              </div>

              <div className="auth-light-profile-grid">
                <div className="auth-light-profile-field">
                  <span className="auth-lpf-label">Client ID</span>
                  <span className="auth-lpf-val gold">{user.serialId || '—'}</span>
                </div>
                <div className="auth-light-profile-field">
                  <span className="auth-lpf-label">Member Since</span>
                  <span className="auth-lpf-val">{user.memberSince || '2026'}</span>
                </div>
                <div className="auth-light-profile-field">
                  <span className="auth-lpf-label">Total Orders</span>
                  <span className="auth-lpf-val">{stats.totalOrders}</span>
                </div>
                <div className="auth-light-profile-field">
                  <span className="auth-lpf-label">Active Orders</span>
                  <span className="auth-lpf-val">{stats.pendingOrders}</span>
                </div>
              </div>

              <div className="auth-light-profile-actions">
                <button
                  type="button"
                  onClick={() => setDashboardTab('orders')}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Package size={14} /> VIEW MY ORDERS
                </button>
                <Link to="/shop" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                  SHOP NOW
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); showToast('Signed out successfully.'); }}
                  className="auth-light-signout-btn"
                >
                  <LuLogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── LOGIN / REGISTER ─────────────────────────────────────────────────────
  return (
    <div className="auth-light-page">
      <div className="auth-light-card">
        {/* Brand Header */}
        <div className="auth-light-brand">
          <div className="auth-light-logo">
            <LuCrown size={22} color="#C6A15B" />
          </div>
          <div>
            <div className="auth-light-brand-name">SWISS CHRONOMETER</div>
            <div className="auth-light-brand-sub">REGISTRY</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="auth-light-mode-tabs">
          <button
            type="button"
            className={`auth-light-mode-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-light-mode-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('register')}
          >
            Create Account
          </button>
        </div>

        {/* Error Area */}
        {(formError || authError) && (
          <div className="auth-light-error-box">
            {formError || authError}
          </div>
        )}

        {/* ── LOGIN ── */}
        {mode === 'login' && (
          <div>
            <h1 className="auth-light-heading">Welcome back</h1>
            <p className="auth-light-subheading">Sign in to access your orders and account.</p>

            {/* Login method toggle */}
            <div className="auth-light-method-toggle">
              <button
                type="button"
                className={`auth-light-method-btn ${loginMethod === 'password' ? 'active' : ''}`}
                onClick={() => setLoginMethod('password')}
              >
                <LuLock size={13} /> Password
              </button>
              <button
                type="button"
                className={`auth-light-method-btn ${loginMethod === 'otp' ? 'active' : ''}`}
                onClick={() => setLoginMethod('otp')}
              >
                <LuMail size={13} /> Email OTP
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} noValidate>
              <div className="auth-light-field">
                <label className="auth-light-label" htmlFor="login-email">Email Address</label>
                <div className="auth-light-input-wrap">
                  <LuMail className="auth-light-input-icon" size={16} />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-light-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div className="auth-light-field">
                  <div className="auth-light-label-row">
                    <label className="auth-light-label" htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="auth-light-forgot-link"
                      onClick={() => { setForgotEmail(loginEmail); setIsForgotModalOpen(true); }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-light-input-wrap">
                    <LuLock className="auth-light-input-icon" size={16} />
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-light-input"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="auth-light-eye-btn"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label="Toggle password"
                    >
                      {showLoginPassword ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="auth-light-field">
                  <div className="auth-light-label-row">
                    <label className="auth-light-label">Verification Code</label>
                    {otpSent && otpTimer > 0 && (
                      <span className="auth-light-otp-timer">Resend in {otpTimer}s</span>
                    )}
                  </div>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="auth-light-otp-send-btn"
                    >
                      <LuMail size={14} /> Send Code to Email
                    </button>
                  ) : (
                    <>
                      <div className="auth-light-otp-grid">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpInputChange(e.target.value, idx)}
                            className="auth-light-otp-box"
                          />
                        ))}
                      </div>
                      {devOtpHint && (
                        <button
                          type="button"
                          onClick={() => setOtpCode(devOtpHint.split(''))}
                          className="auth-light-dev-hint"
                        >
                          Dev: Auto-fill {devOtpHint}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="auth-light-checkbox-row" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`auth-light-checkbox ${rememberMe ? 'checked' : ''}`}>
                  {rememberMe && <LuCheck size={11} />}
                </div>
                <span className="auth-light-checkbox-label">Keep me signed in</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-light-submit-btn"
              >
                {isLoading ? (
                  <><div className="auth-light-spinner" /> Signing in…</>
                ) : (
                  <><span>Sign In</span><LuArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="auth-light-switch">
              Don't have an account?{' '}
              <button type="button" className="auth-light-switch-btn" onClick={() => handleModeSwitch('register')}>
                Create one →
              </button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {mode === 'register' && (
          <div>
            <h1 className="auth-light-heading">Create your account</h1>
            <p className="auth-light-subheading">Join the Swiss Chronometer Registry today.</p>

            <form onSubmit={handleRegisterSubmit} noValidate>
              <div className="auth-light-field">
                <label className="auth-light-label" htmlFor="reg-name">Full Name</label>
                <div className="auth-light-input-wrap">
                  <LuUser className="auth-light-input-icon" size={16} />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your full name"
                    className="auth-light-input"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="auth-light-field">
                <label className="auth-light-label" htmlFor="reg-email">Email Address</label>
                <div className="auth-light-input-wrap">
                  <LuMail className="auth-light-input-icon" size={16} />
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-light-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-light-field">
                <label className="auth-light-label" htmlFor="reg-password">Password</label>
                <div className="auth-light-input-wrap">
                  <LuLock className="auth-light-input-icon" size={16} />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="auth-light-input"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-light-eye-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    aria-label="Toggle password"
                  >
                    {showRegPassword ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                  </button>
                </div>
                {regPassword && (
                  <div className={`auth-light-strength ${strength.class}`}>
                    <div className="auth-light-strength-bars">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`auth-light-strength-bar ${strength.score >= i ? 'filled' : ''}`} />
                      ))}
                    </div>
                    <span className="auth-light-strength-label">{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="auth-light-field">
                <label className="auth-light-label" htmlFor="reg-confirm">Confirm Password</label>
                <div className="auth-light-input-wrap">
                  <LuShieldCheck className="auth-light-input-icon" size={16} />
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="auth-light-input"
                    autoComplete="new-password"
                  />
                </div>
                {regConfirmPassword && regPassword !== regConfirmPassword && (
                  <span className="auth-light-field-error">Passwords do not match.</span>
                )}
              </div>

              <div className="auth-light-checkbox-row" onClick={() => setAcceptTerms(!acceptTerms)}>
                <div className={`auth-light-checkbox ${acceptTerms ? 'checked' : ''}`}>
                  {acceptTerms && <LuCheck size={11} />}
                </div>
                <span className="auth-light-checkbox-label">
                  I accept the Terms of Service and Privacy Policy
                </span>
              </div>

              <button type="submit" disabled={isLoading} className="auth-light-submit-btn">
                {isLoading ? (
                  <><div className="auth-light-spinner" /> Creating account…</>
                ) : (
                  <><span>Create Account</span><LuArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="auth-light-switch">
              Already have an account?{' '}
              <button type="button" className="auth-light-switch-btn" onClick={() => handleModeSwitch('login')}>
                Sign in →
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="auth-light-modal-backdrop" onClick={() => setIsForgotModalOpen(false)}>
          <div className="auth-light-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-light-modal-close"
              onClick={() => setIsForgotModalOpen(false)}
              aria-label="Close"
            >✕</button>

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmitEmail}>
                <h3 className="auth-light-modal-title">Reset Password</h3>
                <p className="auth-light-modal-sub">Enter your email to receive a reset code.</p>
                <div className="auth-light-field">
                  <label className="auth-light-label">Email Address</label>
                  <div className="auth-light-input-wrap">
                    <LuMail className="auth-light-input-icon" size={16} />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="auth-light-input"
                    />
                  </div>
                </div>
                <button type="submit" className="auth-light-submit-btn">Send Reset Code</button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotResetPassword}>
                <h3 className="auth-light-modal-title">Enter Code</h3>
                <p className="auth-light-modal-sub">Code sent to <strong>{forgotEmail}</strong>.</p>
                <div className="auth-light-field">
                  <input
                    type="text"
                    maxLength="6"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    className="auth-light-input"
                    style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '20px' }}
                  />
                </div>
                <div className="auth-light-field">
                  <label className="auth-light-label">New Password</label>
                  <div className="auth-light-input-wrap">
                    <LuLock className="auth-light-input-icon" size={16} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="auth-light-input"
                    />
                  </div>
                </div>
                <button type="submit" className="auth-light-submit-btn">Update Password</button>
              </form>
            )}

            {forgotStep === 3 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <LuShieldCheck size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                <h3 className="auth-light-modal-title">Password Updated</h3>
                <p className="auth-light-modal-sub">Redirecting to sign in…</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
