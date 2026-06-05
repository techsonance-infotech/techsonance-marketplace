"use client";
import { useEffect, useReducer } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { fetchCancelOrderItem, fetchOrderItemDetails } from "@/utils/customerApiClient";
import { formatCurrency } from "@/lib/utils";
import { useAppSelector } from "@/hooks/reduxHooks";
import { authToken } from "@/utils/authToken";

const CANCEL_REASONS = [
    "Order created by mistake",
    "Item(s) would not arrive on time",
    "Shipping cost is too high",
    "Found cheaper somewhere else",
    "Need to change shipping address",
    "Need to change payment method",
    "Other"
];

interface State {
    itemToCancel: any;
    selectedReason: string;
    additionalComments: string;
    isSubmitting: boolean;
    error: string;
}

type Action = 
    | { type: "SET_ITEM"; payload: any }
    | { type: "SET_REASON"; payload: string }
    | { type: "SET_COMMENTS"; payload: string }
    | { type: "SET_SUBMITTING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_ITEM": return { ...state, itemToCancel: action.payload };
        case "SET_REASON": return { ...state, selectedReason: action.payload, error: "" };
        case "SET_COMMENTS": return { ...state, additionalComments: action.payload };
        case "SET_SUBMITTING": return { ...state, isSubmitting: action.payload };
        case "SET_ERROR": return { ...state, error: action.payload, isSubmitting: false };
        default: return state;
    }
}

export default function CancelItemClient() {
    const { orderId, itemId } = useParams<{ orderId: string; itemId: string }>();
    const { user } = useAppSelector((state) => state.auth);
    const userId = user?.id;
    const router = useRouter();

    const [state, dispatch] = useReducer(reducer, {
        itemToCancel: null,
        selectedReason: "",
        additionalComments: "",
        isSubmitting: false,
        error: ""
    });

    const token = authToken();

    useEffect(() => {
        if (!orderId || !itemId || !token) return;
        const getOrder = async () => {
            const res = await fetchOrderItemDetails(itemId, token);
            if (res?.data) {
                console.log(res.data);
                dispatch({ type: "SET_ITEM", payload: res.data });
            }
        };
        getOrder();
    }, [orderId, itemId, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!state.selectedReason) {
            dispatch({ type: "SET_ERROR", payload: "Please select a cancellation reason." });
            return;
        }
        dispatch({ type: "SET_SUBMITTING", payload: true });
        
        try {
            const fullReason = `${state.selectedReason} - ${state.additionalComments}`;
            if (!userId || !itemId || !token) {
                dispatch({ type: "SET_ERROR", payload: "User not found." });
                return;
            }

            const response = await fetchCancelOrderItem(userId, itemId, fullReason, token);
            console.log(response);
            if (response) {
                router.back();
            } else {
                dispatch({ type: "SET_ERROR", payload: "Failed to cancel item. Please try again." });
            }
        } catch (err) {
            dispatch({ type: "SET_ERROR", payload: "An error occurred. Please contact support." });
        }
    };

    if (!state.itemToCancel) return <div className="p-8 text-center">Loading item details...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Cancel Item</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                <h2 className="text-lg font-semibold mb-4">Item to Cancel</h2>
                <div className="flex gap-4 items-center">
                    <img
                        src={state.itemToCancel.variant.images[0]?.image_url}
                        alt={state.itemToCancel.variant.variant_name}
                        className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                    />
                    <div>
                        <p className="font-medium text-gray-900">{state.itemToCancel.variant.variant_name}</p>
                        <p className="text-gray-500 text-sm">Qty: {state.itemToCancel.quantity}</p>
                        <p className="font-semibold mt-1">₹{formatCurrency(Number(state.itemToCancel.price))}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Why are you cancelling?</h2>

                {state.error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={16} /> {state.error}
                    </div>
                )}

                <div className="space-y-3 mb-6">
                    {CANCEL_REASONS.map((reason) => (
                        <label key={reason} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="cancel_reason"
                                value={reason}
                                checked={state.selectedReason === reason}
                                onChange={(e) => dispatch({ type: "SET_REASON", payload: e.target.value })}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 text-sm">{reason}</span>
                        </label>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments (Optional)
                    </label>
                    <textarea
                        rows={3}
                        value={state.additionalComments}
                        onChange={(e) => dispatch({ type: "SET_COMMENTS", payload: e.target.value })}
                        placeholder="Tell us more about why you are cancelling..."
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                    >
                        Keep Item
                    </button>
                    <button
                        type="submit"
                        disabled={state.isSubmitting}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 disabled:bg-red-400"
                    >
                        {state.isSubmitting ? "Processing..." : "Confirm Cancellation"}
                    </button>
                </div>
            </form>
        </div>
    );
}
