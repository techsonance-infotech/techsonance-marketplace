import { useState } from "react";
import { ADMIN_NAV_LINKS, BAR_TOGGLE_ICON } from "../../utils/constants"


export function Sidebar() {
    const [toggle, setToggle] = useState(false);
    return (
        <>
            <aside className={`absolute flex flex-col top-0 left-0 h-full transition ease-in-out bg-gray-800 text-white shadow-lg px-2`}>
                <button onClick={()=>setToggle((prev)=>!prev)}>
                    <img src={BAR_TOGGLE_ICON} alt="Toggle Sidebar" className={" relative mx-4  w-6 h-6 mt-4 mb-8  transition ease-in-out " + (toggle ? "rotate-180 left-24" : "left-0")} />
                </button>
                {
                    ADMIN_NAV_LINKS.map((linkObj, index) => (
                        <>
                            <a href={Object.values(linkObj)[0]} key={index} className={"flex gap-2 rounded-2xl items-center px-4 py-2 my-2 hover:bg-gray-700 transition ease-in-out " + (toggle ? "px-4" : "px-2")}>
                                <img src={Object.values(linkObj)[1]} alt={Object.keys(linkObj)[0]} className="w-6 h-6 " />
                                {
                                    toggle &&  <span className="text-sm">{Object.keys(linkObj)[0]}</span>
                                }
                              
                            </a>
                        </>
                    ))
                }
            </aside>
        </>
    )
}