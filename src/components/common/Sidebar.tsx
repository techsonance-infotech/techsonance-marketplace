import { BAR_TOGGLE_ICON, TS_LOGO, type NavLinkType } from "../../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, type isSidebarType } from "../../features/sidebar";
type SidebarProps = {
    NAV_LINKS: NavLinkType[];
}

export function Sidebar({ NAV_LINKS }: SidebarProps) {
    const { isSidebarOpen }: isSidebarType = useSelector((state: any) => state.sidebar);
    const dispatch = useDispatch()
    return (
        <>
            <aside className={`fixed flex flex-col top-0 left-0 h-full transition ease-in-out bg-gray-800 text-white shadow-lg px-2 `}>
                <button onClick={() => dispatch(toggleSidebar())} className="flex justify-between items-center my-3 ml-1 h-6 ">
                    {
                        isSidebarOpen && <img src={TS_LOGO} alt="Techsonance Logo" className="ml-1 h-8 w-10 rounded-m filter brightness-150" />
                    }
                    <img src={BAR_TOGGLE_ICON} alt="Toggle Sidebar" className={" relative w-6 h-6   transition ease-in-out " + (isSidebarOpen ? "rotate-180 right-4" : "left-0 ml-3")} />
                </button>
                {
                    NAV_LINKS.map((linkObj, index) => (

                        <a href={Object.values(linkObj)[0]} key={index} className={"flex gap-2 rounded-2xl items-center px-4 py-2 my-2 hover:bg-gray-700 transition ease-in-out " + (isSidebarOpen ? "px-4" : "px-2")}>
                            <img src={Object.values(linkObj)[1]} alt={Object.keys(linkObj)[0]} className="w-6 h-6 " />
                            {
                                isSidebarOpen && <span className="text-sm">{Object.keys(linkObj)[0]}</span>
                            }

                        </a>

                    ))
                }
            </aside>
        </>
    )
}