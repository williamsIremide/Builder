import { StorefrontTheme } from "../../constants/types/models/storefront";

/**
 * Converts a StorefrontTheme object (from your Django API) into a CSS
 * custom properties object that can be applied to any container element.
 *
 * Usage:
 *   <div style={themeToVars(theme)}>...</div>          // inline on an element
 *   applyThemeToRoot(theme)                             // inject into :root (storefront use)
 *
 * All blocks should reference these vars (e.g. var(--rb-primary)) so that
 * changing the theme in StorefrontTheme automatically re-skins every block.
 */
export function themeToVars(theme: StorefrontTheme): React.CSSProperties {
  return {
    "--rb-background": theme.background,
    "--rb-foreground": theme.foreground,
    "--rb-primary": theme.primary,
    "--rb-primary-fg": theme.primary_foreground,
    "--rb-secondary": theme.secondary,
    "--rb-secondary-fg": theme.secondary_foreground,
    "--rb-accent": theme.accent,
    "--rb-accent-fg": theme.accent_foreground,
    "--rb-muted": theme.muted,
    "--rb-muted-fg": theme.muted_foreground,
    "--rb-border": theme.border,
    "--rb-input": theme.input,
    "--rb-ring": theme.ring,
    "--rb-destructive": theme.destructive,
    "--rb-destructive-fg": theme.destructive_foreground,
    "--rb-radius": theme.radius,
  } as React.CSSProperties;
}

/**
 * Injects theme vars into document :root — use this in the storefront app's
 * top-level layout. Lets plain CSS files use the vars without inline styles.
 */
export function applyThemeToRoot(theme: StorefrontTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const vars = themeToVars(theme);
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value as string);
  });
}

/**
 * Default theme matching StorefrontTheme Django model defaults.
 * Use as fallback when no theme is loaded yet.
 */
export const DEFAULT_THEME: StorefrontTheme = {
  id: 0,
  background: "#e5e5e5",
  foreground: "#0a0a0a",
  primary: "#ff6a00",
  primary_foreground: "#fafafa",
  secondary: "#f1f5f9",
  secondary_foreground: "#1f2937",
  accent: "#f1f5f9",
  accent_foreground: "#1f2937",
  muted: "#f1f5f9",
  muted_foreground: "#6b7280",
  border: "#cccccc",
  input: "#cccccc",
  ring: "#d97706",
  destructive: "#ef4444",
  destructive_foreground: "#fafafa",
  radius: "0.5rem",
};

// Re-export for convenience
import React from "react";
export type { StorefrontTheme };
