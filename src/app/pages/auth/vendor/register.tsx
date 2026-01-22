import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { set } from "zod";
import { passwordValidationSchema } from "../../../../utils/validation";
import axios from "axios";
import { VENDOR_BASE_URL } from "../../../../utils/constants";
interface FormData {
    business_name: string | null,
    business_number: string | null,
    business_owner_full_name: string | null,
    category: string | null,
    vendor_admin_email: string | null,
    vendor_admin_full_name: string | null,
    password: string | null,
    password_confirm: string | null,
}

export function VendorRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        business_name: null,
        business_number: null,
        business_owner_full_name: null,
        category: null,
        vendor_admin_email: null,
        vendor_admin_full_name: null,
        password: null,
        password_confirm: null,
    })
    const [error, setError] = useState<string | null>(null);
    const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value }: { name: string; value: string } = e.target;
        if (!name) return;
        if (value === null) return;
        if (name == 'category' && formData.category != null) {
            setError(null);
        }
        if (name == 'password') {
            passwordValidationSchema.safeParse(value).success ? setPasswordMatchError(null) : setPasswordMatchError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        }
        if (name == 'confirm_password') {
            console.log(value)
            if (formData.password !== value || formData.password == null) {
                setPasswordMatchError("Passwords do not match");
                return;
            }
            setPasswordMatchError(null);
        }
        setFormData({
            ...formData,
            [name]: value
        });
    }
    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formData.category == null || formData.category === '' ? setError("Please select a business category") : setError(null);
        formData.password == null || formData.password_confirm == null ? setPasswordMatchError("Passwords must be filled") : setPasswordMatchError(null);
        try {
        // axios.post(`${VENDOR_BASE_URL}/api/vendor/register`, {
        //     user_role: 'vendor',
        //     business_name: formData.business_name,
        //     business_number: formData.business_number,
        //     business_owner_full_name: formData.business_owner_full_name,
        //     category: formData.category,
        //     vendor_admin_email: formData.vendor_admin_email,
        //     vendor_admin_full_name: formData.vendor_admin_full_name,
        //     password: formData.password,
        // }).then((response) => {
        //     console.log(response.data);
        //     if (response.status === 200) {
                console.log('Registration successful');
                navigate(`/vendorLogin`);
        //     }
        // })

            } catch (error: unknown) {
            console.log(error)
            throw new Error("Registration failed");
        }
        console.log(formData)
    }

    return (
        <>
            <main className="py-20 m-auto max-w-4xl px-6 font-[inter] mb-2 flex flex-col items-center ">
                <div className="w-full">
                    <h1 className=" font-bold  text-2xl  mb-2 ">
                        Business Registration
                    </h1>
                    <p className="mb-6 text-balance ">Setup the organization profile, assign a domain, and create the admin account.</p>
                </div>
                <form onSubmit={(e) => submitHandler(e)} className="w-full  flex flex-col gap-6 ">
                    <section className="border p-6 rounded-2xl mb-6 w-full  ">
                        <h1 className="font-bold text-xl text-left mb-2">
                            Organization Details
                        </h1>
                        <span className="flex gap-8 flex-col  ">

                            <span className="flex lg:flex-row lg:flex-nowrap justify-between gap-6 w-full">
                                <div className="flex flex-col gap-2 w-full  ">
                                    <label htmlFor="business_name" >
                                        Vendor / Business Name <span className="text-red-600">*</span>
                                    </label>
                                    <input type="text" name="business_name" className="border-2 py-2 px-4 rounded-xl" placeholder="Enter your business name" onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="flex flex-col gap-2 w-full  ">
                                    <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white" >
                                        Business Category <span className="text-red-600">*</span>
                                    </label>
                                    <select name="category" id="" className="border-2 py-[.6rem] px-4 rounded-xl  " onChange={(e) => handleChange(e)} >
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
                                    {error && <p className="text-red-600 text-sm">{error}</p>}
                                </div>
                            </span>

                            <span className="flex lg:flex-row lg:flex-nowrap justify-between gap-6">

                                <div className="flex flex-col gap-2 w-full ">
                                    <label htmlFor="business_owner_full_name" >Business Owner Full Name <span className="text-red-600">*</span></label>
                                    <input type="text" name="business_owner_full_name" className="border-2 py-2 px-4 rounded-xl" placeholder="Enter  business owner full name" onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="flex flex-col gap-2 w-full ">
                                    <label htmlFor="business_number" >Business Number <span className="text-red-600">*</span></label    >
                                    <input type="text" name="business_number" className="border-2 py-2 px-4 rounded-xl" placeholder="Enter business owner contact number" onChange={(e) => handleChange(e)} />
                                </div>
                            </span>

                        </span>

                    </section>
                    <section className="border p-6 rounded-2xl mb-6 w-full ">
                        <h1 className="font-bold text-xl text-left mb-2">
                            Business Admin Account
                        </h1>
                        <p className="mb-6 text-balance  ">
                            These credentials will be used for the first login to the Vendor Dashboard.
                        </p>


                        <div className="flex flex-col gap-2 w-full mb-3 ">

                            <label htmlFor="vendor_admin_full_name">Vendor Admin Full Name <span className="text-red-600">*</span></label>
                            <input type="text" name="vendor_admin_full_name" className="border-2 py-2 px-4 rounded-xl" placeholder="Please enter admin full name" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="flex flex-col gap-2 w-full  mb-4">

                            <label htmlFor="vendor_admin_email">Vendor Admin Email <span className="text-red-600">*</span></label>
                            <input type="text" name="vendor_admin_email" className="border-2 py-2 px-4 rounded-xl" placeholder="admin@vendor.com" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="flex flex-row gap-6 w-full ">

                            <div className="flex flex-col gap-2 w-full ">

                                <label htmlFor="password">password <span className="text-red-600">*</span></label>
                                <input type="password" name="password" id="" className="border-2 py-2 px-4 rounded-xl" placeholder="Please enter password" onChange={(e) => handleChange(e)} />
                                {passwordMatchError && <p className="text-red-600 text-sm">{passwordMatchError}</p>}

                            </div>
                            <div className="flex flex-col gap-2 w-full ">
                                <label htmlFor="confirm password">Confirm Password<span className="text-red-600">*</span></label>
                                <input type="password" name="confirm_password" id="" className="border-2 py-2 px-4 rounded-xl" placeholder="Please reenter  password" onChange={(e) => handleChange(e)} />
                            </div>
                        </div>

                    </section>
                    <span className="flex gap-6 justify-end mb-4 ">
                        <button className="bg-gray-200 text-center  text-black  py-2 px-6 rounded-xl mb-4 border-2 border-black/30 ">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-center  text-white font-bold py-2 px-6 rounded-xl mb-4 "
                        >Create Business Account
                        </button>
                    </span>
                    <p className="text-center" >Already have an account?
                        <Link className="text-blue-500 underline ml-1" to={`/vendorLogin`}>Log in</Link>
                    </p>

                </form>
            </main>
            <Outlet />
        </>
    )
}