import React, { useRef } from "react";
import { useEditor } from "@craftjs/core";
import {
  PageId,
  PAGE_ALLOWED_BLOCKS,
  BLOCK_LABELS,
  BLOCK_ICONS,
} from "~/lib/pagesConfig";
import { craftResolver } from "~/components/editor/resolver";

// Map of icon name strings to simple SVG icons
const ICON_SVG: Record<string, React.ReactNode> = {
  Megaphone: (
    <path
      d="M11 5.882V19.24a1.76 1.76 0 0 1-3.417.592l-2.147-6.15M18 13a3 3 0 1 0 0-6M5.436 13.683A4.001 4.001 0 0 0 7 8h2.5M3.5 11.5L7 8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  Image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  LayoutGrid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </>
  ),
  Mail: (
    <>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </>
  ),
  MessageSquare: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </>
  ),
  Package: (
    <>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </>
  ),
  ShoppingCart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  CreditCard: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
  MapPin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  AlignLeft: (
    <>
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </>
  ),
  Layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ),
  SlidersHorizontal: (
    <>
      <line x1="21" y1="4" x2="14" y2="4" />
      <line x1="10" y1="4" x2="3" y2="4" />
      <line x1="21" y1="12" x2="12" y2="12" />
      <line x1="8" y1="12" x2="3" y2="12" />
      <line x1="21" y1="20" x2="16" y2="20" />
      <line x1="12" y1="20" x2="3" y2="20" />
      <line x1="14" y1="2" x2="14" y2="6" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="16" y1="18" x2="16" y2="22" />
    </>
  ),
};

function BlockIcon({ name }: { name: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {ICON_SVG[name] ?? <rect x="3" y="3" width="18" height="18" rx="2" />}
    </svg>
  );
}

interface ComponentPanelProps {
  currentPage: PageId;
}

export const ComponentPanel = ({ currentPage }: ComponentPanelProps) => {
  const { connectors } = useEditor();
  const allowedBlocks = PAGE_ALLOWED_BLOCKS[currentPage];

  return (
    <aside
      style={{
        width: "220px",
        background: "#0f0f11",
        borderRight: "1px solid #27272a",
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
          Blocks
        </p>
      </div>

      {/* Block List */}
      <div
        style={{
          padding: "10px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {allowedBlocks.map((blockName) => {
          const Component =
            craftResolver[blockName as keyof typeof craftResolver];
          if (!Component) return null;
          const icon = BLOCK_ICONS[blockName] ?? "LayoutGrid";
          const label = BLOCK_LABELS[blockName] ?? blockName;

          return (
            <div
              key={blockName}
              ref={(ref) => {
                if (ref) connectors.create(ref, <Component />);
              }}
              draggable
              title={`Drag to add ${label}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "7px",
                background: "#18181b",
                border: "1px solid #27272a",
                cursor: "grab",
                color: "#a1a1aa",
                fontSize: "0.8rem",
                fontWeight: 500,
                transition: "all 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "#1c1c1f";
                (e.currentTarget as HTMLDivElement).style.color = "#e4e4e7";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#3f3f46";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "#18181b";
                (e.currentTarget as HTMLDivElement).style.color = "#a1a1aa";
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "#27272a";
              }}
            >
              <BlockIcon name={icon} />
              {label}
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div
        style={{
          marginTop: "auto",
          padding: "12px 14px",
          borderTop: "1px solid #1c1c1f",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            color: "#3f3f46",
            lineHeight: 1.5,
          }}
        >
          Drag blocks onto the canvas to build your page.
        </p>
      </div>
    </aside>
  );
};