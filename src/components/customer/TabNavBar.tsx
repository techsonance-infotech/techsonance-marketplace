import { motion } from "motion/react"
import { TAB_LINKS } from "../../utils/customer/constants"

import { DynamicIcon } from "lucide-react/dynamic"
import { Link, useLocation, } from "react-router"
import { useSelector } from "react-redux"



export function TabNavBar() {
    const { user } = useSelector((state: any) => state.auth)

    const path = useLocation().pathname;
    return (
        <>
            <motion.footer className="fixed bottom-0 w-full bg-white   border-t-gray-300 pt-1 pb-1 px-4 flex justify-around items-center lg:hidden z-100">
                {
                    TAB_LINKS.map((link, index) => {
                        if (!user) {
                            link.url = link.url.toLowerCase() === '/profile' ? '/customerProfile' : link.url.toLowerCase() === '/cart' ? '/customerProfile' : link.url;
                        } else {
                            link.title.toLowerCase() === 'profile' ? link.url = `/customerProfile/${user?.id}` : link.title.toLowerCase() === 'cart' ? link.url = `/customerProfile/${user?.id}/cart` : link.url = link.url;
                        }
                        link.title.toLowerCase() === 'profile' ? link.url = `/customerProfile/${user?.id}` : link.title.toLowerCase() === 'cart' ? link.url = `/customerProfile/${user?.id}/cart` : link.url = link.url;

                        return (
                            <motion.div key={index} whileTap={{ scale: 0.95 }} className=" relative z-150 pt-2">

                                <Link to={link.url} className={` relative flex flex-col items-center justify-center gap-1  p-2 text-sm z-50 `}>
                                    <DynamicIcon name={link.iconNames} className={`${path === link.url ? 'text-primary' : 'text-gray-500'}  z-60 `} />
                                    <motion.p className={`${path === link.url ? 'text-primary' : 'text-gray-500'} z-60 `}>{link.title}</motion.p>
                                </Link>
                                {path === link.url && <motion.div layoutId="tab-pill" animate={{ opacity: 1 }} transition={{ type: "spring", ease: "linear", duration: 0.3 }} className={`absolute inset-0 bg-brand-primary w-full   rounded-full transition-opacity duration-300 z-30`} />}
                            </motion.div>
                        )
                    })

                }
            </motion.footer>
        </>
    )
}
