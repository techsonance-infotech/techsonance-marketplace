import { Link, Outlet, useLocation } from "react-router";

import { useState } from "react";
import searchImgDark from "../../src/assets/Search dark.png"
import searchImgLight from "../../src/assets/Search light.png"
import heartLight from "../../src/assets/icons-heart-light.png"
import heartDark from "../../src/assets/icons-heart-dark.png"
import cartImgDark from "../../src/assets/shppingCart.png"
import userIcon from "../../src/assets/user icon.png"
import { BRAND_LOGO, NAV_LINKS } from "../utils/constants";

export function Navbar({ }) {
    const heartImg = true ? heartDark : heartLight
    const searchImg = false ? searchImgLight : searchImgDark;
    const wishlistCount = 0;
    const path = useLocation().pathname;
    if (path === '/adminLogin' || path === '/vendorLogin' || path === '/vendorRegister') {
        return <Outlet />
    }
    //    if(path === '/' || path === '/shop' || path === '/about' || path === '/contact'){
    //         setShowElement(true);
    //    }
    return (
        <>
            <nav className="flex justify-between items-center  align-middle border-b xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1   ">
                <img src={BRAND_LOGO} alt="brand logo" className="h-10  " />
                <ul className="flex space-x-4   md:text-[12px] lg:text-[.8rem] font-medium">
                    {NAV_LINKS.map((item) => {
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
                        <input type="text" name="search" id="" placeholder="Search..." className="focus:outline-none text-[12px]  w-[120px] py-1" /> <button className="focus:outline-none">
                            <img src={searchImg} alt="" className="h-4 w-4" />
                        </button>
                    </div>
                    {path === '/customerRegister' || path === '/customerLogin' ? null :
                        <div className="  flex gap-4 items-center ">
                            <Link to={'/wishlist'} className="relative  ">
                                {wishlistCount > 0 ? <span className=" absolute top-0 left-3 text-[12px] bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center" >{wishlistCount}</span> : null}
                                <img src={heartImg} alt="" className="h-6 w-6" />
                            </Link>
                            <Link to={'/cart_page'}>
                                <img src={cartImgDark
                                } alt="" className="h-6 w-6 " />
                            </Link>
                            <Link to={'/user_profile'}>
                                <img src={userIcon} alt="" className="h-6 w-6 " />
                            </Link>
                        </div>}
                </span>

            </nav>
            <Outlet />
        </>
    )
}