import React, { useState } from 'react';
import { useNode } from '@craftjs/core';

export interface ProductDetailsProps {
  productName?: string;
  category?: string;
  price?: string;
  originalPrice?: string;
  description?: string;
  showReviews?: boolean;
  showRelated?: boolean;
  accentColor?: string;
}

const MOCK_IMAGES = [
  null, null, null, null, // placeholders
];

const MOCK_REVIEWS = [
  { id: 1, rating: 5, title: 'Exceptional Quality', body: 'Outstanding craftsmanship and attention to detail. Completely exceeded my expectations.', initials: 'AM', name: 'Alexander M.' },
  { id: 2, rating: 4, title: 'Comfortable All Day', body: 'Incredibly comfortable for long sessions. The build quality feels premium.', initials: 'SL', name: 'Sarah L.' },
  { id: 3, rating: 5, title: 'Highly Recommended', body: 'Bought this as a gift and the recipient was thrilled. Fast shipping and perfect condition.', initials: 'DJ', name: 'David J.' },
];

const MOCK_RELATED = [
  { id: 1, name: 'Related Product A', price: '₦4,500', category: 'FASHION' },
  { id: 2, name: 'Related Product B', price: '₦7,200', category: 'GADGETS' },
  { id: 3, name: 'Related Product C', price: '₦2,800', category: 'BEVERAGES' },
  { id: 4, name: 'Related Product D', price: '₦5,100', category: 'SNACKS' },
];

const MOCK_VARIANTS = ['Natural', 'Midnight', 'Cream', 'Forest'];

const VARIANT_COLORS: Record<string, string> = {
  Natural: '#c8a97e',
  Midnight: '#1a1a2e',
  Cream: '#f5f0e8',
  Forest: '#2d4a2d',
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export const ProductDetailsSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as ProductDetailsProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Product Name</label>
        <input
          type="text"
          value={props.productName ?? ''}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.productName = e.target.value; })}
          placeholder="e.g. Premium Wireless Headphones"
        />
      </div>
      <div className="settings-group">
        <label>Category</label>
        <input
          type="text"
          value={props.category ?? ''}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.category = e.target.value; })}
          placeholder="e.g. ELECTRONICS"
        />
      </div>
      <div className="settings-group">
        <label>Price</label>
        <input
          type="text"
          value={props.price ?? ''}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.price = e.target.value; })}
          placeholder="e.g. ₦12,500"
        />
      </div>
      <div className="settings-group">
        <label>Original Price (if discounted)</label>
        <input
          type="text"
          value={props.originalPrice ?? ''}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.originalPrice = e.target.value; })}
          placeholder="e.g. ₦15,000"
        />
      </div>
      <div className="settings-group">
        <label>Description</label>
        <textarea
          rows={3}
          value={props.description ?? ''}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.description = e.target.value; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Reviews</label>
        <input
          type="checkbox"
          checked={props.showReviews ?? true}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.showReviews = e.target.checked; })}
        />
      </div>
      <div className="settings-group settings-toggle">
        <label>Show Related Products</label>
        <input
          type="checkbox"
          checked={props.showRelated ?? true}
          onChange={(e) => setProp((p: ProductDetailsProps) => { p.showRelated = e.target.checked; })}
        />
      </div>
      <div className="settings-group">
        <label>Accent Color</label>
        <div className="color-input-row">
          <input
            type="color"
            value={props.accentColor ?? '#B3561B'}
            onChange={(e) => setProp((p: ProductDetailsProps) => { p.accentColor = e.target.value; })}
          />
          <span>{props.accentColor ?? '#B3561B'}</span>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailsBlock = ({
  productName = 'Premium Wireless Headphones',
  category = 'ELECTRONICS',
  price = '₦12,500',
  originalPrice = '₦15,000',
  description = 'Experience exceptional sound quality with our premium wireless headphones. Crafted with attention to detail and built for all-day comfort.',
  showReviews = true,
  showRelated = true,
  accentColor = '#B3561B',
}: ProductDetailsProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 32px',
      }}
    >
      {/* ── Main product section ── */}
      <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start' }}>

        {/* Left — Image gallery */}
        <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Hero image */}
          <div style={{
            aspectRatio: '4/5',
            background: '#f3f4f6',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '0.875rem',
          }}>
            Product Image {selectedImage + 1}
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {MOCK_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                style={{
                  aspectRatio: '1',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  border: i === selectedImage ? `2px solid ${accentColor}` : '2px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right — Product info */}
        <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Category */}
          <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b7280' }}>
            {category}
          </span>

          {/* Name */}
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, margin: 0, color: '#111827' }}>
            {productName}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRow rating={4} />
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>(128 reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827' }}>{price}</span>
            {originalPrice && (
              <span style={{ fontSize: '1rem', color: '#9ca3af', textDecoration: 'line-through' }}>{originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <p style={{ fontSize: '1rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
            {description}
          </p>

          {/* Variant selector */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', color: '#111827' }}>
              Select Finish
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {MOCK_VARIANTS.map((v, i) => (
                <button
                  key={v}
                  onClick={() => setSelectedVariant(i)}
                  title={v}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: VARIANT_COLORS[v],
                    border: '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    outline: i === selectedVariant ? `2px solid ${accentColor}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', color: '#111827' }}>
              Specifications
            </h3>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[['SKU', 'PRD-001'], ['Brand', 'RetailBox'], ['Variant', MOCK_VARIANTS[selectedVariant]], ['In Stock', '42 units']].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to cart */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <button
              style={{
                flex: 1,
                height: '56px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>
            {/* Save/favourite */}
            <button style={{
              padding: '0 20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: '#fff',
              cursor: 'pointer',
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Free shipping + warranty */}
          <div style={{ display: 'flex', gap: '32px', paddingTop: '24px', borderTop: '1px solid #f3f4f6', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke={accentColor} strokeWidth="2" viewBox="0 0 24 24">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827' }}>Free Shipping</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke={accentColor} strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827' }}>2 Year Warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews ── */}
      {showReviews && (
        <section style={{ marginTop: '96px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#111827' }}>
                Customer Reviews
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Authentic feedback from our community.</p>
            </div>
            <button style={{
              padding: '12px 24px',
              border: `1px solid ${accentColor}`,
              color: accentColor,
              background: 'transparent',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              Write a Review
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} style={{
                background: '#fff',
                border: '1px solid #f3f4f6',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <StarRow rating={review.rating} />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '16px 0 8px', color: '#111827' }}>{review.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '24px' }}>
                  &ldquo;{review.body}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#f3f4f6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', color: '#111827',
                  }}>
                    {review.initials}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: '#111827' }}>{review.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── You May Also Like ── */}
      {showRelated && (
        <section style={{ marginTop: '80px', paddingBottom: '32px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 4px', color: '#111827' }}>
              You May Also Like
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Curated pairings to enhance your experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {MOCK_RELATED.map((item) => (
              <div key={item.id} style={{ cursor: 'pointer' }}>
                <div style={{
                  aspectRatio: '1',
                  background: '#f3f4f6',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                }}>
                  Product Image
                </div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 4px' }}>
                  {item.category}
                </p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>{item.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

ProductDetailsBlock.craft = {
  displayName: 'ProductDetails',
  props: {
    productName: 'Premium Wireless Headphones',
    category: 'ELECTRONICS',
    price: '₦12,500',
    originalPrice: '₦15,000',
    description: 'Experience exceptional sound quality with our premium wireless headphones. Crafted with attention to detail and built for all-day comfort.',
    showReviews: true,
    showRelated: true,
    accentColor: '#B3561B',
  },
  related: { settings: ProductDetailsSettings },
};