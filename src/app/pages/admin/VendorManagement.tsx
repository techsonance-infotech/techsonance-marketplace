import { Sidebar } from "../../../components/admin/Sidebar";
import { Navbar } from "../../../components/admin/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import "./index.css"
import { delete_icon, searchImgDark } from "../../../utils/constants";
import { useState } from "react";
import { Pagination } from "../../../components/common/Pagination";
const data = [
    {
        "id": 201,
        "name": "Shree Electronics",
        "email": "contact@shreeelectronics.in",
        "domain": "shreeelectronics.in",
        "status": "Pending",
        "revenue": 69951
    },
    {
        "id": 202,
        "name": "FashionHub",
        "email": "support@fashionhub.com",
        "domain": "fashionhub.com",
        "status": "Active",
        "revenue": 67863
    },
    {
        "id": 203,
        "name": "GreenMart Organics",
        "email": "sales@greenmart.org",
        "domain": "greenmart.org",
        "status": "Suspended",
        "revenue": 33578
    },
    {
        "id": 204,
        "name": "TechWorld Solutions",
        "email": "info@techworld.io",
        "domain": "techworld.io",
        "status": "Active",
        "revenue": 48867
    },
    {
        "id": 205,
        "name": "Royal Furnishings",
        "email": "service@royalfurnishings.in",
        "domain": "royalfurnishings.in",
        "status": "Suspended",
        "revenue": 94217
    },
    {
        "id": 206,
        "name": "BookNest",
        "email": "help@booknest.co",
        "domain": "booknest.co",
        "status": "Pending",
        "revenue": 49228
    },
    {
        "id": 207,
        "name": "UrbanStyle Apparel",
        "email": "care@urbanstyle.com",
        "domain": "urbanstyle.com",
        "status": "Active",
        "revenue": 84513
    },
    {
        "id": 208,
        "name": "KitchenKing Supplies",
        "email": "orders@kitchenking.in",
        "domain": "kitchenking.in",
        "status": "Active",
        "revenue": 68074
    },
    {
        "id": 209,
        "name": "GlowBeauty Cosmetics",
        "email": "support@glowbeauty.in",
        "domain": "glowbeauty.in",
        "status": "Suspended",
        "revenue": 98671
    },
    {
        "id": 210,
        "name": "MegaMart Traders",
        "email": "sales@megamart.biz",
        "domain": "megamart.biz",
        "status": "Active",
        "revenue": 24579
    },
    {
        "id": 211,
        "name": "MegaMart Traders",
        "email": "sales@megamart.biz",
        "domain": "megamart.biz",
        "status": "Active",
        "revenue": 24579
    },
    {
        "id": 212,
        "name": "MegaMart Traders",
        "email": "sales@megamart.biz",
        "domain": "megamart.biz",
        "status": "Active",
        "revenue": 24579
    }
]
export function VendorManagement() {
    const { isAdminSliderOpen } = useSelector((state: any) => state.adminSlider);
    const { theme } = useSelector((state: any) => state.adminTheme);
    const [count, setCount] = useState(1);

    const pageSize = 5;
    const totalPages = Math.ceil(data.length / pageSize);
    const currentPage = count;
    const startIndex = (currentPage - 1) * totalPages;
    const endIndex = startIndex + pageSize;
    const currentData = data.slice(startIndex, endIndex);
    const vendorRequests = 5; // This would typically come from state or props
    return (
        <>
            <Navbar title={"Vendor Management"} />
            <Sidebar />
            <main className={`admin_vendorManagement mr-6  ${isAdminSliderOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <header className="flex justify-between items-center my-6">
                    <h1 className="font-bold text-2xl " >Manage Vendor domains, and platform access.</h1>
                    <span className="flex gap-4">
                        <Link className="vendor_manage_link text-white font-medium bg-blue-600 hover:bg-blue-700" to="/admin/vendorManagement/createVendor">+ Create Vendors</Link>
                        <Link className="vendor_manage_link font-medium " to="/admin/vendorManagement/approveVendors">Approve Vendor <span className="bg-yellow-300 py-1 px-3 rounded-full">{vendorRequests}</span> </Link>
                    </span>
                </header>
                <div className={"border-2 justify-between rounded-lg flex border-gray-400  items-center px-4 py-2 gap-4   bg-white  filter  " + (theme == 'light' ? '' : 'invert')}>
                    <span className="border flex   flex-3 items-center justify-between gap-0 border-gray-400 px-4 rounded-lg ">
                        <button className="rounded-full w-8 h-8"><img className="w-6 h-6" src={searchImgDark} alt="search icon" /></button>
                        <input type="text" className="  text-xl py-2 px-4 w-full " placeholder="Search by name,email or domain" />
                    </span>
                    <span className="flex  gap-4">
                        <select className="vendor_filter" name="status" id="status">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                        <select className="vendor_filter" name="sort_by" id="sort_by">
                            <option value="date_newest">Newest</option>
                            <option value="date_oldest">Oldest</option>
                        </select>
                    </span>
                </div>
                <div 
  className="my-6 relative flex flex-col w-full h-full overflow-scroll  bg-white border rounded-xl bg-clip-border"> 
  
                <table className="w-full text-left table-auto min-w-max  ">
                    <thead  >
                        <tr className="">
                            <th className="p-4 border-b   border-gray-400">VENDOR NAME</th>
                            <th className="p-4 border-b   border-gray-400">DOMAIN</th>
                            <th className="p-4 border-b   border-gray-400">STATUS</th>
                            <th className="p-4 border-b   border-gray-400">REVENUE(YTD)</th>
                            <th className="p-4 border-b   border-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentData.map((vendor) => (
                                <>
                                    <tr key={vendor.id} className="hover:bg-gray-100   ">
                                        <td className={`p-4  ${vendor.id ===currentData[4].id?'border-b-0':'border-b border-gray-400'}`}>{vendor.name}<br /><span className="text-sm font-light text-gray-500">{vendor.email}</span></td>
                                        <td className={`p-4  ${vendor.id ===currentData[4].id?'border-b-0':'border-b border-gray-400'}`}>{vendor.domain}</td>
                                        <td className={`py-4    ${vendor.id ===currentData[4].id?'border-b-0':'border-b border-gray-400'}`}>
                                            <div className={`py-1 px-3 rounded-lg w-28 text-center items-center ${vendor.status === "Active" ? "bg-green-100 text-green-500" : vendor.status === "Pending" ? "bg-yellow-100 text-yellow-500" : "bg-red-100 text-red-500"}  `} >
                                                {vendor.status}
                                            </div>
                                        </td>
                                        <td className={`p-4  ${vendor.id ===currentData[4].id?'border-b-0':'border-b border-gray-400'}`}>₹ {vendor.revenue.toLocaleString()}</td>
                                        <td className={`p-4 items-center ${vendor.id ===currentData[4].id?'border-b-0':'border-b border-gray-400'}  `}>
                                            <Link to={`/admin/vendorManagement/vendorDetails/${vendor.id}`} className="text-blue-600 hover:underline">View Details</Link>
                                            <button className=" text-red-500 hover:underline mx-4 my-0 h-7 w-7 items-center ">
                                                delete
                                               
                                            </button>
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