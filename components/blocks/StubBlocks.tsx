/**
 * Stub blocks — placeholders for commerce-specific pages.
 * These represent locked/system-level blocks that RetailBox
 * fully controls. Users can configure appearance but not structure.
 */
import React from 'react';
import { useNode } from '@craftjs/core';

// ─── Shared Stub Renderer ─────────────────────────────────────────────────────

interface StubProps {
  label: string;
  description: string;
  icon: string;
  accentColor?: string;
}

const StubBlock = ({ label, description, icon, accentColor = '#6366f1' }: StubProps) => (
  <div
    style={{
      padding: '48px 32px',
      textAlign: 'center',
      background: '#f9fafb',
      borderTop: `4px solid ${accentColor}`,
    }}
  >
    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
    <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700, color: '#111827' }}>{label}</h3>
    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>{description}</p>
  </div>
);

// ─── Product Details ──────────────────────────────────────────────────────────

export interface ProductDetailsProps {
  accentColor?: string;
}

export const ProductDetailsSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProductDetailsProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input type="color" value={props.accentColor ?? '#111827'}
            onChange={(e) => setProp((p: ProductDetailsProps) => { p.accentColor = e.target.value; })} />
          <span>{props.accentColor ?? '#111827'}</span>
        </div>
      </div>
    </div>
  );
};

export const ProductDetails = ({ accentColor = '#111827' }: ProductDetailsProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab' }}>
      <StubBlock
        label="Product Details"
        description="Product images, title, price, variants, and Add to Cart — displayed here automatically from your product data."
        icon="📦"
        accentColor={accentColor}
      />
    </div>
  );
};

ProductDetails.craft = {
  displayName: 'ProductDetails',
  props: { accentColor: '#111827' },
  related: { settings: ProductDetailsSettings },
};

// ─── Cart Summary ─────────────────────────────────────────────────────────────

export const CartSummarySettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as { accentColor?: string },
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input type="color" value={props.accentColor ?? '#111827'}
            onChange={(e) => setProp((p: { accentColor?: string }) => { p.accentColor = e.target.value; })} />
          <span>{props.accentColor ?? '#111827'}</span>
        </div>
      </div>
    </div>
  );
};

export const CartSummary = ({ accentColor = '#111827' }: { accentColor?: string }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab' }}>
      <StubBlock
        label="Cart Summary"
        description="Cart items, quantities, subtotal, and checkout button — driven by your cart data automatically."
        icon="🛒"
        accentColor={accentColor}
      />
    </div>
  );
};

CartSummary.craft = {
  displayName: 'CartSummary',
  props: { accentColor: '#111827' },
  related: { settings: CartSummarySettings },
};

// ─── Checkout Form ────────────────────────────────────────────────────────────

export const CheckoutFormSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as { accentColor?: string },
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input type="color" value={props.accentColor ?? '#111827'}
            onChange={(e) => setProp((p: { accentColor?: string }) => { p.accentColor = e.target.value; })} />
          <span>{props.accentColor ?? '#111827'}</span>
        </div>
      </div>
    </div>
  );
};

export const CheckoutForm = ({ accentColor = '#111827' }: { accentColor?: string }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab' }}>
      <StubBlock
        label="Checkout Form"
        description="Shipping address, payment details, and order summary — fully handled by RetailBox checkout."
        icon="💳"
        accentColor={accentColor}
      />
    </div>
  );
};

CheckoutForm.craft = {
  displayName: 'CheckoutForm',
  props: { accentColor: '#111827' },
  related: { settings: CheckoutFormSettings },
};

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const ContactFormSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as { accentColor?: string },
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input type="color" value={props.accentColor ?? '#111827'}
            onChange={(e) => setProp((p: { accentColor?: string }) => { p.accentColor = e.target.value; })} />
          <span>{props.accentColor ?? '#111827'}</span>
        </div>
      </div>
    </div>
  );
};

export const ContactForm = ({ accentColor = '#111827' }: { accentColor?: string }) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab' }}>
      <StubBlock
        label="Contact Form"
        description="Name, email, and message fields with automatic routing to your store's inbox."
        icon="✉️"
        accentColor={accentColor}
      />
    </div>
  );
};

ContactForm.craft = {
  displayName: 'ContactForm',
  props: { accentColor: '#111827' },
  related: { settings: ContactFormSettings },
};
