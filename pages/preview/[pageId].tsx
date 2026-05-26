import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { PAGES, PageId } from "~/lib/pagesConfig";
// import { StorefrontRenderer } from "~/components";
import { request } from "~/utils/requestHandler/baseRequest";
import {
  CraftJson,
  StorefrontPageId,
  StorefrontTheme,
} from "~/constants/types/models/storefront";
import { useRouter } from "next/router";
import {
  storefrontEndpoints,
  storefrontPageEndpoints,
} from "~/constants/routes";
import dynamic from "next/dynamic";

const StorefrontRenderer = dynamic(
  () => import("~/components").then((m) => m.StorefrontRenderer),
  { ssr: false },
);

interface PreviewPageProps {
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

export default function PreviewPage({
  pageId,
  storefrontId,
}: PreviewPageProps) {
  const router = useRouter();
  const [content, setContent] = useState<CraftJson | null>(null);
  const [theme, setTheme] = useState<StorefrontTheme | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const page = PAGES.find((p) => p.id === pageId);



  // useEffect(() => {
  //   Promise.all([
  //     request<PageData[]>(
  //       `${storefrontPageEndpoints.list.backendURL}?storefront=${storefrontId}&page_id=${pageId}`,
  //       { method: "GET" },
  //       setError,
  //       router,
  //       "JWT",
  //     ),
  //     request<StorefrontTheme>(
  //       `${storefrontEndpoints.retrieve.backendURL(storefrontId.toString())}theme/`,
  //       { method: "GET" },
  //       setError,
  //       router,
  //       "JWT",
  //     ),
  //   ])
  //     .then(([pageData, themeData]) => {
  //       // Handle paginated response — results could be nested in data.results or be the array directly
  //       const results: PageData[] =
  //         (pageData as any)?.results ?? // if request returns data.results
  //         (pageData as any)?.data?.results ?? // if request returns full response
  //         (Array.isArray(pageData) ? pageData : []); // if request returns array directly

  //       const match = results.find(
  //         (p) => p.page_id === pageId && p.id === storefrontId,
  //       );
  //       setContent(match?.draft_content ?? null);

  //       // Only set theme if it's actually a theme object (has storefront field)
  //       const theme = themeData as any;
  //       setTheme(theme?.storefront ? (theme as StorefrontTheme) : null);
  //     })
  //     .finally(() => setLoading(false));
  // }, [storefrontId, pageId]);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Preview bar */}
      <div
        style={{
          background: "#0f0f11",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #1c1c1f",
        }}
      >
        <div
          style={{
            width: "22px",
            height: "22px",
            background: "#ff6a00",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 800,
            color: "#fff",
          }}
        >
          R
        </div>
        <span
          style={{ color: "#71717a", fontSize: "0.75rem", fontWeight: 600 }}
        >
          Preview — {page?.label}
        </span>
        <div
          style={{
            marginLeft: "8px",
            padding: "2px 8px",
            background: "#1c1c1f",
            borderRadius: "4px",
            fontSize: "0.65rem",
            color: "#f59e0b",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Draft
        </div>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => window.close()}
          style={{
            background: "transparent",
            border: "1px solid #27272a",
            color: "#71717a",
            borderRadius: "5px",
            padding: "4px 10px",
            fontSize: "0.72rem",
            cursor: "pointer",
          }}
        >
          Close Preview
        </button>
      </div>

      {loading ? null : (
        <StorefrontRenderer
          content={content}
          pageId={pageId}
          theme={theme}
          minHeight="calc(100vh - 40px)"
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const pageId = params?.pageId as string;
  const valid = ["home", "products", "product", "cart", "checkout", "locations"];
  if (!valid.includes(pageId)) {
    return { redirect: { destination: "/editor/home", permanent: false } };
  }
  return {
    props: { pageId, storefrontId: Number(process.env.DEV_STOREFRONT_ID ?? 1) },
  };
};
