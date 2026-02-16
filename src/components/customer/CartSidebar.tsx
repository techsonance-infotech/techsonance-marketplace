import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartSidebar } from "../../features/CartSidebar";
import { PRODUCT_LIST } from "../../utils/customer/constants";
import { AddToCart } from "./AddToCart";
import type { RootState } from "../../app/store";
import { X, ShoppingBag } from "lucide-react";
import BuyBtn from "./BuyBtn";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export function CartSidebar() {
  const { isCartOpen } = useSelector((state: RootState) => state.cartSidebar);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const cartItems = Array.isArray(PRODUCT_LIST) && Array.isArray(items) 
    ? PRODUCT_LIST.filter(product => items.some(item => item.id === product.id)).map(product => {
        const item = items.find(item => item.id === product.id);
        return { ...product, quantity: item?.quantity || 0 };
      }) 
    : [];

  const closeSidebar = () => dispatch(toggleCartSidebar('close'));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* 1. Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* 2. Side Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onMouseLeave={closeSidebar} // Replaces the useEffect event listener logic
            className="fixed right-0 top-0 z-[70] h-[100dvh] w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-brand-primary" />
                <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
              </div>
              <button 
                onClick={closeSidebar}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.li 
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-between items-center gap-4"
                      >
                        <div className="flex gap-4 items-center">
                          <img 
                            className="aspect-square w-16 h-16 object-cover rounded-xl border border-gray-100" 
                            src={item.imgUrl} 
                            alt={item.title} 
                          />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.title}</p>
                            <p className="text-brand-primary font-bold text-sm">₹{item.price}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                           <AddToCart productId={item.id} styles="small " />
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <Link 
                onClick={closeSidebar}
                className="flex justify-center py-3 px-6 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm" 
                to={`/customerProfile/${user?.user_id}/cart`}
              > 
                View Full Cart
              </Link>
              <BuyBtn styles="w-full py-4 rounded-xl shadow-lg" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}