'use client';
import { useEffect, useState } from "react";
import {
    ArrowLeft, User, Mail, Phone, Calendar,
    ShoppingBag, RotateCcw, CreditCard, Ban, ShieldAlert
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { authToken } from "@/utils/authToken";
import { AccessStatus } from "../page"; // Importing the enum from your list page

interface CustomerDetail {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    access_status: AccessStatus;
    registered_at: string;
    stats: {
        total_orders: number;
        total_spent: number;
        total_returns: number;
        total_refunds: number;
    };
    orders: any[]; // Replace with your Order type
    returns: any[]; // Replace with your Return type
}

export default function VendorCustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'orders' | 'returns' | 'refunds'>('orders');
    const [customer, setCustomer] = useState<CustomerDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = authToken();

    useEffect(() => {
        if (!token) {
            router.push("/auth/vendorLogin");
            return;
        }

        // Simulate API Fetch
        const fetchCustomerDetails = async () => {
            setIsLoading(true);
            try {
                // await fetchVendorCustomerDetails(params.customerId, token)
                // Dummy Data Injection
                setTimeout(() => {
                    setCustomer({
                        id: params.customerId as string,
                        first_name: "Alex",
                        last_name: "Carter",
                        email: "alex.carter@example.com",
                        phone_number: "+1 555-0198",
                        access_status: AccessStatus.ACTIVE,
                        registered_at: "2025-10-12T10:00:00Z",
                        stats: {
                            total_orders: 12,
                            total_spent: 1450.00,
                            total_returns: 1,
                            total_refunds: 120.00
                        },
                        orders: [
                            { id: "ORD-9823", date: "2026-04-28", amount: 240.00, status: "Delivered", items: 3 },
                            { id: "ORD-9711", date: "2026-03-15", amount: 85.00, status: "Delivered", items: 1 },
                        ],
                        returns: [
                            { id: "RET-1102", order_id: "ORD-9500", date: "2026-01-10", reason: "Defective", status: "Approved" }
                        ]
                    });
                    setIsLoading(false);
                }, 800);
            } catch (error) {
                console.error("Failed to fetch customer", error);
            }
        };

        fetchCustomerDetails();
    }, [params.customerId, router]);

    if (isLoading) {
        return <div className="p-10 text-center text-gray-500 animate-pulse">Loading customer profile...</div>;
    }

    if (!customer) return null;

    return (
        <main className="w-full px-2 lg:px-4 max-w-7xl mx-auto pb-12">
            {/* Top Navigation */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors my-6 font-medium"
            >
                <ArrowLeft size={16} />
                Back to Customers
            </button>

            {/* Customer Profile Header Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                            {customer.first_name.charAt(0)}{customer.last_name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                {customer.first_name} {customer.last_name}
                                {customer.access_status === AccessStatus.SUSPENDED && (
                                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                        <ShieldAlert size={12} /> Suspended
                                    </span>
                                )}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Mail size={14} /> {customer.email}</span>
                                <span className="flex items-center gap-1.5"><Phone size={14} /> {customer.phone_number || 'No phone'}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {new Date(customer.registered_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Suspend/Activate Action Button */}
                    <div>
                        {customer.access_status === AccessStatus.ACTIVE ? (
                            <button className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                <Ban size={16} /> Suspend Customer
                            </button>
                        ) : (
                            <button className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                <User size={16} /> Reactivate Customer
                            </button>
                        )}
                    </div>
                </div>

                {/* Lifetime Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">{customer.stats.total_orders}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Lifetime Spent</p>
                        <p className="text-2xl font-bold text-gray-800">₹{customer.stats.total_spent.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Returns</p>
                        <p className="text-2xl font-bold text-gray-800">{customer.stats.total_returns}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Refunded</p>
                        <p className="text-2xl font-bold text-gray-800">₹{customer.stats.total_refunds.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabbed Navigation */}
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 px-2">
                {[
                    { id: 'orders', label: 'Order History', icon: ShoppingBag },
                    { id: 'returns', label: 'Returns & Cancels', icon: RotateCcw },
                    { id: 'refunds', label: 'Refunds', icon: CreditCard },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-colors relative ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <table className="w-full table-auto text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customer.orders.map((order, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm font-medium text-blue-600">#{order.id}</td>
                                    <td className="p-4 text-sm text-gray-600">{order.date}</td>
                                    <td className="p-4 text-sm text-gray-600">{order.items} items</td>
                                    <td className="p-4 text-sm font-semibold text-gray-800">₹{order.amount}</td>
                                    <td className="p-4">
                                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* RETURNS TAB */}
                {activeTab === 'returns' && (
                    <div className="p-8 text-center text-gray-500">
                        <RotateCcw size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-gray-700">Return History</p>
                        <p className="text-sm mt-1">Map your return data array here.</p>
                    </div>
                )}

                {/* REFUNDS TAB */}
                {activeTab === 'refunds' && (
                    <div className="p-8 text-center text-gray-500">
                        <CreditCard size={40} className="mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-gray-700">Financial Refunds</p>
                        <p className="text-sm mt-1">Map your refund ledger data here.</p>
                    </div>
                )}
            </div>
        </main>
    );
}