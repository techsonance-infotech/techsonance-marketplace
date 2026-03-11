'use client';
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ProfileSidebar } from "@/components/customer/ProfileSidebar";
import { TabNavBar } from "@/components/customer/TabNavBar";
import { UserRole } from "@/utils/constants";
import { useMediaQuery } from "react-responsive";

export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return (
        <ProtectedRoute allowedRoles={[UserRole.Customer]}>
            <main className={`  xl:pt-10 pb-8   xl:px-32   lg:px-8 md:px-4 px-2 pt-1    min-h-[80dvh] ${isMobile ? ' flex flex-col' : 'flex'}`}>
                {!isMobile && <ProfileSidebar />}
                {children}
                {isMobile && <TabNavBar />}
            </main>
        </ProtectedRoute>
    );
}
