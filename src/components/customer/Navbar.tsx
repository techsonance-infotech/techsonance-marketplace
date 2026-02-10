import { Link, Outlet, useLocation } from "react-router";
import { useMediaQuery } from 'react-responsive'
import { BRAND_LOGO, cartImgDark, heartDark, heartLight, searchImgDark, searchImgLight, userIcon } from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Bell,  Menu } from "lucide-react";
import { closeMenu, openMenu } from "../../features/menuBar";
import { NAV_LINKS } from "../../utils/customer/constants";
import { toggleCartSidebar } from "../../features/CartSidebar";
 


export function Navbar({ styles, logoUrl = BRAND_LOGO, menuLinks = NAV_LINKS }: { styles?: string, logoUrl?: string, menuLinks?: { [key: string]: string }[] }) {
    const heartImg = true ? heartDark : heartLight
    const searchImg = false ? searchImgLight : searchImgDark;
    const { isCartOpen } = useSelector((state) => state.cartSidebar)
      const { items } = useSelector((state) => state.cart)
    
    const { isMenuOpen } = useSelector((state: any) => state.menu)
    const dispatch = useDispatch();
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const wishlistCount = 0;
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
                        <li key={key} className={`${path === value ? ' hover:text-white bg-[#04b0ffc1] ' : ''} py-1 px-3 rounded-full cursor-pointer`} >
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
                        <Link to={'/wishlist'} className="relative  ">
                            {wishlistCount > 0 ? <span className=" absolute top-0 left-3 text-[12px] bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center" >{wishlistCount}</span> : null}
                            <img src={heartImg} alt="" className="h-6 w-6" />
                        </Link>
                        <Link to={'/#'} onClick={() => dispatch(toggleCartSidebar())}  className=" relative" >
                        <p className=" absolute -top-3 left-2 text-md bg-red-500 text-white rounded-full  w-6 h-6 flex items-center justify-center">{items.length > 0 && items.length}</p>
                            <img src={cartImgDark} alt="" className="h-6 w-6 " />
                        </Link>
                        <Link to={'/user_profile'}>
                            <img src={userIcon} alt="" className="h-6 w-6 " />
                        </Link>
                    </div>}
            </span>
        </nav>

    )
}