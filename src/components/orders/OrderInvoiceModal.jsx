import React from 'react';
import { X, Printer, Download, Crown, ShieldCheck, Check } from 'lucide-react';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val || 0);
};

const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace('RLX-', '').replace('-GE', '')}-2026`;
  const primaryItem = order.items?.[0] || {};

  return (
    <div className="orders-modal-backdrop" onClick={onClose}>
      <div
        className="orders-modal-dialog"
        style={{ maxWidth: '820px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="invoice-modal-title"
      >
        {/* Modal Top Control Bar (Hidden when printed) */}
        <div className="orders-modal-header no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Crown size={18} color="#C6A15B" />
            <h3 id="invoice-modal-title" style={{ fontSize: '18px', color: '#111827', margin: 0 }}>
              Official Swiss Chronometer Registry Invoice
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="order-btn-primary"
              title="Print or Save as PDF"
            >
              <Printer size={14} />
              <span>Print / Download PDF</span>
            </button>
            <button type="button" onClick={onClose} className="orders-modal-close-btn" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Container for Invoice Paper */}
        <div className="orders-modal-body" style={{ background: '#0b0e14', padding: '24px' }}>
          {/* Printable Luxury Invoice Paper */}
          <div className="orders-invoice-paper">
            {/* Header */}
            <div className="invoice-header-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Crown size={24} color="#C6A15B" />
                  <span className="invoice-brand-title">ROLLEX SA</span>
                </div>
                <div className="invoice-sub-meta">
                  SWISS CHRONOMETER REGISTRY • MANUFACTURE D'HORLOGERIE
                </div>
                <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>
                  Rue François-Dussaud 3-5 • Case Postale 430 • CH-1211 Genève 26 • Switzerland
                </div>
              </div>

              <div className="invoice-meta-block">
                <div className="invoice-section-heading">PROVENANCE INVOICE</div>
                <div className="invoice-meta-num">{invoiceNumber}</div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Date: </strong> {order.formattedDate || order.date}
                </div>
                <div>
                  <strong>Order Reference: </strong> #{order.id}
                </div>
                <div>
                  <strong>COSC Certificate: </strong> {order.chronometerCertificate || 'CH-COSC-904812'}
                </div>
              </div>
            </div>

            {/* Client Coordinates & Settlement */}
            <div className="invoice-client-grid">
              <div>
                <div className="invoice-section-heading">CLIENT DOSSIER & DELIVERY</div>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px' }}>
                  {order.shippingAddress?.fullName || 'Client Privilege Member'}
                </div>
                <div>{order.shippingAddress?.address || 'Quai du Mont-Blanc 19'}</div>
                <div>
                  {order.shippingAddress?.city || 'Geneva'}, {order.shippingAddress?.postalCode || '1201'}
                </div>
                <div>{order.shippingAddress?.country || 'Switzerland'}</div>
                {order.shippingAddress?.phone && <div>Tel: {order.shippingAddress.phone}</div>}
              </div>

              <div>
                <div className="invoice-section-heading">SETTLEMENT DETAILS</div>
                <div>
                  <strong>Payment Channel: </strong> {order.paymentMethod || 'Geneva Escrow Wire'}
                </div>
                <div>
                  <strong>Transaction Identifier: </strong> {order.transactionRef || 'TXN-902184'}
                </div>
                <div>
                  <strong>Status: </strong>{' '}
                  <span style={{ color: order.status === 'Cancelled' ? '#dc2626' : '#059669', fontWeight: '700' }}>
                    {order.paymentStatus === 'Refunded' ? 'REFUNDED IN FULL' : 'PAID & AUTHENTICATED'}
                  </span>
                </div>
                <div>
                  <strong>Armored Courier: </strong> {order.courier?.name || 'Malca-Amit Transit'}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', marginBottom: '16px' }}>
              <table className="invoice-table" style={{ minWidth: '500px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '45%' }}>Item Description & Calibre</th>
                    <th style={{ textAlign: 'center' }}>Serial ID</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Unit Price</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: '700', color: '#111827' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          {item.collection} • {item.dialColor} • {item.caseSize} • {item.calibre || 'Superlative Chronometer'}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '11px' }}>
                        {item.serialNumber || 'SN-REG-849102'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.quantity || 1}</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="invoice-totals-row">
              <table className="invoice-totals-table">
                <tbody>
                  <tr>
                    <td style={{ color: '#6b7280' }}>Subtotal:</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {formatCurrency(order.subtotal || order.total)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#6b7280' }}>Insured White-Glove Courier:</td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                      $0.00 (Complimentary)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#6b7280' }}>Swiss Chronometer Certification:</td>
                    <td style={{ textAlign: 'right', color: '#059669', fontWeight: '600' }}>
                      $0.00 (Complimentary)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: '#6b7280' }}>Geneva VAT / Import Surcharge:</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>$0.00</td>
                  </tr>
                  <tr>
                    <td className="invoice-grand-total">Total Valuation:</td>
                    <td className="invoice-grand-total" style={{ textAlign: 'right' }}>
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Registry Seal and Guarantee */}
            <div className="invoice-seal-footer">
              <div>
                <div style={{ fontWeight: '700', color: '#111827', marginBottom: '2px' }}>
                  Geneva Superlative Chronometer Guarantee
                </div>
                <div>Valid for 6 years across all official Rollex Boutiques & Horology Service Centers worldwide.</div>
              </div>

              <div className="invoice-official-stamp">
                <ShieldCheck size={16} />
                <span>OFFICIAL REGISTRY SEAL • GENÈVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden on print) */}
        <div className="orders-modal-footer no-print">
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
            Provenance certificate document rendered in compliance with Swiss Federal Horology Standards.
          </span>
          <button type="button" onClick={onClose} className="order-btn-ghost">
            <span>Close Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
