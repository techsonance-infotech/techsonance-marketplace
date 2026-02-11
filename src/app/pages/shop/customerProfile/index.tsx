import { useSelector } from "react-redux";
import type { RootState } from "../../../store";
import { Handbag, Mail, Phone, Timer } from "lucide-react";
import { use } from "react";
import { DynamicIcon } from "lucide-react/dynamic";


export function UserProfile() {
    const { user } = useSelector((state: RootState) => state.auth);
    if (!user) {
        return null;
    }
    console.log()
    return (
        <>
            <section className="w-full">
                <section className="flex border-2 justify-between border-gray-200 items-center  px-6 rounded-xl  h-64">
                    <div className="flex flex-1 items-center gap-6">
                        <img src={user.profileImgUrl || "https://i.pinimg.com/originals/74/a3/b6/74a3b6a8856b004dfff824ae9668fe9b.jpg"} alt={user?.name || "User"} className="rounded-full w-32 h-32" />
                        <div className=" flex flex-col gap-2">
                            <h1 className="text-2xl font-bold  text-gray-900">{user.name}</h1>

                            <span className="flex gap-6">
                                <p className="flex items-center gap-2 text-gray-500">
                                    <Mail /> {user.email}</p> |
                                <p className="flex items-center gap-2 text-gray-500"><Phone /> {user.phone}</p>
                            </span>
                            <p className="text-gray-500">Member since: {new Date(user.created_at).toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>
                    <button className="px-6 py-2 border-2 border-gray-300 rounded-lg " >
                        Edit Profile
                    </button>
                </section>
                <div className="mt-8 flex gap-8">
                    <div className="card flex justify-between p-4 border-2 border-gray-200 rounded-xl gap-12 items-center">
                        <span>
                            <h2 className="font-bold  text-xl text-gray-500 mb-1">TOTAL ORDERS</h2>
                            <p className="text-3xl font-bold text-gray-700">{user.orders.length}</p>
                        </span>
                        <div className="flex items-center bg-brand-primary/10 p-2  justify-center  rounded-full h-12 w-12">
                            <Handbag className="text-brand-primary text-center" />
                        </div>
                    </div>
                    <div className="card flex justify-between p-4 border-2 border-gray-200 rounded-xl gap-12 items-center">
                        <span>
                            <h2 className="font-bold  text-xl text-gray-500 mb-1">ACTIVE ORDERS</h2>
                            <p className="text-3xl font-bold text-gray-700">{user.orders.filter(order => order.order_status === 'Pending').length}</p>
                        </span>
                        <div className="flex justify-center items-center bg-yellow-100 p-2 rounded-full h-12 w-12">
                            <Timer className="text-yellow-500 text-center" />
                        </div>
                    </div>
                </div>
                <section className="my-8 ">
                    <h1 className="font-bold text-2xl  w-full text-gray-900 mb-4">
                        Account Management
                    </h1>
                    <span className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <div className="card flex flex-1 gap-8  border-2 border-gray-200 rounded-xl p-6 ">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex justify-center items-center " >
                                <DynamicIcon name="map-pin" size={36} />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl  mb-2 text-gray-900">Saved Addresses</h2>
                                <p>
                                    Manage your saved addresses for faster checkout and delivery.
                                </p>
                                <p className='text-gray-500 line-clamp-1 mt-2' >
                                    Default Addresses: {user.addresses.filter((address) => address.is_default === true).map((address) => (
                                        <span key={address.address_id} >
                                            {address.address_line1}, {address.city}, {address.state} - {address.postal_code}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                        <div className="card flex flex-1 gap-8  border-2 border-gray-200 rounded-xl p-6  items-start">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex justify-center items-center " >
                                <DynamicIcon name="lock" size={36} />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl  mb-2 text-gray-900">Login & Security</h2>
                                <p>
                                    Manage your login credentials and security settings to keep your account safe.
                                </p>

                            </div>
                        </div>
                        <div className="card flex flex-1 gap-8  border-2 border-gray-200 rounded-xl p-6  items-start">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex justify-center items-center " >
                                <DynamicIcon name="bell" size={36} />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl  mb-2 text-gray-900">Notifications</h2>
                                <p>
                                    Manage your login credentials and security settings to keep your account safe.
                                </p>
                                <p className="mt-2">
                                    Email   Notifications: Enabled
                                </p>
                            </div>
                        </div>
                    </span>


                </section>
            </section>
        </>
    )
}
