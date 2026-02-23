import { Navbar } from "../../../components/admin/Navbar";
import "./index.css"
import { DashboardChart } from "../../../components/admin/DashboardChart";
import { Outlet } from "react-router";
const data = {
  totalVendors: 120,
  vendorGrowth: 15,
  totalCustomers: 450,
  totalOrders: 320,
  totalRevenue: 50000,
  systemsOperations: 99.9

}
const active_instances = [
  { id: 201, name: "Shree Electronics", email: "contact@shreeelectronics.in", status: "Healthy" },
  { id: 202, name: "FashionHub", email: "support@fashionhub.com", status: "Healthy" },
  { id: 203, name: "GreenMart Organics", email: "sales@greenmart.org", status: "High Load" },
  { id: 204, name: "TechWorld Solutions", email: "info@techworld.io", status: "Healthy" },
  { id: 205, name: "Royal Furnishings", email: "service@royalfurnishings.in", status: "High Load" },
  { id: 206, name: "BookNest", email: "help@booknest.co", status: "Healthy" },
  { id: 207, name: "UrbanStyle Apparel", email: "care@urbanstyle.com", status: "Healthy" },
  { id: 208, name: "KitchenKing Supplies", email: "orders@kitchenking.in", status: "High Load" },
  { id: 209, name: "GlowBeauty Cosmetics", email: "support@glowbeauty.in", status: "Healthy" },
  { id: 210, name: "MegaMart Traders", email: "sales@megamart.biz", status: "Healthy" }
];

export function DashBoard() {
 
  return (
    <>
      <Navbar title="Dashboard" />
      <main className={`admin_dashboard  `}>
        <div className="stats">
          <div className="stat ">
            <div className="stat_title   ">Total Vendors</div>
            <div className="stat_value ">{data.totalVendors}</div>
            <div className="stat_desc text-green-600  ">↗︎ {data.vendorGrowth}% this month</div>
          </div>
          <div className="stat ">
            <div className="stat_title   ">Total Customers</div>
            <div className="stat_value  ">{data.totalCustomers}</div>
            <div className="stat_desc   ">Across all instances</div>
          </div>
          <div className="stat ">
            <div className="stat_title   ">Systems Operations</div>
            <div className="stat_value  text-green-600">{data.systemsOperations}%</div>
            <div className="stat_desc  ">
              All systems operational
            </div>
          </div>
          <div className="stat ">
            <div className="stat_title   ">Systems Operations</div>
            <div className="stat_value  text-green-600">{data.systemsOperations}%</div>
            <div className="stat_desc  ">
              All systems operational
            </div>
          </div>
        </div>
        <section className="mid_section flex    justify-between my-5 gap-6">
          <DashboardChart />
          <div className="active_card lg:w-[50%] md:w-[50%]  sm:w-full h-1B15     bg-white
        py-4 px-6 rounded-lg border-2 border-gray-300 ">
            <h2 className="font-bold text-lg mb-4">Active Instances</h2>
            <span className="instance_container overflow-y-scroll h-96  block">
              {active_instances.map((instance) => (
                <div key={instance.id} className="instance_card flex mb-4  gap-6 bg-gray-100 border-2 border-gray-300 px-6 py-2 rounded-md justify-between items-center">
                  <span>
                    <h2 className="card_title font-medium mb-1" >{instance.name}</h2>
                    <p className="card_email text-sm font-light text-gray-500">{instance.email}</p>
                  </span>
                  <button className={`py-1 px-3 text-nowrap-sm   items-center ${instance.status === "Healthy" ? "bg-green-100 text-green-500" : "bg-yellow-100 text-yellow-500"}  `} >{instance.status}</button>
                </div>
              ))}
            </span>
          </div>
        </section>
      </main>
      <Outlet />
    </>
  )
}