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
      // @ts-ignore
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
  content?: CraftJson | string | null;
  theme?: StorefrontTheme | null;
  onSave: (content: CraftJson) => Promise<void>;
  onPublish: (content: CraftJson) => Promise<void>;
  publishState: "idle" | "publishing" | "done";
  isPublished: boolean;
  publishedVersion?: { version_no: number; created_at: string };
  onPageSwitch: (pageId: PageId) => void;
}

// ─── Module-level snapshot bridge ────────────────────────────────────────────
// EditorInner (inside <Editor>) owns usePageHistory and its getSnapshot fn.
// EditorRenderer (outside <Editor>) needs getSnapshot to compute baselineContent
// before passing it into EditorInner. We bridge this with a module-level ref —
// safe because only one EditorInner is ever alive at a time.
type GetSnapshotFn = (pageId: PageId) => string | null;
let _getSnapshot: GetSnapshotFn | null = null;

// ─── EditorInner ─────────────────────────────────────────────────────────────

interface EditorInnerProps extends EditorRendererProps {
  themeVars: React.CSSProperties;
  baselineContent: string | undefined;
  onBaselineReady: () => void; // tells EditorRenderer the bridge is live
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

  const { undo, redo, canUndo, canRedo, getSnapshot } = usePageHistory(pageId);

  // Keep bridge live whenever getSnapshot changes identity
  React.useEffect(() => {
    _getSnapshot = getSnapshot;
    return () => { _getSnapshot = null; };
  }, [getSnapshot]);

  const getContent = useCallback(
    () => JSON.parse(query.serialize()) as CraftJson,
    [query],
  );

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
                <span style={{ fontSize: "0.68rem", color: "#16a34a", fontWeight: 700 }}>
                  ● v{publishedVersion.version_no} live
                </span>
              ) : (
                <span style={{ fontSize: "0.68rem", color: "#71717a", fontWeight: 600 }}>
                  ○ Unpublished
                </span>
              )}
            </div>
          )}

          <div style={{
            width: "100%",
            maxWidth: previewMode ? "100%" : "900px",
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
              key={pageId} forces Frame to remount on every page switch.
              baselineContent is:
                - The latest in-memory snapshot for this page (if we've been here before), OR
                - The initial content from sessionStorage / default
              After Frame mounts, Craft.js owns the canvas. We never touch data again
              until the next page switch.
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

// ─── EditorRenderer ───────────────────────────────────────────────────────────

/**
 * Resolves what content to feed into <Frame data={}> for a given page.
 *
 * Priority:
 *   1. Live in-memory snapshot from usePageHistory (has all unsaved edits)
 *   2. sessionStorage content passed in via props (from a previous save)
 *   3. Hardcoded default page layout
 */
function resolveBaselineContent(
  pageId: PageId,
  serverContent: CraftJson | string | null | undefined,
): string {
  // 1. In-memory snapshot — present if we've visited this page before
  const snapshot = _getSnapshot ? _getSnapshot(pageId) : null;
  if (snapshot) return snapshot;

  // 2. Content from sessionStorage (passed via props from [pageId].tsx)
  if (serverContent) {
    if (typeof serverContent === "object" && Object.keys(serverContent).length > 0) {
      return JSON.stringify(serverContent);
    }
    if (typeof serverContent === "string" && serverContent !== "{}") {
      return serverContent;
    }
  }

  // 3. Hardcoded default
  const fallback = DEFAULT_PAGE_CONTENT[pageId];
  if (fallback && Object.keys(fallback).length > 0) {
    return JSON.stringify(fallback);
  }

  // 4. Bare ROOT (prevents crash on unknown page)
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
}

export const EditorRenderer = (props: EditorRendererProps) => {
  const themeVars = themeToVars(props.theme ?? DEFAULT_THEME);

  // We need to recompute baselineContent each time pageId changes.
  // Using a render-time call is fine here — resolveBaselineContent is cheap
  // and _getSnapshot is always up-to-date from the previous EditorInner render.
  const baselineContent = resolveBaselineContent(props.pageId, props.content);

  return (
    <Editor resolver={craftResolver} enabled={true}>
      <EditorInner
        {...props}
        themeVars={themeVars}
        baselineContent={baselineContent}
        onBaselineReady={() => {}}
      />
    </Editor>
  );
};