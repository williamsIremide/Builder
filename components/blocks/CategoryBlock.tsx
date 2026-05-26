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

export interface CategoryBlockProps {
  title?: string;
}

const PLACEHOLDER_CATEGORIES = [
  { id: 1, name: 'Fashion', display_cover: null },
  { id: 2, name: 'Beverages', display_cover: null },
  { id: 3, name: 'Snacks', display_cover: null },
  { id: 4, name: 'Gadgets', display_cover: null },
];

function getCategoryDescription(name: string) {
  const n = name.toLowerCase();
  if (n.includes('snack') || n.includes('food')) return 'Fresh picks for every craving.';
  if (n.includes('gadget') || n.includes('tech')) return 'Where performance meets design.';
  if (n.includes('fashion')) return 'Timeless pieces, curated for you.';
  if (n.includes('beverage') || n.includes('drink')) return 'From morning brews to evening sips.';
  if (n.includes('care')) return 'Essentials for your everyday routine.';
  return 'Discover our curated collection.';
}

export const CategoryBlock = ({ title = 'Top Categories' }: CategoryBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const ctx = useSafeStorefront();
  let categories: { id: any; name: string; display_cover?: string | null }[] = [];
  try {
    categories = ctx?.storefrontData?.categories ?? [];
  } catch {}

  const items = categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES;
  const bento = items.slice(0, 4);
  const isPlaceholder = categories.length === 0;

  return (
    <section
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab', padding: '40px 32px', width: '100%' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>{title}</h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Intentionally selected for your needs</p>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>
          View all →
        </a>
      </div>

      {/* Desktop — Bento grid (4 items, 4-col x 2-row) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '16px',
        height: '480px',
        marginTop: '16px',
        opacity: isPlaceholder ? 0.5 : 1,
      }}>

        {/* Card 0 — Large (2 cols x 2 rows) */}
        {bento[0] && (
          <div style={{
            gridColumn: 'span 2',
            gridRow: 'span 2',
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#e5e7eb',
          }}>
            {bento[0].display_cover && (
              <img src={bento[0].display_cover} alt={bento[0].name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', color: '#fff', textAlign: 'left' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Category</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px' }}>{bento[0].name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>{getCategoryDescription(bento[0].name)}</p>
            </div>
          </div>
        )}

        {/* Card 1 — Wide (2 cols x 1 row) */}
        {bento[1] && (
          <div style={{
            gridColumn: 'span 2',
            gridRow: 'span 1',
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#fdeee6',
            display: 'flex',
          }}>
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>{bento[1].name}</h3>
              <p style={{ fontSize: '0.875rem', color: '#f97316', margin: 0 }}>{getCategoryDescription(bento[1].name)}</p>
            </div>
            <div style={{ width: '176px', position: 'relative', overflow: 'hidden' }}>
              {bento[1].display_cover ? (
                <img src={bento[1].display_cover} alt={bento[1].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#fed7aa' }} />
              )}
            </div>
          </div>
        )}

        {/* Card 2 — Small white (1 col x 1 row) */}
        {bento[2] && (
          <div style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#ffffff',
            border: '1px solid #f3f4f6',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>{bento[2].name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 12px' }}>{getCategoryDescription(bento[2].name)}</p>
            <div style={{ marginTop: 'auto', height: '80px', borderRadius: '8px', overflow: 'hidden', background: '#e5e7eb' }}>
              {bento[2].display_cover && (
                <img src={bento[2].display_cover} alt={bento[2].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </div>
        )}

        {/* Card 3 — Small dark (1 col x 1 row) */}
        {bento[3] && (
          <div style={{
            gridColumn: 'span 1',
            gridRow: 'span 1',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0d1b2a',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: '0 0 4px' }}>{bento[3].name}</h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: '0 0 12px' }}>{getCategoryDescription(bento[3].name)}</p>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#4b5563', fontSize: '1.25rem', letterSpacing: '0.4em' }}>• • •</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const CategoryBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as CategoryBlockProps,
  }));
  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Section Title</label>
        <input
          type="text"
          value={props.title ?? 'Top Categories'}
          onChange={(e) => setProp((p: CategoryBlockProps) => { p.title = e.target.value; })}
        />
      </div>
    </div>
  );
};

CategoryBlock.craft = {
  displayName: 'CategoryBlock',
  props: { title: 'Top Categories' },
  related: { settings: CategoryBlockSettings },
};