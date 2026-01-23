import { Link, Outlet, useLocation } from "react-router";
import { useState } from "react";
import instagram from "../assets/instgram icon.png"
import facebook from "../assets/facebook icon.png"
import youtube from "../assets/youtube icon.png"
import { BRAND_LOGO, FOOTER_TEXT, NAV_LINKS } from "../utils/constants";
export function Footer({ }) {
    const [showElement, setShowElement] = useState(false);
    const [activeLink, setActiveLink] = useState('/');
    const path = useLocation().pathname;
 
       if (path === '/adminLogin' || path === '/vendorLogin' || path === '/vendorRegister'||path==='/adminDashboard') {
        return <Outlet />
    }
    //
    return (
        <>
            <footer className="flex flex-col    xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-4">
                <span className="flex justify-between items-center  align-middle xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1   ">


                    <img src={BRAND_LOGO} alt="brand logo" className="h-10  " />
                    {
                        path === '/customerRegister' || path === '/customerLogin' ? null : <>
                            <ul className="flex space-x-4   md:text-[12px] lg:text-[.8rem] font-medium">

                                {NAV_LINKS.map((item) => {
                                    const key =  Object.keys(item)[0];
                                    const value = Object.values(item)[0];
                                    
                                    return (
                                        <li key={key} className={`${path === value ? ' hover:text-white bg-[#04b0ffc1] ' : ''} py-1 px-3 rounded-full cursor-pointer`} >
                                            <Link to={`${value}`}>{key}</Link>
                                        </li>
                                    )
                                })}
                            </ul>

                        </>}
                    <div className="  flex gap-4 items-center ">
                        <Link to={'/wishlist'} className="relative  ">
                            <img src={instagram} alt="" className="h-6 w-6" />
                        </Link>
                        <Link to={'/cart_page'}>
                            <img src={facebook
                            } alt="" className="h-6 w-6 " />
                        </Link>
                        <Link to={'/user_profile'}>
                            <img src={youtube} alt="" className="h-6 w-6 " />
                        </Link>
                    </div>
                </span>
               <span className="h-[1px] w-[85%] my-1 bg-black/30 mx-auto " ></span>
                <span className=" font-light  text-center">
                   { FOOTER_TEXT }
                </span>
            </footer>
            <Outlet />
        </>
    )
}