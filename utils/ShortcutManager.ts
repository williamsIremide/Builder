import React, { useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Shortcut {
  key: string;
  shift?: boolean;
  ctrl?: boolean;
  /** Optional: also match Meta (Cmd on Mac) in place of Ctrl */
  meta?: boolean;
  action: () => void;
  /** Human-readable label for help overlays */
  label?: string;
  /** Logical group for display in a shortcut reference panel */
  group?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isPC = () =>
  typeof window !== "undefined" && !/Mobi|Android/i.test(navigator.userAgent);

/** Returns true when the keyboard event matches ctrl OR meta (Mac Cmd) */
const matchesCtrlOrMeta = (event: KeyboardEvent) =>
  event.ctrlKey || event.metaKey;

// ─── ShortcutManager ─────────────────────────────────────────────────────────

/**
 * Headless component: registers global keyboard shortcuts for the duration
 * of its mount. Returns null — place it anywhere inside the editor tree.
 *
 * @example
 * <ShortcutManager shortcuts={useBuilderShortcuts({ onSave, onUndo, ... })} />
 */
const ShortcutManager: React.FC<{ shortcuts: Shortcut[] }> = ({
  shortcuts,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when the user is typing into an input / textarea / contenteditable
      const target = event.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTyping) return;

      const matchedShortcut = shortcuts.find((s) => {
        const keyMatch =
          s.key.toLowerCase() === event.key.toLowerCase();
        const shiftMatch = s.shift ? event.shiftKey : !event.shiftKey;
        const ctrlMatch = s.ctrl
          ? matchesCtrlOrMeta(event)
          : !matchesCtrlOrMeta(event);
        return keyMatch && shiftMatch && ctrlMatch;
      });

      if (matchedShortcut) {
        event.preventDefault();
        matchedShortcut.action();
      }
    };

    if (isPC()) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);

  return null;
};

export default ShortcutManager;

// ─── useBuilderShortcuts ──────────────────────────────────────────────────────

/**
 * Returns the full set of shortcuts for the RetailBox page builder.
 *
 * Pass the returned array directly into <ShortcutManager shortcuts={...} />.
 *
 * Any action you don't provide will be silently skipped, so you can pass
 * only the handlers you have available at a given point in the tree.
 *
 * @example
 * const shortcuts = useBuilderShortcuts({
 *   onUndo:        () => actions.history.undo(),
 *   onRedo:        () => actions.history.redo(),
 *   onSave:        handleSave,
 *   onPublish:     handlePublish,
 *   onTogglePreview: () => setPreviewMode(v => !v),
 *   onDeleteSelected: () => selected && actions.delete(selected.id),
 *   onDeselectAll: () => actions.selectNode(null),
 *   onPageSwitch:  (idx) => router.push(`/editor/${PAGES[idx].id}`),
 * });
 */
export interface BuilderShortcutOptions {
  /** Ctrl+Z — undo last canvas change */
  onUndo?: () => void;
  /** Ctrl+Shift+Z  or  Ctrl+Y — redo */
  onRedo?: () => void;
  /** Ctrl+S — save draft */
  onSave?: () => void;
  /** Ctrl+Shift+P — publish current page */
  onPublish?: () => void;
  /** Ctrl+\ — toggle preview mode */
  onTogglePreview?: () => void;
  /** Backspace / Delete — delete the currently selected block */
  onDeleteSelected?: () => void;
  /** Escape — deselect the current block */
  onDeselectAll?: () => void;
  /**
   * Switch to a numbered page by 1-based index.
   * e.g. Ctrl+1 → Home, Ctrl+2 → Product List …
   * Called with the 0-based index into PAGES.
   */
  onPageSwitch?: (pageIndex: number) => void;
  /** Ctrl+D — duplicate the selected block (if supported) */
  onDuplicate?: () => void;
  /** Ctrl+Shift+H — toggle the shortcuts help overlay */
  onToggleHelp?: () => void;
}

export function useBuilderShortcuts(
  options: BuilderShortcutOptions,
): Shortcut[] {
  const {
    onUndo,
    onRedo,
    onSave,
    onPublish,
    onTogglePreview,
    onDeleteSelected,
    onDeselectAll,
    onPageSwitch,
    onDuplicate,
    onToggleHelp,
  } = options;

  // Rebuild the list only when the identity of any handler changes.
  // Handlers should be stable refs (useCallback) at the call site.
  const shortcuts: Shortcut[] = [];

  // ── History ────────────────────────────────────────────────────────────────
  if (onUndo)
    shortcuts.push({
      key: "z",
      ctrl: true,
      shift: false,
      action: onUndo,
      label: "Undo",
      group: "History",
    });

  if (onRedo) {
    // Ctrl+Shift+Z
    shortcuts.push({
      key: "z",
      ctrl: true,
      shift: true,
      action: onRedo,
      label: "Redo",
      group: "History",
    });
    // Ctrl+Y (Windows convention)
    shortcuts.push({
      key: "y",
      ctrl: true,
      shift: false,
      action: onRedo,
      label: "Redo (Alt)",
      group: "History",
    });
  }

  // ── File / Publish ─────────────────────────────────────────────────────────
  if (onSave)
    shortcuts.push({
      key: "s",
      ctrl: true,
      shift: false,
      action: onSave,
      label: "Save Draft",
      group: "File",
    });

  if (onPublish)
    shortcuts.push({
      key: "p",
      ctrl: true,
      shift: true,
      action: onPublish,
      label: "Publish Page",
      group: "File",
    });

  // ── Canvas ─────────────────────────────────────────────────────────────────
  if (onTogglePreview)
    shortcuts.push({
      key: "\\",
      ctrl: true,
      shift: false,
      action: onTogglePreview,
      label: "Toggle Preview",
      group: "Canvas",
    });

  if (onDeleteSelected) {
    shortcuts.push({
      key: "Delete",
      ctrl: false,
      shift: false,
      action: onDeleteSelected,
      label: "Delete Block",
      group: "Canvas",
    });
    shortcuts.push({
      key: "Backspace",
      ctrl: false,
      shift: false,
      action: onDeleteSelected,
      label: "Delete Block",
      group: "Canvas",
    });
  }

  if (onDeselectAll)
    shortcuts.push({
      key: "Escape",
      ctrl: false,
      shift: false,
      action: onDeselectAll,
      label: "Deselect",
      group: "Canvas",
    });

  if (onDuplicate)
    shortcuts.push({
      key: "d",
      ctrl: true,
      shift: false,
      action: onDuplicate,
      label: "Duplicate Block",
      group: "Canvas",
    });

  // ── Page switching — Ctrl+1…6 ──────────────────────────────────────────────
  if (onPageSwitch) {
    ["1", "2", "3", "4", "5", "6"].forEach((digit, i) => {
      shortcuts.push({
        key: digit,
        ctrl: true,
        shift: false,
        action: () => onPageSwitch(i),
        label: `Go to page ${i + 1}`,
        group: "Navigation",
      });
    });
  }

  // ── Help ───────────────────────────────────────────────────────────────────
  if (onToggleHelp)
    shortcuts.push({
      key: "/",
      ctrl: true,
      shift: false,
      action: onToggleHelp,
      label: "Keyboard Shortcuts",
      group: "Help",
    });

  return shortcuts;
}

// ─── SHORTCUT_REFERENCE ──────────────────────────────────────────────────────

/**
 * Static reference you can render in a help overlay.
 * Groups are listed in the order they appear here.
 */
export const SHORTCUT_REFERENCE: Array<{
  group: string;
  items: Array<{ keys: string[]; label: string }>;
}> = [
  {
    group: "History",
    items: [
      { keys: ["Ctrl", "Z"], label: "Undo" },
      { keys: ["Ctrl", "Shift", "Z"], label: "Redo" },
      { keys: ["Ctrl", "Y"], label: "Redo (Alt)" },
    ],
  },
  {
    group: "File",
    items: [
      { keys: ["Ctrl", "S"], label: "Save Draft" },
      { keys: ["Ctrl", "Shift", "P"], label: "Publish Page" },
    ],
  },
  {
    group: "Canvas",
    items: [
      { keys: ["Ctrl", "\\"], label: "Toggle Preview" },
      { keys: ["Delete"], label: "Delete Selected Block" },
      { keys: ["Escape"], label: "Deselect Block" },
      { keys: ["Ctrl", "D"], label: "Duplicate Block" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { keys: ["Ctrl", "1"], label: "Home page" },
      { keys: ["Ctrl", "2"], label: "Product List" },
      { keys: ["Ctrl", "3"], label: "Single Product" },
      { keys: ["Ctrl", "4"], label: "Cart" },
      { keys: ["Ctrl", "5"], label: "Checkout" },
      { keys: ["Ctrl", "6"], label: "Locations" },
    ],
  },
  {
    group: "Help",
    items: [{ keys: ["Ctrl", "/"], label: "Show This Panel" }],
  },
];