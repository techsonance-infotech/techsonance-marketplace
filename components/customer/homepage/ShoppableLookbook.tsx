"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, ShoppingCart } from "lucide-react";
import { AddToCart } from "@/components/customer/AddToCart";
import { Skeleton } from "../../ui/skeleton";

export interface LookbookHotspot {
  id: string | number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  product_id?: string;
  variant_id?: string; // Must match productVariantId for AddToCart
  name?: string;
  price?: string | number;
  image_url?: string;
  description?: string;
}

export interface ShoppableLookbookProps {
  title?: string;
  subtitle?: string;
  image_url?: string;
  hotspots?: LookbookHotspot[];
}

import { LOOKBOOK_DEFAULTS, LOOKBOOK_DEFAULT_HOTSPOTS } from "@/constants/storefront";

export function ShoppableLookbook({
  title,
  subtitle,
  image_url,
  hotspots,
}: ShoppableLookbookProps) {
  const displayTitle = title ?? LOOKBOOK_DEFAULTS.title;
  const displaySubtitle = subtitle ?? LOOKBOOK_DEFAULTS.subtitle;
  const currentHotspots = hotspots !== undefined && hotspots !== null ? hotspots : LOOKBOOK_DEFAULT_HOTSPOTS;

  const [activeHotspot, setActiveHotspot] = useState<LookbookHotspot | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActiveHotspot(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <section
      className="py-16 px-6 lg:px-16 xl:px-24 bg-white"
      ref={containerRef}
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold tracking-[0.25em] text-purple-600 uppercase">
            Curated Inspiration
          </span>
          <h2 className="text-3xl font-serif tracking-tight text-gray-900 mt-2 mb-3">
            {displayTitle}
          </h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{displaySubtitle}</p>
        </div>

        {/* Interactive Image Container */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
          {image_url ? (
            <Image
              src={image_url}
              alt={displayTitle}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <Skeleton className="w-full h-full p-4 lg:p-8 rounded-4xl" />
          )}

          {/* Render Hotspots */}
          {currentHotspots.map((spot) => {
            const isActive = activeHotspot?.id === spot.id;

            return (
              <div
                key={spot.id}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                {/* Pulse Glow Effect */}
                <span className="absolute -inset-2.5 rounded-full bg-white/30 animate-ping" />

                {/* Hotspot Toggle Button */}
                <button
                  onClick={() => setActiveHotspot(isActive ? null : spot)}
                  className={`relative w-8 h-8 rounded-full border border-white/20 shadow-lg flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-purple-600 text-white scale-110 rotate-45"
                      : "bg-black/60 text-white hover:bg-black/85"
                  }`}
                  aria-label={`View product details for ${spot.name}`}
                >
                  <Plus
                    size={16}
                    className="transition-transform duration-300"
                  />
                </button>

                {/* Popover Card */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute bottom-11 -left-[110px] sm:-left-32 w-56 sm:w-64 bg-white/90 backdrop-blur-xl border border-white/25 rounded-2xl shadow-2xl p-3.5 z-20 flex flex-col gap-3.5`}
                      style={{ originY: 1 }}
                    >
                      {/* Popover Arrow pointing down */}
                      <div className="absolute -bottom-1.5 left-[118px] sm:left-34 w-3.5 h-3.5 bg-white border-r border-b border-white/25 rotate-45" />

                      <div className="flex gap-3">
                        {/* Thumbnail */}
                        {spot.image_url && (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                            <Image
                              src={spot.image_url}
                              alt={spot.name || "Product"}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 truncate mb-0.5">
                            {spot.name || "Premium Item"}
                          </h4>
                          {spot.price && (
                            <p className="text-[13px] font-black text-purple-700">
                              ₹{Number(spot.price).toLocaleString("en-IN")}
                            </p>
                          )}
                          {spot.description && (
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-normal">
                              {spot.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Add To Cart block */}
                      {spot.variant_id ? (
                        <div className="w-full">
                          <AddToCart
                            productVariantId={spot.variant_id}
                            styles="w-full h-9 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                          />
                        </div>
                      ) : (
                        <button className="w-full h-9 bg-slate-900 text-white hover:bg-black text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                          <ShoppingCart size={13} />
                          <span>Out of Stock</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
