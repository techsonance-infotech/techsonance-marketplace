
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { DynamicIcon } from 'lucide-react/dynamic';
import type { RootState } from '../../app/store';
import { logOut } from '../../features/auth/authSlice';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { X } from 'lucide-react';

// Simulating your config file import
const ProfileSidebarLink = [
    { name: 'Profile Overview', path: '/customerProfile', icon: 'user' },
    { name: 'My Orders', path: '/orders', icon: 'shopping-bag' }, // 'handbag' isn't in Lucide, usually 'shopping-bag'
    { name: 'Wishlist', path: '/wishlist', icon: 'heart' },
    { name: 'Addresses', path: '/addresses', icon: 'map-pin' },
    { name: 'Logout', path: '/logout', icon: 'log-out', isDanger: true }
];

export function ProfileSidebar() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentPath = useLocation().pathname;
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const handleNavigation = (linkPath: string) => {
        if (linkPath === '/logout') {
            dispatch(logOut());
            navigate('/');
        } else if (linkPath === '/customerProfile') {
            navigate(`/customerProfile/${user?.user_id}`);
        } else {
            navigate(`/customerProfile/${user?.user_id}${linkPath}`);
        }
    };
    if (isMobile) {
        return (
            <AnimatePresence mode="wait">
                {
                    isMenuOpen && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{type:'tween',ease:'easeInOut' ,duration:0.10}}
                            className="fixed top-0 right-0 w-[70%] h-full bg-white shadow-lg z-50 p-6"
                        >
                            <button onClick={() => setIsMenuOpen(false)} className="mt-10 mb-6 text-gray-500 hover:text-gray-900 float-right"><X />

                            </button>



                            <motion.ul
                                className="space-y-1"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.05 } }
                                }}
                            >
                                {ProfileSidebarLink.map((link) => {
                                    // Logic to determine active state
                                    const targetPath = link.path === '/customerProfile'
                                        ? `/customerProfile/${user?.user_id}`
                                        : `/customerProfile/${user?.user_id}${link.path}`;

                                    const isActive = currentPath === targetPath || (link.path !== '/customerProfile' && currentPath.startsWith(targetPath));
                                    const isDanger = link.path === '/logout';

                                    return (
                                        <motion.li
                                            key={link.name}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                visible: { opacity: 1, x: 0 }
                                            }}
                                        >
                                            <button
                                                onClick={() => handleNavigation(link.path)}
                                                className={`
                                    relative w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-colors group
                                    ${isDanger
                                                        ? 'text-red-500 hover:bg-red-50'
                                                        : isActive
                                                            ? 'text-brand-primary'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                    }
                                `}
                                            >
                                                {/* The Magic Floating Background Pill */}
                                                {isActive && !isDanger && (
                                                    <motion.div
                                                        layoutId="sidebar-active-pill"
                                                        className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl"
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}

                                                {/* Icon & Text - z-index ensures they sit ON TOP of the pill */}
                                                <span className="relative z-10 flex items-center justify-center w-5 h-5">
                                                    <DynamicIcon name={link.icon} size={20} />
                                                </span>
                                                <span className="relative text-start z-10 font-semibold">
                                                    {link.name}
                                                </span>

                                                {/* Hover Chevron (Micro-interaction) */}
                                                {!isActive && !isDanger && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -5 }}
                                                        whileHover={{ opacity: 1, x: 0 }}
                                                        className="absolute right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <DynamicIcon name="chevron-right" size={16} />
                                                    </motion.div>
                                                )}
                                            </button>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>
                        </motion.div>)
                }
                <motion.button className='w-full flex justify-end' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DynamicIcon name="menu" size={32} onClick={() => setIsMenuOpen(true)} />
                </motion.button>

            </AnimatePresence>
        )
    }
    return (
        <aside className="w-full lg:w-72 flex-shrink-0">
            {/* User Header Card */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6  border-l-4    flex items-center gap-4"
            >
                {/* <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-brand-primary font-bold text-xl">
                    {user?.name?.charAt(0) || 'U'}
                </div> */}
                <div className="overflow-hidden">
                    <h1 className="text-lg font-bold text-gray-900 truncate">
                        {user?.name || 'User'}
                    </h1>
                    <p className="text-gray-500 text-xs truncate max-w-[150px]">
                        {user?.email}
                    </p>
                </div>
            </motion.div>

            {/* Navigation List */}
            <motion.ul
                className="space-y-1"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
            >
                {ProfileSidebarLink.map((link) => {
                    // Logic to determine active state
                    const targetPath = link.path === '/customerProfile'
                        ? `/customerProfile/${user?.user_id}`
                        : `/customerProfile/${user?.user_id}${link.path}`;

                    const isActive = currentPath === targetPath || (link.path !== '/customerProfile' && currentPath.startsWith(targetPath));
                    const isDanger = link.path === '/logout';

                    return (
                        <motion.li
                            key={link.name}
                            variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                            }}
                        >
                            <button
                                onClick={() => handleNavigation(link.path)}
                                className={`
                                    relative w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-sm font-medium transition-colors group
                                    ${isDanger
                                        ? 'text-red-500 hover:bg-red-50'
                                        : isActive
                                            ? 'text-brand-primary'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }
                                `}
                            >
                                {/* The Magic Floating Background Pill */}
                                {isActive && !isDanger && (
                                    <motion.div
                                        layoutId="sidebar-active-pill"
                                        className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon & Text - z-index ensures they sit ON TOP of the pill */}
                                <span className="relative z-10 flex items-center justify-center w-5 h-5">
                                    <DynamicIcon name={link.icon} size={20} />
                                </span>
                                <span className="relative z-10 font-semibold">
                                    {link.name}
                                </span>

                                {/* Hover Chevron (Micro-interaction) */}
                                {!isActive && !isDanger && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -5 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="absolute right-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <DynamicIcon name="chevron-right" size={16} />
                                    </motion.div>
                                )}
                            </button>
                        </motion.li>
                    );
                })}
            </motion.ul>
        </aside>
    );
}