import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useAnimate, } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import type { PRODUCT_LIST_TYPE } from "../../utils/customer/constants";
import { AddToCart } from "./AddToCart";
import BuyBtn from "./BuyBtn";
import WishListBtn from "./WishListBtn";

export function ProductList({ products = [], styles }: { products?: PRODUCT_LIST_TYPE[], styles?: string }) {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
    const [scope, animate] = useAnimate()

    const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4;

    const [currentIndex, setCurrentIndex] = useState(0);



    const maxIndex = Math.max(0, products.length - itemsPerPage);
    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < maxIndex;

    const scrollTo = (index: number) => {
        let newIndex = index;
        if (index < 0) newIndex = 0;
        if (index > maxIndex) newIndex = maxIndex;

        setCurrentIndex(newIndex);
    };

    // Update animation whenever index changes
    useEffect(() => {

        animate(scope.current, {
            x: `-${currentIndex * (100 / itemsPerPage)}%`,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        })
    }, [currentIndex, itemsPerPage, scope]);

    if (!products || products.length === 0) return null;

    return (
        <section className={`w-full mx-auto relative group ${styles} my-8`}>


            <div className="flex items-center justify-end gap-2 mb-4 px-4">
                <button
                    disabled={!canScrollPrev}
                    onClick={() => scrollTo(currentIndex - 1)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all
                        ${canScrollPrev
                            ? 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 shadow-sm'
                            : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    disabled={!canScrollNext}
                    onClick={() => scrollTo(currentIndex + 1)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all
                        ${canScrollNext
                            ? 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 shadow-sm'
                            : 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Carousel Viewport */}
            <div className="overflow-hidden w-full px-4 py-4">
                <motion.div
                    ref={scope}
                    className="flex gap-4"

                    drag="x"
                    dragConstraints={{
                        right: 0,
                        left: -((products.length - itemsPerPage) * (isMobile ? 300 : 280)) // Approximate width for drag limits
                    }}
                    style={{
                        width: `${(products.length / itemsPerPage) * 100}%`,
                        cursor: "grab"
                    }}
                    whileTap={{ cursor: "grabbing" }}
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="relative flex-shrink-0"
                            style={{
                                width: `calc(${100 / products.length}% - 16px)`, // 16px accounts for gap
                            }}
                        >
                            <ProductCard product={product} isMobile={isMobile} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// Extracted Sub-Component for cleanliness
function ProductCard({ product, isMobile }: { product: PRODUCT_LIST_TYPE, isMobile: boolean }) {
    return (
        <div className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-4 transition-all hover:shadow-lg hover:border-blue-200 group">
            {/* Image Area */}
            <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-50">
                <WishListBtn productId={product.id} styles="absolute top-3 right-5 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm" />
                <img
                    className="w-full aspect-[4/5] object-cover transform group-hover:scale-105 transition-transform duration-500"
                    src={product.imgUrl}
                    alt={product.title}
                />
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1" title={product.title}>
                        {product.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                        {product.discount > 0 && (
                            <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
                                {Math.round(product.discount)}% OFF
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    <AddToCart productId={product.id} styles="flex-1" />
                    <BuyBtn productId={product.id} styles="flex-1" />
                </div>
            </div>
        </div>
    );
}