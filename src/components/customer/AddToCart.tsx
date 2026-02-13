import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { addToCart, removeFromCart, updateQuantity } from "../../features/Cart";
import { toggleCartSidebar } from "../../features/CartSidebar";
import { useLocation } from "react-router";

export function AddToCart({ productId, styles }: { productId?: string, styles?: string }) {
    const dispatch = useDispatch();
    const { items } = useSelector((state: RootState) => state.cart);
    const { user } = useSelector((state: RootState) => state.auth)

    const cartItem = Array.isArray(items) ? items.find(item => item.id === productId) : undefined;
    const quantity = cartItem ? cartItem.quantity : 0;
    const path=useLocation().pathname;


    const handleIncrement = () => {

        if (user) {
            dispatch(addToCart({ id: productId, user_id: user.user_id }));
            if(path!==`/customerProfile/${user.user_id}/cart`){
                dispatch(toggleCartSidebar('open'));
            }

        } else {

            alert("Please log in to add items to the cart.");
        }
    };


    const handleDecrement = () => {

        if (quantity > 1) {
            dispatch(updateQuantity({ id: productId, quantity: quantity - 1, user_id: user?.user_id }));
        } else {

            dispatch(removeFromCart({ id: productId, user_id: user?.user_id }));

        }
    };

    if (quantity === 0) {
        return (
            <button
                onClick={handleIncrement}
                className={`flex items-center gap-2 bg-brand-primary ${styles?.includes("small") ? "   h-8" : `  h-11 ${styles}`}  text-white px-6 py-3 rounded-lg hover:bg-brand-primary-dark transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
            >
                <ShoppingCart size={24} />
                {/* <span className="font-medium">Add to Cart</span> */}
            </button>
        );
    }

    // 2. STATE: Item IS in cart (Counter UI)
    return (
        <div className={`flex items-center justify-between bg-brand-primary text-white rounded-lg shadow-md overflow-hidden ${styles?.includes("small") ? "   h-8" : `  h-11 ${styles}`}  `}>
            {/* Decrease Button */}
            <button
                onClick={() => handleDecrement()}
                className="mr-2 h-full pl-2 hover:bg-black/10 active:bg-black/20 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>

            {/* Quantity Display */}
            <span className="font-bold text-sm select-none min-w-[.5rem] text-center">
                {quantity}
            </span>

            {/* Increase Button */}
            <button
                onClick={() => handleIncrement()}
                className="ml-2 h-full pr-2 hover:bg-black/10 active:bg-black/20 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}