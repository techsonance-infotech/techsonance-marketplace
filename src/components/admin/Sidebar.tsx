import { ADMIN_NAV_LINKS, BAR_TOGGLE_ICON, TS_LOGO } from "../../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { toggleAdminSlider } from "../../features/adminSidler";


export function Sidebar() {
    const {isAdminSidlerOpen} = useSelector((state:any) => state.adminSidler);
    const dispatch=useDispatch()
    return (
        <>
            <aside className={`absolute flex flex-col top-0 left-0 h-full transition ease-in-out bg-gray-800 text-white shadow-lg px-2`}>
                <button onClick={()=>dispatch(toggleAdminSlider())} className="flex justify-between items-center my-3 ml-1 h-6 ">
                    {
                        isAdminSidlerOpen &&    <img src={TS_LOGO} alt="Techsonance Logo" className="ml-1 h-8 w-10 rounded-m filter brightness-150"/>
                    }
                    <img src={BAR_TOGGLE_ICON} alt="Toggle Sidebar" className={" relative w-6 h-6   transition ease-in-out " + (isAdminSidlerOpen ? "rotate-180 right-4" : "left-0 ml-3")} />
                </button>
                {
                    ADMIN_NAV_LINKS.map((linkObj, index) => (
                        
                            <a    href={Object.values(linkObj)[0]} key={index} className={"flex gap-2 rounded-2xl items-center px-4 py-2 my-2 hover:bg-gray-700 transition ease-in-out " + (isAdminSidlerOpen ? "px-4" : "px-2")}>
                                <img src={Object.values(linkObj)[1]} alt={Object.keys(linkObj)[0]} className="w-6 h-6 " />
                                {
                                    isAdminSidlerOpen &&  <span className="text-sm">{Object.keys(linkObj)[0]}</span>
                                }
                              
                            </a>
                       
                    ))
                }
            </aside>
        </>
    )
}