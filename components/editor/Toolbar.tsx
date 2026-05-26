import React, { useState, useCallback } from "react";
import { PAGES, PageId } from "~/lib/pagesConfig";
import { usePageHistory } from "~/hooks/usePageHistory";
import ShortcutManager, { useBuilderShortcuts } from "~/utils/ShortcutManager";
import { useEditor } from "@craftjs/core";

interface ToolbarProps {
  currentPage: PageId;
  onPageSwitch: (pageId: PageId) => void;
  onSave: () => Promise<void>;
  onPublish: () => Promise<void>;
  onPreview: () => void;
  isPreviewMode: boolean;
  isPublished: boolean;
  publishState: "idle" | "publishing" | "done";
  publishedVersion?: { version_no: number; created_at: string };
}

export const Toolbar = ({
  currentPage,
  onPageSwitch,
  onSave,
  onPublish,
  onPreview,
  isPreviewMode,
  isPublished,
  publishState,
  publishedVersion,
}: ToolbarProps) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { undo, redo, canUndo, canRedo } = usePageHistory(currentPage);

  // Needed for the Delete/Escape shortcuts — read the currently selected node
  const { actions, selected } = useEditor((state, query) => {
    const selectedIds = state.events.selected;
    const currentNodeId = selectedIds ? Array.from(selectedIds)[0] : null;
    let isDeletable = false;
    if (currentNodeId && currentNodeId !== "ROOT") {
      try {
        isDeletable = query.node(currentNodeId).isDeletable();
      } catch {}
    }
    return {
      selected: currentNodeId && isDeletable ? currentNodeId : null,
    };
  });

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }, [saving, onSave]);

  const handlePublish = useCallback(async () => {
    if (publishState !== "idle") return;
    await onPublish();
  }, [publishState, onPublish]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  const shortcuts = useBuilderShortcuts({
    onUndo: undo,
    onRedo: redo,
    onSave: handleSave,
    onPublish: handlePublish,
    onTogglePreview: onPreview,
    onDeleteSelected: selected
      ? () => actions.delete(selected)
      : undefined,
    onDeselectAll: () => actions.selectNode(null as any),
    onPageSwitch: (i) => {
      const page = PAGES[i];
      if (page) onPageSwitch(page.id);
    },
    onToggleHelp: () => setShowHelp((v) => !v),
  });

  // ── Derived labels ─────────────────────────────────────────────────────────

  const publishLabel =
    publishState === "publishing"
      ? "Publishing…"
      : publishState === "done"
        ? "✓ Published"
        : isPublished
          ? "Re-publish"
          : "Publish";

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Global keyboard shortcuts */}
      <ShortcutManager shortcuts={shortcuts} />

      {/* Shortcuts help overlay — Ctrl+/ */}
      {showHelp && (
        <ShortcutsOverlay onClose={() => setShowHelp(false)} />
      )}

      <header
        style={{
          height: "52px",
          background: "#0f0f11",
          borderBottom: "1px solid #27272a",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "6px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginRight: "10px",
          }}
        >
          <div
            style={{
              width: "26px",
              height: "26px",
              background: "var(--rb-primary, #ff6a00)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 800,
              color: "#fff",
            }}
          >
            R
          </div>
          <span
            style={{ color: "#e4e4e7", fontWeight: 700, fontSize: "0.8rem" }}
          >
            RetailBox Builder
          </span>
        </div>

        <div
          style={{
            width: "1px",
            height: "24px",
            background: "#27272a",
            margin: "0 6px",
          }}
        />

        {/* Page tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageSwitch(page.id)}
              style={{
                padding: "5px 11px",
                borderRadius: "5px",
                border: "none",
                fontSize: "0.775rem",
                fontWeight: 600,
                cursor: "pointer",
                background:
                  currentPage === page.id ? "#1c1c1f" : "transparent",
                color:
                  currentPage === page.id
                    ? "var(--rb-primary, #ff6a00)"
                    : "#71717a",
                borderBottom:
                  currentPage === page.id
                    ? "2px solid var(--rb-primary, #ff6a00)"
                    : "2px solid transparent",
              }}
            >
              {page.label}
            </button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Published badge */}
        {publishedVersion && (
          <span
            style={{
              fontSize: "0.68rem",
              color: "#16a34a",
              fontWeight: 600,
              marginRight: "4px",
            }}
          >
            ● v{publishedVersion.version_no} live
          </span>
        )}

        {/* Undo / Redo */}
        {(
          [
            {
              label: "↩",
              action: undo,
              enabled: canUndo,
              title: "Undo (Ctrl+Z)",
            },
            {
              label: "↪",
              action: redo,
              enabled: canRedo,
              title: "Redo (Ctrl+Shift+Z)",
            },
          ] as const
        ).map(({ label, action, enabled, title }) => (
          <button
            key={title}
            onClick={action}
            disabled={!enabled}
            title={title}
            style={{
              width: "32px",
              height: "32px",
              background: enabled ? "#1c1c1f" : "transparent",
              border: "1px solid #27272a",
              borderRadius: "6px",
              color: enabled ? "#e4e4e7" : "#3f3f46",
              cursor: enabled ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
            }}
          >
            {label}
          </button>
        ))}

        <div
          style={{
            width: "1px",
            height: "24px",
            background: "#27272a",
            margin: "0 4px",
          }}
        />

        {/* Preview */}
        <button
          onClick={onPreview}
          style={{
            padding: "7px 14px",
            background: isPreviewMode ? "#1c1c1f" : "transparent",
            border: `1px solid ${
              isPreviewMode ? "var(--rb-primary, #ff6a00)" : "#3f3f46"
            }`,
            borderRadius: "6px",
            color: isPreviewMode ? "var(--rb-primary, #ff6a00)" : "#a1a1aa",
            fontSize: "0.775rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span style={{ fontSize: "12px" }}>👁</span>
          {isPreviewMode ? "Exit Preview" : "Preview"}
        </button>

        {/* Save Draft */}
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "7px 14px",
            background: saved ? "#166534" : "#1c1c1f",
            border: `1px solid ${saved ? "#16a34a" : "#3f3f46"}`,
            borderRadius: "6px",
            color: saved ? "#4ade80" : "#a1a1aa",
            fontSize: "0.775rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save Draft"}
        </button>

        {/* Publish */}
        <button
          onClick={handlePublish}
          disabled={publishState !== "idle"}
          style={{
            padding: "7px 18px",
            background:
              publishState === "done"
                ? "#16a34a"
                : "var(--rb-primary, #ff6a00)",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "0.775rem",
            fontWeight: 700,
            cursor: publishState !== "idle" ? "not-allowed" : "pointer",
            opacity: publishState !== "idle" ? 0.8 : 1,
            transition: "all 0.2s",
          }}
        >
          {publishLabel}
        </button>

        {/* Help button — Ctrl+/ */}
        <button
          onClick={() => setShowHelp((v) => !v)}
          title="Keyboard shortcuts (Ctrl+/)"
          style={{
            width: "32px",
            height: "32px",
            background: showHelp ? "#1c1c1f" : "transparent",
            border: `1px solid ${showHelp ? "#3f3f46" : "#27272a"}`,
            borderRadius: "6px",
            color: showHelp ? "#e4e4e7" : "#3f3f46",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          ?
        </button>
      </header>
    </>
  );
};

// ─── Shortcuts overlay ────────────────────────────────────────────────────────

const SHORTCUT_GROUPS: Array<{
  group: string;
  items: Array<{ keys: string[]; label: string }>;
}> = [
  {
    group: "History",
    items: [
      { keys: ["Ctrl", "Z"], label: "Undo" },
      { keys: ["Ctrl", "Shift", "Z"], label: "Redo" },
      { keys: ["Ctrl", "Y"], label: "Redo (alt)" },
    ],
  },
  {
    group: "File",
    items: [
      { keys: ["Ctrl", "S"], label: "Save Draft" },
      { keys: ["Ctrl", "Shift", "P"], label: "Publish" },
    ],
  },
  {
    group: "Canvas",
    items: [
      { keys: ["Ctrl", "\\"], label: "Toggle Preview" },
      { keys: ["Delete"], label: "Delete selected block" },
      { keys: ["Esc"], label: "Deselect block" },
    ],
  },
  {
    group: "Navigation",
    items: [
      { keys: ["Ctrl", "1"], label: "Home" },
      { keys: ["Ctrl", "2"], label: "Product List" },
      { keys: ["Ctrl", "3"], label: "Single Product" },
      { keys: ["Ctrl", "4"], label: "Cart" },
      { keys: ["Ctrl", "5"], label: "Checkout" },
      { keys: ["Ctrl", "6"], label: "Locations" },
    ],
  },
  {
    group: "Help",
    items: [{ keys: ["Ctrl", "/"], label: "Toggle this panel" }],
  },
];

function ShortcutsOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0f0f11",
          border: "1px solid #27272a",
          borderRadius: "12px",
          padding: "28px 32px",
          width: "420px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#e4e4e7",
            }}
          >
            Keyboard Shortcuts
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#52525b",
              fontSize: "18px",
              cursor: "pointer",
              lineHeight: 1,
              padding: "2px 6px",
            }}
          >
            ×
          </button>
        </div>

        {/* Groups */}
        {SHORTCUT_GROUPS.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: "20px" }}>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#52525b",
              }}
            >
              {group}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {items.map(({ keys, label }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "#a1a1aa" }}>
                    {label}
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        style={{
                          background: "#1c1c1f",
                          border: "1px solid #3f3f46",
                          borderRadius: "4px",
                          padding: "2px 7px",
                          fontSize: "0.7rem",
                          color: "#e4e4e7",
                          fontFamily: "monospace",
                          lineHeight: "1.6",
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Mac note */}
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "0.68rem",
            color: "#3f3f46",
            borderTop: "1px solid #1c1c1f",
            paddingTop: "12px",
          }}
        >
          On Mac, use ⌘ Cmd instead of Ctrl
        </p>
      </div>
    </div>
  );
}