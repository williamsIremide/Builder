import React from 'react';
import { useNode } from '@craftjs/core';

export interface NewsletterSignupProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonLabel?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const NewsletterSignupSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props as NewsletterSignupProps,
  }));

  return (
    <div className="settings-form">
      <div className="settings-group">
        <label>Title</label>
        <input
          type="text"
          value={props.title ?? ''}
          onChange={(e) => setProp((p: NewsletterSignupProps) => { p.title = e.target.value; })}
          placeholder="Stay in the loop"
        />
      </div>
      <div className="settings-group">
        <label>Subtitle</label>
        <textarea
          value={props.subtitle ?? ''}
          rows={2}
          onChange={(e) => setProp((p: NewsletterSignupProps) => { p.subtitle = e.target.value; })}
          placeholder="Get deals and new arrivals in your inbox."
        />
      </div>
      <div className="settings-group">
        <label>Input Placeholder</label>
        <input
          type="text"
          value={props.placeholder ?? ''}
          onChange={(e) => setProp((p: NewsletterSignupProps) => { p.placeholder = e.target.value; })}
          placeholder="Enter your email"
        />
      </div>
      <div className="settings-group">
        <label>Button Label</label>
        <input
          type="text"
          value={props.buttonLabel ?? ''}
          onChange={(e) => setProp((p: NewsletterSignupProps) => { p.buttonLabel = e.target.value; })}
          placeholder="Subscribe"
        />
      </div>
      <div className="settings-row">
        <div className="settings-group">
          <label>Background</label>
          <div className="color-input-row">
            <input type="color" value={props.backgroundColor ?? '#111827'}
              onChange={(e) => setProp((p: NewsletterSignupProps) => { p.backgroundColor = e.target.value; })} />
            <span>{props.backgroundColor ?? '#111827'}</span>
          </div>
        </div>
        <div className="settings-group">
          <label>Accent</label>
          <div className="color-input-row">
            <input type="color" value={props.accentColor ?? '#f59e0b'}
              onChange={(e) => setProp((p: NewsletterSignupProps) => { p.accentColor = e.target.value; })} />
            <span>{props.accentColor ?? '#f59e0b'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewsletterSignup = ({
  title = 'Stay in the loop',
  subtitle = 'Be first to know about new arrivals, exclusive deals, and more.',
  placeholder = 'Enter your email address',
  buttonLabel = 'Subscribe',
  backgroundColor = '#111827',
  textColor = '#ffffff',
  accentColor = '#f59e0b',
}: NewsletterSignupProps) => {
  const { connectors: { connect, drag }, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        backgroundColor,
        color: textColor,
        padding: '64px 32px',
        textAlign: 'center',
        outline: selected ? '2px solid #f59e0b' : 'none',
        cursor: 'grab',
      }}
    >
      <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 12px' }}>{title}</h2>
      {subtitle && (
        <p style={{ fontSize: '1rem', opacity: 0.7, margin: '0 0 32px', maxWidth: '480px', display: 'inline-block' }}>
          {subtitle}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0', maxWidth: '440px', margin: '0 auto' }}>
        <input
          type="email"
          placeholder={placeholder}
          readOnly
          style={{
            flex: 1,
            padding: '14px 16px',
            border: 'none',
            borderRadius: '6px 0 0 6px',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <button
          onClick={(e) => e.preventDefault()}
          style={{
            padding: '14px 24px',
            background: accentColor,
            color: '#000',
            border: 'none',
            borderRadius: '0 6px 6px 0',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

NewsletterSignup.craft = {
  displayName: 'NewsletterSignup',
  props: {
    title: 'Stay in the loop',
    subtitle: 'Be first to know about new arrivals, exclusive deals, and more.',
    placeholder: 'Enter your email address',
    buttonLabel: 'Subscribe',
    backgroundColor: '#111827',
    textColor: '#ffffff',
    accentColor: '#f59e0b',
  },
  related: {
    settings: NewsletterSignupSettings,
  },
};
