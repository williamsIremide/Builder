import { StorefrontPageId } from "../../constants/types/models/storefront";

export const PAGES: { id: StorefrontPageId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "products", label: "Product List", icon: "LayoutGrid" },
  { id: "product", label: "Single Product", icon: "Package" },
  { id: "cart", label: "Cart", icon: "ShoppingCart" },
  { id: "checkout", label: "Checkout", icon: "CreditCard" },
  { id: "locations", label: "Locations", icon: "MapPin" },
  
];

/**
 * Core constraint system.
 * Controls exactly which blocks are available per page.
 * To expose more to merchants, add block names here.
 */
export const PAGE_ALLOWED_BLOCKS: Record<StorefrontPageId, string[]> = {
  home: [
    "AnnouncementBar",
    "HeroBanner",
    "ProductGrid",
    "NewsletterSignup",
    "ContactForm",
    "Navbar",
  ],
  products: [
    "AnnouncementBar",
    "ProductsHeroBlock",
    "ProductCatalogBlock",
    "AdBannerBlock",
  ],
  product: ["AnnouncementBar", "ProductDetails"],
  cart: ["CartSummary"],
  checkout: ["CheckoutForm"],
  locations: ["AnnouncementBar", "LocationBlock"],
};

export const BLOCK_LABELS: Record<string, string> = {
  AnnouncementBar: "Announcement Bar",
  HeroBanner: "Hero Banner",
  ProductGrid: "Product Grid",
  ProductsHeroBlock: "Products Header",
  ProductCatalogBlock: "Product Catalog",
  AdBannerBlock: "Ad Banner",
  NewsletterSignup: "Newsletter Signup",
  ContactForm: "Contact Form",
  ProductDetails: "Product Details",
  CartSummary: "Cart Summary",
  CheckoutForm: "Checkout Form",
  Navbar: "Nav Bar",
  LocationBlock: "Location Map",
};

export const BLOCK_ICONS: Record<string, string> = {
  AnnouncementBar: "Megaphone",
  HeroBanner: "Image",
  ProductGrid: "LayoutGrid",
  ProductsHeroBlock: "AlignLeft",
  ProductCatalogBlock: "SlidersHorizontal",
  AdBannerBlock: "Layers",
  NewsletterSignup: "Mail",
  ContactForm: "MessageSquare",
  ProductDetails: "Package",
  CartSummary: "ShoppingCart",
  CheckoutForm: "CreditCard",
  LocationBlock: "MapPin",
};