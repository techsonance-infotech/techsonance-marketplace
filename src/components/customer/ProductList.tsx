import { ChevronLeft, ChevronRight, CloudCog } from "lucide-react";
import type { PRODUCT_LIST_TYPE } from "../../utils/customer/constants";
import { useState } from "react";
import { AddToCart } from "./AddToCart";
import BuyBtn from "./BuyBtn";
import WishListBtn from "./WishListBtn";
import { useMediaQuery } from "react-responsive";

export function ProductList({ products, styles }: { products?: PRODUCT_LIST_TYPE[], styles?: string }) {

    const isMobile = useMediaQuery({ maxWidth: 768 },);
    const [count, setCount] = useState(isMobile ? 2 : 4);


    console.log("isMobile", isMobile);


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
            <section className={`w-full mx-auto ${styles} my-6`}>
                <div className="flex items-center justify-between gap-2">
                    {!isMobile && <button className="h-10 w-10 bg-primary border-2 flex items-center  border-gray-200 rounded-full  p-2 ">
                        <ChevronLeft onClick={() => handlePrev()} className={`${firstIndex > 0 ? '' : 'text-gray-300'}`} />
                    </button>}
                    <ul className={`w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mx-auto lg:px-1 px-4  gap-4 justify-between   ${styles} items-center`}>

                        {products && products.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                            <li key={idx} className={" flex flex-col text-lg text-gray-700 hover:text-gray-900 cursor-pointer border-2  border-gray-200 rounded-lg p-2   lg:p-4 justify-between  relative " + (isMobile ? "   " : "w-64 h-136")} >
                                <div className="my-2 flex flex-col gap-2">

                                    <WishListBtn productId={product.id} styles={isMobile ? "absolute top-2 right-4" : "absolute top-8 right-8"} />
                                    <img className={"lg:w-64 lg:h-80 lg:aspect-auto aspect-8/16  h-44 object-cover rounded-lg "} src={product.imgUrl} alt={product.title.trim()} />
                                    <p className="line-clamp-2 lg:text-xl text-sm">{product.title}</p>
                                    <p className='lg:text-2xl text-lg font-bold text-gray-900' >₹{product.price} {product.discount > 0 && <span className='text-sm line-through text-gray-500 ml-2' >₹{Math.floor(product.price / (1 - product.discount))}</span>} {product.discount > 0 && <span className='text-sm text-green-500 ml-2' >{Math.round(product.discount * 100)}% off</span>}</p>
                                </div>

                                <span className="flex flex-wrap  justify-between lg:gap-4 gap-1 items-center ">
                                    <AddToCart productId={product.id} styles={`${isMobile ? "w-full" : ""}`} />
                                    <BuyBtn productId={product.id} styles={`${isMobile ? "w-full" : ""}`} />
                                </span>
                            </li>
                        ))}
                    </ul>
                    {!isMobile && <button className="h-10 w-10 bg-primary border-2   flex items-center        border-gray-200 focus:border-gray-300 rounded-full  p-2 ">
                        <ChevronRight onClick={() => handleNext()} className={` ${lastIndex < (products ? products.length - 1 : 0) ? '' : 'text-gray-300   '}`} />
                    </button>}
                </div>

            </section>
        </>
    )
}
