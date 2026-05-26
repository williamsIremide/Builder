/**
 * catalogFilterContext.ts
 *
 * Bidirectional pub/sub bridge connecting:
 *   - ProductsHeroBlock  (category pill strip)
 *   - ProductCatalogBlock (product grid + sidebar filter)
 *
 * Either side can set the active category and both stay in sync.
 *
 * Usage:
 *   // Set from either block
 *   setCatalogCategory(categoryId);   // null = All Items
 *
 *   // Listen in either block
 *   const unsub = onCatalogCategoryChange((id) => setState(id));
 *   return unsub; // call in useEffect cleanup
 */

type Listener = (categoryId: number | null) => void;

const listeners = new Set<Listener>();
let currentCategory: number | null = null;

export function setCatalogCategory(categoryId: number | null): void {
  currentCategory = categoryId;
  listeners.forEach((fn) => fn(categoryId));
}

export function getCatalogCategory(): number | null {
  return currentCategory;
}

export function onCatalogCategoryChange(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}