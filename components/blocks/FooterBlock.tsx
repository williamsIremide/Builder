import React from 'react';
import { useNode } from '@craftjs/core';

function useSafeStorefront() {
  try {
    const { useStorefront } = require('~/contexts');
    return useStorefront();
  } catch {
    return null;
  }
}

export const FooterBlock = () => {
  const { connectors: { connect, drag }, selected } = useNode((s) => ({
    selected: s.events.selected,
  }));

  const ctx = useSafeStorefront();
  const storefront = ctx?.storefrontData;
  const storeName = storefront?.store?.name ?? 'Your Store';
  const logo = storefront?.store?.logo ?? null;
  const email = storefront?.headquarter_branch?.contact_email ?? '';
  const phone = storefront?.headquarter_branch?.contact_phone_number_1 ?? '';
  const address = storefront?.headquarter_branch?.location;
  const instagram = storefront?.social_links?.instagram_url ?? '';
  const twitter = storefront?.social_links?.twitter_url ?? '';
  const whatsapp = storefront?.social_links?.whatsapp_url ?? '';

  return (
    <footer
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        borderTop: '1px solid #e5e7eb',
        background: '#f9fafb',
        padding: '40px 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
        }}
      >
        {/* Brand column */}
        <div>
          {logo ? (
            <img src={logo} alt={storeName} style={{ maxHeight: 60, objectFit: 'contain', marginBottom: 12 }} />
          ) : (
            <p style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: 12 }}>{storeName}</p>
          )}
          {address && (
            <>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: '0 0 4px' }}>Head Office</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 16px' }}>
                {[address.street, address.city, address.state_or_province].filter(Boolean).join(', ')} | HQ
              </p>
            </>
          )}
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 12 }}>
            {instagram && (
              <a href={instagram} onClick={(e) => e.preventDefault()} style={{ color: '#6b7280' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
            {twitter && (
              <a href={twitter} onClick={(e) => e.preventDefault()} style={{ color: '#6b7280' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} onClick={(e) => e.preventDefault()} style={{ color: '#6b7280' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} onClick={(e) => e.preventDefault()} style={{ color: '#6b7280' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} onClick={(e) => e.preventDefault()} style={{ color: '#6b7280' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16 }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Contact Us', 'Branch Locator', 'Products'].map((label) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Partner With Us */}
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16 }}>Partner With Us</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Product Makers', 'Suppliers', 'Logistics', 'Careers'].map((label) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: '0.875rem', color: '#374151', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}>Stay in the loop</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 12 }}>
            Get the latest deals and updates.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
            <button
              onClick={(e) => e.preventDefault()}
              style={{
                padding: '8px 16px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 40, paddingTop: 16, textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          &copy; {new Date().getFullYear()}, {storeName}. All Rights Reserved.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>
          Powered by <span style={{ color: '#374151', fontWeight: 600 }}>Retailbox</span>
        </p>
      </div>
    </footer>
  );
};

FooterBlock.craft = {
  displayName: 'Footer',
  rules: {
    canDrag: () => false,
    canDelete: () => false,
  },
};