import React from 'react';
import { useNode, useEditor } from '@craftjs/core';

/**
 * RootContainer — the top-level droppable area on each page.
 * Users drop blocks into this. It is not itself draggable.
 */
export const RootContainer = ({ children }: { children?: React.ReactNode }) => {
  const { connectors: { connect } } = useNode();
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  return (
    <div
      ref={(ref) => { if (ref) connect(ref); }}
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        position: 'relative',
      }}
    >
      {children}
      {enabled && React.Children.count(children) === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#9ca3af',
            pointerEvents: 'none',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
          </svg>
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>
            Drag blocks here from the left panel
          </p>
        </div>
      )}
    </div>
  );
};

RootContainer.craft = {
  displayName: 'Page',
  rules: {
    canDrag: () => false,
    canDelete: () => false,
    canDrop: () => true,
    canMoveIn: () => true,
  },
};
