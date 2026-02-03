import { useSelector } from "react-redux";
import { Sidebar } from "../../../components/common/Sidebar";
import { VENDOR_NAV_LINKS } from "../../../utils/constants";
import "./index.css"
import Navbar from "../../../components/vendor/Navbar";
import { Pagination } from "../../../components/common/Pagination";
import { useState } from "react";
import { Link } from "react-router";

export const orderData = [
  {
    "orderId": "#ORD-2024-001",
    "customerName": "Rahul Kumar",
    "status": "Pending",
    "amount": 1499,
    "action": "Ship Now"
  },
  {
    "orderId": "#ORD-2024-002",
    "customerName": "Anita Singh",
    "status": "Shipped",
    "amount": 3499,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-003",
    "customerName": "Nitish kumar",
    "status": "Delivered",
    "amount": 2499,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-004",
    "customerName": "Rudra kumar",
    "status": "Pending",
    "amount": 4499,
    "action": "Ship Now"
  },
  {
    "orderId": "#ORD-2024-005",
    "customerName": "Rudra kumar",
    "status": "Delivered",
    "amount": 4099,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-006",
    "customerName": "Akash kumar",
    "status": "Delivered",
    "amount": 2099,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-007",
    "customerName": "Akash kumar",
    "status": "Delivered",
    "amount": 2099,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-008",
    "customerName": "Akash kumar",
    "status": "Delivered",
    "amount": 1499,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-009",
    "customerName": "Priya Sharma",
    "status": "Shipped",
    "amount": 2999,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-010",
    "customerName": "Vikram Singh",
    "status": "Pending",
    "amount": 5499,
    "action": "Ship Now"
  },
  {
    "orderId": "#ORD-2024-011",
    "customerName": "Neha Gupta",
    "status": "Delivered",
    "amount": 1299,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-012",
    "customerName": "Sanjay Verma",
    "status": "Shipped",
    "amount": 3899,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-013",
    "customerName": "Pooja Patel",
    "status": "Pending",
    "amount": 2199,
    "action": "Ship Now"
  },
  {
    "orderId": "#ORD-2024-014",
    "customerName": "Amit Mishra",
    "status": "Delivered",
    "amount": 999,
    "action": "View"
  },
  {
    "orderId": "#ORD-2024-015",
    "customerName": "Sneha Reddy",
    "status": "Shipped",
    "amount": 4599,
    "action": "View"
  }
]
export const vendorStats = {
  totalRevenue: 120000,
  revenueGrowth: 10,
  pendingOrder: 15,
  lowStock: 5,
  activeOrders: 320,
}
export function Dashboard() {
  const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
  const [count, setCount] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(orderData.length / pageSize);
  const currentPage = count;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData: typeof orderData = orderData.slice(startIndex, endIndex);
  console.log(currentData)
  return (
    <>
      <Navbar title="Dashboard" />
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={`vendor_dashboard mr-6  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>

        <div className="stats justify-evenly">
          <div className="stat ">
            <div className="stat_title   ">Total Vendors</div>
            <div className="stat_value ">{vendorStats.totalRevenue}</div>
            <div className="stat_desc text-green-600  ">↗︎ {vendorStats.revenueGrowth}% v last month</div>
          </div>
          <div className="stat ">
            <div className="stat_title   ">Pending Orders</div>
            <div className="stat_value  ">{vendorStats.pendingOrder}</div>
            <div className="stat_desc   ">Requires immediate shipping</div>
          </div>
          <div className="stat ">
            <div className="stat_title   ">Active Products</div>
            <div className="stat_value ">{vendorStats.activeOrders}</div>
            <div className="stat_desc  ">
              {vendorStats.lowStock} Products low on stock
            </div>
          </div>

        </div>


        <div
          className="my-6 relative flex flex-col w-full h-full overflow-scroll  bg-white border rounded-xl bg-clip-border">
          <div className="flex justify-between border-b border-gray-400">
            <h2 className="font-bold text-xl p-4 ">Recent Orders</h2>
            <Link to="/vendor/orders" className="text-xl p-4 text-blue-600 cursor-pointer underline">View All</Link>

          </div>
          <table className="w-full  table-auto min-w-max  ">

            <thead className="bg-gray-200" >
              <tr className="">
                <th className="p-4 border-b   border-gray-400">ORDER ID</th>
                <th className="p-4 border-b   border-gray-400">CUSTOMER</th>
                <th className="p-4 border-b   border-gray-400">STATUS</th>
                <th className="p-4 border-b   border-gray-400">AMOUNT</th>
                <th className="p-4 border-b   border-gray-400">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {
                currentData.map((order, index) => (
                  <>
                    <tr key={index} className={`hover:bg-gray-100 ${order.orderId === currentData[currentData.length - 1].orderId ? 'border-b-0' : 'border-b border-gray-400'}  `}>
                      <td className={`p-4  `}>{order.orderId}</td>
                      <td className={`p-4   `}>{order.customerName}</td>
                      <td className={`p-4   `}>
                        {
                          order.status === "Pending" ? <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-lg text-sm">Pending</span> :
                            order.status === "Shipped" ? <span className="bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">Shipped</span> :
                              <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg text-sm">Delivered</span>
                        }
                      </td>
                      <td className={`p-4  `}>₹ {order.amount}</td>
                      <td className={`p-4  `}>
                        {order.action === "Ship Now" ? <button className="text-blue-500 underline  py-1 px-3 rounded-lg hover:bg-blue-100">Ship Now</button> : <button className="text-gray-500 underline py-1 px-3 rounded-lg hover:bg-gray-100">View</button>}
                      </td>


                    </tr>
                  </>
                ))
              }
            </tbody >

          </table>
        </div>
        <span className="flex justify-end">
          <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative right-0 w-54" />
        </span>
      </main>
    </>
  )
}
