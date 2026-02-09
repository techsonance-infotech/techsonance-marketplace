import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CATEGORY_LIST_TYPE } from "../../utils/customer/constants";
import { useState } from "react";
import { AddToCart } from "./AddToCart";
import BuyBtn from "./BuyBtn";
import WishListBtn from "./WishListBtn";

export function ProductList({ products, styles }: { products?: CATEGORY_LIST_TYPE[], styles?: string }) {
    const count = 3; // Number of products to show at a time
    const [firstIndex, setFirstIndex] = useState(0);
    const [lastIndex, setLastIndex] = useState(count - 1);
    const handlePrev = () => {
        if (firstIndex > 0) {
            setFirstIndex(firstIndex - 1);
            setLastIndex(lastIndex - 1);
            console.log("prev", firstIndex - 1, lastIndex - 1);
        }
    };
    const handleNext = () => {
        if (lastIndex < (products ? products.length - 1 : 0)) {
            setFirstIndex(firstIndex + 1);
            setLastIndex(lastIndex + 1);
            console.log("next", firstIndex + 1, lastIndex + 1);
        }
    };

    return (
        <>
            <section className="xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                <h2 className="text-2xl text-center font-bold mt-8 mb-4">Popular products</h2>
                <div className="flex items-center gap-2">
                    <button className="h-10 w-10 bg-primary border-2 border-gray-200 rounded-full  p-2 ">
                        <ChevronLeft onClick={() => handlePrev()} className={`${firstIndex > 0 ? '' : 'text-gray-300'}`} />
                    </button>
                    <ul className={`flex flex-wrap justify-between gap-4 ${styles} items-center`}>

                        {products && products.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                            <li key={idx} className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer border-2 border-gray-200 rounded-lg p-4 relative" >
                                <WishListBtn productId={product.id} styles="absolute top-2 right-4" />
                                <img className="w-64 h-82 object-cover rounded-lg my-2" src={product.url} alt={product.title.trim()} />
                                <p>{product.title}</p>
                                <p className="text-sm text-gray-500">{product.description}</p>
                                <span className="flex justify-between">
                                    <AddToCart productId={product.id} />
                                    <BuyBtn productId={product.id} />
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button className="h-10 w-10 bg-primary border-2 border-gray-200 focus:border-gray-300 rounded-full  p-2 ">
                        <ChevronRight onClick={() => handleNext()} className={`${lastIndex < (products ? products.length - 1 : 0) ? '' : 'text-gray-300   '}`} />
                    </button>
                </div>

            </section>
        </>
    )
}
