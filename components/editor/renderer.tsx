/**
 * components/editor/EditorRenderer.tsx
 *
 * Local copy of the shared EditorRenderer for the builder app.
 * Once retailbox-shared-react is installed via git, replace with:
 *   import { EditorRenderer } from 'retailbox-shared-react/builder';
 */
import React, { useCallback, useState } from "react";
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

/**
 * Saves the current Craft.js canvas state as a draft.
 * PUT /api/storefront/{storefrontId}/pages/{pageId}/draft/
 */
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

    if (result) {
      toast.success("Draft saved.");
    }

    return result;
  } catch (error) {
    console.error("Error saving draft:", error);
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  } finally {
    setLoading(false);
  }
};

/**
 * Publishes the current draft as a new StorefrontPageVersion.
 * Saves draft first, then calls publish — matching the atomic Django flow.
 * POST /api/storefront/{storefrontId}/pages/{pageId}/publish/
 */
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
    // 1. Save draft first
    await updateSingleInstance(
      `/api/storefront/${storefrontId}/pages/${pageId}/draft/`,
      { draft_content: content as unknown as JsonValue },
      setError,
      router,
      "PUT",
    );

    // 2. Publish — creates a new StorefrontPageVersion atomically in Django
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
    toast.error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
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

// Must be a child of <Editor> to call useEditor()
const EditorInner = ({
  pageId,
  themeVars,
  serializedContent,
  onSave,
  onPublish,
  onPageSwitch,
  publishState,
  isPublished,
  publishedVersion,
}: EditorRendererProps & {
  themeVars: React.CSSProperties;
  serializedContent: string | undefined;
}) => {
  const { query } = useEditor();
  const [previewMode, setPreviewMode] = useState(false);

  const getContent = useCallback(() => JSON.parse(query.serialize()), [query]);

  const pageLabel = PAGES.find((p) => p.id === pageId)?.label ?? pageId;

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...themeVars,
      }}
    >
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
      />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 52px)",
          marginTop: "52px",
          overflow: "hidden",
        }}
      >
        {!previewMode && <ComponentPanel currentPage={pageId} />}

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            background: previewMode ? "#fff" : "#1a1a1d",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: previewMode ? "0" : "32px 24px",
            minWidth: 0, 
          }}
        >
          {!previewMode && (
            <div
              style={{
                width: "100%",
                maxWidth: "900px",
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#3f3f46",
                }}
              >
                {pageLabel} — Draft
              </span>
              <div style={{ flex: 1, height: "1px", background: "#27272a" }} />
              {isPublished && publishedVersion ? (
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#16a34a",
                    fontWeight: 700,
                  }}
                >
                  ● v{publishedVersion.version_no} live
                </span>
              ) : (
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "#71717a",
                    fontWeight: 600,
                  }}
                >
                  ○ Unpublished
                </span>
              )}
            </div>
          )}

          {/* Canvas — Frame lives here so it renders inside the visual box */}
          <div
            style={{
              width: "100%",
              maxWidth: previewMode ? "100%" : "900px",
              background: "#fff",
              minHeight: previewMode ? "100vh" : "600px",
              borderRadius: previewMode ? "0" : "10px",
              // overflow: "hidden",
              boxShadow: previewMode
                ? "none"
                : "0 0 0 1px #27272a, 0 8px 40px rgba(0,0,0,0.4)",
              ...themeVars,
              flexShrink: 0,
              transform: "translateZ(0)",   // ← creates stacking context, traps sticky
              boxSizing: "border-box",
            }}
          >
            {/* key={pageId} forces Frame remount on page switch */}
            <Frame key={pageId} data={serializedContent}>
              <Element is={RootContainer} canvas id="root" />
            </Frame>
          </div>

          {!previewMode && (
            <p
              style={{
                marginTop: "16px",
                fontSize: "0.7rem",
                color: "#3f3f46",
                textAlign: "center",
              }}
            >
              Click a block to select · Drag to reorder · Right panel to edit
              settings
            </p>
          )}
        </main>

        {!previewMode && <SettingsPanel />}
      </div>
    </div>
  );
};

export const EditorRenderer = (props: EditorRendererProps) => {
  const themeVars = themeToVars(props.theme ?? DEFAULT_THEME);
  const serializedContent = (() => {
    // 1. valid object
    if (
      props.content &&
      typeof props.content === "object" &&
      Object.keys(props.content).length > 0
    ) {
      return JSON.stringify(props.content);
    }

    // 2. valid string
    if (
      props.content &&
      typeof props.content === "string" &&
      props.content !== "{}"
    ) {
      return props.content;
    }

    // 3. fallback to default page content
    const fallback = DEFAULT_PAGE_CONTENT[props.pageId];

    if (fallback && Object.keys(fallback).length > 0) {
      return JSON.stringify(fallback);
    }

    // 4. last resort → empty ROOT (prevents crash)
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
  })();

  return (
    <Editor resolver={craftResolver} enabled={true}>
      <EditorInner
        {...props}
        themeVars={themeVars}
        serializedContent={serializedContent}
      />
    </Editor>
  );
};
