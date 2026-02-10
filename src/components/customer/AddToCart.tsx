import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { addToCart, removeFromCart, updateQuantity } from "../../features/Cart"; // Ensure you export removeFromCart
import { toggleCartSidebar } from "../../features/CartSidebar";

export function AddToCart({ productId, styles }: { productId?: string, styles?: string }) {
    const dispatch = useDispatch();
    const { items } = useSelector((state: RootState) => state.cart);

    // Find the specific item in the cart
    const cartItem = items.find(item => item.id === productId);
    const quantity = cartItem ? cartItem.quantity : 0;

    // Handler to increment
    const handleIncrement = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating if this is inside a product card
        dispatch(addToCart({ id: productId }));
        dispatch(toggleCartSidebar('open'))
    };

    // Handler to decrement
    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity > 1) {
            // Assuming your reducer handles updating specific quantities
            dispatch(updateQuantity({ id: productId, quantity: quantity - 1 }));
        } else {
            // If quantity is 1, removing it should remove from cart completely
            dispatch(removeFromCart({ id: productId }));
        }
    };

    // 1. STATE: Item NOT in cart
    if (quantity === 0) {
        return (
            <button
                onClick={handleIncrement}
                className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2.5 rounded-lg hover:bg-brand-primary-dark transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
                <ShoppingCart size={18} />
                <span className="font-medium">Add to Cart</span>
            </button>
        );
    }

    // 2. STATE: Item IS in cart (Counter UI)
    return (
        <div className={`flex items-center justify-between bg-brand-primary text-white rounded-lg shadow-md overflow-hidden ${styles === "small" ? "w-28 h-8" : "w-40 h-14"}`}>
            {/* Decrease Button */}
            <button
                onClick={handleDecrement}
                className="h-full px-2 hover:bg-black/10 active:bg-black/20 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>

            {/* Quantity Display */}
            <span className="font-bold text-sm select-none min-w-[1.5rem] text-center">
                {quantity}
            </span>

            {/* Increase Button */}
            <button
                onClick={handleIncrement}
                className="h-full px-2 hover:bg-black/10 active:bg-black/20 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}