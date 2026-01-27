import { useDispatch, useSelector } from "react-redux";
import { searchImgDark, toggle_dark, toggle_light, TS_LOGO, userIcon } from "../../utils/constants";
import { toggleTheme } from "../../features/theme/adminThemeSlice";

import type { RootState } from "../../app/store";
export function Navbar({ title }: { title: string }) {
    const dispatch = useDispatch()
    const { theme } = useSelector((state: RootState) => state.adminTheme)
    return (
        <>
            <nav className={"flex border-b-2 border-gray-200 py-2 transition-colors duration-300 ease-in-out items-center justify-between px-6   " + (theme === 'light' ? 'bg-white' : 'bg-gray-800')}>
                <div className="nav_lift flex items-center">
                    <img src={TS_LOGO} alt="Techsonance Logo" className=" h-6 w-8 ml-16 " />
                    {title && <span className={"ml-4 font-medium text-xl " + (theme === 'light' ? 'text-black' : 'text-white')}>{title}</span>}
                </div>
                <div className="nav_right flex items-center gap-4">
                    <div className={`border-2  text-[.8rem] border-black/40 rounded-full flex items-center px-3  gap-2  filter ${theme == 'light' ? '':'invert'  }  `}>
                        <input type="text" name="search" id="" placeholder="Search system..." className="focus:outline-none text-[12px]  w-30 py-1" /> <button className="focus:outline-none">
                            <img src={searchImgDark} alt="" className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="toggle_btn transition-transform duration-300 ease-in-out cursor-pointer" onClick={() => { dispatch(toggleTheme()) }}>

                        <img src={theme == 'light' ? toggle_dark : toggle_light} alt="" className={`${theme == 'light' ?'rotate-180' : ''} h-8 w-8`} />


                    </div>
                    <div className="profile">
                        <img src={userIcon} alt="Admin Profile" className={`h-6 w-6     filter ${theme == 'light' ? '':'invert'  }`} />
                    </div>
                </div>
            </nav>
        </>
    )
}