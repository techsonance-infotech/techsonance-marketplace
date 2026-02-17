import { Outlet, useLocation } from "react-router";
import { ProfileSidebar } from "../../../../components/customer/ProfileSidebar";
import { useMediaQuery } from "react-responsive";
import { TabNavBar } from "../../../../components/customer/TabNavBar";

export function UserLayout() {
    const path = useLocation().pathname;
    const isMobile = useMediaQuery({ maxWidth: 767 });
    if (path.includes("checkout")) {
        return <Outlet />;
    }
    return (
        <>
            <main className={`  xl:pt-10 pb-8   xl:px-32   lg:px-8 md:px-4 px-2 pt-1    min-h-[80dvh] ${isMobile ? ' flex flex-col' : 'flex'}`}>
                <ProfileSidebar />
                <Outlet />
             {isMobile && <TabNavBar />}
            </main>
        </>
    )
}
