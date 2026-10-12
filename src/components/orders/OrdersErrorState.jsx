import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const OrdersErrorState = ({ error, onRetry }) => {
  return (
    <div
      className="orders-glass-card"
      style={{
        padding: '30px 24px',
        margin: '20px 0',
        borderColor: 'rgba(239, 68, 68, 0.4)',
        background: 'rgba(239, 68, 68, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertCircle size={22} />
        </div>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginBottom: '2px' }}>
            Swiss Registry Synchronization Notice
          </h4>
          <p style={{ color: '#fca5a5', fontSize: '12px', margin: 0 }}>
            {error || 'Unable to establish secure telemetry connection with Geneva registry server.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="order-btn-primary"
        style={{ background: '#ef4444', color: '#ffffff', boxShadow: 'none' }}
      >
        <RefreshCw size={13} />
        <span>Retry Handshake</span>
      </button>
    </div>
  );
};

export default OrdersErrorState;
