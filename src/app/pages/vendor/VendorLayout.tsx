import { VENDOR_NAV_LINKS } from "../../../utils/constants";
import { Sidebar } from "../../../components/common/Sidebar";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
export function VendorLayout() {
  const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
  return (
    <>
      <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
      <main className={`vendor_dashboard   mr-6  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
        <Outlet />

      </main>
    </>
  )
}
