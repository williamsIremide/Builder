export const PAGES = [
  { id: 'home',     label: 'Home',           icon: 'Home' },
  { id: 'products', label: 'Product List',   icon: 'LayoutGrid' },
  { id: 'product',  label: 'Single Product', icon: 'Package' },
  { id: 'cart',     label: 'Cart',           icon: 'ShoppingCart' },
  { id: 'checkout', label: 'Checkout',       icon: 'CreditCard' },
  { id: 'locations', label: 'Locations',     icon: 'MapPin' },
] as const;

export type PageId = typeof PAGES[number]['id'];

/**
 * Defines which blocks are available on each page.
 * This is the core constraint system — add to these arrays to expand access.
 */
export const PAGE_ALLOWED_BLOCKS: Record<PageId, string[]> = {
  home: [
    'AnnouncementBar',
    'HeroBanner',
    'ProductGrid',
    'NewsletterSignup',
    'ContactForm',
  ],
  products: [
    'AnnouncementBar',
    'ProductsHeroBlock',
    'ProductCatalogBlock',   
    'AdBannerBlock',
  ],
  product: ['AnnouncementBar', 'ProductDetails'],
  cart: ['CartSummary'],
  checkout: ['CheckoutForm'],
  locations: ['AnnouncementBar', 'LocationBlock', 'ContactForm'],
};

/** Human-readable labels for block names shown in the palette */
export const BLOCK_LABELS: Record<string, string> = {
  AnnouncementBar:    'Announcement Bar',
  HeroBanner:         'Hero Banner',
  ProductGrid:        'Product Grid',
  ProductsHeroBlock:  'Products Header',
  ProductCatalogBlock:'Product Catalog',
  AdBannerBlock:      'Ad Banner',
  NewsletterSignup:   'Newsletter Signup',
  ContactForm:        'Contact Form',
  ProductDetails:     'Product Details',
  CartSummary:        'Cart Summary',
  CheckoutForm:       'Checkout Form',
  LocationBlock:      'Location Map',
};

/** Lucide icon names per block (used in ComponentPanel) */
export const BLOCK_ICONS: Record<string, string> = {
  AnnouncementBar:    'Megaphone',
  HeroBanner:         'Image',
  ProductGrid:        'LayoutGrid',
  ProductsHeroBlock:  'AlignLeft',
  ProductCatalogBlock:'SlidersHorizontal',
  AdBannerBlock:      'Layers',
  NewsletterSignup:   'Mail',
  ContactForm:        'MessageSquare',
  ProductDetails:     'Package',
  CartSummary:        'ShoppingCart',
  CheckoutForm:       'CreditCard',
  LocationBlock:      'MapPin',
};