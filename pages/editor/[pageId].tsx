import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  CraftJson,
  StorefrontPage,
  StorefrontPageId,
  StorefrontTheme,
} from "~/constants/types/models/storefront";
import { DEFAULT_THEME } from "~/components/storefront/theme";
import { PageId } from "~/lib/pagesConfig";
import {
  EditorRenderer,
  handlePublishPage,
  handleSaveDraft,
} from "~/components";
import { savePageData, loadPageData } from "~/lib/storage";

interface EditorPageProps {
  pageId: PageId;
  storefrontId: number;
}

interface PageData {
  id: number;
  page_id: StorefrontPageId;
  draft_content: CraftJson;
  is_published: boolean;
  published_version: { version_no: number; created_at: string } | null;
}

export default function EditorPage({ pageId, storefrontId }: EditorPageProps) {
  const router = useRouter();

  // Load each page's initial content ONCE from sessionStorage.
  // After that, Craft.js owns the canvas state — we never re-read storage.
  // useRef so it doesn't trigger re-renders and doesn't reset on page switch.
  const initialContentRef = useRef<Partial<Record<PageId, CraftJson | null>>>({});

  const getInitialContent = (pid: PageId): CraftJson | null => {
    if (!(pid in initialContentRef.current)) {
      const raw = loadPageData(pid);
      initialContentRef.current[pid] = raw ? (JSON.parse(raw) as CraftJson) : null;
    }
    return initialContentRef.current[pid] ?? null;
  };

  const [theme] = useState<StorefrontTheme>(DEFAULT_THEME);
  const [publishState, setPublishState] = useState<"idle" | "publishing" | "done">("idle");
  const [page] = useState<PageData | null>(null);

  const handleSave = useCallback(
    async (content: CraftJson) => {
      // TEMPORARY: save to sessionStorage (clears on server restart / tab close)
      // LATER: replace with handleSaveDraft(content, storefrontId, pageId, router, setPageError, setSaveLoading)
      savePageData(pageId, JSON.stringify(content));

      // Also update our in-memory cache so switching back to this page
      // within the same session uses the saved content as the baseline.
      initialContentRef.current[pageId] = content;
    },
    [pageId],
  );

  const handlePublish = useCallback(
    async (content: CraftJson) => {
      // TEMPORARY: save to sessionStorage
      // LATER: replace with handlePublishPage(...)
      savePageData(pageId, JSON.stringify(content));
      initialContentRef.current[pageId] = content;
    },
    [pageId],
  );

  return (
    <EditorRenderer
      pageId={pageId}
      // Pass the once-loaded initial content. EditorRenderer / Frame only uses
      // this when the Frame mounts (i.e. when pageId changes). After that,
      // Craft.js owns the canvas — no more storage reads on re-render.
      content={getInitialContent(pageId)}
      theme={theme}
      onSave={handleSave}
      onPublish={handlePublish}
      publishState={publishState}
      isPublished={page?.is_published || false}
      publishedVersion={page?.published_version ?? undefined}
      onPageSwitch={(id: string) => router.push(`/editor/${id}`)}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const pageId = params?.pageId as string;
  const valid = ["home", "products", "product", "cart", "checkout", "locations"];
  if (!valid.includes(pageId)) {
    return { redirect: { destination: "/editor/home", permanent: false } };
  }
  return {
    props: {
      pageId,
      storefrontId: Number(process.env.DEV_STOREFRONT_ID ?? 1),
    },
  };
};