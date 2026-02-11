import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartSidebar } from "../../features/CartSidebar";
import { PRODUCT_LIST } from "../../utils/customer/constants";
import { AddToCart } from "./AddToCart";

export function CartSidebar() {
  const focusRef = useRef(null);
  const { isCartOpen } = useSelector((state) => state.cartSidebar)
  const { items } = useSelector((state) => state.cart)
  const cartItems = PRODUCT_LIST.filter(product => items.some(item => item.id === product.id)).map(product => {
    const item = items.find(item => item.id === product.id);
    return { ...product, quantity: item?.quantity || 0 };
  }
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (focusRef.current && isCartOpen) {

      document.addEventListener('mousedown', function handleEscape(event) {
        console.log(event, 'mouse')
        dispatch(toggleCartSidebar('close'));

      });
  
    }
    return () => {
      document.removeEventListener('mousedown', function handleEscape(event) {
        console.log(event, 'mouse')
      });
    }
  }, [isCartOpen]);
  return (
    <>
      {isCartOpen && <aside ref={focusRef} tabIndex={-1} className="absolute z-10 h-[100dvh] w-112 bg-white right-0 top-0 shadow-lg p-4">
        <h1 className="text-lg font-bold">Your Cart</h1>
        <button onClick={() => dispatch(toggleCartSidebar('close'))} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>
        {cartItems.length === 0 ? (
          <p className="mt-4 text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="flex gap-3">


                    <img className="  aspect-square w-18 h-18 object-cover" src={item.imgUrl} alt="" />
                    <span>

                      <p className="font-medium text-md mb-1">{item.title}</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </span>
                  </span>

                </div>

                <span className="flex flex-col justify-between items-end gap-2">

                  <p className="text-gray-500">${item.price}</p>
                  <AddToCart productId={item.id} styles="small" />
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>}
    </>

  )
}
