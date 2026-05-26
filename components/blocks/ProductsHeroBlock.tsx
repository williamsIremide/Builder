import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

// ─── Placeholder category data (mirrors real storefront) ─────────────────────

const PLACEHOLDER_CATEGORIES = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' },
  { id: 3, name: 'Fashion' },
  { id: 4, name: 'Personal Care' },
  { id: 5, name: 'Gadgets' },
  { id: 6, name: 'Sportswear' },
  { id: 7, name: 'Accessories' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductsHeroBlockProps {
  /** Top eyebrow label above the heading */
  eyebrow?: string;
  /** Main editorial heading */
  heading?: string;
  /** Sub-heading / description line */
  subheading?: string;
  /** Pill active background color */
  activePillBg?: string;
  /** Pill active text color */
  activePillText?: string;
}

// ─── Settings panel ───────────────────────────────────────────────────────────

export const ProductsHeroBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProductsHeroBlockProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Eyebrow Text</label>
        <input
          type="text"
          value={props.eyebrow ?? ''}
          onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.eyebrow = e.target.value; })}
          placeholder="New Season"
        />
      </div>
      <div className="settings-group">
        <label>Heading</label>
        <input
          type="text"
          value={props.heading ?? ''}
          onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.heading = e.target.value; })}
          placeholder="Curated Selection"
        />
      </div>
      <div className="settings-group">
        <label>Sub-heading</label>
        <input
          type="text"
          value={props.subheading ?? ''}
          onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.subheading = e.target.value; })}
          placeholder="The Full Inventory"
        />
      </div>
      <div className="settings-row">
        <div className="settings-group">
          <label>Active Pill BG</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.activePillBg ?? '#111827'}
              onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.activePillBg = e.target.value; })}
            />
            <span>{props.activePillBg ?? '#111827'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Active Pill Text</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.activePillText ?? '#ffffff'}
              onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.activePillText = e.target.value; })}
            />
            <span>{props.activePillText ?? '#ffffff'}</span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.72rem', color: '#52525b', margin: '8px 0 0', lineHeight: 1.5 }}>
        In the live storefront, categories are fetched from your store's API. The editor shows placeholder pills to preview the layout.
      </p>
    </div>
  );
};

// ─── Main block ───────────────────────────────────────────────────────────────

export const ProductsHeroBlock = ({
  eyebrow = 'New Season',
  heading = 'Curated Selection',
  subheading = 'The Full Inventory',
  activePillBg = '#111827',
  activePillText = '#ffffff',
}: ProductsHeroBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        background: '#ffffff',
      }}
    >
      {/* ── Desktop editorial header ── */}
      <div style={{
        width: '100%',
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '48px 32px 16px',
      }}>
        <p style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#9ca3af',
          margin: '0 0 6px',
        }}>
          {eyebrow}
        </p>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          margin: '0 0 4px',
          color: 'var(--rb-primary, #f59e0b)',
          lineHeight: 1.1,
        }}>
          {heading}
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 2vw, 1.75rem)',
          fontWeight: 700,
          color: '#111827',
          margin: 0,
          lineHeight: 1.2,
        }}>
          {subheading}
        </h2>
      </div>

      {/* ── Horizontal scrollable category pill strip ── */}
      <div style={{
        width: '100%',
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '16px 32px 24px',
        overflowX: 'auto',
        /* Hide scrollbar cross-browser */
        msOverflowStyle: 'none',
        scrollbarWidth: 'none' as const,
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          width: 'max-content',
        }}>
          {/* "All Items" pill */}
          <button
            onClick={() => setActiveCategoryId(null)}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              background: activeCategoryId === null ? activePillBg : '#f3f4f6',
              color: activeCategoryId === null ? activePillText : '#6b7280',
              fontFamily: 'inherit',
            }}
          >
            All Items
          </button>

          {PLACEHOLDER_CATEGORIES.map((cat) => {
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(isActive ? null : cat.id)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  background: isActive ? activePillBg : '#f3f4f6',
                  color: isActive ? activePillText : '#6b7280',
                  fontFamily: 'inherit',
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active filter indicator ── */}
      {activeCategoryId !== null && (
        <div style={{
          width: '100%',
          maxWidth: '1536px',
          margin: '0 auto',
          padding: '0 32px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Filtering by:
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '999px',
            background: '#f3f4f6',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#111827',
          }}>
            {PLACEHOLDER_CATEGORIES.find((c) => c.id === activeCategoryId)?.name}
            <button
              onClick={() => setActiveCategoryId(null)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                color: '#9ca3af',
                lineHeight: 1,
                fontSize: '14px',
              }}
            >
              ×
            </button>
          </span>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            (filter is visual only in editor preview)
          </span>
        </div>
      )}
    </div>
  );
};

ProductsHeroBlock.craft = {
  displayName: 'ProductsHeroBlock',
  props: {
    eyebrow: 'New Season',
    heading: 'Curated Selection',
    subheading: 'The Full Inventory',
    activePillBg: '#111827',
    activePillText: '#ffffff',
  },
  related: {
    settings: ProductsHeroBlockSettings,
  },
};