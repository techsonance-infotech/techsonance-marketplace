import { ShoppingCart } from "lucide-react";

export function AddToCart({productId}: {productId?: string}) {
    
    return (
        <>
                <button  className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-300 flex items-center gap-2 mt-4">
<ShoppingCart />
                        Add to Cart</button>
        </>
    )
}
