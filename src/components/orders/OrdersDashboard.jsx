import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Crown,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  FileCheck2,
  Clock,
  Package,
} from 'lucide-react';
import { useOrders } from '../../context/OrdersContext';
import OrderSummaryCards from './OrderSummaryCards';
import OrderFilters from './OrderFilters';
import OrderList from './OrderList';
import OrderPagination from './OrderPagination';
import OrderDetailsModal from './OrderDetailsModal';
import OrderTrackModal from './OrderTrackModal';
import OrderCancelModal from './OrderCancelModal';
import OrderInvoiceModal from './OrderInvoiceModal';
import OrdersEmptyState from './OrdersEmptyState';
import OrdersLoadingSkeleton from './OrdersLoadingSkeleton';
import OrdersErrorState from './OrdersErrorState';
import './Orders.css';

const PAGE_SIZE = 5;

const OrdersDashboard = () => {
  const {
    orders,
    loading,
    error,
    cancelOrder,
    resetToDefaultOrders,
    triggerLoadingSim,
    triggerErrorSim,
    clearError,
  } = useOrders();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Visibility States
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [selectedOrderForTrack, setSelectedOrderForTrack] = useState(null);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Compute status counts for the filter chips
  const countsByStatus = useMemo(() => {
    const counts = {
      All: orders.length,
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status] += 1;
      }
    });

    return counts;
  }, [orders]);

  // Filtered and Searched Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (activeFilter !== 'All') {
        if (order.status !== activeFilter) {
          return false;
        }
      }

      // 2. Search Query (matches Order ID or any product name/collection)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesId = (order.id || '').toLowerCase().includes(query);
        const matchesProduct = (order.items || []).some(
          (item) =>
            (item.name || '').toLowerCase().includes(query) ||
            (item.collection || '').toLowerCase().includes(query) ||
            (item.serialNumber || '').toLowerCase().includes(query)
        );
        const matchesCourier = (order.courier?.trackingNumber || '')
          .toLowerCase()
          .includes(query);

        if (!matchesId && !matchesProduct && !matchesCourier) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  // Reset pagination to page 1 whenever search or filter changes
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  return (
    <section className="orders-section-container" aria-label="My Orders Dashboard">
      {/* 1. Dashboard Heading & Header */}
      <div className="orders-header-wrap">
        <div>
          <div className="orders-registry-tag">
            <Sparkles size={13} />
            <span>SWISS CHRONOMETER REGISTRY • CLIENT DOSSIER</span>
          </div>
          <h1 className="orders-main-title">My Orders</h1>
          <p className="orders-main-desc">
            Review your authenticated timepiece acquisitions, courier consignments, and Swiss
            Chronometer Registry certifications.
          </p>
        </div>

        {/* Quick Toolbar Controls */}
        <div className="orders-header-actions">
          <button
            type="button"
            onClick={() => triggerLoadingSim(800)}
            className="order-btn-ghost"
            title="Simulate Registry Telemetry Sync"
          >
            <RefreshCw size={13} />
            <span>Sync Registry</span>
          </button>

          <button
            type="button"
            onClick={resetToDefaultOrders}
            className="order-btn-ghost"
            title="Reset to Geneva pristine catalog state"
            style={{ fontSize: '11px', color: '#9ca3af' }}
          >
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Metric Cards */}
      <OrderSummaryCards
        activeFilter={activeFilter}
        onSelectFilter={handleFilterChange}
      />

      {/* Error state if triggered */}
      {error && <OrdersErrorState error={error} onRetry={clearError} />}

      {/* 3. Search and Filter Toolbar */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        countsByStatus={countsByStatus}
        totalMatching={filteredOrders.length}
      />

      {/* 4. Orders Content: Loading, Empty, or List */}
      {loading ? (
        <OrdersLoadingSkeleton />
      ) : filteredOrders.length === 0 ? (
        <OrdersEmptyState
          isSearching={Boolean(searchQuery || activeFilter !== 'All')}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <>
          <OrderList
            orders={paginatedOrders}
            onViewDetails={(order) => setSelectedOrderForDetails(order)}
            onTrackOrder={(order) => setSelectedOrderForTrack(order)}
            onCancelOrder={(order) => setSelectedOrderForCancel(order)}
            onViewInvoice={(order) => setSelectedOrderForInvoice(order)}
          />

          {/* 5. Pagination */}
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </>
      )}

      {/* ================= MODALS ================= */}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={Boolean(selectedOrderForDetails)}
        onClose={() => setSelectedOrderForDetails(null)}
        onTrackOrder={(order) => setSelectedOrderForTrack(order)}
        onCancelOrder={(order) => setSelectedOrderForCancel(order)}
        onViewInvoice={(order) => setSelectedOrderForInvoice(order)}
      />

      {/* Armored Courier Live Tracking Modal */}
      <OrderTrackModal
        order={selectedOrderForTrack}
        isOpen={Boolean(selectedOrderForTrack)}
        onClose={() => setSelectedOrderForTrack(null)}
      />

      {/* Order Cancellation Confirmation Modal */}
      <OrderCancelModal
        order={selectedOrderForCancel}
        isOpen={Boolean(selectedOrderForCancel)}
        onClose={() => setSelectedOrderForCancel(null)}
        onConfirmCancel={(orderId, reason) => {
          cancelOrder(orderId, reason);
          // If the details modal is open for this order, close or refresh it
          setSelectedOrderForDetails(null);
        }}
      />

      {/* Printable Swiss Provenance Invoice Modal */}
      <OrderInvoiceModal
        order={selectedOrderForInvoice}
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
      />
    </section>
  );
};

export default OrdersDashboard;
