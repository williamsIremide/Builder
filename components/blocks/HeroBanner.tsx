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

export interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  imageUrl?: string;
}

export const HeroBannerSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as HeroBannerProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Motto / Headline</label>
        <input
          type="text"
          value={props.title ?? ''}
          onChange={(e) => setProp((p: HeroBannerProps) => { p.title = e.target.value; })}
          placeholder="e.g. Fresh Finds Every"
        />
      </div>
      <div className="settings-group">
        <label>Description</label>
        <textarea
          rows={3}
          value={props.subtitle ?? ''}
          onChange={(e) => setProp((p: HeroBannerProps) => { p.subtitle = e.target.value; })}
        />
      </div>
      <div className="settings-group">
        <label>Primary Button Label</label>
        <input
          type="text"
          value={props.primaryCtaLabel ?? ''}
          onChange={(e) => setProp((p: HeroBannerProps) => { p.primaryCtaLabel = e.target.value; })}
          placeholder="Explore Catalog"
        />
      </div>
      <div className="settings-group">
        <label>Secondary Button Label</label>
        <input
          type="text"
          value={props.secondaryCtaLabel ?? ''}
          onChange={(e) => setProp((p: HeroBannerProps) => { p.secondaryCtaLabel = e.target.value; })}
          placeholder="Seasonal Picks"
        />
      </div>
      <div className="settings-group">
        <label>Image URL</label>
        <input
          type="text"
          value={props.imageUrl ?? ''}
          onChange={(e) => setProp((p: HeroBannerProps) => { p.imageUrl = e.target.value; })}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

export const HeroBanner = ({
  title,
  subtitle,
  primaryCtaLabel = 'Explore Catalog',
  secondaryCtaLabel = 'Seasonal Picks',
  imageUrl,
}: HeroBannerProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const ctx = useSafeStorefront();
  const storefrontData = ctx?.storefrontData;

  // Use prop overrides, fall back to live storefront data
  const storeName = storefrontData?.store?.name ?? 'Your Store';
  const resolvedImage = imageUrl || storefrontData?.hero_bg_image || null;
  const description = subtitle || storefrontData?.homepage_description || 'Discover our curated collection of amazing products.';

  // Split motto — last word gets accent color, same as real HeroSection
  const mottoWords = (title || storefrontData?.motto || 'Welcome to Our Store').split(' ');
  const lastWord = mottoWords.length > 1 ? mottoWords.pop() : mottoWords[0];
  const restOfMotto = mottoWords.join(' ');

  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
        padding: '48px 32px',
        maxWidth: '1536px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left — text */}
        <div style={{ gridColumn: 'span 6' }}>
          <span style={{ color: 'var(--rb-primary, #f59e0b)', fontSize: '0.875rem', textTransform: 'uppercase', display: 'block', marginBottom: '16px', fontWeight: 600 }}>
            {storeName}
          </span>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, margin: '0 0 32px', color: '#111827' }}>
            {restOfMotto}{' '}
            <span style={{ color: 'var(--rb-primary, #f59e0b)', fontStyle: 'italic' }}>
              {lastWord}
            </span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '40px', maxWidth: '50%' }}>
            {description}
          </p>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={(e) => e.preventDefault()}
              style={{
                padding: '12px 28px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              {primaryCtaLabel}
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              style={{
                padding: '12px 28px',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              {secondaryCtaLabel}
            </button>
          </div>
        </div>

        {/* Right — image */}
        <div
          style={{
            gridColumn: 'span 6',
            position: 'relative',
            height: '500px',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#e5e7eb',
          }}
        >
          {resolvedImage ? (
            <img
              src={resolvedImage}
              alt={`${storeName} Hero`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
              Hero Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

HeroBanner.craft = {
  displayName: 'HeroBanner',
  props: {
    title: '',
    subtitle: '',
    primaryCtaLabel: 'Explore Catalog',
    secondaryCtaLabel: 'Seasonal Picks',
    imageUrl: '',
  },
  related: { settings: HeroBannerSettings },
  rules: {
    canDrag: () => true,
    canDrop: () => false,
    canMoveIn: () => false,
  },
};