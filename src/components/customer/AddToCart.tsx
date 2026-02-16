import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { addToCart, removeFromCart, updateQuantity } from "../../features/Cart";
import { toggleCartSidebar } from "../../features/CartSidebar";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion"; // Note: standard import is framer-motion

interface AddToCartProps {
    productId: string; // Made required for safety
    styles?: string;
}

export function AddToCart({ productId, styles }: AddToCartProps) {
    const dispatch = useDispatch();
    const { items } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth);
    const path = useLocation().pathname;

    const cartItem = items?.find(item => item.id === productId);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    const isSmall = styles?.includes("small");
    const containerBase = `flex items-center justify-center bg-brand-primary text-white rounded-lg shadow-md overflow-hidden transition-all duration-200`;
    const heightClass = isSmall ? "h-8" : "h-11";

    const handleIncrement = () => {
        if (!user) {
          
            alert("Please log in to add items to the cart.");
            return;
        }

        dispatch(addToCart({ id: productId, user_id: user.user_id }));
        
        // Only open sidebar if we aren't already on the cart page
        if (!path.includes("cart")) {
            dispatch(toggleCartSidebar('open'));
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            dispatch(updateQuantity({ id: productId, quantity: quantity - 1, user_id: user?.user_id }));
        } else {
            dispatch(removeFromCart({ id: productId, user_id: user?.user_id }));
        }
    };

    return (
        <div className={`${containerBase} ${heightClass} ${styles}`}>
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
                        className="flex h-full w-full items-center justify-center gap-2 px-6 whitespace-nowrap"
                    >
                        <ShoppingCart size={isSmall ? 18 : 22} />
        
                    </motion.button>
                ) : (
                    <motion.div
                        key="counter-ui"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex h-full w-full items-center justify-between"
                    >
                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleDecrement}
                            className="h-full px-3 hover:bg-black/10 transition-colors"
                        >
                            <Minus size={16} />
                        </motion.button>

                        <motion.span
                            key={quantity}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-bold text-sm min-w-[20px] text-center"
                        >
                            {quantity}
                        </motion.span>

                        <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={handleIncrement}
                            className="h-full px-3 hover:bg-black/10 transition-colors"
                        >
                            <Plus size={16} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}