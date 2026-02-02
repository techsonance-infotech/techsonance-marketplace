import { useSelector } from "react-redux";
import { Pagination } from "../../../components/common/Pagination";
import { useState } from "react";
import { searchImgDark, VENDOR_NAV_LINKS } from "../../../utils/constants";
import Navbar from "../../../components/vendor/Navbar";
import { Sidebar } from "../../../components/common/Sidebar";

export interface Warehouse {
  warehouse_id: number;
  company_id: number;
  name: string;
  location: string; // Maps to the address line in UI
  is_active: boolean;
  total_units: number; // Calculated field from Inventory table
  is_default: boolean; // Field to control the "Default" badge
}
export const warehouseData: Warehouse[] = [
  {
    warehouse_id: 1,
    company_id: 101,
    name: "Main Warehouse (Surat)",
    location: "Ring Road, Surat, Gujarat",
    is_active: true,
    total_units: 4520,
    is_default: true
  },
  {
    warehouse_id: 2,
    company_id: 101,
    name: "North Hub (Delhi)",
    location: "Okhla Ind. Estate, Delhi",
    is_active: true,
    total_units: 2520,
    is_default: false
  },
  {
    warehouse_id: 3,
    company_id: 101,
    name: "South Hub (Bengaluru)",
    location: "Whitefield, Bengaluru, Karnataka",
    is_active: true,
    total_units: 3150,
    is_default: false
  },
  {
    warehouse_id: 4,
    company_id: 101,
    name: "West Hub (Mumbai)",
    location: "Bhiwandi, Thane, Maharashtra",
    is_active: true,
    total_units: 1890,
    is_default: false
  },
  {
    warehouse_id: 5,
    company_id: 101,
    name: "East Hub (Kolkata)",
    location: "Salt Lake Sector V, Kolkata, WB",
    is_active: true,
    total_units: 1240,
    is_default: false
  }
];
export interface Product {
  id: string;
  productName: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  warehouse: 'Main Warehouse' | 'North Hub';
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  imageUrl: string;
}



const productData: Product[] = [
  // --- Rows visible in the Screenshot ---
  {
    id: "prod-001",
    productName: "Noise Air Clips Wireless Open Ear Earbuds",
    sku: "AUD-MIC-001",
    category: "Audio",
    stock: 5,
    price: 8999,
    warehouse: "Main Warehouse",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-MIC-001/200/200"
  },
  {
    id: "prod-002",
    productName: "boAt 2025 Launch Rockerz 113",
    sku: "AUD-HDP-002",
    category: "Audio",
    stock: 220,
    price: 2099,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-HDP-002/200/200"
  },
  {
    id: "prod-003",
    productName: "Noise Airwave Bluetooth in Ear Neckband",
    sku: "AUD-SPK-003",
    category: "Audio",
    stock: 400,
    price: 12999,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SPK-003/200/200"
  },
  {
    id: "prod-004",
    productName: "OnePlus Bullets Wireless Z3 in-Ear Neckband",
    sku: "AUD-SND-004",
    category: "Audio",
    stock: 10,
    price: 4099,
    warehouse: "North Hub",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-004/200/200"
  },
  {
    id: "prod-005",
    productName: "pTron Tangent Buzz w",
    sku: "AUD-SND-005",
    category: "Audio",
    stock: 40,
    price: 4099,
    warehouse: "North Hub",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-005/200/200"
  },
  {
    id: "prod-006",
    productName: "ZEBRONICS Duke Plus, Wireless Over Ear Headphone",
    sku: "AUD-SND-006",
    category: "Audio",
    stock: 20,
    price: 1299,
    warehouse: "North Hub",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-006/200/200"
  },
  {
    id: "prod-007",
    productName: "Sony WF-C510 Wireless Bluetooth Earbuds",
    sku: "AUD-SND-007",
    category: "Audio",
    stock: 2200,
    price: 3499,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-007/200/200"
  },
  {
    id: "prod-008",
    productName: "Boat New Launch Rockerz 650 Pro",
    sku: "AUD-SND-008",
    category: "Audio",
    stock: 40,
    price: 3499,
    warehouse: "North Hub",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-008/200/200"
  },

  // --- Remaining items from original list (Extrapolated) ---
  {
    id: "prod-009",
    productName: "JBL Tune 760NC",
    sku: "AUD-HDP-009",
    category: "Audio",
    stock: 36,
    price: 2099,
    warehouse: "Main Warehouse",
    status: "Low Stock",
    imageUrl: "https://picsum.photos/seed/AUD-HDP-009/200/200"
  },
  {
    id: "prod-010",
    productName: "Sennheiser Momentum 4",
    sku: "AUD-HDP-010",
    category: "Audio",
    stock: 183,
    price: 4099,
    warehouse: "North Hub",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-HDP-010/200/200"
  },
  {
    id: "prod-011",
    productName: "Samsung Galaxy Buds2 Pro",
    sku: "AUD-WLS-011",
    category: "Audio",
    stock: 91,
    price: 1499,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-WLS-011/200/200"
  },
  {
    id: "prod-012",
    productName: "Bose QuietComfort Ultra",
    sku: "AUD-HDP-012",
    category: "Audio",
    stock: 198,
    price: 2099,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-HDP-012/200/200"
  },
  {
    id: "prod-013",
    productName: "Realme Buds Air 5",
    sku: "AUD-WLS-013",
    category: "Audio",
    stock: 197,
    price: 24999,
    warehouse: "North Hub",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-WLS-013/200/200"
  },
  {
    id: "prod-014",
    productName: "Skullcandy Crusher ANC 2",
    sku: "AUD-SND-014",
    category: "Audio",
    stock: 181,
    price: 12999,
    warehouse: "Main Warehouse",
    status: "In Stock",
    imageUrl: "https://picsum.photos/seed/AUD-SND-014/200/200"
  },
  {
    id: "prod-015",
    productName: "Marshall Major IV",
    sku: "AUD-HDP-015",
    category: "Audio",
    stock: 0,
    price: 12999,
    warehouse: "North Hub",
    status: "Out of Stock",
    imageUrl: "https://picsum.photos/seed/AUD-HDP-015/200/200"
  }
];
export   function Inventory() {
  const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
  const [count, setCount] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(productData.length / pageSize);
  const currentPage = count;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData: typeof productData = productData.slice(startIndex, endIndex);
  console.log(currentData)
  return (
    <>
      <Navbar title="Inventory Management" />
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={`admin_dashboard mr-6 pt-3  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
        <div className="flex gap-6 my-6 justify-end">
          <button className="rounded-xl border-2 border-gray-300 text-gray-700 px-4 py-2">Transfer Stock</button>
          <button className="rounded-xl bg-blue-500 text-white px-4 py-2"> Update Stock</button>
        </div>

        <div className="flex gap-3  justify-between flex-wrap mb-6">
          {
            warehouseData.map((warehouse) => (
              <>
                <div key={warehouse.warehouse_id} className="mb-4 p-4 border-2 border-gray-300 rounded-lg bg-white w-1/5 hover:border-blue-500 hover:shadow-lg cursor-pointer">


                  <div className="flex flex-col justify-between min-h-36 w-full
                   ">
                    <span>


                      <div className="text-xl font-semibold flex justify-between items-start">
                        <p className="text-balance">{warehouse.name}</p>
                        {warehouse.is_default && (
                          <span className="text-sm bg-blue-100 p-2 text-blue-800 rounded-xl">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{warehouse.location}</p>
                    </span>
                    <div className="mt-2 flex  justify-between items-center gap-6 font-medium">
                      <p className="text-gray-800 font-medium">Total Units: {warehouse.total_units}</p>
                      <p className={`text-sm ${warehouse.is_active ? 'text-green-600' : 'text-red-600'}`}>{warehouse.is_active ? 'Active' : 'Inactive'}</p>
                    </div>

                  </div>
                </div>
              </>
            ))
          }

        </div>

        <div className={" mt-2 justify-between rounded-2xl flex border-gray-300    items-center  py-2 gap-4   bg-white  filter  "}>
          <span className="border flex   flex-3 items-center justify-between gap-0 border-gray-400 px-4 rounded-lg ">
            <button className="rounded-full w-8 h-8"><img className="w-6 h-6" src={searchImgDark} alt="search icon" /></button>
            <input type="text" className="  text-xl py-2 px-4 w-full " placeholder="Search by name,email or domain" />
          </span>
          <span className="flex  gap-4">
            <select className="vendor_filter rounded-2xl" name="status" id="status">
              <option value="all">All Status</option>
              <option value="active">In Stock</option>
              <option value="pending">Low Stock</option>
              <option value="pending">Out of Stock</option>

            </select>

          </span>
        </div>
        <div
          className="my-6 relative flex w-full h-full overflow-scroll  bg-white border rounded-2xl bg-clip-border">
          <table className="w-full  table-auto min-w-max  ">

            <thead className=" w-full " >
              <tr className="text-left bg-gray-200 ">
                <th className="p-4 border-b   border-gray-400">IMAGE</th>
                <th className="p-4 border-b   border-gray-400">PRODUCT NAME</th>
                <th className="p-4 border-b   border-gray-400">SKU</th>
                <th className="p-4 border-b   border-gray-400">WAREHOUSE</th>
                <th className="p-4 border-b   border-gray-400">STOCK</th>

                <th className="p-4 border-b   border-gray-400">STATUS</th>
                <th className="p-4 border-b   border-gray-400">ADJUST</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {
                currentData.map((item, index) => (
                  <>
                    <tr key={index} className={`hover:bg-gray-100 ${item.id === currentData[pageSize - 1].id ? 'border-b-0' : 'border-b border-gray-400'} border-b border-gray-400   `}>
                      <td className={`p-4  `}> <img className="w-16 h-16" src={item.imageUrl} alt="product image" /> </td>
                      <td className={`p-4 w-56  `}>{item.productName}</td>
                      <td className={`p-4  `}>
                        {item.sku}
                      </td>
                      <td className={`p-4  `}>{item.warehouse}</td>
                      <td className={`p-4  `}>
                        {
                          item.status === "In Stock" ? <span className="block text-center bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm w-14">{item.stock}</span> :
                            item.status === "Low Stock" ? <span className="block text-center bg-yellow-100 text-yellow-800 py-1 px-3 rounded-lg text-sm w-14">{item.stock}</span> :
                              <span className="block text-center bg-red-100 text-red-800 py-1 px-3 rounded-lg text-sm w-14">{item.stock}</span>

                        }
                      </td>

                      <td className={`p-4  `}>
                        {
                          item.status === "In Stock" ? <div className="w-24 text-center bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">{item.status}</div> :
                            item.status === "Low Stock" ? <span className="w-24  block  bg-yellow-100 text-center     text-yellow-800 py-1 px-3 rounded-lg text-sm  ">{item.status}</span> :
                              <span className="w-24 block text-center bg-red-100 text-red-800 py-1 px-3 rounded-lg text-sm">{item.status}</span>

                        }
                      </td>
                      <td className={`p-4  `}>
                        {
                          item.status === "In Stock" ? <button className=" min-w-24 bg-green-100 border-2 border-green-500 cursor-pointer   text-green-800 py-1 px-3 rounded-lg text-sm">Edit</button> :

                            // item.status === "Low Stock" ? <button className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-lg text-sm">Edit</button> :

                            <button className="min-w-24 cursor-pointer bg-red-100 border-2 border-red-500   text-red-800 py-1 px-3 rounded-lg text-sm">Restock</button>
                        }
                      </td>

                    </tr>
                  </>
                ))
              }
            </tbody >

          </table>
        </div>
        <span className="w-full flex justify-between items-center ">
          <p className="text-stone-500">Showing {currentData.length} of {productData.length} products</p>
          <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative right-0 w-54" />
        </span>
      </main>
    </>
  )
}
