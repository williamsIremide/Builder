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

export interface LocationBlockProps {
  title?: string;
}

const PLACEHOLDER_BRANCHES = [
  { id: 1, name: 'HQ Branch', address: '12 Marina Street, Lagos Island', city: 'Lagos', phone: '+234 801 234 5678', email: 'hq@store.com', open: true, lat: 6.4541, lng: 3.3947 },
  { id: 2, name: 'Ikeja Branch', address: '45 Allen Avenue, Ikeja', city: 'Lagos', phone: '+234 802 345 6789', email: 'ikeja@store.com', open: false, lat: 6.5958, lng: 3.3478 },
  { id: 3, name: 'Lekki Branch', address: '7 Admiralty Way, Lekki Phase 1', city: 'Lagos', phone: '+234 803 456 7890', email: 'lekki@store.com', open: true, lat: 6.4281, lng: 3.4219 },
];

export const LocationBlock = ({ title = 'Our Locations' }: LocationBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const ctx = useSafeStorefront();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const branches = PLACEHOLDER_BRANCHES;
  const filtered = search.trim()
    ? branches.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.address.toLowerCase().includes(search.toLowerCase())
      )
    : branches;

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ outline: selected ? '2px solid #f59e0b' : 'none', cursor: 'grab', width: '100%' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 3fr',
        gap: '8px',
        padding: '40px 16px',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        minHeight: '80vh',
      }}>

        {/* Left — branch list */}
        <div style={{ borderRight: '1px solid #e5e7eb', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Search */}
          <input
            type="search"
            placeholder="Search address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />

          <p style={{ fontSize: '0.75rem', color: '#9ca3af', margin: 0 }}>
            {search.trim()
              ? `Branches matching "${search}" — ${filtered.length} found`
              : `All branch locations — ${filtered.length} branches`}
          </p>

          {/* Branch cards */}
          <div style={{ overflowY: 'auto', maxHeight: '65vh', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px' }}>
            {filtered.map((branch) => {
              const isSelected = selectedBranch === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #f97316' : '1px solid #f3f4f6',
                    boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: selectedBranch && !isSelected ? 0.7 : 1,
                  }}
                >
                  {/* Facade image placeholder */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    background: '#f3f4f6',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="24" height="24" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>

                  {/* Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#111827' }}>{branch.name}</p>
                      {/* Chat icon */}
                      <div style={{ padding: '4px', cursor: 'pointer', color: '#9ca3af' }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{branch.address}</p>

                    {/* Open/Closed badge */}
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      background: branch.open ? '#dcfce7' : '#fee2e2',
                      color: branch.open ? '#16a34a' : '#dc2626',
                      width: 'fit-content',
                    }}>
                      {branch.open ? 'Open now' : 'Closed'}
                    </span>

                    <a href={`tel:${branch.phone}`} onClick={(e) => e.preventDefault()} style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                      {branch.phone}
                    </a>
                    <a href={`mailto:${branch.email}`} onClick={(e) => e.preventDefault()} style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                      {branch.email}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — map placeholder */}
        <div style={{
          background: '#e8f0e8',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '500px',
        }}>
          {/* Map grid lines to simulate a map */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a7c5a7" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)"/>
          </svg>

          {/* Simulated roads */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#c8d8c8" strokeWidth="6"/>
            <line x1="0" y1="65%" x2="100%" y2="65%" stroke="#c8d8c8" strokeWidth="4"/>
            <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#c8d8c8" strokeWidth="6"/>
            <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#c8d8c8" strokeWidth="4"/>
            <line x1="0" y1="20%" x2="100%" y2="55%" stroke="#c8d8c8" strokeWidth="3"/>
          </svg>

          {/* Map pins */}
          {filtered.map((branch, i) => {
            const positions = [
              { top: '35%', left: '28%' },
              { top: '55%', left: '62%' },
              { top: '20%', left: '50%' },
            ];
            const pos = positions[i % positions.length];
            const isSelected = selectedBranch === branch.id;

            return (
              <div
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -100%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 10 : 5,
                  filter: `drop-shadow(0 3px 6px rgba(0,0,0,0.3))`,
                }}
              >
                <svg viewBox="0 0 28 36" width={isSelected ? 32 : 26} height={isSelected ? 42 : 34}>
                  <path
                    d="M14 0C7.373 0 2 5.373 2 12c0 8.5 12 24 12 24S26 20.5 26 12C26 5.373 20.627 0 14 0z"
                    fill={isSelected ? '#DC2626' : '#EA7018'}
                  />
                  <circle cx="14" cy="12" r="5" fill="white" opacity="0.95"/>
                </svg>

                {/* Tooltip on selected */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#111827',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginBottom: '8px',
                  }}>
                    {branch.name}
                  </div>
                )}
              </div>
            );
          })}

          {/* User location dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '45%',
            transform: 'translate(-50%, -50%)',
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(37,99,235,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#2563eb',
                border: '2px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
          </div>

          {/* Locate me button */}
          <button style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
            📍
          </button>

          {/* OpenStreetMap attribution */}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            left: '8px',
            fontSize: '0.6rem',
            color: '#6b7280',
          }}>
            © OpenStreetMap contributors
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as LocationBlockProps,
  }));
  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Title</label>
        <input
          type="text"
          value={props.title ?? 'Our Locations'}
          onChange={(e) => setProp((p: LocationBlockProps) => { p.title = e.target.value; })}
        />
      </div>
    </div>
  );
};

LocationBlock.craft = {
  displayName: 'LocationBlock',
  props: { title: 'Our Locations' },
  related: { settings: LocationBlockSettings },
};