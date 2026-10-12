import React from 'react';

const OrdersLoadingSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="orders-glass-card"
          style={{
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            background: 'rgba(18, 22, 30, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                animation: 'skeletonShimmer 1.5s infinite linear',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div
                style={{
                  width: '120px',
                  height: '14px',
                  borderRadius: '4px',
                  background: 'rgba(198, 161, 91, 0.15)',
                }}
              />
              <div
                style={{
                  width: '260px',
                  height: '18px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                }}
              />
              <div
                style={{
                  width: '180px',
                  height: '12px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.04)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '90px',
                height: '24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
              }}
            />
            <div
              style={{
                width: '80px',
                height: '20px',
                borderRadius: '4px',
                background: 'rgba(198, 161, 91, 0.2)',
              }}
            />
            <div
              style={{
                width: '100px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(198, 161, 91, 0.25)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersLoadingSkeleton;
