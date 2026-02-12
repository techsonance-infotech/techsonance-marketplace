import { Outlet } from "react-router";
import { ProfileSidebar } from "../../../../components/customer/ProfileSidebar";

export function UserLayout() {
    return (
        <>
        <main className='  xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1 flex gap-8 '>
        <ProfileSidebar />
        <Outlet   />
        </main>
        </>
    )
}
