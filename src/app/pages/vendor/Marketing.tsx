import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/vendor/Navbar";
import { Sidebar } from "../../../components/common/Sidebar";
import { userIcon, VENDOR_NAV_LINKS } from "../../../utils/constants";
import { Pagination } from "../../../components/common/Pagination";
import { useForm } from "react-hook-form";
import { set } from "zod";


interface Coupon {
    id: number;
    code: string;
    discount_type: 'PERCENTAGE' | 'FLAT_AMOUNT';
    value: number;            // The numerical value of the discount (e.g., 25 or 100)
    currency?: string;        // Currency code if it's a flat amount (e.g., "INR")
    status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
    conditions: {
        min_purchase_amount?: number;
        customer_segment?: 'ALL' | 'NEW_CUSTOMERS';
        expiry_text: string;    // Human-readable expiry or validity info
    };
}


const couponData: Coupon[] = [
    {
        id: 1,
        code: "WINTER26",
        discount_type: "PERCENTAGE",
        value: 25,
        status: "ACTIVE",
        conditions: {
            min_purchase_amount: 1000,
            customer_segment: "ALL",
            expiry_text: "Expires in 12 days"
        }
    },
    {
        id: 2,
        code: "WELCOME2026",
        discount_type: "FLAT_AMOUNT",
        value: 100,
        currency: "INR",
        status: "ACTIVE",
        conditions: {
            customer_segment: "NEW_CUSTOMERS",
            expiry_text: "No expiry"
        }
    }
];
interface UserReview {
    id: number;
    user_name: string;
    purchased_item: string;
    rating: number;         // Integer from 1 to 5
    review_text: string;
    time_posted: string;    // Relative time string
    actions: {
        can_reply: boolean;
        can_report: boolean;
    };
}

const ReviewData: UserReview[] = [
    {
        id: 1,
        user_name: "Rahul K.",
        purchased_item: "Cotton T-Shirt",
        rating: 5,
        review_text: "Great quality fabric! Fits perfectly and delivery was super fast. Will definitely order again.",
        time_posted: "2 hours ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 2,
        user_name: "Sneha M.",
        purchased_item: "Floral Summer Dress",
        rating: 4,
        review_text: "The print is beautiful and exactly as shown. The fit is slightly loose around the waist but comfortable.",
        time_posted: "5 hours ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 3,
        user_name: "Amit P.",
        purchased_item: "Slim Fit Jeans",
        rating: 3,
        review_text: "Quality is decent for the price, but the color faded slightly after the first wash.",
        time_posted: "1 day ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 4,
        user_name: "Priya S.",
        purchased_item: "Running Sneakers",
        rating: 5,
        review_text: "Absolutely love these! Very lightweight and perfect for my morning jogs.",
        time_posted: "2 days ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 5,
        user_name: "Vikram R.",
        purchased_item: "Leather Wallet",
        rating: 2,
        review_text: "The stitching started coming off within a week. Disappointed with the build quality.",
        time_posted: "3 days ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 6,
        user_name: "Anjali D.",
        purchased_item: "Cotton T-Shirt",
        rating: 5,
        review_text: "Ordered a size M and it fits true to size. Very soft material.",
        time_posted: "4 days ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 7,
        user_name: "Rohan G.",
        purchased_item: "Casual Linen Shirt",
        rating: 4,
        review_text: "Looks premium and feels great. Just wish the sleeves were a bit longer.",
        time_posted: "1 week ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 8,
        user_name: "Kavita L.",
        purchased_item: "Designer Handbag",
        rating: 1,
        review_text: "Product arrived damaged and customer support has been slow to respond.",
        time_posted: "1 week ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 9,
        user_name: "Arjun B.",
        purchased_item: "Wireless Headphones",
        rating: 5,
        review_text: "Best value for money. The bass is incredible and battery life lasts forever.",
        time_posted: "2 weeks ago",
        actions: { can_reply: true, can_report: true }
    },
    {
        id: 10,
        user_name: "Meera K.",
        purchased_item: "Cotton T-Shirt",
        rating: 3,
        review_text: "It's okay, but the fabric is thinner than I expected based on the photos.",
        time_posted: "2 weeks ago",
        actions: { can_reply: true, can_report: true }
    }
];
export function Marketing() {
    const couponFormRef = useRef(null);
    const [closedCouponForm, setClosedCouponForm] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { submitCount, errors } } = useForm({
        defaultValues: {
            type: 'percentage',
            code: '',
            value: 0
        }
    });
    const { isSidebarOpen } = useSelector((state: any) => state.sidebar);
    const [count, setCount] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(ReviewData.length / pageSize);
    const currentPage = count;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentData: typeof ReviewData = ReviewData.slice(startIndex, endIndex);

    const couponsColors = {
        text: [
            "text-blue-800",      // 0: Blue
            "text-green-800",     // 1: Green
            "text-yellow-800",    // 2: Yellow

            "text-gray-800",      // 4: Gray
            "text-purple-800",    // 5: Purple
            "text-pink-800",      // 6: Pink
            "text-indigo-800",    // 7: Indigo
            "text-orange-800",    // 8: Orange
            "text-teal-800",      // 9: Teal
            "text-cyan-800"       // 10: Cyan
        ],
        bg: [
            "bg-blue-100",        // 0: Blue
            "bg-green-100",       // 1: Green
            "bg-yellow-100",      // 2: Yellow

            "bg-gray-100",        // 4: Gray
            "bg-purple-100",      // 5: Purple
            "bg-pink-100",        // 6: Pink
            "bg-indigo-100",      // 7: Indigo
            "bg-orange-100",      // 8: Orange
            "bg-teal-100",        // 9: Teal
            "bg-cyan-100"         // 10: Cyan
        ]
    };
    const onSubmit = (data: any) => {
        console.log("Form Data Submitted: ", data);
        setClosedCouponForm(false);

    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (couponFormRef.current && !(couponFormRef.current as any).contains(event.target)) {
                // Close the form or perform any action
                console.log("Clicked outside coupon form");
                setClosedCouponForm(false);
                setValue('code', '');
                setValue('value', 0);
                setValue('type', 'percentage');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [])
    // console.log(couponFormRef.current)
    return (
        <>
            <Navbar title={"Marketing & Reviews"} />
            <Sidebar NAV_LINKS={VENDOR_NAV_LINKS} />
            {
                closedCouponForm && (

                    <section className=" absolute blur-4xl bg-black/20 w-full h-full top-0 left-0 z-10   "   >
                        <form className=" absolute top-[50%] bottom-[50%] left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] z-20 " ref={couponFormRef} onSubmit={handleSubmit(onSubmit)} >
                            <div className=" flex flex-col justify-center items-center h-full  ">
                                <div className=" bg-white  p-6 rounded-lg shadow-lg flex flex-col   w-96 ">
                                    <h2 className=" text-2xl font-bold my-2 ">Create Coupon & promo</h2>
                                    <select   className="my-2 border-2 py-1 px-2  border-gray-300 rounded-md"
                                        {...register('type')}
                                    >
                                        <option value="percentage">Percentage Discount</option>
                                        <option value="flat">Flat Amount Discount</option>
                                    </select>
                                    <div className="flex flex-col my-2 gap-2">
                                        <label htmlFor="code">Coupon Code</label>
                                        <input className="py-1 px-2 border-2 border-gray-300 rounded-md" type="text"
                                               {...register('code', { required: true })} />
                                    </div>
                                    <div className="flex flex-col my-2 gap-2">
                                        <label htmlFor="value">Discount Value</label>
                                        <input className="py-1 px-2 border-2 border-gray-300 rounded-md" type="number"   id="value" {...register('value', { required: true, validate: value => value > 0 })} />
                                    </div>
                                    <input className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 " value="Create" type="submit" />
                                </div>
                            </div>
                        </form>
                    </section>
                )

            }

            <main className={` mr-6  ${isSidebarOpen ? 'ml-50 ' : 'ml-24 '}`}>
                <header className="flex justify-end">
                    <button className="py-2 px-4 bg-blue-500 text-white rounded-lg my-6" onClick={() => setClosedCouponForm(true)}>
                        + Add New Coupon
                    </button>


                </header>
                <section className="mb-6">
                    <h2 className="font-bold text-xl mb-4">Active Coupons & Promo Codes</h2>
                    <div className="flex gap-6">


                        {
                            couponData.map((coupon, index) => (
                                <div key={index} className="border border-gray-400 rounded-lg p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between">
                                                <h3 className={`font-semibold text-lg ${couponsColors.text[index]} bg-none`}>{coupon.code}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm ${coupon.status === 'ACTIVE' ? `${couponsColors.bg[index]} ${couponsColors.text[index]}` : coupon.status === 'EXPIRED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {coupon.status}
                                                </span>
                                            </div>
                                            <p className="text-black  text-2xl font-bold">
                                                {coupon.discount_type === 'PERCENTAGE' ? `${coupon.value}% off` : `₹${coupon.value} off`}

                                            </p>
                                            <p className="text-gray-600">
                                                {coupon.conditions.customer_segment === 'ALL' ? 'All Customers' : 'New Customers'} | {coupon.conditions.min_purchase_amount ? `Min Purchase: ₹${coupon.conditions.min_purchase_amount}` : 'No Min Purchase'}
                                                <br />
                                                {coupon.conditions.expiry_text}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            ))
                        }
                    </div>


                </section>

                <section className="  mb-6  w-full ">

                    <h2 className="font-bold text-xl mb-4">User Reviews & Ratings</h2>
                    <div className="w-full flex flex-col gap-4 mb-6">
                        {
                            currentData?.map((review) => (

                                <div key={review.id} className="border border-gray-400 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2 w-full">
                                        <div className="flex flex-col gap-1">
                                            <span className="flex items-center gap-2 ">
                                                <img src={userIcon} alt="user icon" className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <h3 className="font-semibold text-lg">{review.user_name}</h3>
                                                    <p className="text-gray-600 text-sm">Purchased: {review.purchased_item}</p>
                                                </div>
                                            </span>
                                            <div className="flex items-center gap-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.455a1 1 0 00-.364 1.118l1.286 3.974c.3.921-.755 1.688-1.54 1.118l-3.39-2.455a1 1 0 00-1.176 0l-3.39 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.974a1 1 0 00-.364-1.118L2.034 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.951-.69l1.286-3.974z" />
                                                    </svg>
                                                ))}
                                            </div>

                                        </div>
                                        <div className=" text-sm text-gray-500">{review.time_posted} </div>
                                    </div>
                                    <p className="text-gray-800 mb-4 text-balance pl-10">"{review.review_text}"</p>
                                    <div className="flex gap-4">
                                        {review.actions.can_reply && <button className="text-blue-500  text-sm">Reply</button>}
                                        {review.actions.can_report && <button className="text-red-500  text-sm">Report</button>}
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                    <span className="flex justify-between items-start">
                        <p className="font-medium text-gray-500">
                            showing {startIndex + 1} to {Math.min(endIndex, ReviewData.length)} of {ReviewData.length} entries
                        </p>
                        <Pagination setCount={setCount} count={count} totalPages={totalPages} style="relative right-0 w-54" />
                    </span>
                </section>

            </main>

        </>
    )
}
