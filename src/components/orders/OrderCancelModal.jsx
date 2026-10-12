import React, { useState } from 'react';
import { X, AlertTriangle, Ban, ArrowLeft } from 'lucide-react';

const REASON_OPTIONS = [
  'Changed preference regarding watch model or metal',
  'Need to update shipping coordinates to another residence',
  'Allocation placed in error / duplicate requisition',
  'Purchased alternate reference at local Geneva boutique',
  'Other administrative adjustment',
];

const OrderCancelModal = ({ order, isOpen, onClose, onConfirmCancel }) => {
  const [selectedReason, setSelectedReason] = useState(REASON_OPTIONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalReason = customNote.trim()
      ? `${selectedReason} - Note: ${customNote.trim()}`
      : selectedReason;

    setTimeout(() => {
      onConfirmCancel(order.id, finalReason);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  const primaryItem = order.items?.[0] || {};

  return (
    <div className="orders-modal-backdrop" onClick={onClose}>
      <div
        className="orders-modal-dialog"
        style={{ maxWidth: '520px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="cancel-modal-title"
      >
        {/* Header */}
        <div className="orders-modal-header" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 id="cancel-modal-title" style={{ fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Cancel Order #{order.id}
              </h3>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                Swiss Chronometer Registry • Requisition Cancellation
              </span>
            </div>
          </div>

          <button type="button" onClick={onClose} className="orders-modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="orders-modal-body" style={{ gap: '18px' }}>
            {/* Watch preview */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div className="order-thumb-wrap" style={{ width: '48px', height: '48px' }}>
                <img
                  src={primaryItem.image || '/watch6.jpg'}
                  alt={primaryItem.name}
                  className="order-thumb-img"
                  onError={(e) => {
                    e.target.src = '/watch6.jpg';
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', margin: 0 }}>
                  {primaryItem.name || 'Swiss Timepiece'}
                </h5>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                  Total Valuation: <strong style={{ color: '#C6A15B' }}>${order.total?.toLocaleString()}</strong>
                </span>
              </div>
            </div>

            {/* Warning alert */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#fca5a5',
                lineHeight: '1.5',
              }}
            >
              <strong>Important Notice:</strong> Cancelling will immediately release this private allocation back to the Geneva atelier vault. A full 100% refund of{' '}
              <strong>${order.total?.toLocaleString()}</strong> will be dispatched to your original settlement method.
            </div>

            {/* Reason selector */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C6A15B', fontWeight: '700', marginBottom: '8px' }}>
                Reason for Requisition Cancellation
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0c0f15',
                  border: '1px solid rgba(198, 161, 91, 0.3)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              >
                {REASON_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt} style={{ background: '#121620', color: '#ffffff' }}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional note */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', fontWeight: '600', marginBottom: '6px' }}>
                Client Concierge Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Additional instructions for Geneva Treasury..."
                style={{
                  width: '100%',
                  background: '#0c0f15',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: '#ffffff',
                  fontSize: '12px',
                  resize: 'none',
                }}
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="orders-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="order-btn-ghost"
            >
              <ArrowLeft size={13} />
              <span>Keep Order</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="order-btn-primary"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
              }}
            >
              <Ban size={14} />
              <span>{isSubmitting ? 'Cancelling Requisition...' : 'Confirm Cancellation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCancelModal;
