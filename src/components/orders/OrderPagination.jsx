import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OrderPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="orders-glass-card orders-pagination-bar">
      <div className="orders-pagination-info">
        Showing <strong style={{ color: '#ffffff' }}>{startIdx}</strong> to{' '}
        <strong style={{ color: '#ffffff' }}>{endIdx}</strong> of{' '}
        <strong style={{ color: '#C6A15B' }}>{totalItems}</strong> authenticated acquisitions
      </div>

      <div className="orders-pagination-controls">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="orders-page-btn"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            className={`orders-page-btn ${currentPage === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="orders-page-btn"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
