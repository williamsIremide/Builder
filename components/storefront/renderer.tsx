import React, { useMemo } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { craftResolver } from "./resolver";
import { RootContainer } from "~/components/blocks/RootContainer";
import { themeToVars, DEFAULT_THEME } from "./theme";
import {
  StorefrontTheme,
  CraftJson,
} from "../../constants/types/models/storefront";
import { DEFAULT_PAGE_CONTENT } from "~/lib/defaultContent";

export interface StorefrontRendererProps {
  /**
   * The Craft.js JSON — the `content` field from StorefrontPageVersion,
   * or `draft_content` from StorefrontPage (for preview).
   */
  content: CraftJson | string | null;

  /**
   * StorefrontTheme from your Django API.
   * If not provided, uses DEFAULT_THEME.
   */
  theme?: StorefrontTheme | null;

  /**
   * Minimum height of the rendered page area.
   * Defaults to '100vh'.
   */
  minHeight?: string;
}

/**
 * StorefrontRenderer
 *
 * Renders a Craft.js page JSON as a read-only storefront view.
 * Uses Editor with enabled=false — same component tree as the builder,
 * zero editing overhead, no drag handles, no selection outlines.
 *
 * Use this in:
 *   1. Your storefront Next.js app — for each of the 5 pages
 *   2. The builder's /preview/[pageId] route
 *
 * Example:
 *   <StorefrontRenderer content={page.published_version.content} theme={storefront.theme} />
 */

export interface StorefrontRendererProps {
  content: CraftJson | string | null;
  pageId: string;
  theme?: StorefrontTheme | null;
  minHeight?: string;
}

export const StorefrontRenderer = ({
  content,
  pageId,
  theme,
  minHeight = "100vh",
}: StorefrontRendererProps) => {
  const resolvedTheme = theme ?? DEFAULT_THEME;
  const themeVars = useMemo(() => themeToVars(resolvedTheme), [resolvedTheme]);

  const serializedContent = useMemo(() => {
    // Use saved content if it exists and is non-empty
    if (
      content &&
      typeof content === "object" &&
      Object.keys(content).length > 0
    )
      return JSON.stringify(content);
    if (content && typeof content === "string" && content !== "{}")
      return content;

    // Fall back to hardcoded default for this page
    const defaultContent = DEFAULT_PAGE_CONTENT[pageId];
    return defaultContent && Object.keys(defaultContent).length > 0
      ? JSON.stringify(defaultContent)
      : null;
  }, [content, pageId]);

  if (!serializedContent) {
    return (
      <div
        style={{
          minHeight,
          ...themeVars,
          background: "var(--rb-background)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--rb-muted-fg)",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <p style={{ margin: 0, fontWeight: 500 }}>
          This page has no published content yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight, ...themeVars }}>
      <Editor resolver={craftResolver} enabled={false}>
        <Frame data={JSON.parse(serializedContent)}>
          <Element is={RootContainer} canvas id="root" />
        </Frame>
      </Editor>
    </div>
  );
};
