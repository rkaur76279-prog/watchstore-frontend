import React, { useState } from 'react';
import { Eye, Truck, Ban, FileText, Copy, Check } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const OrderRow = ({
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
    <tr>
      {/* 1. Order ID */}
      <td>
        <button
          type="button"
          onClick={handleCopyId}
          className="order-id-badge"
          title="Click to copy order ID"
        >
          <span>{order.id}</span>
          {copied ? <Check size={12} color="#2ecc71" /> : <Copy size={12} />}
        </button>
      </td>

      {/* 2. Product Name & Thumb */}
      <td>
        <div className="order-product-cell">
          <div className="order-thumb-wrap">
            <img
              src={primaryItem.image || '/watch6.jpg'}
              alt={primaryItem.name || 'Swiss Timepiece'}
              className="order-thumb-img"
              onError={(e) => {
                e.target.src = '/watch6.jpg';
              }}
            />
          </div>
          <div>
            <div className="order-product-name">
              {primaryItem.name || 'Swiss Chronometer Watch'}
              {order.items?.length > 1 && (
                <span style={{ fontSize: '11px', color: '#C6A15B', marginLeft: '6px' }}>
                  +{order.items.length - 1} more
                </span>
              )}
            </div>
            <div className="order-product-sub">
              {primaryItem.collection || 'Geneva Collection'} • {primaryItem.caseSize || '41mm'}
            </div>
          </div>
        </div>
      </td>

      {/* 3. Order Date */}
      <td>
        <span style={{ color: '#4b5563', fontSize: '13px' }}>{order.formattedDate}</span>
      </td>

      {/* 4. Quantity */}
      <td>
        <span style={{ color: '#111827', fontWeight: '600' }}>
          {order.totalQuantity || primaryItem.quantity || 1}
        </span>
      </td>

      {/* 5. Total Price */}
      <td>
        <span className="order-price-val">{formatCurrency(order.total)}</span>
      </td>

      {/* 6. Payment Status */}
      <td>
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
      </td>

      {/* 7. Order Status */}
      <td>
        <OrderStatusBadge status={order.status} />
      </td>

      {/* 8. Actions */}
      <td>
        <div className="order-actions-cell">
          {/* View Details button */}
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="order-btn-primary"
            title="View full order details & tracking timeline"
          >
            <Eye size={13} />
            <span>Details</span>
          </button>

          {/* Track Order button (if shipped) */}
          {isShipped && (
            <button
              type="button"
              onClick={() => onTrackOrder(order)}
              className="order-btn-ghost"
              title="Track armored courier transit"
              style={{ borderColor: 'rgba(198,161,91,0.4)', color: '#DFB76C' }}
            >
              <Truck size={13} />
              <span>Track</span>
            </button>
          )}

          {/* Invoice button */}
          <button
            type="button"
            onClick={() => onViewInvoice(order)}
            className="order-btn-ghost"
            title="View or print official Swiss invoice"
          >
            <FileText size={13} />
            <span>Invoice</span>
          </button>

          {/* Cancel button (if eligible) */}
          {isCancellable && (
            <button
              type="button"
              onClick={() => onCancelOrder(order)}
              className="order-btn-danger-ghost"
              title="Cancel order and request refund"
            >
              <Ban size={12} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default OrderRow;
