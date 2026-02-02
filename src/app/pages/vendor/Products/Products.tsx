import { useSelector } from "react-redux";
import { Pagination } from "../../../../components/common/Pagination";
import { useState } from "react";
import { Edit } from "lucide-react";
import { searchImgDark, VENDOR_NAV_LINKS } from "../../../../utils/constants";
import Navbar from "../../../../components/vendor/Navbar";
import { Sidebar } from "../../../../components/common/Sidebar";
import { Link } from "react-router";



export interface Product {
  id: string; // Used for React keys and API calls
  productName: string;
  sku: string;
  stock: number;
  price: number;
  status: 'Active' | 'Inactive';
  imageUrl: string;
}
const productData: Product[] = [
  {
    "id": "prod-001",
    "productName": "Noise Air Clips Wireless Open Ear Earbuds",
    "sku": "AUD-MIC-001",
    "stock": 90,
    "price": 8999,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-MIC-001/200/200"
  },
  {
    "id": "prod-002",
    "productName": "boAt 2025 Launch Rockerz 113",
    "sku": "AUD-HDP-002",
    "stock": 183,
    "price": 2099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-HDP-002/200/200"
  },
  {
    "id": "prod-003",
    "productName": "Noise Airwave Bluetooth in Ear Neckband",
    "sku": "AUD-SPK-003",
    "stock": 45,
    "price": 12999,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SPK-003/200/200"
  },
  {
    "id": "prod-004",
    "productName": "OnePlus Bullets Wireless Z3 in-Ear Neckband",
    "sku": "AUD-SND-004",
    "stock": 46,
    "price": 4099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-004/200/200"
  },
  {
    "id": "prod-005",
    "productName": "pTron Tangent Buzz w",
    "sku": "AUD-SND-005",
    "stock": 22,
    "price": 4099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-005/200/200"
  },
  {
    "id": "prod-006",
    "productName": "ZEBRONICS Duke Plus, Wireless Over Ear Headphone",
    "sku": "AUD-SND-006",
    "stock": 196,
    "price": 1299,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-006/200/200"
  },
  {
    "id": "prod-007",
    "productName": "Sony WF-C510 Wireless Bluetooth Earbuds",
    "sku": "AUD-SND-007",
    "stock": 172,
    "price": 3499,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-007/200/200"
  },
  {
    "id": "prod-008",
    "productName": "Boat New Launch Rockerz 650 Pro",
    "sku": "AUD-SND-008",
    "stock": 237,
    "price": 3499,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-008/200/200"
  },
  {
    "id": "prod-009",
    "productName": "JBL Tune 760NC",
    "sku": "AUD-HDP-009",
    "stock": 36,
    "price": 2099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-HDP-009/200/200"
  },
  {
    "id": "prod-010",
    "productName": "Sennheiser Momentum 4",
    "sku": "AUD-HDP-010",
    "stock": 183,
    "price": 4099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-HDP-010/200/200"
  },
  {
    "id": "prod-011",
    "productName": "Samsung Galaxy Buds2 Pro",
    "sku": "AUD-WLS-011",
    "stock": 91,
    "price": 1499,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-WLS-011/200/200"
  },
  {
    "id": "prod-012",
    "id": "prod-012",
    "productName": "Bose QuietComfort Ultra",
    "sku": "AUD-HDP-012",
    "stock": 198,
    "price": 2099,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-HDP-012/200/200"
  },
  {
    "id": "prod-013",
    "productName": "Realme Buds Air 5",
    "sku": "AUD-WLS-013",
    "stock": 197,
    "price": 24999,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-WLS-013/200/200"
  },
  {
    "id": "prod-014",
    "productName": "Skullcandy Crusher ANC 2",
    "sku": "AUD-SND-014",
    "stock": 181,
    "price": 12999,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-SND-014/200/200"
  },
  {
    "id": "prod-015",
    "productName": "Marshall Major IV",
    "sku": "AUD-HDP-015",
    "stock": 248,
    "price": 12999,
    "status": "Active",
    "imageUrl": "https://picsum.photos/seed/AUD-HDP-015/200/200"
  }
]
export   function Products() {
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
      <Navbar title="Dashboard" />
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={`admin_dashboard mr-6 pt-3  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
        <div className="flex gap-6 my-6 justify-end">
          <Link className="rounded-xl bg-black text-white px-4 py-2" to={'/vendor/products/createProduct'}>+ Add New Product</Link>
          <button className="rounded-xl bg-blue-500 text-white px-4 py-2"> Export CSV</button>
        </div>
        <div className={" mt-2 justify-between rounded-2xl flex border-gray-300    items-center  py-2 gap-4   bg-white  filter  "}>
          <span className="border flex   flex-3 items-center justify-between gap-0 border-gray-400 px-4 rounded-lg ">
            <button className="rounded-full w-8 h-8"><img className="w-6 h-6" src={searchImgDark} alt="search icon" /></button>
            <input type="text" className="  text-xl py-2 px-4 w-full " placeholder="Search by name,email or domain" />
          </span>
          <span className="flex  gap-4">
            <select className="vendor_filter rounded-2xl" name="status" id="status">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">In Active</option>

            </select>
            <select className="vendor_filter rounded-2xl" name="sort_by" id="sort_by">
              <option value="category">Category</option>
              <option value="headphone">Headphone</option>
            </select>
          </span>
        </div>
        <div
          className="my-6 relative flex w-full h-full overflow-scroll  bg-white border rounded-2xl bg-clip-border">
          <table className="w-full  table-auto min-w-max  ">

            <thead className=" w-full " >
              <tr className="text-left bg-gray-200 ">
                <th className="p-4 border-b  text-center  border-gray-400"><input className="w-4  h-4 text-center" type="checkbox" /></th>
                <th className="p-4 border-b   border-gray-400"></th>
                <th className="p-4 border-b   border-gray-400">PRODUCT NAME</th>
                <th className="p-4 border-b   border-gray-400">SKU</th>
                <th className="p-4 border-b   border-gray-400">STOCK</th>
                <th className="p-4 border-b   border-gray-400">PRICE</th>
                <th className="p-4 border-b   border-gray-400">STATUS</th>
                <th className="p-4 border-b   border-gray-400">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {
                currentData.map((item, index) => (
                  <>
                    <tr key={index} className={`hover:bg-gray-100 ${item.id === currentData[pageSize - 1].id ? 'border-b-0' : 'border-b border-gray-400'} border-b border-gray-400   `}>
                      <td className={`p-4  `}> <input type="checkbox" className="w-4 h-4" /></td>
                      <td className={`p-4  `}> <img className="w-16 h-16" src={item.imageUrl} alt="product image" /> </td>
                      <td className={`p-4 w-56  `}>{item.productName}</td>
                      <td className={`p-4  `}>
                        {item.sku}
                      </td>

                      <td className={`p-4  `}>
                        <p className={`${item.stock >= 20 ? 'text-green-500  py-1 px-3 rounded-lg ' : 'text-red-500   py-1 px-3 rounded-lg  '}`}>{item.stock}</p>
                      </td>
                      <td className={`p-4  `}>₹ {item.price}</td>
                      <td className={`p-4  `}>
                        {
                          item.status === "Active" ? <span className="bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">Active</span> :
                            item.status === "Inactive" ? <span className="bg-green-100 text-green-800 py-1 px-3 rounded-lg text-sm">In Active</span> :
                              <></>
                        }
                      </td>
                      <td className={`p-4  `}>
                        <Edit />
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
