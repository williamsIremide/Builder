import React from 'react';
import { useNode } from '@craftjs/core';

export interface AdBannerBlockProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
}

export const AdBannerBlockSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as AdBannerBlockProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Ad Text</label>
        <input
          type="text"
          value={props.text ?? ''}
          onChange={(e) => setProp((p: AdBannerBlockProps) => { p.text = e.target.value; })}
          placeholder="Ad Space"
        />
      </div>
      <div className="settings-group">
        <label>Height (px)</label>
        <input
          type="number"
          value={props.height ?? 240}
          min={100}
          max={600}
          onChange={(e) => setProp((p: AdBannerBlockProps) => { p.height = Number(e.target.value); })}
        />
      </div>
      <div className="settings-row">
        <div className="settings-group">
          <label>Background Color</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.backgroundColor ?? '#fb923c'}
              onChange={(e) => setProp((p: AdBannerBlockProps) => { p.backgroundColor = e.target.value; })}
            />
            <span>{props.backgroundColor ?? '#fb923c'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Text Color</label>
          <div className="color-input-row">
            <input
              type="color"
              value={props.textColor ?? '#ffffff'}
              onChange={(e) => setProp((p: AdBannerBlockProps) => { p.textColor = e.target.value; })}
            />
            <span>{props.textColor ?? '#ffffff'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdBannerBlock = ({
  text = 'Ad Space',
  backgroundColor = '#fb923c',
  textColor = '#ffffff',
  height = 240,
}: AdBannerBlockProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px 0' }}
    >
      <div style={{ width: '100%', maxWidth: '1280px', padding: '0 40px' }}>
        <div
          style={{
            width: '100%',
            height,
            borderRadius: '8px',
            border: '1px dashed #f97316',
            background: backgroundColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: textColor,
            fontSize: '0.875rem',
            fontWeight: 500,
            outline: selected ? '2px solid #f59e0b' : 'none',
            cursor: 'grab',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

AdBannerBlock.craft = {
  displayName: 'AdBanner',
  props: {
    text: 'Ad Space',
    backgroundColor: '#fb923c',
    textColor: '#ffffff',
    height: 240,
  },
  related: { settings: AdBannerBlockSettings },
};