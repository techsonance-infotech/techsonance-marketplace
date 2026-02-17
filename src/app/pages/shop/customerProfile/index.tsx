import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Handbag, Mail, Phone, Timer, MapPin, Lock, Bell } from "lucide-react";
import type { RootState } from "../../../store";
import { useEffect, useState } from "react";


const Counter = ({ value }: { value: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;


        const duration = 1000;
        const incrementTime = Math.abs(Math.floor(duration / end));

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
};


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 50 }
    }
};

export function UserProfile() {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!user) return null;

    const activeOrders = user.orders.filter(order => order.order_status === 'Pending').length;

    return (
        <motion.section
            className="w-full   mx-auto lg:px-4 lg:py-8 px-2 py-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >

            <motion.section
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="flex flex-col md:flex-row justify-between items-center lg:p-8 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm lg:gap-6 gap-2"
            >
                <div className="flex flex-col md:flex-row items-center gap-8   w-full">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                    >
                        <img
                            src={user.profileImgUrl || "https://i.pinimg.com/originals/74/a3/b6/74a3b6a8856b004dfff824ae9668fe9b.jpg"}
                            alt={user.name || "User"}
                            className="rounded-full w-32 h-32 object-cover border-4 border-gray-50 shadow-md"
                        />
                        <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                    </motion.div>

                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 text-sm">
                            <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                <Mail size={14} /> {user.email}
                            </span>
                            <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                <Phone size={14} /> {user.phone}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-2 font-medium">
                            Member since: {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                    Edit Profile
                </motion.button>
            </motion.section>


            <div className="mt-8 flex flex-col md:flex-row gap-6">
                {[
                    { label: "TOTAL ORDERS", value: user.orders.length, icon: Handbag, color: "bg-brand-primary", text: "text-brand-primary" },
                    { label: "ACTIVE ORDERS", value: activeOrders, icon: Timer, color: "bg-yellow-500", text: "text-yellow-500" }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                        className="flex-1 flex justify-between items-center lg:p-6 px-3 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm transition-all"
                    >
                        <div>
                            <h2 className="font-bold text-sm text-gray-400 mb-1 tracking-wider">{stat.label}</h2>
                            <p className="lg:text-4xl text-3xl font-extrabold text-gray-800">
                                <Counter value={stat.value} />
                            </p>
                        </div>
                        <div className={`flex items-center justify-center ${stat.color}/10 p-4 rounded-full h-16 w-16`}>
                            <stat.icon className={`${stat.text} w-8 h-8`} />
                        </div>
                    </motion.div>
                ))}
            </div>


            <motion.section variants={itemVariants} className="my-8">
                <h1 className="font-bold lg:text-2xl text-xl text-gray-900 mb-6">Account Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    <ManagementCard
                        icon={<MapPin size={28} className="text-blue-600" />}
                        color="bg-blue-50"
                        title="Saved Addresses"
                        description="Manage your saved addresses for faster checkout and delivery."
                    >
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Default Address</p>
                            {user.addresses.filter(a => a.is_default).length > 0 ? (
                                user.addresses.filter(a => a.is_default).map(address => (
                                    <p key={address.address_id} className="text-sm text-gray-600 line-clamp-1">
                                        {address.address_line1}, {address.city}...
                                    </p>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No default address set</p>
                            )}
                        </div>
                    </ManagementCard>

                    <ManagementCard
                        icon={<Lock size={28} className="text-green-600" />}
                        color="bg-green-50"
                        title="Login & Security"
                        description="Manage your login credentials and security settings to keep your account safe."
                    />


                    <ManagementCard
                        icon={<Bell size={28} className="text-yellow-600" />}
                        color="bg-yellow-50"
                        title="Notifications"
                        description="Customize how you receive updates and promotional offers."
                    >
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium text-gray-600">Email Notifications: Enabled</p>
                        </div>
                    </ManagementCard>
                </div>
            </motion.section>
        </motion.section>
    );
}


const ManagementCard = ({ icon, color, title, description, children }: any) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, backgroundColor: "#fafafa" }}
        className="flex flex-col lg:p-6 p-3 border border-gray-200 rounded-2xl bg-white shadow-sm cursor-pointer transition-colors"
    >
        <div className="flex items-start gap-6">
            <div className={`w-14 h-14 ${color} rounded-2xl flex justify-center items-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <h2 className="font-bold lg:text-xl text-lg mb-2 text-gray-900">{title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
        {children}
    </motion.div>
);