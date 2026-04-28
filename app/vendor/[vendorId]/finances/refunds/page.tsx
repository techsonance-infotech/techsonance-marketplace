'use client';

import { useEffect, useState } from "react";
import { searchImgDark } from "@/constants/common";
import { ChevronDown, ChevronUp, Download, CornerDownLeft, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchGetCompanyRefunds, fetchProcessRefund } from "@/utils/vendorApiClient";

// Mapped exactly to your backend response structure
interface RefundRecord {
    id: string;
    refund_amount: string;
    refund_reason: string;
    refund_status: string; // 'pending', 'processed', etc.
    scope: 'item' | 'order';
    created_at: string;
    order_id: string;
    order_items_id: string | null;
    payment_id: string;
}

interface RefundDashboardData {
    total: number;
    totalPendingAmount: number;
    itemRefunds: RefundRecord[];
    orderRefunds: RefundRecord[];
    refunds: RefundRecord[];
}

export const RefundsTableHeader = [
    "Refund ID",
    "Order Ref",
    "Scope",
    "Amount",
    "Reason",
    "Status",
    "Date",
    "Actions"
];

export default function RefundsPage() {
    const params = useParams();
    const vendorId = params.vendorId as string;

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [dashboardData, setDashboardData] = useState<RefundDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setIsOpen(false);
    };

    const fetchRefunds = async () => {
        setLoading(true);
        try {
            const response = await fetchGetCompanyRefunds()
            setDashboardData(response.data);
        } catch (err) {
            console.error("Error fetching refunds list:", err);
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const handleProcessPayment = async (refundId: string) => {
        const confirmProcess = window.confirm(
            "Have you successfully transferred this amount back to the customer's original payment method? This action cannot be undone."
        );

        if (!confirmProcess) return;

        try {
            setProcessingId(refundId);
            await fetchProcessRefund(refundId);
            await fetchRefunds();
        } catch (err: any) {
            console.error("Failed to process refund", err);
            alert(err.response?.data?.message || "An error occurred while processing the refund.");
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase(); // Handle backend lowercase status safely
        if (s === "PENDING")
            return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 py-1 px-3 rounded-full text-xs font-semibold">● Pending</span>;
        if (s === "PROCESSED")
            return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 py-1 px-3 rounded-full text-xs font-semibold">● Processed</span>;
        if (s === "REJECTED")
            return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 py-1 px-3 rounded-full text-xs font-semibold">● Rejected</span>;

        return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 border border-gray-200 py-1 px-3 rounded-full text-xs font-semibold capitalize">● {status}</span>;
    };

    const formatCurrency = (amount: string | number) => {
        return Number(amount).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
    };

    return (
        <main className="w-full px-1">
            {/* Header */}
            <header className="flex flex-wrap justify-between items-center my-6 gap-4">
                <div className="flex flex-wrap items-center gap-4 text-gray-700">
                    <div className="flex items-center gap-2">
                        <CornerDownLeft size={24} className="text-orange-500" />
                        <h1 className="text-2xl font-bold text-gray-800">Refunds Hub</h1>
                    </div>
                    {/* Displaying Summary Stats from Backend */}
                    {dashboardData && (
                        <div className="flex gap-2">
                            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                {dashboardData.total} Total Requests
                            </span>
                            <span className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full">
                                ₹{formatCurrency(dashboardData.totalPendingAmount)} Pending Clearance
                            </span>
                        </div>
                    )}
                </div>
                <button className="flex items-center gap-2 font-semibold text-sm bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl px-5 py-2.5 transition-colors shadow-sm">
                    <Download size={16} />
                    Export CSV
                </button>
            </header>

            {/* Filter Bar */}
            <div className="relative flex flex-wrap justify-between rounded-xl items-center py-3 px-4 gap-3 bg-white border border-gray-200 shadow-sm mb-4">
                {/* Search */}
                <span className="flex flex-1 min-w-[220px] items-center gap-2 border border-gray-200 bg-gray-50 py-2 px-3 rounded-xl focus-within:border-orange-400 focus-within:bg-white transition-colors">
                    <img className="w-5 h-5 opacity-50 shrink-0" src={searchImgDark} alt="search icon" />
                    <input
                        type="text"
                        className="text-sm bg-transparent w-full outline-none text-gray-700 placeholder:text-gray-400"
                        placeholder="Search by Refund ID or Order Ref"
                    />
                </span>

                {/* Filters */}
                <span className="flex flex-wrap gap-3 items-center">
                    <select className="text-sm border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-gray-600 outline-none focus:border-orange-400 cursor-pointer transition-colors" name="status">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select className="text-sm border border-gray-200 bg-gray-50 rounded-xl px-3 py-2 text-gray-600 outline-none focus:border-orange-400 cursor-pointer transition-colors" name="sort_by">
                        <option value="date_newest">Newest First</option>
                        <option value="date_oldest">Oldest First</option>
                        <option value="amount_highest">Highest Amount</option>
                    </select>

                    {isOpen ? (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-sm border border-orange-300 bg-orange-50 text-orange-600 rounded-xl px-3 py-2 font-medium transition-colors"
                        >
                            {date ? date.toDateString() : "Select Date"}
                            <ChevronUp size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="flex items-center gap-2 text-sm border border-gray-200 bg-gray-50 text-gray-600 rounded-xl px-3 py-2 hover:border-gray-300 transition-colors"
                        >
                            {date ? date.toDateString() : "Select Date"}
                            <ChevronDown size={16} />
                        </button>
                    )}

                    {isOpen && (
                        <div className="absolute right-4 top-full mt-2 z-20 shadow-lg rounded-xl overflow-hidden border border-gray-200">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateChange}
                                className="rounded-xl bg-white"
                                captionLayout="dropdown"
                            />
                        </div>
                    )}
                </span>
            </div>

            {/* Data Table */}
            <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
                <table className="w-full table-auto min-w-[900px] border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-left">
                            <th className="p-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                            </th>
                            {RefundsTableHeader.map((header) => (
                                <th key={header} className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="py-16 text-center text-gray-400">
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-sm">Loading refunds...</p>
                                </td>
                            </tr>
                        ) : !dashboardData || dashboardData.refunds.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-16 text-center text-gray-400 text-sm">
                                    <CornerDownLeft size={36} className="mx-auto mb-3 opacity-30" />
                                    No refund records found.
                                </td>
                            </tr>
                        ) : (
                            dashboardData.refunds.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                                    </td>

                                    {/* REFUND ID */}
                                    <td className="p-4">
                                        <span className="font-mono text-sm font-semibold text-gray-800">
                                            REF-{item.id.split("-")[0].toUpperCase()}
                                        </span>
                                    </td>

                                    {/* ORDER REF - Using direct order_id from response */}
                                    <td className="p-4">
                                        <Link href={`/vendor/${vendorId}/orders/${item.order_id}`} className="font-mono text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                                            ORD-{item.order_id.split("-")[0].toUpperCase()}
                                        </Link>
                                    </td>

                                    {/* SCOPE */}
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md uppercase ${item.scope === 'order' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {item.scope}
                                        </span>
                                    </td>

                                    {/* AMOUNT */}
                                    <td className="p-4">
                                        <span className="font-bold text-gray-900">
                                            ₹{formatCurrency(item.refund_amount)}
                                        </span>
                                    </td>

                                    {/* REASON */}
                                    <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={item.refund_reason}>
                                        {item.refund_reason || "N/A"}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        {getStatusBadge(item.refund_status)}
                                    </td>

                                    {/* DATE */}
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(item.created_at).toLocaleDateString("en-GB", {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-4">
                                        {/* Safely handle lowercase "pending" from backend */}
                                        {item.refund_status.toLowerCase() === 'pending' ? (
                                            <button
                                                onClick={() => handleProcessPayment(item.id)}
                                                disabled={processingId === item.id}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                                            >
                                                {processingId === item.id ? (
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : null}
                                                Process Payment
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-400 font-medium">No action needed</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}