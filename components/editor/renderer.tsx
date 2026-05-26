/**
 * components/editor/EditorRenderer.tsx
 */
import React, { useCallback, useRef, useState } from "react";
import { Editor, Frame, Element, useEditor } from "@craftjs/core";
import { craftResolver } from "~/components/editor/resolver";
import { RootContainer } from "~/components/blocks/RootContainer";
import { PAGES, PageId } from "~/lib/pagesConfig";
import { Toolbar } from "./Toolbar";
import { ComponentPanel } from "./ComponentPanel";
import { SettingsPanel } from "./SettingsPanel";
import {
  StorefrontPageVersion,
  StorefrontTheme,
} from "../../constants/types/models/storefront";
import { DEFAULT_THEME, themeToVars } from "../storefront/theme";
import { toast } from "sonner";
import { NextRouter } from "next/router";
import { CraftJson } from "~/constants/types/models/storefront";
import { updateSingleInstance } from "~/utils/requestHandler/updateData";
import { createSingleInstance } from "~/utils/requestHandler/createData";
import { JsonValue } from "~/utils";
import { DEFAULT_PAGE_CONTENT } from "~/lib/defaultContent";
import { usePageHistory } from "~/hooks/usePageHistory";

export const handleSaveDraft = async (
  content: CraftJson,
  storefrontId: number,
  pageId: string,
  router: NextRouter,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  try {
    const result = await updateSingleInstance(
      `/api/storefront/${storefrontId}/pages/${pageId}/draft/`,
      { draft_content: content as unknown as JsonValue },
      setError,
      router,
      "PUT",
    );
    if (result) toast.success("Draft saved.");
    return result;
  } catch (error) {
    console.error("Error saving draft:", error);
    toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

export const handlePublishPage = async (
  content: CraftJson,
  storefrontId: number,
  pageId: string,
  router: NextRouter,
  setError: (error: string | null) => void,
  setPublishState: (state: "idle" | "publishing" | "done") => void,
) => {
  setPublishState("publishing");
  try {
    await updateSingleInstance(
      `/api/storefront/${storefrontId}/pages/${pageId}/draft/`,
      { draft_content: content as unknown as JsonValue },
      setError,
      router,
      "PUT",
    );
    const version = await createSingleInstance<StorefrontPageVersion>(
      `/api/storefront/${storefrontId}/pages/${pageId}/publish/`,
      //@ts-ignore
      {},
      setError,
      router,
    );
    if (version) {
      toast.success("Page published successfully!");
      setPublishState("done");
      setTimeout(() => setPublishState("idle"), 3000);
    } else {
      setPublishState("idle");
    }
    return version;
  } catch (error) {
    console.error("Error publishing page:", error);
    toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    setPublishState("idle");
    return null;
  }
};

export interface EditorRendererProps {
  pageId: PageId;
  /**
   * Initial content for this page (from sessionStorage or server).
   * Only used when the page first mounts — after that Craft.js owns the state.
   */
  content?: CraftJson | string | null;
  theme?: StorefrontTheme | null;
  onSave: (content: CraftJson) => Promise<void>;
  onPublish: (content: CraftJson) => Promise<void>;
  publishState: "idle" | "publishing" | "done";
  isPublished: boolean;
  publishedVersion?: { version_no: number; created_at: string };
  onPageSwitch: (pageId: PageId) => void;
}

// ─── EditorInner ─────────────────────────────────────────────────────────────
// Must live inside <Editor> to call useEditor() and usePageHistory().

interface EditorInnerProps extends EditorRendererProps {
  themeVars: React.CSSProperties;
  /**
   * The baseline serialized content for this page — used as the Frame's
   * initial `data`. May be the server content OR an in-memory snapshot from
   * a previous visit to this page in the same session.
   */
  baselineContent: string | undefined;
}

const EditorInner = ({
  pageId,
  themeVars,
  baselineContent,
  onSave,
  onPublish,
  onPageSwitch,
  publishState,
  isPublished,
  publishedVersion,
}: EditorInnerProps) => {
  const { query } = useEditor();
  const [previewMode, setPreviewMode] = useState(false);

  // usePageHistory lives here (inside Editor) so it can call useEditor().
  // getSnapshot lets EditorRenderer retrieve the live in-memory canvas for
  // any page — used when the user switches pages so we pass the snapshot
  // (not the stale server content) as the new page's baseline.
  const { undo, redo, canUndo, canRedo, getSnapshot } = usePageHistory(pageId);

  // Expose getSnapshot upward via a ref on the window (simple cross-component
  // communication without prop-drilling through the Editor boundary).
  // EditorRenderer reads this ref when computing the next page's baselineContent.
  useSnapshotBridge(getSnapshot);

  const getContent = useCallback(() => JSON.parse(query.serialize()), [query]);
  const pageLabel = PAGES.find((p) => p.id === pageId)?.label ?? pageId;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", ...themeVars }}>
      <Toolbar
        currentPage={pageId}
        onPageSwitch={onPageSwitch}
        onSave={async () => onSave(getContent())}
        onPublish={async () => onPublish(getContent())}
        onPreview={() => setPreviewMode((v) => !v)}
        isPreviewMode={previewMode}
        isPublished={isPublished}
        publishState={publishState}
        publishedVersion={publishedVersion}
        // Pass undo/redo down to Toolbar so it can wire the buttons
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div style={{ display: "flex", height: "calc(100vh - 52px)", marginTop: "52px", overflow: "hidden" }}>
        {!previewMode && <ComponentPanel currentPage={pageId} />}

        <main style={{
          flex: 1, overflowY: "auto", overflowX: "auto",
          background: previewMode ? "#fff" : "#1a1a1d",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: previewMode ? "0" : "32px 24px", minWidth: 0,
        }}>
          {!previewMode && (
            <div style={{ width: "100%", maxWidth: "900px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#3f3f46" }}>
                {pageLabel} — Draft
              </span>
              <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
              {isPublished && publishedVersion ? (
                <span style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700 }}>● v{publishedVersion.version_no} live</span>
              ) : (
                <span style={{ fontSize: "0.68rem", color: "#71717a", fontWeight: 600 }}>○ Unpublished</span>
              )}
            </div>
          )}

          <div style={{
            width: "100%", maxWidth: previewMode ? "100%" : "900px",
            background: "#fff",
            minHeight: previewMode ? "100vh" : "600px",
            borderRadius: previewMode ? "0" : "10px",
            boxShadow: previewMode ? "none" : "0 0 0 1px #27272a, 0 8px 40px rgba(0,0,0,0.4)",
            ...themeVars,
            flexShrink: 0,
            transform: "translateZ(0)",
            boxSizing: "border-box",
          }}>
            {/*
              key={pageId} forces Frame to unmount/remount on page switch.
              baselineContent is the snapshot for this page if we've visited it
              before in this session, otherwise it's the server/default content.
              After mount, Craft.js owns the canvas — we don't touch `data` again.
            */}
            <Frame key={pageId} data={baselineContent}>
              <Element is={RootContainer} canvas id="root" />
            </Frame>
          </div>

          {!previewMode && (
            <p style={{ marginTop: "16px", fontSize: "0.7rem", color: "#3f3f46", textAlign: "center" }}>
              Click a block to select · Drag to reorder · Right panel to edit settings
            </p>
          )}
        </main>

        {!previewMode && <SettingsPanel />}
      </div>
    </div>
  );
};

// ─── Snapshot bridge ──────────────────────────────────────────────────────────
// usePageHistory lives inside <Editor> but EditorRenderer (outside <Editor>)
// needs to read snapshots when computing baselineContent for the next page.
// We stash the getter in a module-level ref — safe because there's only ever
// one EditorInner alive at a time.

type SnapshotGetter = (pageId: PageId) => string | null;
let _snapshotGetter: SnapshotGetter | null = null;

function useSnapshotBridge(getter: SnapshotGetter) {
  _snapshotGetter = getter;
  // Clear on unmount
  React.useEffect(() => {
    _snapshotGetter = getter;
    return () => { _snapshotGetter = null; };
  }, [getter]);
}

function getSnapshotForPage(pageId: PageId): string | null {
  return _snapshotGetter ? _snapshotGetter(pageId) : null;
}

// ─── EditorRenderer ───────────────────────────────────────────────────────────

export const EditorRenderer = (props: EditorRendererProps) => {
  const themeVars = themeToVars(props.theme ?? DEFAULT_THEME);

  // Track which pages we've already loaded so we use the in-memory snapshot
  // on subsequent visits instead of re-loading the original content.
  const visitedPages = useRef<Set<PageId>>(new Set());

  const computeBaselineContent = (pageId: PageId, serverContent: CraftJson | string | null | undefined): string | undefined => {
    // If we've visited this page before in this session, use the live in-memory
    // snapshot (which includes all unsaved edits) as the Frame's starting point.
    if (visitedPages.current.has(pageId)) {
      const snapshot = getSnapshotForPage(pageId);
      if (snapshot) return snapshot;
    }

    // First visit — mark as visited and use server/sessionStorage/default content.
    visitedPages.current.add(pageId);

    if (serverContent && typeof serverContent === "object" && Object.keys(serverContent).length > 0) {
      return JSON.stringify(serverContent);
    }
    if (serverContent && typeof serverContent === "string" && serverContent !== "{}") {
      return serverContent;
    }

    const fallback = DEFAULT_PAGE_CONTENT[pageId];
    if (fallback && Object.keys(fallback).length > 0) {
      return JSON.stringify(fallback);
    }

    return JSON.stringify({
      ROOT: {
        type: { resolvedName: "RootContainer" },
        isCanvas: true,
        props: { id: "root" },
        displayName: "RootContainer",
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    });
  };

  const baselineContent = computeBaselineContent(props.pageId, props.content);

  return (
    <Editor resolver={craftResolver} enabled={true}>
      <EditorInner
        {...props}
        themeVars={themeVars}
        baselineContent={baselineContent}
      />
    </Editor>
  );
};