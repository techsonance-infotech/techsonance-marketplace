"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Target, AlertTriangle, ShoppingCart, TrendingUp, Download, Loader2, Tag, Calendar, Clock } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";
import { authToken } from "@/utils/authToken";
import { REVIEW_DATA } from "@/constants/vendor";
import AxiosAPI from "@/lib/axios";
import { CouponModel } from "@/components/vendor/CouponModel";

// --- Interfaces ---
interface OverallMetrics {
    totalCarts: number;
    totalOrders: number;
    conversionRate: number;
    abandonmentRate: number;
}

interface ProductConversion {
    variantId: string;
    variantName: string;
    sku: string;
    cartAdditions: number;
    orderCompletions: number;
    conversionRate: number;
}

// --- API Functions ---
export const fetchConversionMetrics = async (token: string) => {
    return await AxiosAPI.get(`/v1/orders/analytics/conversion`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const exportAnalyticsCsv = async (token: string) => {
  return await AxiosAPI.get(`/v1/orders/analytics/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'text/csv',
    },
    responseType: 'blob',
  });
};

export const fetchCoupons = async (token: string) => {
    return await AxiosAPI.get(`/v1/coupon`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export default function MarketingPage() {
    const params = useParams();
    const router = useRouter();
    const vendorId = params?.vendorId as string;
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [couponId, setCouponId] = useState<string | null>(null);

    // Analytics & Data State
    const [overallMetrics, setOverallMetrics] = useState<OverallMetrics | null>(null);
    const [productConversions, setProductConversions] = useState<ProductConversion[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const token = authToken();

    // Data Loaders
    const loadMetrics = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetchConversionMetrics(token as string);
            setOverallMetrics(res.data.data.overall);
            setProductConversions(res.data.data.productConversions);
        } catch (error) {
            console.error("Error fetching conversion metrics:", error);
        } finally {
            setIsLoadingMetrics(false);
        }
    }, [token]);

    const loadCoupons = useCallback(async () => {
        if (!token) return;
        try {
            const res = await fetchCoupons(token as string);
            setCoupons(res.data.data || []);
            console.log(res.data.data);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setIsLoadingCoupons(false);
        }
    }, [token]);

    // Initial Fetch
    useEffect(() => {
        if (!token) {
            router.push("/auth/vendorLogin");
            return;
        }
        loadMetrics();
        loadCoupons();
    }, [token, router, loadMetrics, loadCoupons]);

    // Pagination for Reviews
    const [count, setCount] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(REVIEW_DATA.length / pageSize);
    const startIndex = (count - 1) * pageSize;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await exportAnalyticsCsv(token as string);
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            const dateStr = new Date().getTime().toString();
            link.setAttribute('download', `store_analytics_${dateStr}.csv`);
            
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export analytics:", error);
            alert("Failed to download CSV.");
        } finally {
            setIsExporting(false);
        }
    };

    const openNewPromoModal = () => {
        setCouponId(null);
        setIsModalOpen(true);
    };

    const openEditPromoModal = (id: string) => {
        setCouponId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="relative min-h-screen bg-slate-50">
            {/* Promo Code Creation Modal */}
            {(isModalOpen || couponId) && (
                <CouponModel 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    id={couponId} 
                    onSuccess={loadCoupons} 
                />
            )}

            {/* Main Content Dashboard */}
            <main className="max-w-6xl mx-auto px-4 pb-10">
                <header className="flex justify-between items-center py-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Marketing & Analytics</h1>
                        <p className="text-sm text-gray-500 mt-1">Track conversions and manage promotions.</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                            {isExporting ? "Exporting..." : "Export CSV"}
                        </button>

                        <button
                            className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-100 transition-all flex items-center gap-2"
                            onClick={openNewPromoModal}
                        >
                            <Plus size={18} /> Add New Promo
                        </button>
                    </div>
                </header>

                {/* Overviews Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Store Conversion</span>
                            <span className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><Target size={18} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {isLoadingMetrics ? "..." : `${overallMetrics?.conversionRate || 0}%`}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Orders / Total Carts</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Abandonment Rate</span>
                            <span className="bg-red-50 text-red-600 p-2 rounded-lg"><AlertTriangle size={18} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {isLoadingMetrics ? "..." : `${overallMetrics?.abandonmentRate || 0}%`}
                        </h3>
                        <p className="text-xs text-red-500 mt-1 font-medium">Missed checkout opportunities</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Carts</span>
                            <span className="bg-blue-50 text-blue-600 p-2 rounded-lg"><ShoppingCart size={18} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {isLoadingMetrics ? "..." : overallMetrics?.totalCarts || 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Total intent to buy</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed Orders</span>
                            <span className="bg-purple-50 text-purple-600 p-2 rounded-lg"><TrendingUp size={18} /></span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">
                            {isLoadingMetrics ? "..." : overallMetrics?.totalOrders || 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Successfully processed</p>
                    </div>
                </div>

                {/* --- HORIZONTAL COUPON LISTING --- */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Tag size={20} className="text-blue-600" /> Active Promotions
                        </h2>
                    </div>

                    {isLoadingCoupons ? (
                        <div className="flex justify-center items-center py-10 bg-white border border-gray-200 rounded-2xl">
                            <Loader2 className="animate-spin text-gray-400" size={30} />
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 bg-white border border-gray-200 rounded-2xl border-dashed">
                            <Tag size={40} className="text-gray-300 mb-3" />
                            <p className="text-sm font-medium text-gray-600">No promotions available</p>
                            <p className="text-xs text-gray-400 mt-1">Create a promo code to offer discounts to your customers.</p>
                        </div>
                    ) : (
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
                            {coupons && Array.isArray(coupons) && coupons.map((coupon) => {
                                const isExpired = new Date(coupon.valid_to) < new Date();
                                const isActive = coupon.is_active && !isExpired;

                                return (
                                    <div 
                                        key={coupon.id} 
                                        className="min-w-[320px] max-w-[320px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm snap-start flex-shrink-0 relative flex flex-col justify-between"
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-5 right-5">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                                                isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {isActive ? 'Active' : 'Expired'}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-black text-gray-800 tracking-tight uppercase border-b-2 border-dashed border-gray-200 inline-block pb-1">
                                                    {coupon.code}
                                                </h3>
                                                <p className="text-xs text-gray-500 font-medium mt-2">{coupon.description}</p>
                                            </div>

                                            <div className="space-y-2.5 mb-6 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Discount</span>
                                                    <span className="font-bold text-blue-600 text-base">
                                                        {coupon.discount_type === 'percentage' 
                                                            ? `${coupon.discount_value}% OFF` 
                                                            : `₹${coupon.discount_value} OFF`}
                                                    </span>
                                                </div>
                                                
                                                <div className="h-[1px] w-full bg-gray-200"></div>

                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 flex items-center gap-1"><Clock size={12}/> Created</span>
                                                    <span className="text-gray-700 font-medium">{new Date(coupon.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 flex items-center gap-1"><Calendar size={12}/> Expires</span>
                                                    <span className={`${isExpired ? 'text-red-600' : 'text-gray-700'} font-medium`}>
                                                        {new Date(coupon.valid_to).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => openEditPromoModal(coupon.id)}
                                            className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl transition-colors border border-gray-200 shadow-sm"
                                        >
                                            Edit Rules
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Funnel Table */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-bold text-lg text-gray-800">Product Funnel Analytics</h2>
                        <p className="text-xs text-gray-500 mt-1">Identify which products are being abandoned at checkout to optimize pricing.</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                    <th className="p-4">Product Variant</th>
                                    <th className="p-4">SKU</th>
                                    <th className="p-4 text-center">Cart Additions</th>
                                    <th className="p-4 text-center">Purchased</th>
                                    <th className="p-4">Conversion Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoadingMetrics ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">Loading analytics data...</td>
                                    </tr>
                                ) : productConversions?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">No conversion data available yet.</td>
                                    </tr>
                                ) : (
                                    productConversions?.map((product) => (
                                        <tr key={product.variantId} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-semibold text-sm text-gray-800">{product.variantName}</td>
                                            <td className="p-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                                            <td className="p-4 text-center font-medium text-gray-600">{product.cartAdditions}</td>
                                            <td className="p-4 text-center font-medium text-gray-600">{product.orderCompletions}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-bold ${
                                                        product.conversionRate >= 50 ? 'text-emerald-600' :
                                                        product.conversionRate >= 20 ? 'text-amber-500' : 'text-red-500'
                                                    }`}>
                                                        {product.conversionRate}%
                                                    </span>
                                                    <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${
                                                                product.conversionRate >= 50 ? 'bg-emerald-500' :
                                                                product.conversionRate >= 20 ? 'bg-amber-400' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${Math.min(product.conversionRate, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                     <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-gray-800">Customer Reviews</h2>
                    </div>
                    <div className="p-8 text-center text-gray-400 text-sm">
                         Review mapping logic here...
                    </div>
                    <span className="flex justify-end p-4 border-t border-gray-100">
                        <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative" />
                    </span>
                </div>
            </main>

           
    
        </div>
    );
}