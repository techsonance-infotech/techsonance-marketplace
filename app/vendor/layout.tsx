'use client';

import { Sidebar } from "@/components/common/Sidebar";
import { VENDOR_NAV_LINKS } from "@/constants/vendor";
import { useIsSidebarOpen } from "@/utils/sideBarCheck";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const isSidebarOpen = useIsSidebarOpen();

    return (
        <>
            <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
            <main className={`vendor_dashboard mr-6 ${isSidebarOpen ? 'ml-50' : 'ml-24'}`}>
                {children}
            </main>
        </>
    );
}
