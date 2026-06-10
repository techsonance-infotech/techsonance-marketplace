'use client'
import { useImageColors } from "@/hooks/useImageColors";
import Image from "next/image";
import Link from "next/link";

export function BrandHighlight({ getField }: { getField: (k: string) => string }) {
  const img = getField("new_arrivals_left_image_url");
  const { bg: bgColor } = useImageColors(img);
  if (!img) return null;
  return (
    <section className="brand_highlight_desktop  py-20 px-6 lg:px-16 xl:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            style={{ background: bgColor }}
            className="relative h-[420px] rounded-2xl overflow-hidden transition-colors duration-500"
          >
            <Image
              src={img}
              alt="Brand"
              fill
              className="object-contain"
              sizes="50vw"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">
              Our Promise
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-5 leading-tight">
              Precision Engineered for Pure Sound
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Every product on our platform is hand-selected for build quality,
              acoustic performance, and long-term reliability. We partner only
              with brands that share our obsession with detail.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                ["500+", "Products"],
                ["50K+", "Happy Customers"],
                ["4.9★", "Avg. Rating"],
              ].map(([val, lab]) => (
                <div
                  key={lab}
                  className="text-center p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-xl font-black text-gray-900">{val}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">
                    {lab}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/store">
              <button className="bg-gray-900 text-white hover:bg-black transition-colors px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest rounded-xl">
                Shop the Collection
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
