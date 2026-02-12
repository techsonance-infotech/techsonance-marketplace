import { Link, Outlet, useLocation } from "react-router";
import { useMediaQuery } from 'react-responsive'
import { BRAND_LOGO, cartImgDark, heartDark, heartLight, searchImgDark, searchImgLight, userIcon } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Heart, ShoppingCart } from "lucide-react";

import { NAV_LINKS } from "../../utils/customer/constants";
import { toggleCartSidebar } from "../../features/CartSidebar";



export function Navbar({ styles, logoUrl = BRAND_LOGO, menuLinks = NAV_LINKS }: { styles?: string, logoUrl?: string, menuLinks?: { [key: string]: string }[] }) {

    const searchImg = false ? searchImgLight : searchImgDark;
    const { items } = useSelector((state) => state.cart)
    const { wishItems } = useSelector((state: any) => state.wishlist)
    const { user } = useSelector((state: any) => state.auth)
    const dispatch = useDispatch();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const wishlistCount = wishItems.length;
    const path = useLocation().pathname;
    if (path.startsWith('/admin') || path.startsWith('/vendor')) {
        return <Outlet />
    }
    if (isTabletOrMobile) {
        return (
            <nav className="flex justify-between items-center  align-middle  px-4 py-2 h-16   ">
                <Link to="/"><img src={logoUrl} alt="brand logo" className="h-10  " /></Link>
                <Link to='/notifications'>
                    <Bell />
                </Link>
            </nav>
        )
    }

    return (
        <nav className={`bg-navbar text-navbar-foreground flex justify-between items-center  align-middle  xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1 h-16   `}>
            <Link to="/"><img src={logoUrl} alt="brand logo" className="h-10" /></Link>
            <ul className="flex space-x-4   md:text-[12px] lg:text-[.8rem] font-medium">
                {menuLinks.map((item) => {
                    const key = Object.keys(item)[0];
                    const value = Object.values(item)[0];
                    return (
                        <li key={key} className={`text-lg  ${path === value ? ' hover:text-white bg-[#04b0ffc1] ' : ''} py-1 px-3 rounded-full cursor-pointer`} >
                            <Link to={`${value}`}>{key}</Link>
                        </li>
                    )
                })}
            </ul>
            <span className="flex gap-4">
                <div className="border-2  text-[.8rem] border-black/40 rounded-full flex items-center px-5 py-1 gap-2   ">
                    <input type="text" name="search" id="" placeholder="Search..." className="focus:outline-none text-[12px]  w-30 py-1" /> <button className="focus:outline-none">
                        <img src={searchImg} alt="" className="h-4 w-4" />
                    </button>
                </div>
                {path === '/customerRegister' || path === '/customerLogin' ? null :
                    <div className="  flex gap-4 items-center ">
                        <Link to={'/customerProfile/' + (user?.user_id || '') + '/wishlist'} className="relative  ">
                            {wishlistCount > 0 ? <span className="  absolute -top-2 -right-2 text-md bg-red-500 text-white rounded-full  w-6 h-6 flex items-center justify-center" >{wishlistCount}</span> : null}
                            <Heart size={32} color={wishlistCount > 0 ? "pink" : "black"} fill={wishlistCount > 0 ? "pink" : "none"} />
                        </Link>
                        <button onClick={() => dispatch(toggleCartSidebar('open'))} className=" relative" >
                            {items.length > 0 && <p className=" absolute -top-2 -right-2 text-md bg-red-500 text-white rounded-full  w-6 h-6 flex items-center justify-center">{items.length}</p>}
                            <ShoppingCart size={32} />
                        </button>
                        <Link to={'/customerProfile/' + (user?.user_id || '')} className=" ">
                            <img src={userIcon} alt="" className="h-6 w-6 " />
                        </Link>
                    </div>}
            </span>
        </nav>

    )
}