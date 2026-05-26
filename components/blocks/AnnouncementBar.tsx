import React from 'react';
import { useNode } from '@craftjs/core';

export interface AnnouncementBarProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  link?: string;
  linkLabel?: string;
}

export const AnnouncementBarSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as AnnouncementBarProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Message</label>
        <input
          type="text"
          value={props.text ?? ''}
          onChange={(e) => setProp((p: AnnouncementBarProps) => { p.text = e.target.value; })}
          placeholder="Free shipping on orders over $50!"
        />
      </div>

      <div className="settings-group">
        <label>Link Label (optional)</label>
        <input
          type="text"
          value={props.linkLabel ?? ''}
          onChange={(e) => setProp((p: AnnouncementBarProps) => { p.linkLabel = e.target.value; })}
          placeholder="Learn more"
        />
      </div>

      <div className="settings-row">
        <div className="settings-group">
          <label>Background</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.backgroundColor ?? '#f59e0b'}
              onChange={(e) => setProp((p: AnnouncementBarProps) => { p.backgroundColor = e.target.value; })}
            />
            <span>{props.backgroundColor ?? '#f59e0b'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Text Color</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.textColor ?? '#000000'}
              onChange={(e) => setProp((p: AnnouncementBarProps) => { p.textColor = e.target.value; })}
            />
            <span>{props.textColor ?? '#000000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AnnouncementBar = ({
  text = 'Free shipping on orders over $50! Use code FREESHIP.',
  backgroundColor = '#f59e0b',
  textColor = '#000000',
  linkLabel = '',
}: AnnouncementBarProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        backgroundColor,
        color: textColor,
        textAlign: 'center',
        padding: '10px 24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
      }}
    >
      <span>{text}</span>
      {linkLabel && (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            color: textColor,
            textDecoration: 'underline',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {linkLabel}
        </a>
      )}
    </div>
  );
};

AnnouncementBar.craft = {
  displayName: 'AnnouncementBar',
  props: {
    text: 'Free shipping on orders over $50! Use code FREESHIP.',
    backgroundColor: '#f59e0b',
    textColor: '#000000',
    linkLabel: 'Learn more',
  },
  related: {
    settings: AnnouncementBarSettings,
  },
};
