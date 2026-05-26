import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { MOCK_CATEGORIES, SIZE_OPTIONS, PRICE_MIN, PRICE_MAX, formatPrice } from '~/constants/mock/mockProducts';
import {
  setCatalogCategory,
  onCatalogCategoryChange,
  getCatalogCategory,
} from '~/contexts/catalogFilterContext';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductsHeroBlockProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  activePillBg?: string;
  activePillText?: string;
  /** Whether to show the inline Filters button + panel in the storefront */
  showFiltersButton?: boolean;
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

      {/* ── Filters button toggle ── */}
      <div style={{ borderTop: '1px solid #27272a', margin: '12px 0 8px', paddingTop: '12px' }}>
        <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', margin: '0 0 8px' }}>
          Inline Filters
        </p>
        <div className="settings-group settings-toggle">
          <label>Show Filters Button</label>
          <input
            type="checkbox"
            checked={props.showFiltersButton ?? true}
            onChange={(e) => setProp((p: ProductsHeroBlockProps) => { p.showFiltersButton = e.target.checked; })}
          />
        </div>
        <p style={{ fontSize: '0.68rem', color: '#52525b', margin: '4px 0 0', lineHeight: 1.5 }}>
          When enabled, a "Filters" button appears in the pill strip. Shoppers click it to expand quick-filter options (category, size, price).
        </p>
      </div>

      <p style={{ fontSize: '0.68rem', color: '#52525b', margin: '12px 0 0', lineHeight: 1.5, borderTop: '1px solid #27272a', paddingTop: '10px' }}>
        Category pills are bidirectionally synced with the Product Catalog sidebar. Clicking either updates both.
      </p>
    </div>
  );
};

// ─── Inline filter panel (storefront-facing) ──────────────────────────────────

function InlineFilterPanel({
  activeCategoryId,
  onCategoryChange,
  activeSizes,
  onToggleSize,
  priceRange,
  onPriceChange,
  currencySymbol,
  onClear,
}: {
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  activeSizes: string[];
  onToggleSize: (s: string) => void;
  priceRange: [number, number];
  onPriceChange: (v: [number, number]) => void;
  currencySymbol: string;
  onClear: () => void;
}) {
  const hasActiveFilters =
    activeCategoryId !== null ||
    activeSizes.length > 0 ||
    priceRange[0] !== PRICE_MIN ||
    priceRange[1] !== PRICE_MAX;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1536px',
      margin: '0 auto',
      padding: '0 32px 20px',
      animation: 'slideDown 0.2s ease',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: '24px',
        padding: '20px 24px',
        background: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #f3f4f6',
        alignItems: 'start',
      }}>

        {/* Category */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', margin: '0 0 10px' }}>
            Category
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            <button
              onClick={() => onCategoryChange(null)}
              style={{
                padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                border: `1.5px solid ${activeCategoryId === null ? '#111827' : '#e5e7eb'}`,
                background: activeCategoryId === null ? '#111827' : '#fff',
                color: activeCategoryId === null ? '#fff' : '#6b7280',
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >All</button>
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(activeCategoryId === cat.id ? null : cat.id)}
                style={{
                  padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
                  border: `1.5px solid ${activeCategoryId === cat.id ? '#111827' : '#e5e7eb'}`,
                  background: activeCategoryId === cat.id ? '#111827' : '#fff',
                  color: activeCategoryId === cat.id ? '#fff' : '#6b7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', margin: '0 0 10px' }}>
            Size
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
            {SIZE_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => onToggleSize(s)}
                style={{
                  width: '34px', height: '34px', borderRadius: '7px',
                  border: `1.5px solid ${activeSizes.includes(s) ? '#111827' : '#e5e7eb'}`,
                  background: activeSizes.includes(s) ? '#111827' : '#fff',
                  color: activeSizes.includes(s) ? '#fff' : '#374151',
                  fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.12s',
                }}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', margin: '0 0 10px' }}>
            Price Range
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>{formatPrice(priceRange[0], currencySymbol)}</span>
            <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 600 }}>{formatPrice(priceRange[1], currencySymbol)}</span>
          </div>
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={priceRange[0]}
            onChange={(e) => { const v = Number(e.target.value); if (v < priceRange[1]) onPriceChange([v, priceRange[1]]); }}
            style={{ width: '100%', accentColor: '#111827', display: 'block', marginBottom: '6px' }}
          />
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={500} value={priceRange[1]}
            onChange={(e) => { const v = Number(e.target.value); if (v > priceRange[0]) onPriceChange([priceRange[0], v]); }}
            style={{ width: '100%', accentColor: '#111827', display: 'block' }}
          />
        </div>

        {/* Clear */}
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
          {hasActiveFilters && (
            <button
              onClick={onClear}
              style={{
                padding: '7px 14px', borderRadius: '7px',
                border: '1px solid #e5e7eb', background: '#fff',
                fontSize: '0.75rem', fontWeight: 600, color: '#6b7280',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main block ───────────────────────────────────────────────────────────────

export const ProductsHeroBlock = ({
  eyebrow = 'New Season',
  heading = 'Curated Selection',
  subheading = 'The Full Inventory',
  activePillBg = '#111827',
  activePillText = '#ffffff',
  showFiltersButton = true,
}: ProductsHeroBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  // Category — bidirectionally synced with ProductCatalogBlock
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(getCatalogCategory);

  // Inline filter panel state (storefront-facing, not persisted)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  // Subscribe: if catalog sidebar changes category, keep pill strip in sync
  useEffect(() => {
    const unsub = onCatalogCategoryChange((id) => {
      setActiveCategoryId(id);
    });
    return unsub;
  }, []);

  const handleCategorySelect = (id: number | null) => {
    setActiveCategoryId(id);
    setCatalogCategory(id);
  };

  const handleClearAll = () => {
    handleCategorySelect(null);
    setActiveSizes([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  };

  const toggleSize = (s: string) =>
    setActiveSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const activeFilterCount =
    (activeCategoryId !== null ? 1 : 0) +
    activeSizes.length +
    (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0);

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
      {/* ── Editorial header ── */}
      <div style={{
        width: '100%',
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '48px 32px 16px',
      }}>
        <p style={{
          fontSize: '0.75rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: '#9ca3af', margin: '0 0 6px',
        }}>{eyebrow}</p>
        <h1 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800,
          letterSpacing: '-0.02em', margin: '0 0 4px',
          color: 'var(--rb-primary, #f59e0b)', lineHeight: 1.1,
        }}>{heading}</h1>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 700,
          color: '#111827', margin: 0, lineHeight: 1.2,
        }}>{subheading}</h2>
      </div>

      {/* ── Pill strip row: categories + optional Filters button ── */}
      <div style={{
        width: '100%', maxWidth: '1536px', margin: '0 auto',
        padding: '16px 32px 24px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* Scrollable pill strip */}
        <div style={{
          flex: 1,
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none' as const,
        }}>
          <div style={{ display: 'flex', gap: '8px', width: 'max-content' }}>
            <button
              onClick={() => handleCategorySelect(null)}
              style={{
                padding: '8px 20px', borderRadius: '999px', border: 'none',
                fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
                background: activeCategoryId === null ? activePillBg : '#f3f4f6',
                color: activeCategoryId === null ? activePillText : '#6b7280',
                fontFamily: 'inherit',
              }}
            >All Items</button>

            {MOCK_CATEGORIES.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(isActive ? null : cat.id)}
                  style={{
                    padding: '8px 20px', borderRadius: '999px', border: 'none',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    whiteSpace: 'nowrap', transition: 'all 0.15s',
                    background: isActive ? activePillBg : '#f3f4f6',
                    color: isActive ? activePillText : '#6b7280',
                    fontFamily: 'inherit',
                  }}
                >{cat.name}</button>
              );
            })}
          </div>
        </div>

        {/* Filters toggle button */}
        {showFiltersButton && (
          <button
            onClick={() => setFilterPanelOpen(v => !v)}
            style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: filterPanelOpen ? '1.5px solid #111827' : '1.5px solid #e5e7eb',
              background: filterPanelOpen ? '#111827' : '#fff',
              color: filterPanelOpen ? '#fff' : '#374151',
              fontSize: '0.875rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
              position: 'relative',
            }}
          >
            {/* Sliders icon */}
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
              <circle cx="9" cy="6" r="2" fill={filterPanelOpen ? '#111827' : '#fff'}/>
              <circle cx="15" cy="12" r="2" fill={filterPanelOpen ? '#111827' : '#fff'}/>
              <circle cx="9" cy="18" r="2" fill={filterPanelOpen ? '#111827' : '#fff'}/>
            </svg>
            Filters
            {/* Active filter badge */}
            {activeFilterCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '18px', height: '18px', borderRadius: '50%',
                background: filterPanelOpen ? '#fff' : '#111827',
                color: filterPanelOpen ? '#111827' : '#fff',
                fontSize: '0.6rem', fontWeight: 800,
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── Inline filter panel (shown when Filters button is clicked) ── */}
      {showFiltersButton && filterPanelOpen && (
        <InlineFilterPanel
          activeCategoryId={activeCategoryId}
          onCategoryChange={handleCategorySelect}
          activeSizes={activeSizes}
          onToggleSize={toggleSize}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          currencySymbol="₦"
          onClear={handleClearAll}
        />
      )}

      {/* ── Active filter indicator (when panel closed but filters active) ── */}
      {activeCategoryId !== null && !filterPanelOpen && (
        <div style={{
          width: '100%', maxWidth: '1536px', margin: '0 auto',
          padding: '0 32px 8px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Filtering by:</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 10px', borderRadius: '999px',
            background: '#f3f4f6', fontSize: '0.8rem', fontWeight: 600, color: '#111827',
          }}>
            {MOCK_CATEGORIES.find((c) => c.id === activeCategoryId)?.name}
            <button
              onClick={() => handleCategorySelect(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#9ca3af', lineHeight: 1, fontSize: '14px' }}
            >×</button>
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
    showFiltersButton: true,
  },
  related: { settings: ProductsHeroBlockSettings },
};