/**
 * mockProducts.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for mock product + category data.
 *
 * Used by:
 *   - ProductGrid        (home page featured / new arrivals / hot deals)
 *   - ProductCatalogBlock (products page full catalog with filters)
 *   - ProductsHeroBlock  (category pill strip — reads MOCK_CATEGORIES)
 *
 * In production these are replaced by real API data; the shape is identical.
 */

export interface MockCategory {
  id: number;
  name: string;
}

export interface MockProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  /** Category id — matches MockCategory.id */
  category: number;
  discount: string | null;
  variants: string[];
  /** Clothing sizes for the size filter */
  sizes: string[];
  /** Human-readable category label shown on card */
  displayCategory: string;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Personal Care" },
  { id: 5, name: "Gadgets" },
  { id: 6, name: "Sportswear" },
  { id: 7, name: "Accessories" },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: "Classic Tee",
    price: 4500,
    originalPrice: 6000,
    category: 3,
    discount: "25%",
    variants: ["Small", "Medium", "Large"],
    sizes: ["S", "M", "L"],
    displayCategory: "Fashion",
  },
  {
    id: 2,
    name: "Slim Chinos",
    price: 7200,
    originalPrice: null,
    category: 3,
    discount: null,
    variants: ["30", "32", "34"],
    sizes: [],
    displayCategory: "Fashion",
  },
  {
    id: 3,
    name: "Canvas Sneakers",
    price: 12500,
    originalPrice: 15000,
    category: 3,
    discount: "17%",
    variants: ["42", "43", "44"],
    sizes: [],
    displayCategory: "Fashion",
  },
  {
    id: 4,
    name: "Wool Beanie",
    price: 3800,
    originalPrice: null,
    category: 7,
    discount: null,
    variants: ["One Size"],
    sizes: [],
    displayCategory: "Accessories",
  },
  {
    id: 5,
    name: "Leather Belt",
    price: 5100,
    originalPrice: 6500,
    category: 7,
    discount: "22%",
    variants: ["S", "M", "L"],
    sizes: ["S", "M", "L"],
    displayCategory: "Accessories",
  },
  {
    id: 6,
    name: "Denim Jacket",
    price: 18000,
    originalPrice: null,
    category: 3,
    discount: null,
    variants: ["XS", "S", "M", "L"],
    sizes: ["XS", "S", "M", "L"],
    displayCategory: "Fashion",
  },
  {
    id: 7,
    name: "Linen Shirt",
    price: 8900,
    originalPrice: 11000,
    category: 3,
    discount: "19%",
    variants: ["S", "M", "L"],
    sizes: ["S", "M", "L"],
    displayCategory: "Fashion",
  },
  {
    id: 8,
    name: "Running Shorts",
    price: 5500,
    originalPrice: null,
    category: 6,
    discount: null,
    variants: ["S", "M", "L", "XL"],
    sizes: ["S", "M", "L", "XL"],
    displayCategory: "Sportswear",
  },
  {
    id: 9,
    name: "Knit Sweater",
    price: 14200,
    originalPrice: 17000,
    category: 3,
    discount: "16%",
    variants: ["S", "M", "L"],
    sizes: ["S", "M", "L"],
    displayCategory: "Fashion",
  },
  {
    id: 10,
    name: "Cargo Pants",
    price: 11000,
    originalPrice: null,
    category: 3,
    discount: null,
    variants: ["30", "32", "34", "36"],
    sizes: [],
    displayCategory: "Fashion",
  },
  {
    id: 11,
    name: "Matcha Latte Mix",
    price: 2800,
    originalPrice: null,
    category: 1,
    discount: null,
    variants: ["250g", "500g"],
    sizes: [],
    displayCategory: "Beverages",
  },
  {
    id: 12,
    name: "Granola Bars x6",
    price: 1600,
    originalPrice: 2000,
    category: 2,
    discount: "20%",
    variants: ["Original", "Choco"],
    sizes: [],
    displayCategory: "Snacks",
  },
  {
    id: 13,
    name: "Face Moisturiser",
    price: 4200,
    originalPrice: null,
    category: 4,
    discount: null,
    variants: ["50ml", "100ml"],
    sizes: [],
    displayCategory: "Personal Care",
  },
  {
    id: 14,
    name: "Wireless Earbuds",
    price: 22500,
    originalPrice: 28000,
    category: 5,
    discount: "20%",
    variants: ["White", "Black"],
    sizes: [],
    displayCategory: "Gadgets",
  },
  {
    id: 15,
    name: "Yoga Leggings",
    price: 7800,
    originalPrice: null,
    category: 6,
    discount: null,
    variants: ["XS", "S", "M", "L"],
    sizes: ["XS", "S", "M", "L"],
    displayCategory: "Sportswear",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const PRICE_MIN = 0;
export const PRICE_MAX = 30000;

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export function formatPrice(amount: number, currencySymbol: string): string {
  return `${currencySymbol}${amount.toLocaleString()}`;
}

// ─── Cross-block category event ───────────────────────────────────────────────
// ProductsHeroBlock fires this; ProductCatalogBlock listens.
// Using a CustomEvent keeps the blocks fully decoupled from any store/context.

export const CATEGORY_FILTER_EVENT = "rb:categoryFilter";

export interface CategoryFilterEventDetail {
  categoryId: number | null;
}

export function dispatchCategoryFilter(categoryId: number | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CategoryFilterEventDetail>(CATEGORY_FILTER_EVENT, {
      detail: { categoryId },
    })
  );
}