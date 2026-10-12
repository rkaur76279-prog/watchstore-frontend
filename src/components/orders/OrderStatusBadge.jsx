import React from 'react';
import { CheckCircle2, Clock, Truck, RotateCcw, XCircle } from 'lucide-react';

const OrderStatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();

  let badgeClass = 'pending';
  let Icon = Clock;
  let label = status;

  if (norm === 'delivered') {
    badgeClass = 'delivered';
    Icon = CheckCircle2;
  } else if (norm === 'shipped') {
    badgeClass = 'shipped';
    Icon = Truck;
  } else if (norm === 'processing') {
    badgeClass = 'processing';
    Icon = RotateCcw;
  } else if (norm === 'cancelled') {
    badgeClass = 'cancelled';
    Icon = XCircle;
  }

  return (
    <span className={`order-status-badge ${badgeClass}`}>
      <span className={`status-pulse-dot ${badgeClass}`} />
      <Icon size={12} />
      <span>{label}</span>
    </span>
  );
};

export default OrderStatusBadge;
