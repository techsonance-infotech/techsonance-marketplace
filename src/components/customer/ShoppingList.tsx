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
            <span className="flex gap-8  ">
                <FilterSidebar PRODUCT_LIST={productsState} filterProduct={setProductsState} />
                <ul className={`w-full flex flex-wrap justify-between gap-4 ${styles} items-start`} >

                    {productsState && productsState.slice(firstIndex, lastIndex + 1).map((product, idx) => (
                        <li key={idx} className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer border-2 w-82 border-gray-200 rounded-lg p-4  relative" >
                            <WishListBtn productId={product.id} styles="absolute top-2 right-4" />
                            <Link to={`/shopping/${product.id}`} className="w-full h-full" >
                                <img className="w-full h-80 object-cover rounded-lg my-2" src={product.imgUrl} alt={product.title.trim()} />
                            </Link>
                            <p>{product.title}</p>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                                {product.description}</p>
                            <p>
                                <span className="text-lg flex justify-between font-bold text-gray-900">
                                    <p>
                                        ${product.price}
                                    </p>
                                    <p className="mr-4">
                                        {product.discount > 0 && <span className="text-sm line-through text-gray-500 ml-2">${Math.floor(product.price / (1 - product.discount))}</span>}
                                    </p>
                                    <p>
                                        {product.discount > 0 && <span className="text-sm text-green-500 ml-2">{Math.round(product.discount)}% off</span>}
                                    </p>
                                </span>
                            </p>
                            <span className="flex justify-between  my-2 items-center align-middle">
                                <AddToCart productId={product.id} />
                                <BuyBtn productId={product.id} />
                            </span>
                        </li>
                    ))}
                </ul>

            </span>
            <Pagination count={count} setCount={setCount} totalPages={totalPages} onPageChange={handleScroll} />
        </>
    )
}
