import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const FILTER_OPTIONS = [
  { key: 'All', label: 'All Orders' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Processing', label: 'Processing' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
  { key: 'Cancelled', label: 'Cancelled' },
];

const OrderFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  countsByStatus,
  totalMatching,
}) => {
  return (
    <div className="orders-glass-card orders-toolbar-wrap">
      {/* Search Input */}
      <div className="orders-search-box">
        <Search className="orders-search-icon" size={17} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Order ID (e.g. RLX-849201) or watch model..."
          className="orders-search-input"
          aria-label="Search orders"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="orders-search-clear"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="orders-filter-chips" role="tablist">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = activeFilter === opt.key;
          const count = countsByStatus[opt.key] ?? 0;

          return (
            <button
              key={opt.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange(opt.key)}
              className={`orders-filter-btn ${isActive ? 'active' : ''}`}
            >
              <span>{opt.label}</span>
              <span className="orders-filter-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderFilters;
