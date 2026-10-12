import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

const OrdersEmptyState = ({ isSearching, onResetFilters }) => {
  return (
    <div
      className="orders-glass-card"
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(198, 161, 91, 0.1)',
          border: '1px solid rgba(198, 161, 91, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C6A15B',
          marginBottom: '20px',
        }}
      >
        <PackageX size={34} />
      </div>

      <div className="orders-registry-tag" style={{ margin: '0 auto 12px auto' }}>
        <Sparkles size={12} />
        <span>SWISS CHRONOMETER REGISTRY</span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          color: '#ffffff',
          marginBottom: '8px',
        }}
      >
        {isSearching ? 'No Matching Timepiece Orders Found' : 'No Order History on Record'}
      </h3>

      <p
        style={{
          fontSize: '13px',
          color: '#9ca3af',
          maxWidth: '440px',
          lineHeight: '1.6',
          marginBottom: '26px',
        }}
      >
        {isSearching
          ? 'We could not locate any orders matching your search query or filter parameters. Try checking your spelling or resetting filters.'
          : 'You do not have any active or historical timepiece requisitions in your client dossier. Explore the collection to place your first reservation.'}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {isSearching && (
          <button
            type="button"
            onClick={onResetFilters}
            className="order-btn-ghost"
            style={{ padding: '10px 18px', fontSize: '12px' }}
          >
            <RefreshCw size={14} />
            <span>Reset Search & Filters</span>
          </button>
        )}

        <Link
          to="/shop"
          className="order-btn-primary"
          style={{ padding: '10px 22px', fontSize: '12px' }}
        >
          <span>Explore Horology Boutique</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default OrdersEmptyState;
