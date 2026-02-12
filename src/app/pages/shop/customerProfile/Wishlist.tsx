import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { X } from "lucide-react";
import { PRODUCT_LIST } from "../../../../utils/customer/constants";
import { AddToCart } from "../../../../components/customer/AddToCart";
import { removeFromWishlist } from "../../../../features/Wishlist";

export function WishList() {

    const { wishItems } = useSelector((state: RootState) => state.wishlist);
    const wishlistItems = Array.isArray(wishItems) ? PRODUCT_LIST.filter(item => wishItems.some((wishItem: any) => wishItem.productId === item.id)) : [];


    const isEmpty = Array.isArray(wishItems) ? wishItems.length === 0 : [];
    const dispatch = useDispatch();
    console.log(wishItems)
    return (
        <>
            <section className="w-full mb-[20vh]">
                <h1 className="text-2xl font-bold">
                    WishList
                </h1>
                <div>
                    {/* Wishlist items will be displayed here */}
                    {
                        isEmpty ? (
                            <p className="text-gray-500 my-2">Your wishlist is empty.</p>
                        ) : (
                            <ul className="my-6">
                                {wishlistItems.map((item, idx) => (
                                    <li key={idx} className="flex justify-start  px-6 py-4 my-4 gap-6 border-2 border-gray-200 rounded-2xl  ">
                                        <button onClick={() => dispatch(removeFromWishlist(item.id))} className="text-gray-500 hover:text-gray-700   flex items-center justify-center ">
                                            <X />
                                        </button>
                                        <div>
                                            <img src={item?.imgUrl} alt={item?.title} className="w-54 aspect-square object-cover rounded-2xl" />
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">

                                            <p className="font-semibold text-xl ">{item?.title}</p>

                                            <p className="text-lg font-medium">₹ {item?.price}</p>

                                        </div>
                                        <div className="w-full flex justify-end   align-middle items-center">
                                            <AddToCart productId={item.id} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )

                    }
                </div>
            </section>

        </>
    )
}
