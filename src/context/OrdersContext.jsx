import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

const STORAGE_KEY = 'rollex_client_orders';
const API_BASE = '/api/orders';

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();

  // Start with empty array — DB fetch on mount fills this in
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync orders with localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage:', e);
    }
  }, [orders]);

  // Fetch orders from MongoDB backend database
  const fetchOrdersFromDb = useCallback(async (userEmail, userName) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (userEmail) queryParams.append('email', userEmail);
      if (userName) queryParams.append('name', userName);

      const url = `${API_BASE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.orders)) {
        console.log(`[DB SUCCESS] Loaded ${data.orders.length} orders from MongoDB`);
        setOrders(data.orders);
      } else {
        console.warn('Database returned unexpected response, keeping current state');
      }
    } catch (err) {
      console.warn('Backend /api/orders fetch failed, using local/cached state:', err.message);
      // Keep offline/cached orders
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync with backend on mount or when user changes
  useEffect(() => {
    const emailToQuery = user?.email || 'client@rollex.ch';
    const nameToQuery = user?.name || '';
    fetchOrdersFromDb(emailToQuery, nameToQuery);
  }, [user, fetchOrdersFromDb]);

  // Compute live summary statistics
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
      (o) => o.status === 'Pending' || o.status === 'Processing'
    ).length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;
    const totalSpent = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalSpent,
    };
  }, [orders]);

  // Cancel an order in backend DB & local state
  const cancelOrder = async (orderId, reason = 'Client requested cancellation') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const formattedTimestamp = `${dateStr} • ${timeStr} CET`;

    // 1. Optimistic local state update
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [
          ...(order.timeline ? order.timeline.filter((t) => t.stage !== 'Delivered' && t.stage !== 'Shipped') : []),
          {
            stage: 'Cancelled',
            title: 'Order Cancelled & Refunded',
            description: reason,
            timestamp: formattedTimestamp,
            completed: true,
            current: true,
            isCancelled: true,
          },
        ];

        return {
          ...order,
          status: 'Cancelled',
          paymentStatus: 'Refunded',
          cancellationReason: reason,
          cancelledAt: formattedTimestamp,
          refundRef: `REF-CH-${Math.floor(100000 + Math.random() * 900000)}-ESCROW`,
          timeline: updatedTimeline,
          notes: `Order cancelled upon client confirmation. 100% refund initiated. ${order.notes || ''}`,
        };
      })
    );

    // 2. Persist cancellation to backend MongoDB
    try {
      const res = await fetch(`${API_BASE}/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        console.log(`[DB CANCEL SUCCESS] Order #${orderId} marked cancelled in MongoDB`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
      }
    } catch (err) {
      console.warn('Backend order cancel error:', err.message);
    }
  };

  // Add a newly placed order to backend DB & local state
  const addOrder = async (orderPayload) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const isoDate = now.toISOString().split('T')[0];

    const generatedId =
      orderPayload.id || `RLX-${Math.floor(100000 + Math.random() * 900000)}-GE`;

    const userEmail =
      orderPayload.userEmail ||
      user?.email ||
      orderPayload.shippingAddress?.email ||
      'client@rollex.ch';

    const userName =
      orderPayload.userName ||
      user?.name ||
      orderPayload.shippingAddress?.fullName ||
      'Client Privilege Member';

    const newOrder = {
      id: generatedId,
      userEmail,
      userName,
      date: isoDate,
      formattedDate: dateFormatted,
      status: orderPayload.status || 'Processing',
      paymentStatus: orderPayload.paymentStatus || 'Paid',
      paymentMethod: orderPayload.paymentMethod || 'Geneva Escrow Direct Wire',
      transactionRef: `TXN-CH-${Math.floor(100000 + Math.random() * 900000)}`,
      items: orderPayload.items || [],
      totalQuantity: orderPayload.totalQuantity || 1,
      subtotal: Number(orderPayload.subtotal || 0),
      shippingCharge: 0.00,
      tax: 0.00,
      total: Number(orderPayload.total || orderPayload.subtotal || 0),
      shippingAddress: orderPayload.shippingAddress || {
        fullName: userName,
        address: 'Quai du Mont-Blanc 19',
        city: 'Geneva',
        country: 'Switzerland',
        postalCode: '1201',
        phone: '+41 22 555 0199',
      },
      courier: {
        name: 'Malca-Amit Armored Transit',
        trackingNumber: `MA-CH-${Math.floor(1000000 + Math.random() * 9000000)}-NX`,
        serviceLevel: 'White-Glove Armed Security Escort',
        estimatedDelivery: '3-5 Business Days',
        statusMessage: 'Order entered into Geneva atelier queue for superlative chronometer testing.',
        currentLocation: 'Geneva Manufacture Atelier',
        checkpoints: [
          {
            time: `${dateFormatted} - 10:00 AM`,
            status: 'Private client allocation reserved',
            location: 'Geneva Atelier, Switzerland',
          },
        ],
      },
      timeline: [
        {
          stage: 'Order Placed',
          title: 'Order Placed',
          description: 'Client requisition authenticated and funds placed into Geneva Escrow',
          timestamp: `${dateFormatted} • Today`,
          completed: true,
        },
        {
          stage: 'Processing',
          title: 'Chronometer Tolerance Verification',
          description: 'Master horologist precision audit and water-resistance testing in progress',
          timestamp: `${dateFormatted} • Active Stage`,
          completed: true,
          current: true,
        },
        {
          stage: 'Shipped',
          title: 'White-Glove Armored Transit',
          description: 'Diplomatic courier handover and tracking activation',
          timestamp: 'Scheduled upon atelier release',
          completed: false,
        },
        {
          stage: 'Delivered',
          title: 'Signed Handover & Certificate Activation',
          description: 'In-person biometric delivery and Swiss Chronometer Registry guarantee',
          timestamp: 'Pending transit completion',
          completed: false,
        },
      ],
      chronometerCertificate: `CH-COSC-${Math.floor(100000 + Math.random() * 900000)}`,
      warrantyPeriod: '6-Year International Superlative Guarantee',
      notes: 'Saved in Swiss Chronometer Registry MongoDB database.',
    };

    // 1. Optimistic local state update
    setOrders((prev) => [newOrder, ...prev]);

    // 2. Persist new order into MongoDB backend
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      const data = await res.json();
      if (data.success && data.order) {
        console.log(`[DB SAVE SUCCESS] Order #${data.order.id} saved in MongoDB!`);
        setOrders((prev) => [data.order, ...prev.filter((o) => o.id !== newOrder.id)]);
        return data.order;
      }
    } catch (err) {
      console.warn('Backend order create error (saved locally):', err.message);
    }

    return newOrder;
  };

  // Reset to default sample orders (also in backend)
  const resetToDefaultOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        return;
      }
    } catch (e) {
      console.warn('Reseed API error, resetting locally:', e);
    } finally {
      setLoading(false);
    }

    setOrders(INITIAL_ORDERS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    } catch (e) {
      console.error(e);
    }
  };

  // Simulate loading state (for UI testing)
  const triggerLoadingSim = (duration = 900) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, duration);
  };

  // Simulate error state (for UI testing)
  const triggerErrorSim = (msg = 'Swiss Chronometer Registry API connection interrupted. Unable to sync live status.') => {
    setError(msg);
  };

  const clearError = () => {
    setError(null);
  };

  const reloadOrders = () => {
    fetchOrdersFromDb(user?.email || 'client@rollex.ch', user?.name || '');
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        stats,
        cancelOrder,
        addOrder,
        resetToDefaultOrders,
        reloadOrders,
        triggerLoadingSim,
        triggerErrorSim,
        clearError,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
