import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

export interface CartSummaryBlockProps {
  accentColor?: string;
  currencySymbol?: string;
}

const MOCK_CART_ITEMS = [
  { id: 1, name: 'Classic Tee', variant: 'Medium · Natural', price: 4500, quantity: 2, image: null },
  { id: 2, name: 'Canvas Sneakers', variant: 'Size 43 · White', price: 12500, quantity: 1, image: null },
  { id: 3, name: 'Wool Beanie', variant: 'One Size · Black', price: 3800, quantity: 1, image: null },
];

const deliveryFee = 0;

export const CartSummaryBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as CartSummaryBlockProps,
  }));
  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Currency Symbol</label>
        <input
          type="text"
          value={props.currencySymbol ?? '₦'}
          onChange={(e) => setProp((p: CartSummaryBlockProps) => { p.currencySymbol = e.target.value; })}
        />
      </div>
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input
            type="color"
            value={props.accentColor ?? '#B3561B'}
            onChange={(e) => setProp((p: CartSummaryBlockProps) => { p.accentColor = e.target.value; })}
          />
          <span>{props.accentColor ?? '#B3561B'}</span>
        </div>
      </div>
    </div>
  );
};

export const CartSummaryBlock = ({
  accentColor = '#B3561B',
  currencySymbol = '₦',
}: CartSummaryBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [items, setItems] = useState(MOCK_CART_ITEMS);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formatPrice = (amount: number) =>
    `${currencySymbol}${amount.toLocaleString()}`;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '40px 32px',
      }}
    >
      {items.length === 0 ? (
        /* Empty state */
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <svg width="64" height="64" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Your bag is empty</h2>
          <p style={{ color: '#9ca3af', margin: 0 }}>Looks like you haven't added anything yet.</p>
          <button style={{
            padding: '12px 32px',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '56px',
          alignItems: 'start',
        }}>
          {/* Left — Cart item list */}
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>
              Your Bag
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 32px' }}>
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '16px',
                  alignItems: 'center',
                  paddingBottom: '24px',
                  borderBottom: '1px solid #f3f4f6',
                }}>
                  {/* Image */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#d1d5db',
                  }}>
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111827', margin: '0 0 4px' }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 12px' }}>{item.variant}</p>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        style={{
                          width: '28px', height: '28px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem', color: '#374151',
                        }}
                      >−</button>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          width: '28px', height: '28px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          background: '#fff',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '1rem', color: '#374151',
                        }}
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', color: accentColor, margin: 0, whiteSpace: 'nowrap' }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Order summary */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '28px',
            position: 'sticky',
            top: '80px',
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 24px', color: '#111827' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Subtotal', value: formatPrice(subtotal) },
                { label: 'Delivery', value: deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
              marginBottom: '24px',
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Total</span>
              <span style={{ fontWeight: 700, fontSize: '1.125rem', color: '#111827' }}>{formatPrice(total)}</span>
            </div>

            <button style={{
              width: '100%',
              padding: '14px',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '12px',
            }}>
              Proceed to Checkout
            </button>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
                textDecoration: 'none',
              }}
            >
              Continue Shopping
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

CartSummaryBlock.craft = {
  displayName: 'CartSummary',
  props: {
    accentColor: '#B3561B',
    currencySymbol: '₦',
  },
  related: { settings: CartSummaryBlockSettings },
};