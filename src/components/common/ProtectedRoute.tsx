import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, useLocation } from 'react-router'
import { role } from '../../utils/Types';
import type { RootState } from '../../app/store';

const allowedRoles = ['customer', 'admin', 'vendor']
export function ProtectedRoute({children,allowedRoles}: {children: React.ReactNode, allowedRoles:string[]}) {
    const location =useLocation()
    const userRole=role;
    
    const { isAuthenticated, user } = useSelector((state:RootState) => state.auth)
    const userRoleType=user?.user_role_id ? allowedRoles[user.user_role_id - 1] : null;

    const isAuthorized = userRoleType && allowedRoles.includes(userRoleType);
    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to={'/unauthorized'} state={{from:location}} replace />
    }
 
    return children
}