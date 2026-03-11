'use client';
import Navbar from "@/components/vendor/Navbar";
import { InnerSideBar } from "@/components/common/InnerSideBar";
import { VENDOR_SETTINGS_LINKS } from "@/constants/vendor";
import { useIsSidebarOpen } from "@/utils/sideBarCheck";

export default function VendorSettingsLayout({ children }: { children: React.ReactNode }) {
    const isSidebarOpen = useIsSidebarOpen();
    return (
        <>
            <Navbar title="Global Settings" />
            <InnerSideBar
                links={VENDOR_SETTINGS_LINKS}
                isOpen={'ml-50'}
                isNotOpen={'ml-24'}
            />
            {children}
        </>
    );
}
