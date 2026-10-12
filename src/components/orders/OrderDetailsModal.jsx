import React from 'react';
import {
  X,
  Truck,
  FileText,
  Ban,
  ShieldCheck,
  MapPin,
  CreditCard,
  Crown,
  Calendar,
  Sparkles,
} from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTrackingTimeline from './OrderTrackingTimeline';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const OrderDetailsModal = ({
  order,
  isOpen,
  onClose,
  onTrackOrder,
  onCancelOrder,
  onViewInvoice,
}) => {
  if (!isOpen || !order) return null;

  const isCancellable = order.status === 'Pending' || order.status === 'Processing';
  const isShipped = order.status === 'Shipped';
  const primaryItem = order.items?.[0] || {};

  return (
    <div className="orders-modal-backdrop" onClick={onClose}>
      <div
        className="orders-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="order-details-title"
      >
        {/* Modal Header */}
        <div className="orders-modal-header">
          <div>
            <div className="orders-registry-tag" style={{ marginBottom: '4px' }}>
              <Crown size={12} />
              <span>SWISS CHRONOMETER DOSSIER</span>
            </div>
            <h3
              id="order-details-title"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '22px',
                color: '#111827',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <span>Order #{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6b7280', marginTop: '4px', flexWrap: 'wrap' }}>
              <Calendar size={12} color="#C6A15B" />
              <span>Requisition Placed: {order.formattedDate || order.date}</span>
              <span>•</span>
              <span style={{ color: '#C6A15B' }}>Certificate: {order.chronometerCertificate || 'CH-COSC-ACTIVE'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="orders-modal-close-btn"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="orders-modal-body">
          {/* Tracking Timeline */}
          <OrderTrackingTimeline
            timeline={order.timeline}
            status={order.status}
            cancellationReason={order.cancellationReason}
          />

          {/* Timepiece Requisition Items */}
          <div className="orders-glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C6A15B', fontWeight: '700' }}>
                Acquired Timepiece ({order.items?.length || 1} Item)
              </h4>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Superlative Precision</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                  }}
                >
                  <div className="order-thumb-wrap" style={{ width: '68px', height: '68px', flexShrink: 0 }}>
                    <img
                      src={item.image || '/watch6.jpg'}
                      alt={item.name}
                      className="order-thumb-img"
                      onError={(e) => {
                        e.target.src = '/watch6.jpg';
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#4b5563', margin: '2px 0 0 0' }}>
                          {item.collection} • {item.dialColor || 'Bespoke Dial'} • {item.caseSize || '41mm'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="order-price-val" style={{ fontSize: '16px' }}>
                          {formatCurrency(item.price)}
                        </div>
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Qty: {item.quantity || 1}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', color: '#C6A15B', background: 'rgba(198,161,91,0.1)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(198,161,91,0.2)' }}>
                        {item.calibre || 'Superlative Chronometer Calibre'}
                      </span>
                      {item.serialNumber && (
                        <span style={{ fontSize: '10px', color: '#4b5563', background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '2px 8px', borderRadius: '4px' }}>
                          Serial: {item.serialNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid: Shipping Information & Payment / Financials */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {/* Shipping Coordinates */}
            <div className="orders-glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <MapPin size={16} color="#C6A15B" />
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C6A15B', fontWeight: '700', margin: 0 }}>
                  Insured Delivery Coordinates
                </h4>
              </div>

              <div style={{ fontSize: '12px', color: '#374151', lineHeight: '1.6' }}>
                <p style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                  {order.shippingAddress?.fullName || 'Client Privilege Member'}
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress?.address || 'Quai du Mont-Blanc 19'}</p>
                <p style={{ margin: 0 }}>
                  {order.shippingAddress?.city || 'Geneva'}, {order.shippingAddress?.postalCode || '1201'}
                </p>
                <p style={{ margin: 0 }}>{order.shippingAddress?.country || 'Switzerland'}</p>
                {order.shippingAddress?.phone && (
                  <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>Tel: {order.shippingAddress.phone}</p>
                )}
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#6b7280' }}>Armored Courier:</span>
                  <span style={{ color: '#111827', fontWeight: '600' }}>{order.courier?.name || 'Malca-Amit'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#6b7280' }}>Consignment Tracking:</span>
                  <span style={{ color: '#C6A15B', fontFamily: 'monospace', fontWeight: '600' }}>
                    {order.courier?.trackingNumber || 'MA-CH-9482104'}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Summary & Payment */}
            <div className="orders-glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <CreditCard size={16} color="#C6A15B" />
                <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#C6A15B', fontWeight: '700', margin: 0 }}>
                  Settlement & Summary
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: '#111827' }}>{formatCurrency(order.subtotal || order.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>White-Glove Armored Courier:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Complimentary ($0.00)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Swiss COSC Registry Seal:</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>Included ($0.00)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                  <span>Geneva Duty & VAT:</span>
                  <span style={{ color: '#111827' }}>$0.00 (Privilege Exempt)</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(198, 161, 91, 0.25)',
                    paddingTop: '10px',
                    marginTop: '4px',
                    fontSize: '15px',
                    fontWeight: '700',
                  }}
                >
                  <span style={{ color: '#111827' }}>Total Paid:</span>
                  <span style={{ color: '#C6A15B' }}>{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: '#6b7280' }}>Payment Channel:</span>
                  <span style={{ color: '#111827' }}>{order.paymentMethod || 'Geneva Escrow Wire'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Transaction Ref:</span>
                  <span style={{ color: '#6b7280', fontFamily: 'monospace' }}>{order.transactionRef || 'TXN-902184'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warranty & Guarantee Banner */}
          <div
            style={{
              background: 'rgba(198, 161, 91, 0.08)',
              border: '1px solid rgba(198, 161, 91, 0.3)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <ShieldCheck size={28} color="#C6A15B" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12px' }}>
              <strong style={{ color: '#111827', display: 'block' }}>
                {order.warrantyPeriod || '6-Year International Superlative Guarantee'}
              </strong>
              <span style={{ color: '#4b5563' }}>
                Protected by Swiss Chronometer Registry Geneva. Serial verification ID: {order.chronometerCertificate}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="orders-modal-footer">
          <div style={{ display: 'flex', gap: '8px' }}>
            {isCancellable && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCancelOrder(order);
                }}
                className="order-btn-danger-ghost"
              >
                <Ban size={13} />
                <span>Cancel Requisition</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewInvoice(order);
              }}
              className="order-btn-ghost"
            >
              <FileText size={14} />
              <span>Print Official Invoice</span>
            </button>

            {isShipped && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onTrackOrder(order);
                }}
                className="order-btn-primary"
              >
                <Truck size={14} />
                <span>Live Armored Tracking</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="order-btn-ghost"
            >
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
