import React from 'react';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val || 0);
};

const OrderSummaryCards = ({ activeFilter, onSelectFilter }) => {
  const { stats } = useOrders();

  const cards = [
    {
      id: 'all',
      filterKey: 'All',
      label: 'Total Orders',
      count: stats.totalOrders,
      subtext: `Total Portfolio: ${formatCurrency(stats.totalSpent)}`,
      icon: Package,
      accentClass: 'accent-gold',
    },
    {
      id: 'pending',
      filterKey: 'Pending',
      label: 'Pending Orders',
      count: stats.pendingOrders,
      subtext: 'In Atelier Calibration & Transit',
      icon: Clock,
      accentClass: 'accent-amber',
    },
    {
      id: 'completed',
      filterKey: 'Delivered',
      label: 'Completed Orders',
      count: stats.completedOrders,
      subtext: 'Delivered & Superlative Certified',
      icon: CheckCircle2,
      accentClass: 'accent-emerald',
    },
    {
      id: 'cancelled',
      filterKey: 'Cancelled',
      label: 'Cancelled Orders',
      count: stats.cancelledOrders,
      subtext: 'Refunded & Allocation Restored',
      icon: XCircle,
      accentClass: 'accent-ruby',
    },
  ];

  return (
    <div className="orders-summary-grid">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isSelected =
          (card.filterKey === 'All' && activeFilter === 'All') ||
          (card.filterKey !== 'All' && activeFilter === card.filterKey);

        return (
          <div
            key={card.id}
            onClick={() => onSelectFilter(card.filterKey)}
            className={`orders-glass-card orders-metric-card ${card.accentClass}`}
            style={{
              cursor: 'pointer',
              borderColor: isSelected ? '#C6A15B' : undefined,
              boxShadow: isSelected
                ? '0 0 25px rgba(198, 161, 91, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : undefined,
            }}
            title={`Filter by ${card.label}`}
          >
            <div className="orders-metric-info">
              <span className="orders-metric-label">{card.label}</span>
              <div className="orders-metric-count">
                <span>{card.count}</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#9ca3af' }}>
                  {card.count === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
              <span className="orders-metric-subtext">{card.subtext}</span>
            </div>

            <div className="orders-metric-icon-wrap">
              <IconComponent size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderSummaryCards;
