import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { motion } from "motion/react";
import { use, useState } from "react";
import type { UserOrder } from "../../../../utils/Types";
import { Link } from "react-router";
import { PRODUCT_LIST, type PRODUCT_LIST_TYPE } from "../../../../utils/customer/constants";
import { useMediaQuery } from "react-responsive";
import { is } from "date-fns/locale";
type ordersStatusType = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
const OrderCard = ({ order, isMobile }: { order: UserOrder, isMobile: boolean }) => {
  const productId = order.products[0].product_id;
  const quantity = order.products[0].quantity;

  const productDetails: PRODUCT_LIST_TYPE = PRODUCT_LIST.find(p => p.id === productId)
  console.log('Found product details for productId:', productId, 'details:', productDetails);
  console.log(Array.isArray(productDetails), 'productDetails is an array')
  const product = Array.isArray(productDetails) ? productDetails[0] : productDetails;
  console.log('productDetails', productDetails, 'order,', order)
  if (isMobile) {
    return (
      <>
        <motion.div className="w-full flex border-2 border-gray-300 rounded-xl gap-4 py-1">
          <img src={product?.imgUrl} alt={product?.title} className="h-24 w-24 object-cover rounded " />
          <div className="flex flex-col justify-start items-start gap-2  ">
            <p className="text-blue-600">{product?.title}</p>
            {product?.status === 'Delivered' ? <p className="text-green-600">Delivered</p> : <p className="text-orange-600">Pending</p>}
            <p>ordered on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>

        </motion.div>
      </>
    )
  }
  return (
    <motion.div className="w-full border-2 border-gray-300 rounded-xl p-4">
      <header className="flex justify-between items-start mb-4 border-b-2 border-gray-200 pb-2">

        <span className="flex gap-8">
          <div className="text-gray-500">
            <h3 className=" mb-1"> ORDER PLACED</h3>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="text-gray-500">
            <h3 className=" mb-1">  TOTAL AMOUNT</h3>
            <p>₹{order.total_amount.toLocaleString()}</p>
          </div>
          <div className="text-gray-500">
            <h3 className=" mb-1">SHIP TO</h3>
            <p className="text-blue-400">{Array.isArray(order.shippingTo) ? order.shippingTo.find(addr => addr.name) : order.shippingTo}</p>
          </div>        </span>
        <div>
          <h1 className="text-gray-500">ORDER #{order.order_id}</h1>
          <span className="space-x-6">
            <Link to={`/shop/order-details/${order.order_id}`} className="text-blue-400 hover:underline">View Details</Link>
            <select name="invoice" id="" className="text-blue-400 hover:underline">
              <option value="invoice" className="text-blue-400 hover:underline">Invoice  </option>
              <option value="receipt">Receipt</option>
            </select>
          </span>
        </div>
      </header>
      {order.order_status == 'Pending' && <motion.div className="mb-2 rounded text-lg font-semibold">
        Order will Deliver soon
      </motion.div>}
      <div className="flex justify-start items-start gap-4">
        <img src={product?.imgUrl} alt={product?.title} className="w-24 h-24 object-cover rounded" />
        <div>
          <p className="text-blue-600">{product?.title}</p>
          <p className="text-gray-600">Quantity: {quantity}</p>
        </div>
        <div className="flex justify-end items-end ml-auto gap-4">

          {
            order.order_status === 'Delivered' && <motion.button className="text-blue-400 hover:underline justify-self-end ">Write review</motion.button>
          }
        </div>
      </div>


    </motion.div>
  )
}
const OrdersList = ({ orders, status, isMobile }: { orders: UserOrder[], status: ordersStatusType, isMobile: boolean }) => {
  console.log('status:', status, 'orders:', orders);
  const filteredOrders = orders.filter(order => order.order_status === status);

  return (
    <motion.div className="space-y-4 w-full">
      {filteredOrders.map(order => (
        <OrderCard key={order.order_id} order={order} isMobile={isMobile} />
      ))}
      {filteredOrders.length === 0 && <p className="text-gray-500 text-center py-10">No {status} orders found.</p>}
    </motion.div>
  )
}
export function CustomersOrders() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const [orderStatus, setOrderStatus] = useState<ordersStatusType>('Pending');
  const orders: UserOrder[] = user?.orders || [];

  console.log(orders)
  const ordersStatusMap = ["Pending", "Delivered", "Cancelled"];

  return (
    <>

      <section className=" w-full  px-4 py-8 min-h-[60vh]">
        <h1 className="w-full mb-6 font-bold">My Orders
        </h1>

        <div className="flex relative   border-gray-300 mb-6">
          {ordersStatusMap.map((status) => {
            const isActive = orderStatus === status;
            return (
              <motion.button
                key={status}
                className={"relative lg:px-6 lg:py-2 px-4 font-medium transition-colors focus:outline-none border-b-4" + (isActive ? " text-black bg-black/5" : " text-gray-500 border-b-gray-200 hover:text-gray-700")}

                onClick={() => setOrderStatus(status as ordersStatusType)}
              >
                <motion.p
                  whileHover={{ scale: 1.05 }}
                  className="relative z-10" >
                  {status === 'Pending' ? 'Active' : status === 'Shipped' ? 'Shipped' : status === 'Delivered' ? 'Delivered' : 'Cancelled'}
                </motion.p>

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-[-2px] left-0 right-0 h-1 bg-black  "
                    transition={{
                      type: 'spring',
                      bounce: 0.2,
                      duration: 0.4
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        <OrdersList orders={orders} status={orderStatus} isMobile={isMobile} />

      </section>
    </>
  )
}
