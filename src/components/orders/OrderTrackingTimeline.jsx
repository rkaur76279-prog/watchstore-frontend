import React from 'react';
import { Check, Clock, Truck, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';

const OrderTrackingTimeline = ({ timeline = [], status = '', cancellationReason = '' }) => {
  const isCancelled = status === 'Cancelled';

  // Standard stages
  const standardStages = [
    { key: 'Order Placed', label: 'Order Placed', icon: Clock },
    { key: 'Processing', label: 'Processing & COSC Test', icon: ShieldCheck },
    { key: 'Shipped', label: 'Armored Courier Transit', icon: Truck },
    { key: 'Delivered', label: 'Signed Handover', icon: Check },
  ];

  if (isCancelled) {
    return (
      <div className="order-timeline-card" style={{ borderColor: 'rgba(239, 68, 68, 0.35)' }}>
        <div className="order-timeline-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={16} color="#ef4444" />
            <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ef4444', fontWeight: '700' }}>
              Order Lifecycle Status: Cancelled & Refunded
            </h4>
          </div>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>Consignment Voided</span>
        </div>

        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#fca5a5', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} /> Cancellation Justification:
          </div>
          <p style={{ fontSize: '12px', color: '#e5e7eb', margin: 0 }}>
            {cancellationReason || 'Client initiated cancellation prior to final white-glove security dispatch.'}
          </p>
        </div>

        <div className="order-timeline-steps">
          {timeline.map((step, idx) => (
            <div key={idx} className="timeline-step-item">
              <div className="timeline-node-wrap">
                <div className={`timeline-node-icon ${step.isCancelled ? 'cancelled' : 'completed'}`}>
                  {step.isCancelled ? <XCircle size={15} /> : <Check size={14} />}
                </div>
                {idx < timeline.length - 1 && (
                  <div className={`timeline-connector-line ${step.isCancelled ? '' : 'completed'}`} />
                )}
              </div>
              <div className="timeline-step-content">
                <div className="timeline-step-title" style={{ color: step.isCancelled ? '#ef4444' : '#ffffff' }}>
                  {step.title}
                </div>
                <div className="timeline-step-desc">{step.description}</div>
                <div className="timeline-step-time" style={{ color: step.isCancelled ? '#fca5a5' : '#C6A15B' }}>
                  {step.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate status progress index
  const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIdx = Math.max(0, statusOrder.indexOf(status));

  return (
    <div className="order-timeline-card">
      <div className="order-timeline-title-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#C6A15B" />
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C6A15B', fontWeight: '700' }}>
            Chronometer Registry Journey
          </h4>
        </div>
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>Superlative Tracking Active</span>
      </div>

      <div className="order-timeline-steps">
        {standardStages.map((stageItem, idx) => {
          const isCompleted = idx < currentIdx || (idx === currentIdx && status === 'Delivered');
          const isCurrent = idx === currentIdx && status !== 'Delivered';
          const isPending = idx > currentIdx;

          // Find step info from custom timeline if present
          const timelineStep = timeline.find(
            (t) => (t.stage || '').toLowerCase() === stageItem.key.toLowerCase()
          );

          let nodeClass = 'pending';
          if (isCompleted) nodeClass = 'completed';
          else if (isCurrent) nodeClass = 'current';

          const IconComp = stageItem.icon;

          return (
            <div key={stageItem.key} className="timeline-step-item">
              <div className="timeline-node-wrap">
                <div className={`timeline-node-icon ${nodeClass}`}>
                  {isCompleted ? <Check size={14} /> : <IconComp size={14} />}
                </div>
                {idx < standardStages.length - 1 && (
                  <div className={`timeline-connector-line ${isCompleted ? 'completed' : ''}`} />
                )}
              </div>

              <div className="timeline-step-content">
                <div className={`timeline-step-title ${isCurrent ? 'current' : ''}`}>
                  <span>{stageItem.label}</span>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: '9px',
                        textTransform: 'uppercase',
                        background: 'rgba(198,161,91,0.2)',
                        color: '#C6A15B',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Active Stage
                    </span>
                  )}
                </div>

                <div className="timeline-step-desc">
                  {timelineStep?.description ||
                    (stageItem.key === 'Order Placed'
                      ? 'Requisition logged and client funds verified in escrow'
                      : stageItem.key === 'Processing'
                      ? 'Calibre tolerance & waterproof pressure testing at Geneva atelier'
                      : stageItem.key === 'Shipped'
                      ? 'Consignment sealed in armored courier vehicle with armed escort'
                      : 'Physical biometric signature and chronometer certificate activation')}
                </div>

                <div className="timeline-step-time">
                  {timelineStep?.timestamp ||
                    (isCompleted ? 'Completed' : isCurrent ? 'In Progress Today' : 'Pending')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
