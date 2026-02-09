import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CATEGORY_LIST_TYPE } from "../../utils/customer/constants";
import { useState } from "react";

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
                <h2 className="text-2xl text-center font-bold mt-8 mb-4">Our products</h2>
                <div className="flex items-center gap-2">
                    <button className="h-10 w-10 bg-primary border-2 border-gray-200 rounded-full  p-2 ">
                        <ChevronLeft onClick={() => handlePrev()} />
                    </button>
                    <ul className={`flex flex-wrap justify-between gap-4 ${styles} items-center`}>

                        {products && products.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                            <li key={idx} className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer">
                                <img className="w-68 h-86 object-cover rounded-lg my-2" src={product.url} alt={product.title.trim()} />
                                {product.title.trim()}
                            </li>
                        ))}
                    </ul>
                    <button className="h-10 w-10 bg-primary border-2 border-gray-200 rounded-full  p-2 ">
                        <ChevronRight onClick={() => handleNext()} />
                    </button>
                </div>

            </section>
        </>
    )
}
