import React from "react";
import { useEditor } from "@craftjs/core";
import { BLOCK_LABELS } from "~/lib/pagesConfig";

export const SettingsPanel = () => {
  const { selected, actions } = useEditor((state, query) => {
    const selectedIds = state.events.selected;
    const currentNodeId = selectedIds ? Array.from(selectedIds)[0] : null;

    let selected = null;
    if (currentNodeId && currentNodeId !== "ROOT") {
      const node = state.nodes[currentNodeId];
      if (node) {
        selected = {
          id: currentNodeId,
          name: node.data.displayName || node.data.name,
          settings: node.related?.settings,
          isDeletable: query.node(currentNodeId).isDeletable(),
        };
      }
    }
    return { selected };
  });

  return (
    <aside
      style={{
        width: "260px",
        background: "#0f0f11",
        borderLeft: "1px solid #27272a",
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px 10px",
          borderBottom: "1px solid #1c1c1f",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#52525b",
          }}
        >
          {selected
            ? `Edit: ${BLOCK_LABELS[selected.name] ?? selected.name}`
            : "Settings"}
        </p>

        {selected?.isDeletable && (
          <button
            onClick={() => actions.delete(selected.id)}
            title="Delete block"
            style={{
              background: "transparent",
              border: "1px solid #3f3f46",
              borderRadius: "5px",
              color: "#ef4444",
              padding: "3px 8px",
              fontSize: "0.7rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {selected?.settings ? (
          React.createElement(selected.settings)
        ) : (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "#3f3f46",
              fontSize: "0.8rem",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ marginBottom: "10px", opacity: 0.5 }}
            >
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <p style={{ margin: 0 }}>
              Select a block on the canvas to edit its settings.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
