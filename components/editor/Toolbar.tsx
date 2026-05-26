import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { PAGES, PageId } from "~/lib/pagesConfig";

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

  const { actions, canUndo, canRedo } = useEditor((_, q) => ({
    canUndo: q.history.canUndo(),
    canRedo: q.history.canRedo(),
  }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const publishLabel =
    publishState === "publishing"
      ? "Publishing…"
      : publishState === "done"
        ? "✓ Published"
        : isPublished
          ? "Re-publish"
          : "Publish";

  return (
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
        <span style={{ color: "#e4e4e7", fontWeight: 700, fontSize: "0.8rem" }}>
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
              background: currentPage === page.id ? "#1c1c1f" : "transparent",
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
            action: () => actions.history.undo(),
            enabled: canUndo,
            title: "Undo",
          },
          {
            label: "↪",
            action: () => actions.history.redo(),
            enabled: canRedo,
            title: "Redo",
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

      <button
        onClick={onPreview}
        style={{
          padding: "7px 14px",
          background: isPreviewMode ? "#1c1c1f" : "transparent",
          border: `1px solid ${isPreviewMode ? "var(--rb-primary, #ff6a00)" : "#3f3f46"}`,
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

      <button
        onClick={onPublish}
        disabled={publishState !== "idle"}
        style={{
          padding: "7px 18px",
          background:
            publishState === "done" ? "#16a34a" : "var(--rb-primary, #ff6a00)",
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
    </header>
  );
};
