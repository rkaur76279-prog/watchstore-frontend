import React, { useState, useEffect, useRef } from 'react';
  import { X, Mail, Check, Loader2, Shield, Gem, Clock } from 'lucide-react';

/* ─── Perks shown inside the modal ─── */
const PERKS = [
  { icon: Gem,   label: 'Exclusive Access',  desc: 'Early allocation on limited editions' },
  { icon: Clock, label: 'New Arrivals First', desc: 'Private notifications before public release' },
  { icon: Shield,label: 'Members-Only Offers',desc: 'VIP pricing & certification events' },
];

const SubscribeModal = ({ isOpen, onClose }) => {
  const [email, setEmail]   = useState('');
  const [name,  setName]    = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | already
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  /* Auto-focus email input when modal opens */
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setName('');
      setStatus('idle');
      setMessage('');
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Prevent body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const validate = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }
    if (!validate(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), name: name.trim(), source: 'subscribe-modal' }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus(data.alreadySubscribed ? 'already' : 'success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Unable to connect. Please try again shortly.');
    }
  };

  if (!isOpen) return null;

  const isDone = status === 'success' || status === 'already';

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        id="subscribe-modal-backdrop"
        className="sub-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ── Modal Panel ── */}
      <div
        id="subscribe-modal"
        className="sub-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sub-modal-title"
      >
        {/* Close button */}
        <button
          id="subscribe-modal-close"
          className="sub-modal-close"
          onClick={onClose}
          aria-label="Close subscribe modal"
        >
          <X size={18} />
        </button>

        {/* Gold top accent bar */}
        <div className="sub-modal-accent-bar" />

        {/* Header */}
        <div className="sub-modal-header">
          <div className="sub-modal-icon-ring">
            <Mail size={22} color="#C6A15B" />
          </div>
          <span className="sub-modal-eyebrow">PRIVATE DISPATCH</span>
          <h2 id="sub-modal-title" className="sub-modal-title">
            Join the Inner Circle
          </h2>
          <p className="sub-modal-subtitle">
            Reserved for discerning collectors. Receive exclusive access to limited editions,
            private events, and superlative horological intelligence.
          </p>
        </div>

        {/* Perks list */}
        <div className="sub-modal-perks">
          {PERKS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="sub-perk-item">
              <div className="sub-perk-icon">
                <Icon size={14} color="#C6A15B" />
              </div>
              <div>
                <p className="sub-perk-label">{label}</p>
                <p className="sub-perk-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Success / Already State ── */}
        {isDone ? (
          <div className="sub-modal-success">
            <div className="sub-success-icon">
              <Check size={26} strokeWidth={2.5} color="#C6A15B" />
            </div>
            <h3 className="sub-success-title">
              {status === 'already' ? 'Already Enlisted' : 'You Are on the List'}
            </h3>
            <p className="sub-success-text">{message}</p>
            <button
              id="subscribe-success-close"
              className="sub-btn sub-btn-primary"
              onClick={onClose}
            >
              Continue to Boutique
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form
            id="subscribe-form"
            className="sub-modal-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Name (optional) */}
            <div className="sub-field">
              <label htmlFor="sub-name" className="sub-label">
                Your Name <span className="sub-optional">(optional)</span>
              </label>
              <input
                id="sub-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Harrison Vance"
                className="sub-input"
                autoComplete="name"
                disabled={status === 'loading'}
              />
            </div>

            {/* Email */}
            <div className="sub-field">
              <label htmlFor="sub-email" className="sub-label">
                Email Address <span className="sub-required">*</span>
              </label>
              <input
                id="sub-email"
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="your@email.com"
                className={`sub-input ${status === 'error' ? 'sub-input--error' : ''}`}
                autoComplete="email"
                disabled={status === 'loading'}
                required
              />
              {status === 'error' && (
                <p className="sub-error-text" role="alert">{message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="subscribe-submit-btn"
              type="submit"
              className="sub-btn sub-btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="sub-spinner" />
                  <span>Enrolling…</span>
                </>
              ) : (
                <span>SUBSCRIBE TO PRIVATE DISPATCH</span>
              )}
            </button>

            <p className="sub-disclaimer">
              <Shield size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Your privacy is absolute. Unsubscribe at any time with one click.
            </p>
          </form>
        )}
      </div>
    </>
  );
};

export default SubscribeModal;
