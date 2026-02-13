import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PRODUCT_LIST_TYPE } from "../../utils/customer/constants";
import { useState } from "react";
import { AddToCart } from "./AddToCart";
import BuyBtn from "./BuyBtn";
import WishListBtn from "./WishListBtn";

export function ProductList({ products, styles }: { products?: PRODUCT_LIST_TYPE[], styles?: string }) {
    const count = 4; // Number of products to show at a time
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
            <section className={`w-full mx-auto ${styles}`}>
                <div className="flex items-center justify-between gap-2">
                    <button className="h-10 w-10 bg-primary border-2 flex items-center  border-gray-200 rounded-full  p-2 ">
                        <ChevronLeft onClick={() => handlePrev()} className={`${firstIndex > 0 ? '' : 'text-gray-300'}`} />
                    </button>
                    <ul className={`w-full flex mx-auto  gap-4 justify-between   ${styles} items-center`}>

                        {products && products.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                            <li key={idx} className=" flex flex-col text-lg text-gray-700 hover:text-gray-900 cursor-pointer border-2 w-74 h-136 border-gray-200 rounded-lg p-4 justify-between  relative" >
                                <div className="my-2 flex flex-col gap-2">

                                    <WishListBtn productId={product.id} styles="absolute top-4 right-8" />
                                    <img className="w-64 h-80 object-cover rounded-lg my-2" src={product.imgUrl} alt={product.title.trim()} />
                                    <p>{product.title}</p>
                                    <p className='text-2xl font-bold text-gray-900' >₹{product.price} {product.discount > 0 && <span className='text-sm line-through text-gray-500 ml-2' >₹{Math.floor(product.price / (1 - product.discount))}</span>} {product.discount > 0 && <span className='text-sm text-green-500 ml-2' >{Math.round(product.discount * 100)}% off</span>}</p>
                                </div>

                                <span className="flex justify-between gap-4 items-center ">
                                    <AddToCart productId={product.id} />
                                    <BuyBtn productId={product.id} />
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button className="h-10 w-10 bg-primary border-2   flex items-center        border-gray-200 focus:border-gray-300 rounded-full  p-2 ">
                        <ChevronRight onClick={() => handleNext()} className={` ${lastIndex < (products ? products.length - 1 : 0) ? '' : 'text-gray-300   '}`} />
                    </button>
                </div>

            </section>
        </>
    )
}
