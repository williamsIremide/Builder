import { StoreBranchItem } from "~/constants/types/models/item";
import { Branch } from "~/constants/types/models/store";
import groupBy from "lodash/groupBy";
import { useMemo } from "react";

export const useGroupedByInventory = (products: StoreBranchItem[]) => {
  return useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return {};
    return groupBy(products, (item) => item?.variant?.inventory?.id);
  }, [products]);
};

export function useSameInventoryProducts(
  allProducts: StoreBranchItem[],
  selectedProduct?: StoreBranchItem,
): StoreBranchItem[] {
  return useMemo(() => {
    if (!selectedProduct) return [];
    const selectedInventoryId = selectedProduct.variant.inventory.id;
    return allProducts.filter(
      (p) => p.variant.inventory.id === selectedInventoryId,
    );
  }, [allProducts, selectedProduct]);
}

/* 
TODO: 
    return "not taking orders" if branch doesn't deliver to location in question
*/

/**
 * Utility function to check availability of a StoreBranchItem
 * @param item - The StoreBranchItem to check
 * @returns {string | null} - A message indicating the issue or null if no issues
 */
export function checkItemAvailability(
  item: StoreBranchItem,
  branch?: Branch,
): string | null {
  const currentTime = new Date(); // Current time
  const branchOpenTime = new Date(
    `1970-01-01T${branch?.operating_hours?.monday_open_time}Z`,
  );
  const branchCloseTime = new Date(
    `1970-01-01T${branch?.operating_hours?.monday_open_time}Z`,
  );

  // Check if the item itself is active
  if (!item.is_active) {
    return "item unavailable";
  }

  // Check if the branch is active
  if (!branch?.is_active) {
    return "Delivery unavailable";
  }

  // Check if the current time is outside branch working hours
  if (currentTime < branchOpenTime || currentTime > branchCloseTime) {
    return "branch is currently closed";
  }

  return null;
}

// -----

export type SortType =
  | "new-arrivals"
  | "best-sellers"
  | "promoted"
  | "top-picks"
  | "featured"
  | "price-low-to-high"
  | "price-high-to-low"
  | "alphabetical"
  | "alphabetical-desc"
  | "discount-high-to-low"
  | "expiring-soon"
  | "most-stocked"
  | "hot-deals"
  | "least-stocked"
  | "default";

export interface SortOptions {
  type: SortType;
  limit?: number;
  excludeOutOfStock?: boolean;
  minDiscount?: number;
  maxDaysToExpiry?: number;
  randomSeed?: number; // For consistent random sorting
}

export interface SortResult<T = StoreBranchItem> {
  items: T[];
  totalCount: number;
  sortType: SortType;
  appliedFilters: {
    excludeOutOfStock: boolean;
    minDiscount?: number;
    maxDaysToExpiry?: number;
  };
}

/**
 * Comprehensive Product Sorting Service
 * Handles all product sorting and filtering requirements
 */
export class ProductSortingService {
  private static instance: ProductSortingService;

  // Cache for performance optimization
  private sortCache = new Map<string, SortResult>();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private cacheTimestamps = new Map<string, number>();

  public static getInstance(): ProductSortingService {
    if (!ProductSortingService.instance) {
      ProductSortingService.instance = new ProductSortingService();
    }
    return ProductSortingService.instance;
  }

  /**
   * Main sorting method
   */
  public sortProducts(
    products: StoreBranchItem[],
    options: SortOptions,
  ): SortResult {
    const cacheKey = this.generateCacheKey(products, options);

    // Check cache
    if (this.isCacheValid(cacheKey)) {
      return this.sortCache.get(cacheKey)!;
    }

    let sortedProducts = [...products];

    // Apply pre-filters
    if (options.excludeOutOfStock) {
      sortedProducts = sortedProducts.filter((item) => item.quantity > 0);
    }

    if (options.minDiscount !== undefined) {
      sortedProducts = sortedProducts.filter(
        (item) => parseFloat(item.discount_percentage) >= options.minDiscount!,
      );
    }

    if (options.maxDaysToExpiry) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + options.maxDaysToExpiry);

      sortedProducts = sortedProducts.filter((item) => {
        if (!item.expiration_date) return true;
        return new Date(item.expiration_date) <= cutoffDate;
      });
    }

    // Apply sorting logic
    sortedProducts = this.applySorting(sortedProducts, options);

    // Apply limit
    const totalCount = sortedProducts.length;
    if (options.limit && options.limit > 0) {
      sortedProducts = sortedProducts.slice(0, options.limit);
    }

    const result: SortResult = {
      items: sortedProducts,
      totalCount,
      sortType: options.type,
      appliedFilters: {
        excludeOutOfStock: options.excludeOutOfStock || false,
        minDiscount: options.minDiscount,
        maxDaysToExpiry: options.maxDaysToExpiry,
      },
    };

    // Cache result
    this.sortCache.set(cacheKey, result);
    this.cacheTimestamps.set(cacheKey, Date.now());

    return result;
  }

  /**
   * Apply specific sorting logic based on type
   */
  private applySorting(
    products: StoreBranchItem[],
    options: SortOptions,
  ): StoreBranchItem[] {
    switch (options.type) {
      case "hot-deals":
        return this.sortByHotDeals(products);

      case "new-arrivals":
        return this.sortByNewArrivals(products);

      case "best-sellers":
        return this.sortByBestSellers(products);

      case "promoted":
        return this.sortByPromoted(products, options.randomSeed);

      case "top-picks":
        return this.sortByTopPicks(products, options.randomSeed);

      case "featured":
        return this.sortByFeatured(products, options.randomSeed);

      case "price-low-to-high":
        return this.sortByPrice(products, "asc");

      case "price-high-to-low":
        return this.sortByPrice(products, "desc");

      case "alphabetical":
        return this.sortAlphabetically(products, "asc");

      case "alphabetical-desc":
        return this.sortAlphabetically(products, "desc");

      case "discount-high-to-low":
        return this.sortByDiscount(products);

      case "expiring-soon":
        return this.sortByExpiryDate(products);

      case "most-stocked":
        return this.sortByStock(products, "desc");

      case "least-stocked":
        return this.sortByStock(products, "asc");

      case "default":
      default:
        return this.sortByDefault(products);
    }
  }

  /**
   * Create a seeded pseudo-random number generator
   */
  private createSeededRandom(seed: number): () => number {
    let random = seed;
    return () => {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    };
  }

  /**
   * Sort by newest arrivals (created_at desc)
   */
  private sortByNewArrivals(products: StoreBranchItem[]): StoreBranchItem[] {
    return products.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }

  /**
   * Sort by best sellers (using quantity sold as proxy - higher original quantity means more popular)
   */
  private sortByBestSellers(products: StoreBranchItem[]): StoreBranchItem[] {
    return products.sort((a, b) => {
      // Calculate "popularity score" based on various factors
      const scoreA = this.calculatePopularityScore(a);
      const scoreB = this.calculatePopularityScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * Sort promoted products (random selection with weighted preferences)
   */
  private sortByPromoted(
    products: StoreBranchItem[],
    seed?: number,
  ): StoreBranchItem[] {
    const promoted = products.filter(
      (item) =>
        parseFloat(item.discount_percentage) > 0 || // Has discount
        item.quantity > 100 || // High stock
        new Date(item.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Recent
    );

    const remaining = products.filter((item) => !promoted.includes(item));

    return [
      ...this.shuffleArray([...promoted], this.createSeededRandom(seed ?? 42)),
      ...this.shuffleArray(
        [...remaining],
        this.createSeededRandom((seed ?? 42) + 1),
      ),
    ];
  }

  /**
   * Sort by top picks / curated selection
   */
  private sortByTopPicks(
    products: StoreBranchItem[],
    seed?: number,
  ): StoreBranchItem[] {
    const topPicks = products.filter((item) => {
      const price = parseFloat(item.selling_price);
      const discount = parseFloat(item.discount_percentage);
      const stock = item.quantity;

      // Curated logic: good price range, decent stock, some variety in brands
      return (
        price >= 1.0 &&
        price <= 15.0 && // Reasonable price range
        stock > 20 && // Good availability
        (discount > 0 || stock > 50) // Either discounted or very popular
      );
    });

    const remaining = products.filter((item) => !topPicks.includes(item));

    return [
      ...this.shuffleArray([...topPicks], this.createSeededRandom(seed ?? 42)),
      ...remaining.sort(
        (a, b) => parseFloat(b.selling_price) - parseFloat(a.selling_price),
      ),
    ];
  }

  /**
   * Sort featured products (premium/high-value items)
   */
  private sortByFeatured(
    products: StoreBranchItem[],
    seed?: number,
  ): StoreBranchItem[] {
    const featured = products.filter((item) => {
      const price = parseFloat(item.selling_price);
      const hasImages = item.variant.images && item.variant.images.length > 0;
      const isGlass = item.variant.name.toLowerCase().includes("glass");

      // Featured logic: premium variants, good presentation
      return (
        hasImages &&
        (price > 10.0 || isGlass || item.variant.name.includes("NRB"))
      );
    });

    const remaining = products.filter((item) => !featured.includes(item));

    return [
      ...this.shuffleArray([...featured], this.createSeededRandom(seed ?? 42)),
      ...this.shuffleArray(
        [...remaining],
        this.createSeededRandom(seed ? seed + 2 : 42),
      ),
    ];
  }

  /**
   * Sort by price
   */
  private sortByPrice(
    products: StoreBranchItem[],
    order: "asc" | "desc",
  ): StoreBranchItem[] {
    return products.sort((a, b) => {
      const priceA = parseFloat(a.selling_price);
      const priceB = parseFloat(b.selling_price);
      return order === "asc" ? priceA - priceB : priceB - priceA;
    });
  }

  /**
   * Sort alphabetically by product name
   */
  private sortAlphabetically(
    products: StoreBranchItem[],
    order: "asc" | "desc",
  ): StoreBranchItem[] {
    return products.sort((a, b) => {
      const nameA = a.variant.name.toLowerCase();
      const nameB = b.variant.name.toLowerCase();
      const comparison = nameA.localeCompare(nameB);
      return order === "asc" ? comparison : -comparison;
    });
  }

  /**
   * Sort by discount percentage (highest first)
   */
  private sortByDiscount(products: StoreBranchItem[]): StoreBranchItem[] {
    return products.sort((a, b) => {
      const discountA = parseFloat(a.discount_percentage);
      const discountB = parseFloat(b.discount_percentage);
      return discountB - discountA;
    });
  }

  /**
   * Sort by expiry date (soonest first)
   */
  private sortByExpiryDate(products: StoreBranchItem[]): StoreBranchItem[] {
    return products.sort((a, b) => {
      if (!a.expiration_date && !b.expiration_date) return 0;
      if (!a.expiration_date) return 1;
      if (!b.expiration_date) return -1;

      return (
        new Date(a.expiration_date).getTime() -
        new Date(b.expiration_date).getTime()
      );
    });
  }

  /**
   * Sort by stock quantity
   */
  private sortByStock(
    products: StoreBranchItem[],
    order: "asc" | "desc",
  ): StoreBranchItem[] {
    return products.sort((a, b) => {
      return order === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    });
  }

  /**
   * Default sorting (balanced approach)
   */
  private sortByDefault(products: StoreBranchItem[]): StoreBranchItem[] {
    return products.sort((a, b) => {
      // Multi-factor sorting: discount, stock, newness, price
      const scoreA = this.calculateDefaultScore(a);
      const scoreB = this.calculateDefaultScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate popularity score for best sellers
   */
  private calculatePopularityScore(item: StoreBranchItem): number {
    const discount = parseFloat(item.discount_percentage);
    const stock = item.quantity;
    const price = parseFloat(item.selling_price);
    const isRecent =
      new Date(item.created_at) >
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    let score = 0;

    // Higher stock initially suggests popularity
    score += Math.min(stock / 10, 20);

    // Discounted items tend to sell more
    score += discount * 2;

    // Mid-range prices often sell better
    if (price >= 1.0 && price <= 10.0) score += 10;

    // Recent items get a boost
    if (isRecent) score += 15;

    // Glass bottles are premium
    if (item.variant.name.toLowerCase().includes("glass")) score += 8;

    return score;
  }

  /**
   * Sort by hot deals (best value for price + discount + availability)
   */
  private sortByHotDeals(products: StoreBranchItem[]): StoreBranchItem[] {
    return products
      .filter(
        (item) => item.quantity > 0 && parseFloat(item.discount_percentage) > 0,
      )
      .sort((a, b) => {
        const scoreA = this.calculateHotDealScore(a);
        const scoreB = this.calculateHotDealScore(b);
        return scoreB - scoreA;
      });
  }

  private calculateHotDealScore(item: StoreBranchItem): number {
    const discount = parseFloat(item.discount_percentage);
    const price = parseFloat(item.selling_price);
    const stock = item.quantity;
    const isRecent =
      new Date(item.created_at) >
      new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // last 2 weeks

    let score = 0;
    score += discount * 2; // prioritise heavy discounts
    score += Math.max(0, 10 - price); // lower price, higher score
    score += Math.min(stock / 10, 5); // moderate benefit for stock
    if (isRecent) score += 5;

    return score;
  }

  /**
   * Calculate default score for balanced sorting
   */
  private calculateDefaultScore(item: StoreBranchItem): number {
    // TODO: Make this more extensible by allowing args (weighting configs) instead of hardcoding
    const discount = parseFloat(item.discount_percentage);
    const stock = item.quantity;
    const price = parseFloat(item.selling_price);

    let score = 0;

    // Availability score
    score += stock > 0 ? 20 : 0;
    score += Math.min(stock / 5, 10);

    // Discount score
    score += discount * 1.5;

    // Price reasonableness
    if (price >= 1.0 && price <= 15.0) score += 5;

    // Newness
    const daysSinceCreation =
      (Date.now() - new Date(item.created_at).getTime()) /
      (1000 * 60 * 60 * 24);
    score += Math.max(0, 10 - daysSinceCreation / 7);

    return score;
  }

  /**
   * Shuffle array with optional seed for consistent randomization
   */
  private shuffleArray<T>(array: T[], randomFn: () => number): T[] {
    const shuffled = [...array];

    // Fisher–Yates shuffle with custom RNG
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(
    products: StoreBranchItem[],
    options: SortOptions,
  ): string {
    // const optionsKey = [
    //   options.type,
    //   options.excludeOutOfStock,
    //   options.minDiscount,
    //   options.maxDaysToExpiry,
    //   options.limit,
    //   options.randomSeed,
    // ].join("-");
    const productIds = products
      .map((p) => p.id)
      .sort()
      .join(",");
    const optionsString = JSON.stringify(options);
    return `${productIds}-${optionsString}`;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(key: string): boolean {
    if (!this.sortCache.has(key)) return false;

    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;

    return Date.now() - timestamp < this.cacheExpiry;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.sortCache.clear();
    this.cacheTimestamps.clear();
  }

  /**
   * Get available sort types
   */
  public getAvailableSortTypes(): { value: SortType; label: string }[] {
    return [
      { value: "default", label: "Recommended" },
      { value: "hot-deals", label: "Hot Deals" },
      { value: "new-arrivals", label: "New Arrivals" },
      { value: "best-sellers", label: "Best Sellers" },
      { value: "promoted", label: "Promoted" },
      { value: "top-picks", label: "Top Picks" },
      { value: "featured", label: "Featured" },
      { value: "price-low-to-high", label: "Price: Low to High" },
      { value: "price-high-to-low", label: "Price: High to Low" },
      { value: "alphabetical", label: "A-Z" },
      { value: "alphabetical-desc", label: "Z-A" },
      { value: "discount-high-to-low", label: "Highest Discount" },
      { value: "expiring-soon", label: "Expiring Soon" },
      { value: "most-stocked", label: "Most Available" },
      { value: "least-stocked", label: "Limited Stock" },
    ];
  }
}

// Export singleton instance
export const productSorter = ProductSortingService.getInstance();

// Convenience functions for common use cases
export const sortProducts = (
  products: StoreBranchItem[],
  type: SortType,
  options?: Partial<Omit<SortOptions, "type">>,
): SortResult => {
  return productSorter.sortProducts(products, { type, ...options });
};

export const getNewArrivals = (
  products: StoreBranchItem[],
  limit = 10,
  excludeOutOfStock = true,
): StoreBranchItem[] => {
  return sortProducts(products, "new-arrivals", { limit, excludeOutOfStock })
    .items;
};

export const getBestSellers = (
  products: StoreBranchItem[],
  limit = 10,
  excludeOutOfStock = true,
): StoreBranchItem[] => {
  return sortProducts(products, "best-sellers", { limit, excludeOutOfStock })
    .items;
};

export const getPromotedProducts = (
  products: StoreBranchItem[],
  limit = 8,
  seed?: number,
): StoreBranchItem[] => {
  return sortProducts(products, "promoted", { limit, randomSeed: seed }).items;
};

export const getTopPicks = (
  products: StoreBranchItem[],
  limit = 12,
  seed?: number,
): StoreBranchItem[] => {
  return sortProducts(products, "top-picks", { limit, randomSeed: seed }).items;
};

export const getHotDeals = (
  products: StoreBranchItem[],
  limit = 12,
  seed?: number,
): StoreBranchItem[] => {
  return sortProducts(products, "hot-deals", { limit, randomSeed: seed }).items;
};

export const getFeaturedProducts = (
  products: StoreBranchItem[],
  limit = 6,
  seed?: number,
): StoreBranchItem[] => {
  return sortProducts(products, "featured", { limit, randomSeed: seed }).items;
};
