import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import type { RootState } from '../../app/store';
import { DynamicIcon } from 'lucide-react/dynamic';
import { logOut } from '../../features/auth/authSlice';
const ProfileSidebarLink = [
    {
        name: 'Profile Overview',
        path: '/customerProfile',
        icon: 'user',

    },
    {
        name: 'My Orders',
        path: '/orders',
        icon: 'handbag',
    },
    {
        name: 'Wishlist',
        path: '/wishlist',
        icon: 'heart',
    },
    {

        name: 'Addresses',
        path: '/addresses',
        icon: 'map-pin',
    },
    {
        name: 'Logout',
        path: '/logout',
        icon: 'log-out',
    }

]
export function ProfileSidebar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const onClickHandler = (path: string) => {
        if (path === '/logout') {
            dispatch(logOut())
            console.log('Logging out...');
        } else if (path === '/customerProfile') {
            navigate(`/customerProfile/${user?.user_id}`, { replace: true });
        } else {
            navigate(`/customerProfile/${user?.user_id}${path}`);

        }
    }
    return (
        <aside>
            <div className="flex flex-col items-start gap-4 mb-8 border-l-8 rounded-l-sm px-4 py-2  ">
                <h1 className="text-2xl text-start align-middle font-bold  text-gray-900">Hello {user && user.name}</h1>
                <p className="text-gray-500 text-sm leading-relaxed">{user?.email}</p>
            </div>

            <ul className="space-y-2">
                {ProfileSidebarLink.map((link) => (
                    <li key={link.name}>
                        <button
                            onClick={() => onClickHandler(link.path)}
                            className={`lg:w-64  flex gap-4 items-center  text-left px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors ${path === `/customerProfile/${user?.user_id}${link.path}` ? 'bg-blue-100' : link.path === `/logout` ? ' text-red-500' : ''}`}
                        >
                            <DynamicIcon name={link.icon} />
                            {link.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
