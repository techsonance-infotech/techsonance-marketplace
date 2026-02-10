import { Link, Outlet, useLocation } from "react-router";

import { FOOTER_BOTTOM_TEXT, FOOTER_CONTENT } from "../../utils/customer/constants";
import { DynamicIcon } from "lucide-react/dynamic";




export function Footer({ styles }: { styles?: string }) {

    const path = useLocation().pathname;

    if (path.startsWith('/admin') || path.startsWith('/vendor')) {
        return <Outlet />
    }
    //
    return (
        <>
            <footer className={`flex flex-col bg-footer      xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-4 ${styles}`}>
                <span className="w-full flex justify-center items-start   xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1   ">


                    {/* <img src={BRAND_LOGO} alt="brand logo" className="h-10  " /> */}
                    {
                        path === '/customerRegister' || path === '/customerLogin' ? null : <>
                            <div className="w-full  space-x-4 flex justify-between  md:text-[12px] lg:text-[.8rem] font-medium">
                                {
                                    FOOTER_CONTENT.map((section, index) => (
                                        <ul key={index} className="flex flex-col gap-2">
                                            <li className="font-bold text-lg ">{section.header}</li>

                                            {
                                                section.links.map((link, linkIndex) => (
                                                    <li key={linkIndex} className={`text-sm  hover:text-gray-400 transition-colors duration-300 w-64 `}>
                                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                            {link.icon && <DynamicIcon name={link.icon} className={link.styles} size={32} />
                                                            }

                                                            {link.category === 'social' ? null : link.title}
                                                        </a>
                                                    </li>
                                                ))
                                            }

                                        </ul>

                                    )
                                    )

                                }
                            </div>

                        </>}
                     
                </span>
                <span className="h-[1px] w-[85%] my-2  bg-black/30 mx-auto " ></span>
                <span className=" font-light  text-center mb-6">
                    {FOOTER_BOTTOM_TEXT}
                </span>
            </footer>

        </>
    )
}