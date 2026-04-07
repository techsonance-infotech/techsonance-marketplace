'use client';
import { ShoppingCart, Plus, Minus } from "lucide-react";
import type { RootState } from "@/lib/store";
import { addToCart, removeFromCart } from "@/lib/features/Cart";
import { toggleCartSidebar } from "@/lib/features/CartSidebar";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { companyDomain } from "@/config";
import { fetchAddToCart, fetchRemoveFromCart } from "@/utils/customerApiClient";

interface AddToCartProps {
    productVariantId: string;
    styles?: string;

}
export interface CartItemResponse {
    cart_id: string;
    cart_item_id: string;
    quantity: number;
    product_variant_id: string;
}


export function AddToCart({ productVariantId, styles }: AddToCartProps) {
    const dispatch = useAppDispatch();
    const { items } = useAppSelector((state: RootState) => state.cart);
    const { user } = useAppSelector((state: RootState) => state.auth);
    const path = usePathname();
    const router = useRouter();
    const cartItem = items?.find(item => item.productVariantId === productVariantId);
    console.log("cartItem", cartItem)
    const quantity = cartItem ? cartItem.quantity : 0;

    const isSmall = styles?.includes("small");

    const containerBase = `flex items-center justify-center bg-brand-primary text-white rounded-lg shadow-md overflow-hidden transition-all duration-200`;
    const heightClass = isSmall ? "h-6" : "h-11";
    const debounceFunction = ({ func, delay = 300 }: { func: () => void, delay: number }) => {
        let timeoutId: any;
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func();
            }, delay);
        };
    }

    console.log("productVariantId  ", productVariantId)
    const handleIncrement = async () => {
        if (!user) {
            router.push('/auth/customerLogin');
            return;
        }

        const response = await fetchAddToCart(productVariantId, quantity, user?.id, companyDomain);
        console.log("add to cart response", response)

        const cartResponse: CartItemResponse = response.data;
        dispatch(addToCart({ cartId: cartResponse.cart_id, cartItemId: cartResponse.cart_item_id, productVariantId: cartResponse.product_variant_id, userId: user.id, quantity: cartResponse.quantity }));
        if (!path.includes("cart") && !path.includes("wishlist")) {
            debounceFunction({ func: () => dispatch(toggleCartSidebar('open')), delay: 300 })();
        }
    };

    const handleDecrement = async () => {

        const response = await fetchRemoveFromCart(user?.id, cartItem?.cartId, cartItem?.cartItemId, companyDomain);
        console.log("remove response", response)
        const cartResponse: CartItemResponse | {
            cartId: string;
            message: string;
            success: boolean;
        } = response.data;
        if (cartResponse.success) {
            dispatch(removeFromCart({ cartId: cartResponse.cartId, cartItemId: null, productVariantId: null, userId: user?.id || '', quantity: 0 }));
        } else {
            dispatch(removeFromCart({ cartId: cartResponse?.cart_id || '', cartItemId: cartResponse?.cart_item_id || '', productVariantId: cartResponse?.product_variant_id, userId: user?.id || '', quantity: cartResponse?.quantity }));
        }
    };

    return (
        <motion.div whileHover={{ scale: 1.1 }} className={`${containerBase} ${heightClass} ${styles}  `}>
            <AnimatePresence mode="wait">
                {quantity === 0 ? (
                    <motion.button
                        key="add-btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleIncrement}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="flex h-full w-full items-center justify-center gap-2  whitespace-nowrap"
                    >
                        <ShoppingCart size={isSmall ? 18 : 22} />

                    </motion.button>
                ) : (
                    <motion.div
                        key="counter-ui"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex  h-full w-full items-center justify-evenly "
                    >
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleDecrement}
                            className="h-full   flex items-center justify-center flex-1 hover:bg-black/10 transition-colors"
                        >
                            <Minus size={16} />
                        </motion.button>

                        <motion.span
                            key={quantity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-bold   flex-1 text-xs  text-center"
                        >
                            {quantity}
                        </motion.span>

                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleIncrement}
                            className="h-full flex items-center justify-center flex-1 hover:bg-black/10 transition-colors"
                        >
                            <Plus size={16} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}