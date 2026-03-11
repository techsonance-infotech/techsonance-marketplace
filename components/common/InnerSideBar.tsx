'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsSidebarOpen } from "@/utils/sideBarCheck";

export interface Link {
    section: string;
    list: {
        title: string;
        path: string;
        icon: string;
    }[];
}

export function InnerSideBar({ links, isOpen ,isNotOpen}: { links: Link[], isOpen?:string, isNotOpen?:string }) {
        const isSidebarOpen = useIsSidebarOpen();
        const style = isSidebarOpen ? isOpen : isNotOpen;
    const path = usePathname();
    console.log(path)
    // const activeLink=path.split('/').pop();
    // console.log(activeLink)

    return (
        <>
            <aside className={`inner_sidebar fixed top-20 left-0 h-full max-w-74  bg-white border-r-2  border-t-2  border-gray-300 p-4 ${style}`}       >
                {
                    links.map((section, index) => (
                        <div key={index} className="mb-6 pr-4">
                            <h3 className="text-gray-500 text-lg font-bold uppercase mb-3">{section.section}</h3>
                            <ul>
                                {
                                    section.list.map((link, linkIndex) => (
                                        <li key={linkIndex} className="mb-2">
                                            <Link href={link.path} className={`px-4 py-2 rounded-xl border-2  hover:text-blue-500 flex items-center  ${path == `${link.path}` ? 'font-bold bg-blue-50 border-2 text-blue-600  border-blue-300  ' : ' font-normal hover:bg-blue-50 hover:border-2 hover:text-blue-600  hover:border-blue-300 border-white '}`}>


                                                {/* <span className="material-symbols-outlined mr-2 text-base">{link.icon}</span> */}
                                                {link.title}
                                                <br />
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </aside>
        </>
    )
}
