import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, useLocation } from 'react-router'
import { role } from '../../features/auth/authSlice'
import { Children } from 'react'
const allowedRoles = ['customer', 'admin', 'vendor']
export function ProtectedRoute({children,allowedRoles}: {children: React.ReactNode, allowedRoles:string[]}) {
    const location =useLocation()
    const userRole=role;
    
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const userRoleType=user?.user_role_type;

    const isAuthorized = userRoleType && allowedRoles.includes(userRoleType);
    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to={'/unauthorized'} state={{from:location}} replace />
    }
 
    return children
}