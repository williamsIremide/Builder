import React, { useCallback, useRef } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { CraftJson, StorefrontTheme } from "~/constants/types/models/storefront";
import { DEFAULT_THEME } from "~/components/storefront/theme";
import { PageId } from "~/lib/pagesConfig";
import { EditorRenderer } from "~/components";
import { savePageData, loadPageData } from "~/lib/storage";

interface EditorPageProps {
  pageId: PageId;
  storefrontId: number;
}

export default function EditorPage({ pageId, storefrontId }: EditorPageProps) {
  const router = useRouter();

  // Load each page's saved content from sessionStorage exactly once —
  // the first time that page is requested. After that, usePageHistory's
  // in-memory snapshot takes over (via the snapshot bridge in EditorRenderer).
  // Using a ref so this cache survives re-renders without causing them.
  const sessionCache = useRef<Partial<Record<PageId, CraftJson | null>>>({});

  const getInitialContent = (pid: PageId): CraftJson | null => {
    if (!(pid in sessionCache.current)) {
      const raw = loadPageData(pid);
      sessionCache.current[pid] = raw ? (JSON.parse(raw) as CraftJson) : null;
    }
    return sessionCache.current[pid] ?? null;
  };

  // Save Draft — writes current canvas JSON to sessionStorage.
  // sessionStorage is cleared on tab close / server restart (not persistent).
  // LATER: replace body with handleSaveDraft(...) to hit the backend.
  const handleSave = useCallback(
    async (content: CraftJson) => {
      savePageData(pageId, JSON.stringify(content));
      // Also update the in-memory cache so if this component remounts it
      // still has the right starting point.
      sessionCache.current[pageId] = content;
    },
    [pageId],
  );

  // Publish — same as save for now.
  // LATER: replace with handlePublishPage(...) to create a StorefrontPageVersion.
  const handlePublish = useCallback(
    async (content: CraftJson) => {
      savePageData(pageId, JSON.stringify(content));
      sessionCache.current[pageId] = content;
    },
    [pageId],
  );

  return (
    <EditorRenderer
      pageId={pageId}
      // Pass the once-read sessionStorage content as the initial baseline.
      // EditorRenderer will prefer the live in-memory snapshot over this
      // for pages that have already been visited in this session.
      content={getInitialContent(pageId)}
      theme={DEFAULT_THEME}
      onSave={handleSave}
      onPublish={handlePublish}
      publishState="idle"
      isPublished={false}
      publishedVersion={undefined}
      onPageSwitch={(id) => router.push(`/editor/${id}`)}
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