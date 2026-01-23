import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
const allowedRoles = ['customer', 'admin', 'vendor']
export function ProtectedRoute() {
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    if (!isAuthenticated) {
        <Navigate to={'/login'} />
    }
 
    return (
        <Outlet />
    )
}