import React, { useCallback, useEffect, useState } from "react";
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
import { fetchSingleInstance } from "~/utils/requestHandler/fetchData";
import {
  storefrontEndpoints,
  storefrontPageEndpoints,
} from "~/constants/routes";
import { request } from "~/utils/requestHandler/baseRequest";
import { savePageData, loadPageData } from "~/lib/storage"; // ← ADD THIS IMPORT

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

  const [page, setPage] = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const [theme, setTheme] = useState<StorefrontTheme>(DEFAULT_THEME);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  const [saveLoading, setSaveLoading] = useState(false);
  const [publishState, setPublishState] = useState<
    "idle" | "publishing" | "done"
  >("idle");

  // // Fetch page data and theme in parallel on mount / page switch
  // useEffect(() => {
  //   setPageLoading(true);

  //   Promise.all([
  //     request<StorefrontPage[]>(
  //       `${storefrontPageEndpoints.list.backendURL}?storefront=${storefrontId}&page_id=${pageId}`,
  //       { method: "GET" },
  //       setPageError,
  //       router,
  //     ),
  //     request<StorefrontTheme>(
  //       `${storefrontEndpoints.retrieve.backendURL(storefrontId)}theme/`,
  //       { method: "GET" },
  //       setThemeError,
  //       router,
  //     ),
  //   ])
  //     .then(([pageData, themeData]) => {
  //       const pages = pageData as StorefrontPage[] | null;
  //       setPage(pages?.[0] ?? null);
  //       setTheme((themeData as StorefrontTheme) ?? DEFAULT_THEME);
  //     })
  //     .finally(() => setPageLoading(false));
  // }, [storefrontId, pageId]);

  const handleSave = useCallback(
    async (content: CraftJson) => {
      // TEMPORARY: save to localStorage until backend is connected
      savePageData(pageId, JSON.stringify(content));
      // LATER: remove the line above and uncomment the line below
      // await handleSaveDraft(content, storefrontId, pageId, router, setPageError, setSaveLoading);
    },
    [storefrontId, pageId, router],
  );

  const handlePublish = useCallback(
    async (content: CraftJson) => {
      // TEMPORARY: save to localStorage until backend is connected
      savePageData(pageId, JSON.stringify(content));
      // LATER: remove the line above and uncomment the block below
      // const version = await handlePublishPage(content, storefrontId, pageId, router, setPageError, setPublishState);
      // if (version) {
      //   setPage((prev) =>
      //     prev ? { ...prev, is_published: true, published_version: version } : prev,
      //   );
      // }
    },
    [storefrontId, pageId, router],
  );

  if (pageLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0f0f11",
          color: "#52525b",
          fontSize: "0.875rem",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "#ff6a00",
            borderRadius: "7px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          R
        </div>
        Loading editor…
      </div>
    );
  }

  // TEMPORARY: load from localStorage; LATER: remove loadPageData and use only page?.draft_content
  const localContent = loadPageData(pageId);
  const resolvedContent = localContent ? JSON.parse(localContent) : page?.draft_content;

  return (
    <EditorRenderer
      pageId={pageId}
      content={resolvedContent}
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