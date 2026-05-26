import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

export interface CheckoutFormBlockProps {
  accentColor?: string;
  currencySymbol?: string;
}

const DELIVERY_OPTIONS = [
  {
    id: 'door',
    title: 'Doorstep Delivery',
    descriptions: ['Delivered to your address', 'Estimated: 2–3 business days'],
    price: '₦500',
    iconBg: '#eef2ff',
    iconColor: '#4f46e5',
  },
  {
    id: 'pickup',
    title: 'Pickup Delivery',
    descriptions: ['Pick up from nearest store', 'Ready in 1 business day'],
    price: 'Free',
    iconBg: '#f0fdf4',
    iconColor: '#16a34a',
  },
];

const PAYMENT_OPTIONS = [
  { id: 'bank', title: 'Bank Transfer', description: 'Transfer from your bank account', iconBg: '#eff6ff', iconColor: '#2563eb' },
  { id: 'cash', title: 'Cash Payment', description: 'Pay with cash on delivery', iconBg: '#f0fdf4', iconColor: '#16a34a' },
  { id: 'ussd', title: 'USSD Payment', description: 'Use USSD code to pay', iconBg: '#fefce8', iconColor: '#ca8a04' },
  { id: 'pos', title: 'POS Payment', description: 'Pay via POS terminal', iconBg: '#fef2f2', iconColor: '#dc2626' },
  { id: 'card', title: 'Card Payment', description: 'Debit or credit card', iconBg: '#faf5ff', iconColor: '#9333ea' },
  { id: 'vendbox', title: 'VendBox Payment', description: 'Pay via VendBox machine', iconBg: '#f9fafb', iconColor: '#374151' },
];

const MOCK_SUBTOTAL = 25300;
const MOCK_DELIVERY = 0;

export const CheckoutFormBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as CheckoutFormBlockProps,
  }));
  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Currency Symbol</label>
        <input
          type="text"
          value={props.currencySymbol ?? '₦'}
          onChange={(e) => setProp((p: CheckoutFormBlockProps) => { p.currencySymbol = e.target.value; })}
        />
      </div>
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input
            type="color"
            value={props.accentColor ?? '#B3561B'}
            onChange={(e) => setProp((p: CheckoutFormBlockProps) => { p.accentColor = e.target.value; })}
          />
          <span>{props.accentColor ?? '#B3561B'}</span>
        </div>
      </div>
    </div>
  );
};

export const CheckoutFormBlock = ({
  accentColor = '#B3561B',
  currencySymbol = '₦',
}: CheckoutFormBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [selectedDelivery, setSelectedDelivery] = useState('pickup');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const formatPrice = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  const total = MOCK_SUBTOTAL + MOCK_DELIVERY;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 32px',
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '40px',
        alignItems: 'start',
      }}>

        {/* Left — Form */}
        <div style={{
          border: '1px solid #f3f4f6',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          {/* Personal Info */}
          <div style={{ padding: '32px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>
              Personal Info
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>Full Name</label>
              <input
                type="text"
                placeholder="Bola Tinubu"
                style={{
                  padding: '10px 14px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#111827',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>First name, then last name</p>
            </div>
          </div>

          {/* Delivery Type */}
          <div style={{ padding: '32px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>
              Delivery Type
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {DELIVERY_OPTIONS.map((option) => {
                const isSelected = selectedDelivery === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedDelivery(option.id)}
                    style={{
                      border: `1px solid ${isSelected ? '#f97316' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{
                      width: '36px', height: '36px',
                      borderRadius: '50%',
                      background: option.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="18" height="18" fill="none" stroke={option.iconColor} strokeWidth="2" viewBox="0 0 24 24">
                        {option.id === 'door'
                          ? <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>
                          : <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
                        }
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111827', margin: '0 0 4px' }}>{option.title}</p>
                      {option.descriptions.map((d, i) => (
                        <p key={i} style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>{d}</p>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>{option.price}</span>
                      <div style={{
                        width: '18px', height: '18px',
                        borderRadius: '4px',
                        border: `2px solid ${isSelected ? '#f97316' : '#d1d5db'}`,
                        background: isSelected ? '#f97316' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && (
                          <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>
              Payment Method
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {PAYMENT_OPTIONS.map((option) => {
                const isSelected = selectedPayment === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedPayment(option.id)}
                    style={{
                      border: `1px solid ${isSelected ? '#f97316' : '#e5e7eb'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px',
                      borderRadius: '50%',
                      background: option.iconBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '10px',
                    }}>
                      <svg width="16" height="16" fill="none" stroke={option.iconColor} strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', margin: '0 0 4px' }}>{option.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>{option.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                      <div style={{
                        width: '18px', height: '18px',
                        borderRadius: '4px',
                        border: `2px solid ${isSelected ? '#f97316' : '#d1d5db'}`,
                        background: isSelected ? '#f97316' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isSelected && (
                          <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>
            Order Summary
          </h2>

          {/* Mock items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {[
              { name: 'Classic Tee ×2', price: 9000 },
              { name: 'Canvas Sneakers ×1', price: 12500 },
              { name: 'Wool Beanie ×1', price: 3800 },
            ].map(({ name, price }) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#6b7280' }}>{name}</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{formatPrice(price)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }}>
            {[
              { label: 'Subtotal', value: formatPrice(MOCK_SUBTOTAL) },
              { label: 'Delivery', value: MOCK_DELIVERY === 0 ? 'Free' : formatPrice(MOCK_DELIVERY) },
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
          }}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

CheckoutFormBlock.craft = {
  displayName: 'CheckoutForm',
  props: {
    accentColor: '#B3561B',
    currencySymbol: '₦',
  },
  related: { settings: CheckoutFormBlockSettings },
};