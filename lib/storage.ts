import { PageId } from './pagesConfig';

const STORAGE_KEY = 'retailbox_storefront';

export type StorefrontData = Partial<Record<PageId, string>>;

export function savePageData(pageId: PageId, serializedState: string): void {
  try {
    const existing = loadAllData();
    const updated: StorefrontData = { ...existing, [pageId]: serializedState };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('[RetailBox] Failed to save page data:', e);
  }
}

export function loadPageData(pageId: PageId): string | null {
  try {
    const all = loadAllData();
    return all[pageId] ?? null;
  } catch (e) {
    console.error('[RetailBox] Failed to load page data:', e);
    return null;
  }
}

export function loadAllData(): StorefrontData {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StorefrontData;
  } catch {
    return {};
  }
}

export function clearAllData(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}