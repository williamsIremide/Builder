import { DefaultFields, RetailStoreType } from "../utilTypes";
import { RetailStore } from "./store";

export { PageId } from "~/lib/pagesConfig";

export type StorefrontPageId =
  | "home"
  | "products"
  | "product"
  | "cart"
  | "locations"
  | "checkout";

export type StorefrontAssetType = "image";

export interface Storefront extends DefaultFields {
  store: RetailStore; // ForeignKey to RetailStore
  homepage_description?: string | null; // TextField, optional, nullable. Good for SEO
  store_weblink?: string | null; // URLField, optional, nullable
  theme_color?: string | null; // CharField, optional, nullable
  motto?: string | null; // CharField, optional, nullable
  bio?: string | null; // TextField, optional, nullable
  twitter_url?: string | null; // URLField, optional, nullable
  instagram_url?: string | null; // URLField, optional, nullable
  tiktok_url?: string | null; // URLField, optional, nullable
  linkedin_url?: string | null; // URLField, optional, nullable
  threads_url?: string | null; // URLField, optional, nullable
  facebook_url?: string | null; // URLField, optional, nullable
  pinterest_url?: string | null; // URLField, optional, nullable

  headquarter_branch?: Branch;
}

export interface StorefrontTheme {
  id: number;
  background: string; // e.g. "#e5e5e5"
  foreground: string; // e.g. "#0a0a0a"
  primary: string; // e.g. "#ff6a00"
  primary_foreground: string;
  secondary: string;
  secondary_foreground: string;
  accent: string;
  accent_foreground: string;
  muted: string;
  muted_foreground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructive_foreground: string;
  radius: string; // e.g. "0.5rem"
}

export interface StorefrontPage {
  id: number;
  storefront_id: number;
  page_id: StorefrontPageId;
  draft_content: CraftJson; // Craft.js serialized JSON
  schema_version: number;
  published_version: StorefrontPageVersion | null;
  is_published: boolean;
}

export interface StorefrontPageVersion {
  id: number;
  page_id: number;
  content: CraftJson;
  saved_by: number | null; // user ID
  version_no: number;
  created_at: string; // ISO datetime
}

export interface StorefrontAsset {
  id: number;
  storefront_id: number;
  uploaded_by: number | null;
  file: string; // URL
  file_name: string;
  file_size: number; // bytes
  mime_type: string;
  asset_type: StorefrontAssetType;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface AssetStorageStats {
  used_bytes: number;
  remaining_bytes: number;
  max_bytes: number; // 50 * 1024 * 1024
}

export type CraftJson = Record<string, CraftNode>;

export interface CraftNode {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, unknown>;
  displayName: string;
  custom: Record<string, unknown>;
  parent: string | null;
  hidden: boolean;
  nodes: string[];
  linkedNodes: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  detail?: string;
  [field: string]: unknown;
}
