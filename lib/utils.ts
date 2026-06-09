import {
  AppliedPromotion,
  BundleDealConfig,
  BuyXGetYConfig,
  DiscountConfig,
  FixedAmountConfig,
  FreeShippingConfig,
  PercentageConfig,
  PromotionRuleType,
  PromotionType,
  TieredDiscountConfig,
} from "@/utils/Types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const styles = {
  // ── Button ──────────────────────────────────────────────────────────────
  // Compose: cn(styles.btn.base, styles.btn.primary, styles.btn.md)

  btn: {
    base: "inline-flex items-center justify-center gap-2 font-semibold rounded-full cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",

    // Intent variants — use concrete colors, no theme tokens
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 focus-visible:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400",
    ghost:
      "bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-300",
    dark: "bg-gray-900 text-white hover:bg-black focus-visible:ring-gray-700",

    // Size variants
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-[15px]",
    icon: "h-10 w-10 p-0",
  },

  // ── Product card ─────────────────────────────────────────────────────────

  productCard:
    "group flex flex-col cursor-pointer bg-white border border-gray-100 rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300 relative h-full",

  productCardImageWrap:
    "relative aspect-square md:aspect-[4/5] bg-[#F8F9FA] overflow-hidden",

  // ── Search inputs ─────────────────────────────────────────────────────────

  /** Base — always applied */
  searchInput:
    "w-full pl-10 pr-10 py-2.5 rounded-full text-sm font-medium border border-transparent transition-all duration-200 outline-none",

  /** Apply alongside searchInput when the field is focused */
  searchInputFocused: "bg-white border-blue-500 ring-2 ring-blue-100",

  /** Apply alongside searchInput when the field is idle */
  searchInputIdle: "bg-gray-100 hover:bg-gray-200",

  // ── Sort trigger ──────────────────────────────────────────────────────────

  sortTrigger:
    "flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 bg-white hover:border-gray-300 transition-colors",

  // ── Suggestion pill (search page idle state) ──────────────────────────────

  suggestionPill:
    "px-4 py-2 rounded-full text-sm font-medium bg-gray-50 border border-gray-100 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5",

  // ── Filter sidebar placeholder rows ───────────────────────────────────────

  filterPlaceholder:
    "h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center px-3 text-sm text-gray-400",

  // ── Overlay / command palette ─────────────────────────────────────────────

  overlayPalette:
    "bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden",

  overlaySuggestionRow:
    "w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group",

  // ── Inline SearchBar (ShoppingList) ───────────────────────────────────────

  searchBarContainer:
    "flex items-center gap-2 border-2 rounded-xl px-4 py-2.5 bg-white transition-all duration-200",

  searchBarFocused: "border-blue-500 shadow-sm",

  searchBarIdle: "border-gray-200 hover:border-gray-300",

  // ── Pagination ────────────────────────────────────────────────────────────

  paginationBtn:
    "flex items-center justify-center h-9 min-w-[36px] px-3 rounded-lg text-sm font-medium transition-colors duration-150",

  paginationBtnActive: "bg-gray-900 text-white",

  paginationBtnInactive: "text-gray-600 hover:bg-gray-100",
} as const;

// ─── Compound helpers (optional shortcuts) ────────────────────────────────────
// These combine the base + a default variant so call-sites need only one import.

export const productCard = () => styles.productCard;
export const productCardImage = () => styles.productCardImageWrap;
export const suggestionPill = () => styles.suggestionPill;
export const filterPlaceholder = () => styles.filterPlaceholder;
export const sortTrigger = () => styles.sortTrigger;

/** Full search input — pass `focused` boolean */
export const searchInput = (focused: boolean) =>
  cn(
    styles.searchInput,
    focused ? styles.searchInputFocused : styles.searchInputIdle,
  );

/** Inline search bar container — pass `focused` boolean */
export const searchBarContainer = (focused: boolean) =>
  cn(
    styles.searchBarContainer,
    focused ? styles.searchBarFocused : styles.searchBarIdle,
  );

/** Pagination button — pass `active` boolean */
export const paginationBtn = (active: boolean) =>
  cn(
    styles.paginationBtn,
    active ? styles.paginationBtnActive : styles.paginationBtnInactive,
  );

/** Button — pass intent and size */
export const btn = (
  intent: keyof Pick<
    typeof styles.btn,
    "primary" | "secondary" | "danger" | "ghost" | "dark"
  > = "primary",
  size: keyof Pick<typeof styles.btn, "sm" | "md" | "lg" | "icon"> = "md",
) => cn(styles.btn.base, styles.btn[intent], styles.btn[size]);

export function formatCurrency(amount: number, locale = "en-IN"): string {
  if (typeof amount === "string" || !amount) {
    return String(amount);
  }
  if (isNaN(amount)) {
    console.warn(`Invalid amount provided to formatCurrency: ${amount}`);
    return amount.toString();
  }
  return amount.toLocaleString(locale);
}

export function formatNumber(value: number, locale = "en-IN"): string {
  if (isNaN(value)) {
    console.warn(`Invalid value provided to formatNumber: ${value}`);
    return value.toString();
  }
  return value.toLocaleString(locale);
}

export const formatStructure = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString();

export const isImageUrl = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);

export const isPdfUrl = (url: string) => /\.pdf(\?.*)?$/i.test(url);
// Helper — put this near calculateCouponDiscount
export function getMinOrderAmount(coupon: AppliedPromotion): number | null {
  const minRule = coupon.rule?.find(
    (r) => r.rule_type === PromotionRuleType.MIN_CART_VALUE,
  );
  if (!minRule) return null;
  const cfg = minRule.rule_config as { amount?: number; value?: number };
  return cfg?.amount ?? cfg?.value ?? null;
}

export function calculateCouponDiscount(
  coupon: AppliedPromotion | null,
  subtotal: number,
): number {
  if (!coupon) return 0;

  const config = coupon.discount_config;
  if (!config) return 0;
  // ── Helper: is it a PercentageOffConfig? ─────────────────────────────
  // All config shapes have different required keys — use them as discriminants.
  const isPercentage = (c: DiscountConfig): c is PercentageConfig =>
    "value" in c &&
    !("buy_qty" in c) &&
    !("tiers" in c) &&
    !("product_variant_ids" in c);

  const isFixed = (c: DiscountConfig): c is FixedAmountConfig =>
    "value" in c &&
    !("buy_qty" in c) &&
    !("tiers" in c) &&
    !("product_variant_ids" in c);

  const isBuyXGetY = (c: DiscountConfig): c is BuyXGetYConfig =>
    "buy_qty" in c && "get_qty" in c;

  const isTiered = (c: DiscountConfig): c is TieredDiscountConfig =>
    "tiers" in c;

  const isBundle = (c: DiscountConfig): c is BundleDealConfig =>
    "product_variant_ids" in c && "bundle_price" in c;

  const isFreeShipping = (c: DiscountConfig): c is FreeShippingConfig =>
    !("value" in c) &&
    !("buy_qty" in c) &&
    !("tiers" in c) &&
    !("product_variant_ids" in c);

  // ── Route by discount_type (source of truth) ──────────────────────────
  const type = (coupon.discount_type ?? "").toLowerCase();

  switch (type) {
    case PromotionType.PERCENTAGE: {
      if (!isPercentage(config)) return 0;
      const raw = Math.floor((subtotal * config.value) / 100);
      return config.cap != null && config.cap > 0
        ? Math.min(raw, config.cap)
        : raw;
    }

    case PromotionType.FIXED_AMOUNT: {
      if (!isFixed(config)) return 0;
      // Can't discount more than the cart itself
      return Math.min(config.value, subtotal);
    }

    case PromotionType.BUY_X_GET_Y: {
      if (!isBuyXGetY(config)) return 0;
      // Discount = price of "get" items × get_discount_percent/100
      // We don't have per-item prices here, so we return 0 and let
      // the server apply the line-item discount. Flag it clearly:
      return 0; // applied server-side per line item
    }

    case PromotionType.FREE_SHIPPING: {
      // Shipping discount is handled separately in the delivery variable.
      // Return 0 here so it doesn't double-count.
      return 0;
    }

    case PromotionType.TIERED_DISCOUNT: {
      if (!isTiered(config)) return 0;
      // Find the highest tier the subtotal qualifies for
      const activeTier = [...config.tiers]
        .sort((a, b) => b.min_cart - a.min_cart)
        .find((tier) => subtotal >= tier.min_cart);
      if (!activeTier) return 0;
      return Math.floor((subtotal * activeTier.percent) / 100);
    }

    case PromotionType.BUNDLE_DEAL: {
      if (!isBundle(config)) return 0;
      // Discount = difference between full subtotal and the fixed bundle price
      return Math.max(0, subtotal - config.bundle_price);
    }

    default:
      return 0;
  }
}
