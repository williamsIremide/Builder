import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

export interface ProductGridProps {
  columns?: 2 | 3 | 4;
  showPrices?: boolean;
  showAddToCart?: boolean;
  sectionTitle?: string;
  showTitle?: boolean;
  cardBackground?: string;
  accentColor?: string;
}

const MOCK_PRODUCTS = [
  { id: 1, name: 'Classic Tee', price: '₦4,500', originalPrice: '₦6,000', category: 'FASHION', discount: '25%', variants: ['Small', 'Medium', 'Large'] },
  { id: 2, name: 'Slim Chinos', price: '₦7,200', originalPrice: null, category: 'FASHION', discount: null, variants: ['30', '32', '34'] },
  { id: 3, name: 'Canvas Sneakers', price: '₦12,500', originalPrice: '₦15,000', category: 'FOOTWEAR', discount: '17%', variants: ['42', '43', '44'] },
  { id: 4, name: 'Wool Beanie', price: '₦3,800', originalPrice: null, category: 'ACCESSORIES', discount: null, variants: ['One Size'] },
  { id: 5, name: 'Leather Belt', price: '₦5,100', originalPrice: '₦6,500', category: 'ACCESSORIES', discount: '22%', variants: ['S', 'M', 'L'] },
  { id: 6, name: 'Denim Jacket', price: '₦18,000', originalPrice: null, category: 'FASHION', discount: null, variants: ['XS', 'S', 'M', 'L'] },
  { id: 7, name: 'Linen Shirt', price: '₦8,900', originalPrice: '₦11,000', category: 'FASHION', discount: '19%', variants: ['S', 'M', 'L'] },
  { id: 8, name: 'Running Shorts', price: '₦5,500', originalPrice: null, category: 'SPORTSWEAR', discount: null, variants: ['S', 'M', 'L', 'XL'] },
  { id: 9, name: 'Knit Sweater', price: '₦14,200', originalPrice: '₦17,000', category: 'FASHION', discount: '16%', variants: ['S', 'M', 'L'] },
  { id: 10, name: 'Cargo Pants', price: '₦11,000', originalPrice: null, category: 'FASHION', discount: null, variants: ['30', '32', '34', '36'] },
];

function MockProductCard({
  product,
  cardBackground,
  accentColor,
  showPrices,
  showAddToCart,
}: {
  product: typeof MOCK_PRODUCTS[0];
  cardBackground: string;
  accentColor: string;
  showPrices: boolean;
  showAddToCart: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [variantOpen, setVariantOpen] = useState(false);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setVariantOpen(false); }}
    >
      {/* Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#f3f4f6',
      }}>
        {/* Placeholder image area */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d1d5db',
          fontSize: '0.75rem',
          background: cardBackground === '#ffffff' ? '#f9fafb' : cardBackground,
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}>
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: '#111827',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
          }}>
            {product.discount} off
          </div>
        )}

        {/* Favourite button */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="14" height="14" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>

        {/* Hover overlay — Add to Cart */}
        {showAddToCart && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s ease',
            zIndex: 10,
          }}>
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Text info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
          {selectedVariant} · {product.category}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          {showPrices && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: accentColor }}>
                {product.price}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                  {product.originalPrice}
                </span>
              )}
            </div>
          )}

          {/* Variants dropdown */}
          {product.variants.length > 1 && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setVariantOpen(!variantOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {product.variants.length} Variants
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {variantOpen && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '4px',
                  minWidth: '120px',
                  zIndex: 20,
                }}>
                  {product.variants.map((v) => (
                    <div
                      key={v}
                      onClick={() => { setSelectedVariant(v); setVariantOpen(false); }}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        background: v === selectedVariant ? '#f3f4f6' : 'transparent',
                        fontWeight: v === selectedVariant ? 600 : 400,
                        color: '#374151',
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProductGridSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProductGridProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Section Title</label>
        <input
          type="text"
          value={props.sectionTitle ?? ''}
          onChange={(e) => setProp((p: ProductGridProps) => { p.sectionTitle = e.target.value; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Prices</label>
        <input
          type="checkbox"
          checked={props.showPrices ?? true}
          onChange={(e) => setProp((p: ProductGridProps) => { p.showPrices = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show "Add to Cart"</label>
        <input
          type="checkbox"
          checked={props.showAddToCart ?? true}
          onChange={(e) => setProp((p: ProductGridProps) => { p.showAddToCart = e.target.checked; })}
        />
      </div>
      <div className="settings-row">
        <div className="settings-group">
          <label>Card Background</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.cardBackground ?? '#ffffff'}
              onChange={(e) => setProp((p: ProductGridProps) => { p.cardBackground = e.target.value; })}
            />
            <span>{props.cardBackground ?? '#ffffff'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Accent Color</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.accentColor ?? '#B3561B'}
              onChange={(e) => setProp((p: ProductGridProps) => { p.accentColor = e.target.value; })}
            />
            <span>{props.accentColor ?? '#B3561B'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductGrid = ({
  showPrices = true,
  showAddToCart = true,
  sectionTitle = 'Featured Products',
  showTitle = true,
  cardBackground = '#ffffff',
  accentColor = '#B3561B',
}: ProductGridProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab', width: '100%', padding: '24px 32px' }}
    >
      <div style={{ width: '100%' }}>

        {/* Header */}
        {showTitle && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0, color: '#111827' }}>{sectionTitle}</h2>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none' }}
            >
              View all →
            </a>
          </div>
        )}

        {/* Grid — matches real storefront: 2 cols → 3 → 4 → 5 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
          width: '100%',
        }}>
          {MOCK_PRODUCTS.map((product) => (
            <MockProductCard
              key={product.id}
              product={product}
              cardBackground={cardBackground}
              accentColor={accentColor}
              showPrices={showPrices}
              showAddToCart={showAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

ProductGrid.craft = {
  displayName: 'ProductGrid',
  props: {
    columns: 3,
    showPrices: true,
    showAddToCart: true,
    sectionTitle: 'Featured Products',
    showTitle: true,
    cardBackground: '#ffffff',
    accentColor: '#B3561B',
  },
  related: { settings: ProductGridSettings },
};