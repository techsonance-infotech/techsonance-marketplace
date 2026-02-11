import { useState } from "react";
import type { PRODUCT_LIST_TYPE } from "../../utils/customer/constants";
import { AddToCart } from "./AddToCart";
import BuyBtn from "./BuyBtn";
import WishListBtn from "./WishListBtn";
import { Pagination } from "../common/Pagination";
import { Link } from "react-router";
import { FilterSidebar } from "./FilterSidebar";


export function ShoppingList({
    products, styles
}: {
    products: PRODUCT_LIST_TYPE[];
    styles?: string;
}) {
    const pageSize = 8; // Number of products to show at a time
    const [productsState, setProductsState] = useState<PRODUCT_LIST_TYPE[]>(products)
    const [count, setCount] = useState(1); // Number of products to show at a time
    const totalPages = Math.ceil(productsState.length / pageSize);
    const firstIndex = (count - 1) * pageSize;
    const lastIndex = firstIndex + pageSize - 1;
    const handleScroll = () => {
        window.scrollTo(
            {
                top: 0,
                behavior: 'smooth'
            }
        )
    }

    return (
        <>
            <span className="flex gap-8   mb-8">
                <FilterSidebar PRODUCT_LIST={productsState} filterProduct={setProductsState} />
                {/* Container: Grid with responsive columns */}
                <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    {productsState && productsState.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                        <li
                            key={idx}
                            className="flex flex-col justify-between text-lg text-gray-700 hover:text-gray-900 cursor-pointer border-2 border-gray-200 rounded-lg p-4 relative h-full transition-shadow hover:shadow-md"
                        >
                            {/* Top Section */}
                            <div className="flex flex-col h-full">
                                <WishListBtn productId={product.id} styles="absolute top-2 right-6 z-10" />

                                <Link to={`/shopping/${product.id}`} className="block overflow-hidden rounded-lg">
                                    <img
                                        className="w-full object-cover aspect-square rounded-lg mb-4 transform hover:scale-105 transition-transform duration-300"
                                        src={product.imgUrl}
                                        alt={product.title.trim()}
                                    />
                                </Link>

                                <h3 className="font-semibold text-base line-clamp-1 mb-1">{product.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                                    {product.description}
                                </p>
                            </div>

                            {/* Bottom Section (Pricing & Buttons) */}
                            <div className="mt-auto">
                                <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                                    <span className="font-bold text-gray-900 text-xl">₹{product.price}</span>
                                    {product.discount > 0 && (
                                        <>
                                            <span className="text-xs line-through text-gray-400">
                                                ₹{Math.floor(product.price / (1 - product.discount / 100))}
                                            </span>
                                            <span className="text-xs font-bold text-green-500">
                                                {Math.round(product.discount)}% off
                                            </span>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-2 justify-between items-center">
                                    <div className="">
                                        <AddToCart productId={product.id} styles="w-full" />
                                    </div>
                                    <div className="">
                                        <BuyBtn productId={product.id} styles="flex-1" />
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

            </span>
            <div className="flex justify-end">

                <Pagination count={count} setCount={setCount} totalPages={totalPages} onPageChange={handleScroll} />
            </div>
        </>
    )
}
