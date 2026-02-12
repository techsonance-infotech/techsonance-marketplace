import { Check, X, Copy, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface OrderItem {
    id: string;
    name: string;
    image: string;
    color: string;
    quantity: number;
    price: number;
}

interface ShippingAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface PaymentMethod {
    type: string;
    details: string;
}

interface OrderSuccessStatusTypes {
    orderId?: string;
    orderDate?: string;
    estimatedDelivery?: string;
    shippingAddress?: ShippingAddress;
    paymentMethod?: PaymentMethod;
    items?: OrderItem[];
    subtotal?: number;
    discount?: number;
    delivery?: number;
    total?: number;

}

interface OrderFailedStatusTypes {
    errorCode?: string;
    transactionId?: string;
    attemptedAmount?: number;
    possibleReasons?: string[];
}

interface OrderStatusProps {
    
    status: "success" | "failed";
    orderSuccess: OrderSuccessStatusTypes;
    orderFailed: OrderFailedStatusTypes;
    onRetryPayment?: () => void;
    onChangePaymentMethod?: () => void;
}
const mockOrderStatus: OrderSuccessStatusTypes = {
    orderId: "#345-9204268-1845104",
    orderDate: "Jan 1",
    estimatedDelivery: "Jan 4",
    shippingAddress: {
        line1: "flat no 202, bblossom the presidency,",
        line2: "vesu, near raguver spectrum building",
        city: "SURAT",
        state: "GUJARAT",
        postalCode: "395007",
        country: "India"
    },
    paymentMethod: {
        type: "UPI",
        details: "bankofindia@1313yap"
    },
    items: [
        {
            id: "1",
            name: "Sound Sphere Bass Pro",
            image: "/product-image.png",
            color: "Midnight Black",
            quantity: 1,
            price: 1399
        }
    ],
    subtotal: 1399,
    discount: 300,
    delivery: 0,
    total: 1099,

}

const mockFailedStatus: OrderFailedStatusTypes = {
    errorCode: "PAYMENT_DECLINED",
    transactionId: "TXN123456789",
    attemptedAmount: 1099,
    possibleReasons: [
        "Insufficient funds in the account.",
        "Incorrect card details entered.",
        "Bank's fraud detection system flagged the transaction.",
        "Technical issues with the payment gateway."
    ]
}
export function OrderStatus({
    status,
    orderSuccess = mockOrderStatus,
    orderFailed = mockFailedStatus,
    onRetryPayment,
    onChangePaymentMethod
}: OrderStatusProps) {
    const [copied, setCopied] = useState(false);

    const copyOrderId = () => {
        navigator.clipboard.writeText(orderSuccess.orderId || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const orderStatuses = [
        { label: "Order Placed", date: orderSuccess.orderDate, active: true },
        { label: "Processing", date: "", active: false },
        { label: "Shipped", date: "", active: false },
        { label: "Delivered", date: `Est. ${orderSuccess.estimatedDelivery}`, active: false }
    ];

    // Render Success Page
    if (status === "success") {
        return (
            <div className="min-h-screen bg-white pb-20">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    {/* Success Icon & Message */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-200 rounded-full mb-4">
                            <Check className="w-10 h-10 text-green-700" strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-gray-600">
                            Thank you for your purchase. We've emailed you the receipt.
                        </p>
                    </div>

                    {/* Order ID */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-semibold">{orderSuccess.orderId}</span>
                            <button
                                onClick={copyOrderId}
                                className="ml-2 text-blue-600 hover:text-blue-700"
                                title="Copy Order ID"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Order Status Timeline */}
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-bold mb-6">Order Status</h2>
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-300">
                                <div className="h-full bg-black w-0 transition-all duration-500"></div>
                            </div>

                            {/* Status Points */}
                            <div className="relative flex justify-between">
                                {orderStatuses.map((statusItem, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div
                                            className={`w-4 h-4 rounded-full mb-2 ${index === 0 ? "bg-black" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div className="text-center">
                                            <div className={`text-sm font-medium ${index === 0 ? "text-black" : "text-gray-400"
                                                }`}>
                                                {statusItem.label}
                                            </div>
                                            {statusItem.date && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {statusItem.date}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Delivery Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                            SHIPPING ADDRESS
                                        </h3>
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {orderSuccess?.shippingAddress.line1}
                                            {orderSuccess?.shippingAddress.line2 && (
                                                <>
                                                    <br />
                                                    {orderSuccess.shippingAddress.line2}
                                                </>
                                            )}
                                            <br />
                                            {orderSuccess?.shippingAddress.city}, {orderSuccess.shippingAddress.state}{" "}
                                            {orderSuccess.shippingAddress.postalCode}
                                            <br />
                                            {orderSuccess.shippingAddress.country}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                            PAYMENT METHOD
                                        </h3>
                                        <p className="text-sm text-gray-800">
                                            {orderSuccess.paymentMethod.type}
                                            <br />
                                            {orderSuccess.paymentMethod.details}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Ordered */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                                <h2 className="text-xl font-bold mb-4">Items Ordered</h2>
                                {orderSuccess.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23e5e7eb'/%3E%3C/svg%3E";
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Color: {item.color}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-semibold">₹{item.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-4">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Subtotal</span>
                                        <span>₹{orderSuccess.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Discount</span>
                                        <span className="text-green-600">- ₹{orderSuccess.discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Delivery</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mb-6">
                                    <div className="flex justify-between items-center text-xl font-bold">
                                        <span>Total</span>
                                        <span>₹{orderSuccess?.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link
                                    to="/"
                                    className="block w-full bg-black text-white text-center font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Failed Page
    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Error Icon & Message */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-200 rounded-full mb-4">
                        <X className="w-10 h-10 text-red-600" strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order failed!</h1>
                    <p className="text-gray-600">
                        We couldn't process your payment. Don't worry, no funds
                        <br />
                        have been deducted from your account.
                    </p>
                </div>

                {/* Error Details */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Error Code</span>
                            <span className="font-semibold text-red-600">{orderFailed?.errorCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Transaction ID</span>
                            <span className="font-semibold">{orderFailed?.transactionId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Attempted Amount</span>
                            <span className="font-semibold">Rs. {orderFailed?.attemptedAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Possible Reasons */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4">Possible Reasons:</h2>
                    <div className="space-y-2">
                        {orderFailed?.possibleReasons.map((reason, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{reason}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={onRetryPayment}
                        className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Retry Payment
                    </button>

                    <button
                        onClick={onChangePaymentMethod}
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Change Payment Method
                    </button>
                </div>

                {/* Support Link */}
                <div className="text-center mt-8">
                    <Link
                        to="/support"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Need help? Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}