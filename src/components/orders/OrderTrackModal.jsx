import React from 'react';
import { X, Truck, ShieldCheck, MapPin, CheckCircle2, Clock, ExternalLink, Navigation } from 'lucide-react';

const OrderTrackModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const courier = order.courier || {};
  const checkpoints = courier.checkpoints || [
    { time: 'Oct 07, 2026 - 11:00 AM', status: 'Consignment packaged under diplomatic seal', location: 'Geneva Manufacture Atelier' },
    { time: 'Oct 08, 2026 - 03:30 PM', status: 'Transferred to Zurich Air Logistics Hub', location: 'Zurich Vault, Switzerland' },
    { time: 'Oct 09, 2026 - 08:15 AM', status: 'In armored flight transit to destination city', location: 'Air Cargo Transit' },
  ];

  return (
    <div className="orders-modal-backdrop" onClick={onClose}>
      <div
        className="orders-modal-dialog"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="track-modal-title"
      >
        {/* Modal Header */}
        <div className="orders-modal-header">
          <div>
            <div className="orders-registry-tag" style={{ marginBottom: '4px' }}>
              <Truck size={12} />
              <span>ARMORED COURIER TELEMETRY</span>
            </div>
            <h3 id="track-modal-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#ffffff', margin: 0 }}>
              Live Tracking: Order #{order.id}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="orders-modal-close-btn" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="orders-modal-body" style={{ gap: '20px' }}>
          {/* Active Courier Status Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(18, 24, 34, 0.9) 0%, rgba(12, 16, 24, 0.95) 100%)',
              border: '1px solid rgba(198, 161, 91, 0.35)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 0 30px rgba(198, 161, 91, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>
                  Carrier Service
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: '2px 0 4px 0' }}>
                  {courier.name || 'Malca-Amit Armored Transit'}
                </h4>
                <span style={{ fontSize: '12px', color: '#C6A15B' }}>
                  {courier.serviceLevel || 'White-Glove Armed Security Escort'}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9ca3af' }}>
                  Waybill Identifier
                </span>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: '700', color: '#C6A15B' }}>
                  {courier.trackingNumber || 'MA-CH-9482104-NX'}
                </div>
                <div style={{ fontSize: '11px', color: '#2ecc71', fontWeight: '600', marginTop: '2px' }}>
                  • Biometric Escort Active
                </div>
              </div>
            </div>

            {/* Current Status Banner */}
            <div
              style={{
                background: 'rgba(198, 161, 91, 0.12)',
                border: '1px solid rgba(198, 161, 91, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div className="status-pulse-dot shipped" style={{ width: '8px', height: '8px' }} />
              <div style={{ fontSize: '12px' }}>
                <strong style={{ color: '#ffffff' }}>Latest Telemetry Update: </strong>
                <span style={{ color: '#dfcaa0' }}>
                  {courier.statusMessage || 'In transit: Cleared international security screening.'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <div>
                <span style={{ color: '#9ca3af', display: 'block', fontSize: '11px' }}>Current Transit Hub</span>
                <strong style={{ color: '#ffffff' }}>{courier.currentLocation || 'Zurich, Switzerland'}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#9ca3af', display: 'block', fontSize: '11px' }}>Estimated Handover</span>
                <strong style={{ color: '#C6A15B' }}>{courier.estimatedDelivery || 'Oct 11, 2026'}</strong>
              </div>
            </div>
          </div>

          {/* Destination Coordinates */}
          <div className="orders-glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Navigation size={14} color="#C6A15B" />
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#C6A15B', fontWeight: '700' }}>
                Delivery Destination
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
              {order.shippingAddress?.fullName}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
              {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
            </p>
          </div>

          {/* Audit Trail Checkpoints */}
          <div className="orders-glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C6A15B', fontWeight: '700', marginBottom: '16px' }}>
              Consignment Audit Log
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {checkpoints.map((cp, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: i === checkpoints.length - 1 ? '#C6A15B' : 'rgba(198, 161, 91, 0.2)',
                      color: i === checkpoints.length - 1 ? '#0c0e12' : '#C6A15B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>
                      {cp.status}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                      {cp.location} • <span style={{ color: '#C6A15B' }}>{cp.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="orders-modal-footer">
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            Live telemetry provided via Swiss Chronometer Registry partner relay.
          </span>
          <button type="button" onClick={onClose} className="order-btn-primary">
            <span>Dismiss Telemetry</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackModal;
