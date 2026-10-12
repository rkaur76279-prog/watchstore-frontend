import React, { useState } from 'react';
import { Eye, Truck, Ban, FileText, Copy, Check, Calendar, CreditCard } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const OrderCard = ({
  order,
  onViewDetails,
  onTrackOrder,
  onCancelOrder,
  onViewInvoice,
}) => {
  const [copied, setCopied] = useState(false);

  const primaryItem = order.items?.[0] || {};
  const isCancellable = order.status === 'Pending' || order.status === 'Processing';
  const isShipped = order.status === 'Shipped';

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="orders-glass-card order-mobile-card">
      {/* Card Header: Order ID & Status Badge */}
      <div className="order-mobile-card-header">
        <div>
          <button
            type="button"
            onClick={handleCopyId}
            className="order-id-badge"
            title="Click to copy order ID"
          >
            <span>{order.id}</span>
            {copied ? <Check size={11} color="#2ecc71" /> : <Copy size={11} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '11px', color: '#9ca3af' }}>
            <Calendar size={12} color="#C6A15B" />
            <span>{order.formattedDate}</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <OrderStatusBadge status={order.status} />
          <div style={{ marginTop: '4px' }}>
            <span
              className={`order-payment-badge ${
                order.paymentStatus === 'Paid'
                  ? 'paid'
                  : order.paymentStatus === 'Refunded'
                  ? 'refunded'
                  : ''
              }`}
            >
              {order.paymentStatus || 'Paid'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body: Thumbnail, details, and price */}
      <div className="order-mobile-card-body">
        <div className="order-thumb-wrap" style={{ width: '64px', height: '64px' }}>
          <img
            src={primaryItem.image || '/watch6.jpg'}
            alt={primaryItem.name || 'Swiss Timepiece'}
            className="order-thumb-img"
            onError={(e) => {
              e.target.src = '/watch6.jpg';
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h4 className="order-product-name" style={{ fontSize: '14px' }}>
            {primaryItem.name || 'Swiss Timepiece'}
            {order.items?.length > 1 && (
              <span style={{ fontSize: '11px', color: '#C6A15B', marginLeft: '6px' }}>
                +{order.items.length - 1} more
              </span>
            )}
          </h4>
          <p className="order-product-sub">
            {primaryItem.collection || 'Collection'} • {primaryItem.caseSize || '41mm'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Qty: <strong style={{ color: '#111827' }}>{order.totalQuantity || primaryItem.quantity || 1}</strong>
            </div>
            <div className="order-price-val" style={{ fontSize: '16px' }}>
              {formatCurrency(order.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="order-mobile-card-footer">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="order-btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Eye size={13} />
            <span>View Details</span>
          </button>

          {isShipped && (
            <button
              type="button"
              onClick={() => onTrackOrder(order)}
              className="order-btn-ghost"
              style={{ borderColor: 'rgba(198,161,91,0.4)', color: '#DFB76C' }}
            >
              <Truck size={13} />
              <span>Track</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewInvoice(order)}
            className="order-btn-ghost"
          >
            <FileText size={13} />
            <span>Invoice</span>
          </button>

          {isCancellable && (
            <button
              type="button"
              onClick={() => onCancelOrder(order)}
              className="order-btn-danger-ghost"
            >
              <Ban size={12} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
