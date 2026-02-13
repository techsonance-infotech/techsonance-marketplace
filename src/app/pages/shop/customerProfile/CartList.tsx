import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { PRODUCT_LIST } from "../../../../utils/customer/constants";
import { AddToCart } from "../../../../components/customer/AddToCart";
import BuyBtn from "../../../../components/customer/BuyBtn";

export function CartList() {
    const { items } = useSelector((state: RootState) => state.cart);
    const cartItemsWithDetails = items.map(item => {
        const product = PRODUCT_LIST.find(p => p.id === item.id);
        return {
            ...item,
            name: product?.title || 'Unknown Product',
            price: product?.price || 0,
            imgUrl: product?.imgUrl || ''
        }
    });
    const totalPrice = cartItemsWithDetails.reduce((total, item) => total + item.price * item.quantity, 0);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <p className="mb-4">Confirm your items before checking out</p>
            {cartItemsWithDetails.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <section className="flex flex-col md:flex-row gap-8">


                    <div>
                        {cartItemsWithDetails.map(item => (
                            <div key={item.id} className="flex justify-between items-center gap-4   border-2  border-gray-300 px-4 py-2 rounded-lg mb-4">
                                <span className="flex gap-4">


                                    <img src={item.imgUrl} alt={item.name} className="w-18 h-18 object-cover rounded" />
                                    <div>
                                        <h3 className="font-bold text-balance">{item.name}</h3>
                                        <p>Price: ₹{item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </span>
                                <AddToCart productId={item.id} styles="w-60 small" />
                            </div>
                        ))}

                    </div>
                    <div className="border-2 border-gray-300 py-4 px-6 rounded-xl">
                        <h2 className="text-xl font-bold">Order Summary</h2>
                        <p className="">Shipping & discounts will be applied at checkout</p>
                        <div className="flex justify-between mt-4">

                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="">
                                    <tr className="font-bold text-lg"><td>TOTAL MRP ({cartItemsWithDetails.length} Items )</td><td>₹{totalPrice}</td> </tr>
                                    {
                                        cartItemsWithDetails.map(item => (
                                            <tr key={item.id} className="border-b border-gray-300 text-gray-700">
                                                <td className="py-2 pl-2 text-left text-sm text-balance">{item.name} x {item.quantity}</td>
                                                <td className="py-2 text-right">₹{item.price * item.quantity}</td>

                                            </tr>
                                        ))
                                    }
                                    <tr className="font-bold text-lg border-b border-gray-300">
                                        <td className="py-2">Discount</td>
                                        <td className="py-2 text-right">₹0</td>
                                    </tr>
                                    <tr className="font-bold text-lg border-b border-gray-300">
                                        <td className="py-2">Shipping</td>
                                        <td className="py-2 text-right">₹0</td>
                                    </tr>
                                    <tr className="font-bold text-lg  ">
                                        <td className="py-2">Subtotal</td>
                                        <td className="py-2 text-right">₹{totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>




                        </div>
                        <BuyBtn styles="mt-4 w-full" />
                    </div>

                </section>
            )}

        </div>
    )
}
