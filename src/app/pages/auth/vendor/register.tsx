import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { passwordValidationSchema } from "../../../../utils/validation";
import { VENDOR_AUTH_URL } from "../../../../utils/constants";

interface FormData {
    business_name: string;
    business_number: string;
    business_owner_full_name: string;
    category: string;
    country?: string; // Optional if not in the form
    vendor_admin_email: string;
    vendor_admin_full_name: string;
    password: string;
    confirm_password: string;
}

export function VendorRegister() {
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState<string | null>(null);

    // Initialize React Hook Form
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        defaultValues: {
            business_name: "",
            business_number: "",
            business_owner_full_name: "",
            category: "",
            vendor_admin_email: "",
            vendor_admin_full_name: "",
            password: "",
            confirm_password: "",
        }
    });

    const onSubmit = async (data: FormData) => {
        setGlobalError(null);
        try {
            const response = await axios.post(`${VENDOR_AUTH_URL}/register-vendor`, {
                user_role: 'vendor',
                business_name: data.business_name,
                business_number: data.business_number,
                business_owner_full_name: data.business_owner_full_name,
                category: data.category,
                vendor_admin_email: data.vendor_admin_email,
                vendor_admin_full_name: data.vendor_admin_full_name,
                password: data.password,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Registration successful');
                reset(); // Clear form on success
                navigate(`/vendorLogin`);
            }
        } catch (error: unknown) {
            console.error(error);
            setGlobalError("Registration failed. Please try again.");
        }
    };

    return (
        <>
            <main className="py-20 m-auto max-w-4xl px-6 font-[inter] mb-2 flex flex-col items-center ">
                <div className="w-full">
                    <h1 className="font-bold text-2xl mb-2">
                        Business Registration
                    </h1>
                    <p className="mb-6 text-balance">Setup the organization profile, assign a domain, and create the admin account.</p>
                </div>

                {/* React Hook Form handles the e.preventDefault() under the hood */}
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6 ">
                    <section className="border p-6 rounded-2xl mb-6 w-full">
                        <h1 className="font-bold text-xl text-left mb-2">
                            Organization Details
                        </h1>
                        <span className="flex gap-8 flex-col">
                            <span className="flex lg:flex-row lg:flex-nowrap justify-between gap-6 w-full">
                                <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="business_name">
                                        Vendor / Business Name <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="rounded-xl border-2 border-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-1.5"
                                        placeholder="Enter your business name"
                                        {...register("business_name", { required: "Business name is required" })}
                                    />
                                    {errors.business_name && <p className="text-red-600 text-sm">{errors.business_name.message}</p>}
                                </div>

                                <div className="flex flex-col gap-2 w-full">
                                    <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                                        Business Category <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        className="border-2 py-[.5rem] px-4 rounded-xl"
                                        {...register("category", { required: "Please select a business category" })}
                                    >
                                        <option value="">Select Business Category</option>
                                        <option value="retail">Retail</option>
                                        <option value="diy_hardware">DIY and hardware</option>
                                        <option value="fashion">Fashion and apparel</option>
                                        <option value="food_and_beverages">Food and beverages</option>
                                        <option value="health_and_wellness">Health and wellness</option>
                                        <option value="automotive">Automotive</option>
                                        <option value="sports_and_outdoors">Sports and outdoors</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="technology">Technology</option>
                                        <option value="beauty_and_personal_care">Beauty and personal care</option>
                                        <option value="hospitality">Toys and hobbies</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.category && <p className="text-red-600 text-sm">{errors.category.message}</p>}
                                </div>
                            </span>

                            <span className="flex lg:flex-row lg:flex-nowrap justify-between gap-6">
                                <div className="flex flex-col gap-2 w-full ">
                                    <label htmlFor="business_owner_full_name">Business Owner Full Name <span className="text-red-600">*</span></label>
                                    <input
                                        type="text"
                                        className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                        placeholder="Enter business owner full name"
                                        {...register("business_owner_full_name", { required: "Owner name is required" })}
                                    />
                                    {errors.business_owner_full_name && <p className="text-red-600 text-sm">{errors.business_owner_full_name.message}</p>}
                                </div>
                                <div className="flex flex-col gap-2 w-full ">
                                    <label htmlFor="business_number">Business Number <span className="text-red-600">*</span></label>
                                    <input
                                        type="text"
                                        className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                        placeholder="Enter business owner contact number"
                                        {...register("business_number", { required: "Business number is required" })}
                                    />
                                    {errors.business_number && <p className="text-red-600 text-sm">{errors.business_number.message}</p>}
                                </div>
                            </span>
                        </span>
                    </section>

                    <section className="border p-6 rounded-2xl mb-6 w-full">
                        <h1 className="font-bold text-xl text-left mb-2">
                            Business Admin Account
                        </h1>
                        <p className="mb-6 text-balance">
                            These credentials will be used for the first login to the Vendor Dashboard.
                        </p>

                        <div className="flex flex-col gap-2 w-full mb-3 ">
                            <label htmlFor="vendor_admin_full_name">Vendor Admin Full Name <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                placeholder="Please enter admin full name"
                                {...register("vendor_admin_full_name", { required: "Admin full name is required" })}
                            />
                            {errors.vendor_admin_full_name && <p className="text-red-600 text-sm">{errors.vendor_admin_full_name.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2 w-full mb-4">
                            <label htmlFor="vendor_admin_email">Vendor Admin Email <span className="text-red-600">*</span></label>
                            <input
                                type="email"
                                className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                placeholder="admin@vendor.com"
                                {...register("vendor_admin_email", { 
                                    required: "Admin email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.vendor_admin_email && <p className="text-red-600 text-sm">{errors.vendor_admin_email.message}</p>}
                        </div>

                        <div className="flex flex-row gap-6 w-full ">
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="password">Password <span className="text-red-600">*</span></label>
                                <input
                                    type="password"
                                    className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                    placeholder="Please enter password"
                                    {...register("password", { 
                                        required: "Password is required",
                                        validate: (val) => passwordValidationSchema.safeParse(val).success || "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
                                    })}
                                />
                                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <label htmlFor="confirm_password">Confirm Password<span className="text-red-600">*</span></label>
                                <input
                                    type="password"
                                    className="rounded-xl border-2 border-gray-800 py-2 px-4"
                                    placeholder="Please reenter password"
                                    {...register("confirm_password", { 
                                        required: "Confirm password is required",
                                        validate: (val) => val === watch("password") || "Passwords do not match" 
                                    })}
                                />
                                {errors.confirm_password && <p className="text-red-600 text-sm">{errors.confirm_password.message}</p>}
                            </div>
                        </div>
                    </section>

                    {globalError && <p className="text-red-600 text-center font-bold">{globalError}</p>}

                    <span className="flex gap-6 justify-end mb-4 ">
                        <button type="button" onClick={() => reset()} className="bg-gray-200 text-center text-black py-2 px-6 rounded-xl mb-4 border-2 border-black/30">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-blue-500 text-center text-white font-bold py-2 px-6 rounded-xl mb-4 disabled:opacity-50"
                        >
                            {isSubmitting ? "Creating..." : "Create Business Account"}
                        </button>
                    </span>

                    <p className="text-center">Already have an account?
                        <Link className="text-blue-500 underline ml-1" to={`/vendorLogin`}>Log in</Link>
                    </p>
                </form>
            </main>
            <Outlet />
        </>
    );
}