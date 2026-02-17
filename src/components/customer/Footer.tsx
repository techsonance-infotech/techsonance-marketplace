import { Link, Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";
import { FOOTER_BOTTOM_TEXT, FOOTER_CONTENT } from "../../utils/customer/constants";
import { DynamicIcon } from "lucide-react/dynamic";

export function Footer({ styles }: { styles?: string }) {
    const path = useLocation().pathname;

    // Skip footer for admin/vendor routes
    if (path.startsWith('/admin') || path.startsWith('/vendor')) {
        return <Outlet />;
    }

    // Hide main footer content for Auth pages
    const isAuthPage = path === '/customerRegister' || path === '/customerLogin';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const columnVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50 }
        }
    };

    return (
        <footer className={`bg-footer xl:px-32 lg:px-8 md:px-4 sm:px-2 py-8 px-4 ${styles}`}>
            {!isAuthPage && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full flex flex-col sm:flex-row justify-between gap-8 mb-12"
                >
                    {FOOTER_CONTENT.map((section, index) => (
                        <motion.ul
                            key={index}
                            variants={columnVariants}
                            className="flex flex-col gap-4 min-w-[150px]"
                        >
                            <li className="font-bold text-lg text-primary mb-2">
                                {section.header}
                            </li>

                            {section.links.map((link, linkIndex) => (
                                <motion.li
                                    key={linkIndex}
                                    whileHover={{ x: 5 }}
                                    className="text-sm text-primary hover:text-brand-primary transition-colors"
                                >
                                    <Link
                                        to={link.url}
                                        className="flex items-center gap-2 group"
                                    >
                                        {link.icon && (
                                                <DynamicIcon
                                                    name={link.icon}
                                                    className={link.styles}
                                                    size={28}
                                                />
                                          
                                        )}
                                        {link.category !== 'social' && <span className="w-64 text-balance" >{link.title}</span>}
                                    </Link>
                                </motion.li>
                            ))}
                        </motion.ul>
                    ))}
                </motion.div>
            )}

            <div className="flex flex-col items-center">
                <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    className="h-[1px] bg-black/10 mb-6"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-light text-center text-gray-100 text-sm max-w-2xl leading-relaxed"
                >
                    {FOOTER_BOTTOM_TEXT}
                </motion.p>
            </div>
        </footer>
    );
}