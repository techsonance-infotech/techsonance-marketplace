 
import { Outlet } from 'react-router'
import Navbar from '../../../../components/vendor/Navbar'
import { InnerSideBar } from '../../../../components/common/InnerSideBar'
import { VENDOR_SETTINGS_LINKS } from '../../../../utils/constants'
import { useSelector } from 'react-redux';

export function VendorSettingLayout() {
    const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
    return (
        <>
            <Navbar title="Global Settings" />
 <InnerSideBar links={VENDOR_SETTINGS_LINKS} style={isSidebarOpen ? 'ml-50' : 'ml-24'} />
            <Outlet />
        </>
    )
}
