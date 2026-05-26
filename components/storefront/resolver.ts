/**
 * craftResolver — the SINGLE source of truth for block registration.
 *
 * This file is shared between:
 *   - The builder (Editor enabled=true)
 *   - The storefront renderer (Editor enabled=false)
 *
 * Both must always use this exact same resolver.
 * Never add a block to one context without adding it here.
 *
 * Alias keys (e.g. ProductDetails: ProductDetailsBlock) must match
 * the resolvedName values used in saved Craft.js JSON exactly.
 */

import { RootContainer } from "~/components/blocks/RootContainer";
import { NavbarBlock } from "~/components/blocks/NavbarBlock";
import { HeroBanner } from "~/components/blocks/HeroBanner";
import { AnnouncementBar } from "~/components/blocks/AnnouncementBar";
import { ProductGrid } from "~/components/blocks/ProductGrid";
import { ProductsHeroBlock } from "~/components/blocks/ProductsHeroBlock";
import { NewsletterSignup } from "~/components/blocks/NewsletterSignup";
import { ContactForm, CartSummary, CheckoutForm} from "~/components/blocks/StubBlocks";
import { CategoryBlock } from "~/components/blocks/CategoryBlock";
import { AdBannerBlock } from "~/components/blocks/AdBannerBlock";
import { StoreLocationBlock } from "~/components/blocks/StoreLocationBlock";
import { LocationBlock } from "~/components/blocks/LocationBlock";
import { FooterBlock } from "~/components/blocks/FooterBlock";
import { ProductDetailsBlock } from "~/components/blocks/ProductDetails";
import { CartSummaryBlock } from "~/components/blocks/CartSummaryBlock";
import { CheckoutFormBlock } from "~/components/blocks/CheckoutFormBlock";
import { ProductCatalogBlock } from "../blocks/ProductCatalogBlock ";

export const craftResolver = {
  // System / layout
  RootContainer,
  NavbarBlock,
  FooterBlock,

  // Content blocks
  HeroBanner,
  AnnouncementBar,
  ProductGrid,
  ProductCatalogBlock,
  ProductsHeroBlock,
  NewsletterSignup,
  ContactForm,
  CategoryBlock,
  AdBannerBlock,

  // Location blocks
  StoreLocationBlock,
  LocationBlock,

  // Commerce blocks
  // Keys must match resolvedName in saved JSON exactly
  ProductDetails: ProductDetailsBlock,
  CartSummary: CartSummaryBlock,
  CheckoutForm: CheckoutFormBlock,
} as const;

export type ResolverKey = keyof typeof craftResolver;