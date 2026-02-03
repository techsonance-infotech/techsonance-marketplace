import { useState } from "react";
import { Sidebar } from "../../../components/common/Sidebar";
import { searchImgDark, VENDOR_NAV_LINKS } from "../../../utils/constants";
import { useSelector } from "react-redux";
import Navbar from "../../../components/vendor/Navbar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Calendar } from "../../../components/ui/calendar";
import { Pagination } from "../../../components/common/Pagination";

type Order = {
  id: string;
  orderNumber: string;
  dateTime: string;
  customer: {
    name: string;
    location: string;
  };
  status: 'Pending' | 'Shipped' | 'Delivered';
  total: number;
  paymentMethod: 'Paid (UPI)' | 'COD' | 'Refunded' | 'Card payment';
};

const ordersData: Order[] = [
  {
    "id": "order_001",
    "orderNumber": "#ORD-2024-001",
    "dateTime": "Today, 10:23 AM",
    "customer": {
      "name": "Rahul Kumar",
      "location": "Mumbai, MH"
    },
    "status": "Pending",
    "total": 1499,
    "paymentMethod": "Paid (UPI)"
  },
  {
    "id": "order_002",
    "orderNumber": "#ORD-2024-002",
    "dateTime": "11-01-26, 11:34 PM",
    "customer": {
      "name": "Anita Singh",
      "location": "Bangalore, KA"
    },
    "status": "Shipped",
    "total": 3499,
    "paymentMethod": "COD"
  },
  {
    "id": "order_003",
    "orderNumber": "#ORD-2024-003",
    "dateTime": "10-01-26, 4:34 PM",
    "customer": {
      "name": "Nitish kumar",
      "location": "Kolkata, WB"
    },
    "status": "Delivered",
    "total": 2499,
    "paymentMethod": "COD"
  },
  {
    "id": "order_004",
    "orderNumber": "#ORD-2024-004",
    "dateTime": "5-01-26, 1:34 PM",
    "customer": {
      "name": "Rudra kumar",
      "location": "Surat, GJ"
    },
    "status": "Shipped",
    "total": 4499,
    "paymentMethod": "Paid (UPI)"
  },
  {
    "id": "order_005",
    "orderNumber": "#ORD-2024-005",
    "dateTime": "5-01-26, 1:34 PM",
    "customer": {
      "name": "Rudra kumar",
      "location": "Surat, GJ"
    },
    "status": "Delivered",
    "total": 4099,
    "paymentMethod": "COD"
  },
  {
    "id": "order_006",
    "orderNumber": "#ORD-2024-006",
    "dateTime": "5-01-26, 1:34 PM",
    "customer": {
      "name": "Akash kumar",
      "location": "Kolkata, WB"
    },
    "status": "Delivered",
    "total": 2099,
    "paymentMethod": "Paid (UPI)"
  },
  {
    "id": "order_007",
    "orderNumber": "#ORD-2024-007",
    "dateTime": "5-01-26, 1:34 PM",
    "customer": {
      "name": "Akash kumar",
      "location": "Kolkata, WB"
    },
    "status": "Delivered",
    "total": 2099,
    "paymentMethod": "COD"
  },
  {
    "id": "order_008",
    "orderNumber": "#ORD-2024-008",
    "dateTime": "5-01-26, 1:34 PM",
    "customer": {
      "name": "Niraj kumar",
      "location": "Guwahati, AS"
    },
    "status": "Delivered",
    "total": 1499,
    "paymentMethod": "Paid (UPI)"
  }
]
export function Orders() {
  const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(1);
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsOpen(false);
  }
  const pageSize = 5;
  const totalPages = Math.ceil(ordersData.length / pageSize);

  const currentPage = count;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = ordersData.slice(startIndex, endIndex);
  console.log(currentData)


  return (
    <>
      <Navbar title={"Orders"} />
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={` mr-6  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
        <header className="flex justify-end items-center my-6">
          <button className="font-medium text-xl bg-blue-500 text-white rounded-xl px-4 py-2" >Export CSV</button>

        </header>
        <div className={" justify-between rounded-lg flex border-gray-300  items-center  py-2 gap-4   bg-white  filter  "}>
          <span className="border-2 flex   flex-3 items-center justify-between gap-0 border-gray-300 py-1 px-4 rounded-2xl ">
            <button className="rounded-full w-8 h-8"><img className="w-6 h-6" src={searchImgDark} alt="search icon" /></button>
            <input type="text" className="  text-xl py-2 px-4 w-full " placeholder="Search by name,email or domain" />
          </span>
          <span className="flex  gap-4">
            <select className="vendor_filter  rounded-2xl" name="status" id="status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <select className="vendor_filter  rounded-2xl" name="sort_by" id="sort_by">
              <option value="date_newest">Newest</option>
              <option value="date_oldest">Oldest</option>
            </select>
            {
              isOpen ? <button onClick={() => setIsOpen(false)} className="vendor_filter rounded-3xl bg-blue-100 text-blue-600"> {date ? date.toDateString() : "Select Date"}<ChevronUp size={40} strokeWidth={3} absoluteStrokeWidth /> </button> :
                <button onClick={() => setIsOpen(true)} className="vendor_filter  rounded-2xl "> {date ? date.toDateString() : "Select Date"}<ChevronDown size={40} strokeWidth={3} absoluteStrokeWidth />  </button>
            }
            {isOpen && (<Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border shadow-sm absolute right-64 z-20"
              captionLayout='dropdown'
            />)
            }


          </span>
        </div>
        {/* Table Section */}
        <div
          className="my-6 relative flex w-full h-full overflow-scroll  bg-white border rounded-2xl bg-clip-border">
          <table className="w-full  table-auto min-w-max  ">

            <thead className=" w-full " >
              <tr className="text-center bg-gray-200 ">
                <th className="p-4 border-b   border-gray-400">ORDER DETAILS</th>
                <th className="p-4 border-b   border-gray-400">CUSTOMER</th>
                <th className="p-4 border-b   border-gray-400">STATUS</th>
                <th className="p-4 border-b   border-gray-400">TOTAL</th>
                <th className="p-4 border-b   border-gray-400">PAYMENT</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {
                currentData?.map((item, index) => (
                  <>

                    <tr key={item.id} className={`hover:bg-gray-100 ${item.id === currentData[currentData.length - 1].id ? 'border-b-0' : 'border-b border-gray-400'} border-b border-gray-400   `}>

                      <td className={`p-4 w-56  `}>{item.orderNumber}
                        <br /><span className="text-sm font-light text-gray-500">{item.dateTime}</span>
                      </td>
                      <td className={`p-4  `}>
                        {item.customer.name} <br /><span className="text-sm font-light text-gray-500">{item.customer.location}</span>
                      </td>
                      <td className={`p-4  `}>


                        {
                          item.status === "Pending" ? <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-lg text-sm">Active</span> :
                            item.status === "Shipped" ? <span className="bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">In Active</span> :
                              <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-lg text-sm">Delivered</span>
                        }
                      </td>


                      <td className={`p-4  `}>₹ {item.total}</td>
                      <td className={`p-4  `}>
                        {
                          item.paymentMethod === "Paid (UPI)" ? <span className="bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">{item.paymentMethod}</span> :
                            <span className="bg-gray-200 text-black py-1 px-3 rounded-lg text-sm">{item.paymentMethod}</span>
                        }
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
