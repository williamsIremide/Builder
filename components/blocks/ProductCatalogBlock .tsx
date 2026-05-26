import React, { useState, useMemo } from 'react';
import { useNode } from '@craftjs/core';

// ─── Mock data matching real storefront shape ─────────────────────────────────

const PLACEHOLDER_CATEGORIES = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' },
  { id: 3, name: 'Fashion' },
  { id: 4, name: 'Personal Care' },
  { id: 5, name: 'Gadgets' },
  { id: 6, name: 'Sportswear' },
  { id: 7, name: 'Accessories' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const MOCK_PRODUCTS = [
  { id: 1,  name: 'Classic Tee',       price: 4500,  originalPrice: 6000,  category: 1, discount: '25%', variants: ['Small', 'Medium', 'Large'],    sizes: ['S','M','L'],         displayCategory: 'Fashion'    },
  { id: 2,  name: 'Slim Chinos',       price: 7200,  originalPrice: null,  category: 3, discount: null,  variants: ['30', '32', '34'],               sizes: [],                    displayCategory: 'Fashion'    },
  { id: 3,  name: 'Canvas Sneakers',   price: 12500, originalPrice: 15000, category: 3, discount: '17%', variants: ['42', '43', '44'],               sizes: [],                    displayCategory: 'Fashion'    },
  { id: 4,  name: 'Wool Beanie',       price: 3800,  originalPrice: null,  category: 7, discount: null,  variants: ['One Size'],                     sizes: [],                    displayCategory: 'Accessories'},
  { id: 5,  name: 'Leather Belt',      price: 5100,  originalPrice: 6500,  category: 7, discount: '22%', variants: ['S', 'M', 'L'],                  sizes: ['S','M','L'],         displayCategory: 'Accessories'},
  { id: 6,  name: 'Denim Jacket',      price: 18000, originalPrice: null,  category: 3, discount: null,  variants: ['XS', 'S', 'M', 'L'],            sizes: ['XS','S','M','L'],    displayCategory: 'Fashion'    },
  { id: 7,  name: 'Linen Shirt',       price: 8900,  originalPrice: 11000, category: 3, discount: '19%', variants: ['S', 'M', 'L'],                  sizes: ['S','M','L'],         displayCategory: 'Fashion'    },
  { id: 8,  name: 'Running Shorts',    price: 5500,  originalPrice: null,  category: 6, discount: null,  variants: ['S', 'M', 'L', 'XL'],            sizes: ['S','M','L','XL'],    displayCategory: 'Sportswear' },
  { id: 9,  name: 'Knit Sweater',      price: 14200, originalPrice: 17000, category: 3, discount: '16%', variants: ['S', 'M', 'L'],                  sizes: ['S','M','L'],         displayCategory: 'Fashion'    },
  { id: 10, name: 'Cargo Pants',       price: 11000, originalPrice: null,  category: 3, discount: null,  variants: ['30', '32', '34', '36'],         sizes: [],                    displayCategory: 'Fashion'    },
  { id: 11, name: 'Matcha Latte Mix',  price: 2800,  originalPrice: null,  category: 1, discount: null,  variants: ['250g', '500g'],                 sizes: [],                    displayCategory: 'Beverages'  },
  { id: 12, name: 'Granola Bars ×6',   price: 1600,  originalPrice: 2000,  category: 2, discount: '20%', variants: ['Original', 'Choco'],            sizes: [],                    displayCategory: 'Snacks'     },
  { id: 13, name: 'Face Moisturiser',  price: 4200,  originalPrice: null,  category: 4, discount: null,  variants: ['50ml', '100ml'],               sizes: [],                    displayCategory: 'Personal Care'},
  { id: 14, name: 'Wireless Earbuds',  price: 22500, originalPrice: 28000, category: 5, discount: '20%', variants: ['White', 'Black'],               sizes: [],                    displayCategory: 'Gadgets'    },
  { id: 15, name: 'Yoga Leggings',     price: 7800,  originalPrice: null,  category: 6, discount: null,  variants: ['XS', 'S', 'M', 'L'],            sizes: ['XS','S','M','L'],    displayCategory: 'Sportswear' },
];

const PRICE_MIN = 0;
const PRICE_MAX = 30000;

function formatPrice(n: number, sym: string) {
  return `${sym}${n.toLocaleString()}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductCatalogBlockProps {
  currencySymbol?: string;
  accentColor?: string;
  cardBackground?: string;
  showAddToCart?: boolean;
  showPrices?: boolean;
  /** Show the size filter section in the sidebar */
  showSizeFilter?: boolean;
  /** Show the price range filter in the sidebar */
  showPriceFilter?: boolean;
  /** Show sort dropdown */
  showSortBy?: boolean;
}

// ─── Settings panel ───────────────────────────────────────────────────────────

export const ProductCatalogBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProductCatalogBlockProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Currency Symbol</label>
        <input
          type="text"
          value={props.currencySymbol ?? '₦'}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.currencySymbol = e.target.value; })}
        />
      </div>

      <div className="settings-row">
        <div className="settings-group">
          <label>Accent Color</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.accentColor ?? '#B3561B'}
              onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.accentColor = e.target.value; })}
            />
            <span>{props.accentColor ?? '#B3561B'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Card Background</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.cardBackground ?? '#ffffff'}
              onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.cardBackground = e.target.value; })}
            />
            <span>{props.cardBackground ?? '#ffffff'}</span>
          </div>
        </div>
      </div>

      <div className="settings-group settings-toggle">
        <label>Show Prices</label>
        <input
          type="checkbox"
          checked={props.showPrices ?? true}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.showPrices = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Add to Cart</label>
        <input
          type="checkbox"
          checked={props.showAddToCart ?? true}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.showAddToCart = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Size Filter</label>
        <input
          type="checkbox"
          checked={props.showSizeFilter ?? true}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.showSizeFilter = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Price Range Filter</label>
        <input
          type="checkbox"
          checked={props.showPriceFilter ?? true}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.showPriceFilter = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Sort By</label>
        <input
          type="checkbox"
          checked={props.showSortBy ?? true}
          onChange={(e) => setProp((p: ProductCatalogBlockProps) => { p.showSortBy = e.target.checked; })}
        />
      </div>

      <p style={{ fontSize: '0.72rem', color: '#52525b', margin: '8px 0 0', lineHeight: 1.5 }}>
        In the live storefront, categories, sizes, and products are fetched from your store's API. Filters are visual-only in the editor.
      </p>
    </div>
  );
};

// ─── Product card ─────────────────────────────────────────────────────────────

function CatalogProductCard({
  product,
  cardBackground,
  accentColor,
  showPrices,
  showAddToCart,
  currencySymbol,
}: {
  product: typeof MOCK_PRODUCTS[0];
  cardBackground: string;
  accentColor: string;
  showPrices: boolean;
  showAddToCart: boolean;
  currencySymbol: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: '12px',
        overflow: 'hidden',
        background: cardBackground === '#ffffff' ? '#f9fafb' : cardBackground,
      }}>
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#d1d5db',
          transition: 'transform 0.4s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}>
          <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: '#111827', color: '#fff',
            fontSize: '0.6rem', fontWeight: 700,
            padding: '2px 7px', borderRadius: '999px',
          }}>
            {product.discount} off
          </div>
        )}

        {/* Favourite */}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="12" height="12" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>

        {/* Add to cart overlay */}
        {showAddToCart && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '10px',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.25s ease',
            zIndex: 10,
          }}>
            <button style={{
              width: '100%', padding: '8px',
              background: '#111827', color: '#fff',
              border: 'none', borderRadius: '7px',
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase' as const,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <p style={{ fontWeight: 700, fontSize: '0.825rem', color: '#111827', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </p>
        <p style={{ fontSize: '0.7rem', color: '#9ca3af', margin: 0 }}>
          {product.displayCategory}
        </p>
        {showPrices && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: accentColor }}>
              {formatPrice(product.price, currencySymbol)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '0.7rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                {formatPrice(product.originalPrice, currencySymbol)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Filter sidebar section header ────────────────────────────────────────────

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '16px', marginBottom: '16px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', background: 'transparent', border: 'none',
          padding: '0 0 10px', cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
          {title}
        </span>
        <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && children}
    </div>
  );
}

// ─── Price range slider (visual) ──────────────────────────────────────────────

function PriceRangeFilter({
  min, max, value, onChange, currencySymbol,
}: {
  min: number; max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  currencySymbol: string;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
          {formatPrice(value[0], currencySymbol)}
        </span>
        <span style={{ fontSize: '0.78rem', color: '#374151', fontWeight: 600 }}>
          {formatPrice(value[1], currencySymbol)}
        </span>
      </div>
      {/* Min slider */}
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <input
          type="range"
          min={min} max={max} step={500}
          value={value[0]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v < value[1]) onChange([v, value[1]]);
          }}
          style={{ width: '100%', accentColor: '#111827' }}
        />
      </div>
      {/* Max slider */}
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min={min} max={max} step={500}
          value={value[1]}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v > value[0]) onChange([value[0], v]);
          }}
          style={{ width: '100%', accentColor: '#111827' }}
        />
      </div>
    </div>
  );
}

// ─── Active filter chips ──────────────────────────────────────────────────────

function ActiveFilters({
  categoryId, sizes, priceRange, sortBy,
  onRemoveCategory, onRemoveSize, onResetPrice, onResetSort,
}: {
  categoryId: number | null;
  sizes: string[];
  priceRange: [number, number];
  sortBy: string;
  onRemoveCategory: () => void;
  onRemoveSize: (s: string) => void;
  onResetPrice: () => void;
  onResetSort: () => void;
}) {
  const priceChanged = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const sortChanged = sortBy !== 'newest';
  const hasAny = categoryId !== null || sizes.length > 0 || priceChanged || sortChanged;
  if (!hasAny) return null;

  const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '999px',
      background: '#f3f4f6', fontSize: '0.75rem', fontWeight: 600, color: '#374151',
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: 0, color: '#9ca3af', lineHeight: 1, fontSize: '14px',
      }}>×</button>
    </span>
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
      <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Filters:</span>
      {categoryId !== null && (
        <Chip label={PLACEHOLDER_CATEGORIES.find(c => c.id === categoryId)?.name ?? ''} onRemove={onRemoveCategory} />
      )}
      {sizes.map(s => (
        <Chip key={s} label={`Size: ${s}`} onRemove={() => onRemoveSize(s)} />
      ))}
      {priceChanged && (
        <Chip label={`Price: ${formatPrice(priceRange[0], '₦')}–${formatPrice(priceRange[1], '₦')}`} onRemove={onResetPrice} />
      )}
      {sortChanged && (
        <Chip label={`Sort: ${SORT_OPTIONS.find(o => o.value === sortBy)?.label ?? sortBy}`} onRemove={onResetSort} />
      )}
    </div>
  );
}

// ─── Main block ───────────────────────────────────────────────────────────────

export const ProductCatalogBlock = ({
  currencySymbol = '₦',
  accentColor = '#B3561B',
  cardBackground = '#ffffff',
  showAddToCart = true,
  showPrices = true,
  showSizeFilter = true,
  showPriceFilter = true,
  showSortBy = true,
}: ProductCatalogBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  // ── Filter state ──────────────────────────────────────────────────────────
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [sortBy, setSortBy] = useState('newest');
  

  // ── Filtered & sorted products ────────────────────────────────────────────
  const displayed = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (activeCategoryId !== null) {
      list = list.filter(p => p.category === activeCategoryId);
    }
    if (activeSizes.length > 0) {
      list = list.filter(p => p.sizes.some(s => activeSizes.includes(s)));
    }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [activeCategoryId, activeSizes, priceRange, sortBy]);

  const toggleSize = (s: string) =>
    setActiveSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        background: '#fff',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '0 32px 48px',
      }}>



        {/* ── Desktop: two-column layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '32px',
          alignItems: 'start',
        }}>

          {/* ── LEFT: Filter sidebar ── */}
          <aside style={{
            position: 'sticky',
            top: '80px',
            paddingTop: '4px',
          }}>
            {/* Category filter */}
            <FilterSection title="Category">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {/* All */}
                <button
                  onClick={() => setActiveCategoryId(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 10px', borderRadius: '7px',
                    background: activeCategoryId === null ? '#f3f4f6' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left' as const,
                    fontFamily: 'inherit',
                  }}
                >
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: activeCategoryId === null ? 700 : 400,
                    color: activeCategoryId === null ? '#111827' : '#6b7280',
                  }}>
                    All Items
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                    {MOCK_PRODUCTS.length}
                  </span>
                </button>

                {PLACEHOLDER_CATEGORIES.map(cat => {
                  const count = MOCK_PRODUCTS.filter(p => p.category === cat.id).length;
                  if (count === 0) return null;
                  const isActive = activeCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryId(isActive ? null : cat.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '7px 10px', borderRadius: '7px',
                        background: isActive ? '#f3f4f6' : 'transparent',
                        border: 'none', cursor: 'pointer', textAlign: 'left' as const,
                        fontFamily: 'inherit',
                      }}
                    >
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? '#111827' : '#6b7280',
                      }}>
                        {cat.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </FilterSection>

            {/* Size filter */}
            {showSizeFilter && (
              <FilterSection title="Size">
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {SIZE_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      style={{
                        width: '38px', height: '38px', borderRadius: '7px',
                        border: `1.5px solid ${activeSizes.includes(s) ? '#111827' : '#e5e7eb'}`,
                        background: activeSizes.includes(s) ? '#111827' : '#fff',
                        color: activeSizes.includes(s) ? '#fff' : '#374151',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Price range filter */}
            {showPriceFilter && (
              <FilterSection title="Price Range">
                <PriceRangeFilter
                  min={PRICE_MIN} max={PRICE_MAX}
                  value={priceRange} onChange={setPriceRange}
                  currencySymbol={currencySymbol}
                />
              </FilterSection>
            )}

            {/* Reset all */}
            {(activeCategoryId !== null || activeSizes.length > 0 || priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
              <button
                onClick={() => {
                  setActiveCategoryId(null);
                  setActiveSizes([]);
                  setPriceRange([PRICE_MIN, PRICE_MAX]);
                }}
                style={{
                  width: '100%', padding: '8px', borderRadius: '7px',
                  border: '1px solid #e5e7eb', background: '#fff',
                  fontSize: '0.8rem', fontWeight: 600, color: '#6b7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                  marginTop: '4px',
                }}
              >
                Clear all filters
              </button>
            )}
          </aside>

          {/* ── RIGHT: Product grid ── */}
          <div>
            {/* Toolbar: result count + active filter chips + sort */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', marginBottom: '16px',
              flexWrap: 'wrap' as const, gap: '8px',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 6px' }}>
                  {displayed.length} {displayed.length === 1 ? 'product' : 'products'}
                  {activeCategoryId !== null && ` in ${PLACEHOLDER_CATEGORIES.find(c => c.id === activeCategoryId)?.name}`}
                </p>
                <ActiveFilters
                  categoryId={activeCategoryId}
                  sizes={activeSizes}
                  priceRange={priceRange}
                  sortBy={sortBy}
                  onRemoveCategory={() => setActiveCategoryId(null)}
                  onRemoveSize={(s) => setActiveSizes(prev => prev.filter(x => x !== s))}
                  onResetPrice={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
                  onResetSort={() => setSortBy('newest')}
                />
              </div>

              {showSortBy && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <label style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '7px 12px', border: '1px solid #e5e7eb',
                      borderRadius: '8px', fontSize: '0.8rem', color: '#374151',
                      background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Product grid */}
            {displayed.length === 0 ? (
              <div style={{
                padding: '80px 0', textAlign: 'center',
                color: '#9ca3af',
              }}>
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" style={{ marginBottom: '12px', opacity: 0.4 }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>No products match your filters</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Try adjusting or clearing your filters</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
                gap: '20px',
              }}>
                {displayed.map(product => (
                  <CatalogProductCard
                    key={product.id}
                    product={product}
                    cardBackground={cardBackground}
                    accentColor={accentColor}
                    showPrices={showPrices}
                    showAddToCart={showAddToCart}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCatalogBlock.craft = {
  displayName: 'ProductCatalogBlock',
  props: {
    currencySymbol: '₦',
    accentColor: '#B3561B',
    cardBackground: '#ffffff',
    showAddToCart: true,
    showPrices: true,
    showSizeFilter: true,
    showPriceFilter: true,
    showSortBy: true,
  },
  related: { settings: ProductCatalogBlockSettings },
};