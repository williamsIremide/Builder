import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

function useSafeStorefront() {
  try {
    const { useStorefront } = require('~/contexts');
    return useStorefront();
  } catch {
    return null;
  }
}

const PLACEHOLDER_CATEGORIES = ['Beverages', 'Snacks', 'Fashion', 'Personal Care', 'Gadgets'];
const NAV_LINKS = ['Home', 'About Us', 'Contact', 'FAQs'];

export const NavbarBlock = () => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({
    selected: s.events.selected,
  }));

  const ctx = useSafeStorefront();
  const storefrontData = ctx?.storefrontData;
  const storeName = storefrontData?.store?.name ?? 'Your Store';
  const logo = storefrontData?.store?.logo ?? null;
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <header
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 64px',
        gap: '24px',
      }}
    >
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        {logo ? (
          <img src={logo} alt={storeName} style={{ maxHeight: 50, objectFit: 'contain' }} />
        ) : (
          <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>{storeName}</span>
        )}
      </div>

      {/* Nav — Products dropdown + links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>

        {/* Products dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.875rem',
              padding: '4px 12px',
              background: 'transparent',
              border: 'none',
              borderBottom: '2px solid transparent',
              color: 'rgba(0,0,0,0.6)',
              cursor: 'pointer',
            }}
          >
            Products
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {productsOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              padding: '8px',
              minWidth: '220px',
              zIndex: 100,
            }}>
              {PLACEHOLDER_CATEGORIES.map((cat) => (
                <div
                  key={cat}
                  style={{
                    padding: '8px 12px',
                    fontSize: '0.875rem',
                    color: '#374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location link */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: '0.875rem',
            padding: '4px 12px',
            color: 'rgba(0,0,0,0.6)',
            textDecoration: 'none',
            borderBottom: '2px solid transparent',
          }}
        >
          Location
        </a>

        {/* Account link */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: '0.875rem',
            padding: '4px 12px',
            color: 'rgba(0,0,0,0.6)',
            textDecoration: 'none',
            borderBottom: '2px solid transparent',
          }}
        >
          Account
        </a>

        
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* SearchBar — Location dropdown + input + Search button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        {/* Location dropdown button */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            background: '#fff',
            fontSize: '0.875rem',
            color: '#374151',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Location
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '36px', background: '#e5e7eb' }} />

        {/* Search input */}
        <input
          type="search"
          placeholder="Search curated items..."
          style={{
            padding: '8px 12px',
            border: '1px solid #e5e7eb',
            borderLeft: 'none',
            borderRight: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            width: '220px',
            background: '#fff',
          }}
        />

        {/* Search button */}
        <button
          style={{
            padding: '8px 16px',
            background: '#111827',
            color: '#fff',
            border: 'none',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Search
        </button>
      </div>

      {/* Right icons — Cart + User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

        {/* Cart */}
        <div style={{ position: 'relative', padding: '8px', cursor: 'pointer' }}>
          <span style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#111827',
            color: '#fff',
            fontSize: '10px',
            borderRadius: '999px',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
          }}>0</span>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>

        {/* User */}
        <div style={{ padding: '8px', cursor: 'pointer' }}>
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    </header>
  );
};

NavbarBlock.craft = {
  displayName: 'Navbar',
  rules: {
    canDrag: () => false,
    canDelete: () => false,
  },
};