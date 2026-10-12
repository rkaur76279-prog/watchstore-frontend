import React from 'react';
import OrderRow from './OrderRow';
import OrderCard from './OrderCard';

const OrderList = ({
  orders,
  onViewDetails,
  onTrackOrder,
  onCancelOrder,
  onViewInvoice,
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="orders-glass-card orders-table-wrapper hidden lg:block">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Identifier</th>
              <th>Timepiece Description</th>
              <th>Acquisition Date</th>
              <th>Qty</th>
              <th>Valuation</th>
              <th>Settlement</th>
              <th>Registry Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onViewDetails={onViewDetails}
                onTrackOrder={onTrackOrder}
                onCancelOrder={onCancelOrder}
                onViewInvoice={onViewInvoice}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="orders-mobile-cards-wrap lg:hidden">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={onViewDetails}
            onTrackOrder={onTrackOrder}
            onCancelOrder={onCancelOrder}
            onViewInvoice={onViewInvoice}
          />
        ))}
      </div>
    </>
  );
};

export default OrderList;
