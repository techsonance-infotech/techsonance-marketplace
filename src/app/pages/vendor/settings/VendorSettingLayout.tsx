 
import { Outlet } from 'react-router'
import Navbar from '../../../../components/vendor/Navbar'

export function VendorSettingLayout() {
    return (
        <>
            <Navbar title="Global Settings" />
            <Outlet />
        </>
    )
}
