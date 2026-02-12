import { Outlet } from "react-router";

import { ADMIN_NAV_LINKS } from "../../../utils/constants";
import { Sidebar } from "../../../components/common/Sidebar";
import { useSelector } from "react-redux";



export   function AdminLayout() {
    const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
    return (
        <>
            <Sidebar NAV_LINKS={ADMIN_NAV_LINKS} />
            <main className={`   mr-6  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <Outlet />
            </main>
        </>
    )
}
