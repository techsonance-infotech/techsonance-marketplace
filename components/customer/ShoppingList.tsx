'use client';
/**
 * ShoppingList.tsx — Phase 1 + 3
 *
 * Changes from original:
 * 1. URL-driven state: search/sort/filter/page are read from and written to URL
 *    search params via useRouter + useSearchParams. No more closed-over local
 *    state that silently diverges from the URL.
 * 2. Single useEffect triggers the data fetch whenever URL params change, so
 *    the back button, shared links, and page refresh all restore exact state.
 * 3. Framer Motion <LayoutGroup> + layout="position" on the grid wrapper
 *    prevents jarring shifts when the sidebar appears/disappears.
 * 4. fetchProducts is called directly from the effect, not via useCallback
 *    with a stale-closure dependency array — fixes the bug where re-renders
 *    didn't trigger a new fetch after filter changes.
 */

import { useReducer, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ChevronDown, PackageSearch } from 'lucide-react';

import { AddToCart } from './AddToCart';
import { BuyBtn } from './BuyBtn';
import { WishListBtn } from './WishListBtn';
import { useStoreFrontCmsData } from '@/hooks/useStoreFrontCmsData';
import { Pagination } from '../common/Pagination';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { ProductSkeleton } from '../common/ProductSkeleton';
import { SearchBar } from './SearchBar';
import { BuyBtnMode, Product, Category } from '@/utils/Types';
import { formatCurrency } from '@/lib/utils';
import { fetchProductVendorProducts, SortBy } from '@/utils/commonAPiClient';

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;

export const SORT_OPTIONS: { label: string; value: SortBy }[] = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'discount' },
];

const DEFAULT_FILTERS: FilterState = {
    minPrice: 0,
    maxPrice: 50000,
    selectedCategories: [],
};

// ─── State ────────────────────────────────────────────────────────────────────

interface State {
    products: Product[];
    categories: Category[];
    isLoading: boolean;
    totalPages: number;
    total: number;
    isSortOpen: boolean;
}

enum ActionType {
    SET_PRODUCTS_DATA = 'SET_PRODUCTS_DATA',
    SET_LOADING = 'SET_LOADING',
    SET_SORT_OPEN = 'SET_SORT_OPEN',
}

type Action =
    | {
          type: ActionType.SET_PRODUCTS_DATA;
          payload: { products: Product[]; total: number; totalPages: number; categories: Category[] };
      }
    | { type: ActionType.SET_LOADING; payload: boolean }
    | { type: ActionType.SET_SORT_OPEN; payload: boolean };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SET_PRODUCTS_DATA:
            return {
                ...state,
                products: action.payload.products,
                total: action.payload.total,
                totalPages: action.payload.totalPages,
                categories: action.payload.categories,
            };
        case ActionType.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ActionType.SET_SORT_OPEN:
            return { ...state, isSortOpen: action.payload };
        default:
            return state;
    }
}

// ─── URL helpers ──────────────────────────────────────────────────────────────
// These build a new URLSearchParams from the current ones plus a delta,
// so callers only need to pass what changed.

function buildParams(
    current: URLSearchParams,
    delta: Record<string, string | number | undefined | null>,
): URLSearchParams {
    const next = new URLSearchParams(current.toString());
    Object.entries(delta).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') {
            next.delete(k);
        } else {
            next.set(k, String(v));
        }
    });
    return next;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ShoppingListProps {
    styles?: string;
}

export function ShoppingList({ styles }: ShoppingListProps) {
    useStoreFrontCmsData(); // keeps CMS subscription alive

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // ── Derive all "controlled" state directly from URL ───────────────────────
    const search = searchParams.get('search') ?? '';
    const categoryId = searchParams.get('category_id') ?? '';
    const minPrice = Number(searchParams.get('min_price') ?? 0);
    const maxPrice = Number(searchParams.get('max_price') ?? 50000);
    const sortBy = (searchParams.get('sort_by') as SortBy) ?? 'newest';
    const page = Number(searchParams.get('page') ?? 1);

    const filters: FilterState = {
        minPrice,
        maxPrice,
        selectedCategories: categoryId ? [categoryId] : [],
    };

    // ── Local UI-only state ───────────────────────────────────────────────────
    const [state, dispatch] = useReducer(reducer, {
        products: [],
        categories: [],
        isLoading: true,
        totalPages: 1,
        total: 0,
        isSortOpen: false,
    });

    const sortRef = useRef<HTMLDivElement>(null);

    // Close sort dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                dispatch({ type: ActionType.SET_SORT_OPEN, payload: false });
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Single source-of-truth fetch: fires whenever URL params change ────────
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            dispatch({ type: ActionType.SET_LOADING, payload: true });
            try {
                const response = await fetchProductVendorProducts({
                    search: search.replace('...','') || undefined,
                    category_id: categoryId || undefined,
                    min_price: minPrice > 0 ? minPrice : undefined,
                    max_price: maxPrice < 50000 ? maxPrice : undefined,
                    sort_by: sortBy,
                    offset: (page - 1) * PAGE_SIZE,
                    limit: PAGE_SIZE,
                });

                if (cancelled) return;

                // Accumulate categories seen across pages for the sidebar
                const seen = new Map<string, Category>();
                (response.data ?? []).forEach((p: Product) => {
                    if (p.category && !seen.has(p.category.id)) seen.set(p.category.id, p.category);
                });
                const merged = new Map<string, Category>(state.categories.map((c) => [c.id, c]));
                seen.forEach((v, k) => merged.set(k, v));

                dispatch({
                    type: ActionType.SET_PRODUCTS_DATA,
                    payload: {
                        products: response.data ?? [],
                        total: response.total ?? 0,
                        totalPages: response.totalPages ?? 1,
                        categories: Array.from(merged.values()),
                    },
                });
            } catch (e) {
                console.error('Failed to fetch products', e);
                if (!cancelled) {
                    dispatch({
                        type: ActionType.SET_PRODUCTS_DATA,
                        payload: { products: [], total: 0, totalPages: 1, categories: state.categories },
                    });
                }
            } finally {
                if (!cancelled) dispatch({ type: ActionType.SET_LOADING, payload: false });
            }
        };

        fetchProducts();
        return () => {
            cancelled = true;
        };
        // searchParams.toString() as the dep: re-runs whenever ANY param changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    // ── URL-updating handlers ─────────────────────────────────────────────────

    const pushParams = (delta: Record<string, string | number | undefined | null>) => {
        const next = buildParams(searchParams, delta);
        router.push(`${pathname}?${next.toString()}`, { scroll: false });
    };

    const handleSearch = (value: string) => {
        pushParams({ search: value || null, page: 1 });
    };

    const handleSortChange = (value: SortBy) => {
        pushParams({ sort_by: value, page: 1 });
        dispatch({ type: ActionType.SET_SORT_OPEN, payload: false });
    };

    const handleFiltersChange = (newFilters: FilterState) => {
        pushParams({
            category_id: newFilters.selectedCategories[0] ?? null,
            min_price: newFilters.minPrice > 0 ? newFilters.minPrice : null,
            max_price: newFilters.maxPrice < 50000 ? newFilters.maxPrice : null,
            page: 1,
        });
    };

    const handlePageChange = (p: number) => {
        pushParams({ page: p });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Adapter so Pagination's (count, setCount) API works with URL state
    const setPageAdapter = (p: number | ((prev: number) => number)) => {
        handlePageChange(typeof p === 'function' ? p(page) : p);
    };

    const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Newest';

    return (
        <motion.section
            className={`w-full ${styles ?? ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <LayoutGroup>
                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <FilterSidebar
                        categories={state.categories}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        totalResults={state.total}
                    />

                    <motion.div layout="position" className="flex-1 min-w-0">
                        {/* Header Area */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            {/* Mobile count */}
                            <div className="lg:hidden w-full flex justify-between items-center">
                                <p className="text-sm text-gray-500 mt-1">Showing {state.total} items</p>
                            </div>

                            {/* Desktop search + sort */}
                            <div className="hidden lg:flex w-full items-center justify-between">
                                <div className="text-sm text-gray-500 font-medium">
                                    Showing {state.total} products
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-72">
                                        <SearchBar
                                            value={search}
                                            onChange={(val) => pushParams({ search: val || null, page: 1 })}
                                            onSearch={handleSearch}
                                            placeholder="Search brands, styles..."
                                        />
                                    </div>
                                    <div ref={sortRef} className="relative">
                                        <button
                                            onClick={() =>
                                                dispatch({ type: ActionType.SET_SORT_OPEN, payload: !state.isSortOpen })
                                            }
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-700 bg-white hover:border-gray-300 transition-colors"
                                        >
                                            Sort by: {currentSortLabel}
                                            <ChevronDown
                                                size={16}
                                                className={`text-gray-400 transition-transform ${state.isSortOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {state.isSortOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1"
                                                >
                                                    {SORT_OPTIONS.map((opt) => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => handleSortChange(opt.value)}
                                                            className={`w-full text-left px-4 py-2.5 text-sm ${
                                                                sortBy === opt.value
                                                                    ? 'bg-gray-50 font-semibold text-black'
                                                                    : 'text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <AnimatePresence mode="wait">
                            {state.isLoading ? (
                                <motion.ul
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                >
                                    {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                        <ProductSkeleton key={i} />
                                    ))}
                                </motion.ul>
                            ) : state.products.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4"
                                >
                                    <PackageSearch size={48} strokeWidth={1} className="opacity-40" />
                                    <div className="text-center">
                                        <p className="text-base font-medium text-gray-600">No products found</p>
                                        {search && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                Try a different keyword or clear the filter
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.ul
                                    key={`products-${page}-${search}-${sortBy}-${categoryId}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                >
                                    {state.products.map((product, idx) => (
                                        <ProductCard key={product.id} product={product} idx={idx} />
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>

                        {!state.isLoading && state.totalPages > 1 && (
                            <Pagination
                                count={page}
                                setCount={setPageAdapter}
                                totalPages={state.totalPages}
                                onPageChange={() => {}}
                            />
                        )}
                    </motion.div>
                </div>
            </LayoutGroup>
        </motion.section>
    );
}

// ─── ProductCard (unchanged visual, typed) ────────────────────────────────────

export function ProductCard({ product, idx }: { product: Product; idx: number }) {
    const primaryImage =
        product.variants?.[0]?.images?.[0]?.image_url ?? 'https://placehold.net/400x500.png';
    const variantId = product.variants?.[0]?.id ?? '';

    return (
        <motion.li
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.25 }}
            className="group flex flex-col cursor-pointer bg-white border border-gray-100
           rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-300
           relative h-full group"
        >
            <div className="relative aspect-square md:aspect-[4/5] bg-[#F8F9FA] overflow-hidden">
                <WishListBtn
                    productVariantId={variantId}
                    styles="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center rounded-full text-gray-600 hover:text-red-500 transition-colors"
                />
                <Link href={`/store/${product.id}`} className="block w-full h-full p-4">
                    <img
                        loading="lazy"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        src={primaryImage}
                        alt={product.name?.trim()}
                    />
                </Link>
            </div>

            <div className="p-4 flex flex-col flex-grow bg-white">
                <div className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                    {product.category?.name ?? 'Category'}
                </div>
                <Link href={`/store/${product.id}`} className="block">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-[15px] leading-tight mb-3 line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="font-bold text-gray-900 text-lg">
                                ₹{formatCurrency(Number(product.base_price))}
                            </span>
                            {Number(product.discount_percent) > 0 && (
                                <span className="text-xs line-through text-gray-400 ml-1.5 font-medium">
                                    ₹
                                    {formatCurrency(
                                        Math.floor(
                                            Number(product.base_price) /
                                                (1 - Number(product.discount_percent) / 100),
                                        ),
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    {variantId && (
                        <div className="hidden lg:flex xl:flex mt-3 pt-3 justify-between items-center border-t border-gray-100 gap-2.5 w-full">
                            <AddToCart
                                productVariantId={variantId}
                                productVariant={product.variants?.[0]}
                                styles="w-full h-10 rounded-full bg-theme-primary border border-gray-200 hover:bg-theme-secondary text-theme-primary-foreground transition-colors cursor-pointer"
                            />
                            <BuyBtn
                                id={variantId}
                                mode={BuyBtnMode.QUICK_BUY}
                                styles="w-full h-10 bg-black border border-gray-200 hover:bg-black/90 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                                iconStyles="text-white"
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.li>
    );
}