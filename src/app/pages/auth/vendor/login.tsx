
import { useSelector, useDispatch } from "react-redux";
import poster from "../../../../assets/vendor login poster.png";
import { useState } from "react";
import { Link, Outlet } from "react-router";
import axios from "axios";
import { loginFailure, loginStart, loginSuccess } from "../../../../features/auth/authSlice";
import { passwordValidationSchema } from "../../../../utils/validation";
import { VENDOR_BASE_URL } from "../../../../utils/constants";
export function VendorLogin() {
    const { isAuthenticated,
        user,
        loading,
        error,
        token } = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const [adminLoginID, setAdminLoginID] = useState<string | null>(null);
    const [adminLoginPass, setAdminLoginPass] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (passwordValidationSchema.safeParse(e.target.value).success === false) {
            setErrorMessage("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            return;
        } else {
            setErrorMessage(null)

        }
        setAdminLoginPass(e.target.value);
        setErrorMessage(null);

    }
    const SubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //  dispatch(loginStart());
        //     axios.post(`${VENDOR_BASE_URL}/api/admin/login`, {
        //         admin_id: adminLoginID,
        //         password: adminLoginPass
        //     }).then((response:unknown) => {
        //         console.log(response.data);
        //         if (response.status === 200) {
        //               dispatch(loginSuccess({
        //                 user: response.data.user,
        //                 token: response.data.token  // Adjust according to API response structure
        //             }));
        //             console.log('Login successful');
        //         }
        //     }).catch((error:Error) => {
        //         dispatch(loginFailure(error.message));
        //         console.error('There was an error!', error);

        //     });
    }

    return (
        <>
            <main className="flex font-[roboto] justify-center items-center border h-[100vh] gap-16">

                <form onSubmit={() => SubmitHandler} className="flex  flex-col border rounded-2xl       px-9 h-[620px] w-[540px]  justify-center " >
                    <h1 className=" font-bold  lg:text-[2rem] md:text-[1.5rem]  ">Manage your Store</h1>
                    <p className="font-bold text-[1rem] text-slate-600 mb-8">Welcome back! Please enter your details.</p>
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex flex-col  text-[1rem] gap-2">
                            <label htmlFor="email" className="font-bold ">Business Email Address</label>
                            <input type="text" placeholder="Enter your business email" name="email" required className="border rounded-[.5rem] px-4 py-2" onChange={(e) => setAdminLoginID(e.target.value)} />
                        </div>
                        <div className="flex flex-col text-[1rem] gap-2">
                            <span>
                                <label htmlFor="password" className="font-bold " >Password</label>
                                <a href="#" className="text-sm underline text-blue-500 float-right">Forgot Password?</a>
                            </span>
                            <input type="password" placeholder='Password' name="password" id="" required className="border rounded-[.5rem] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => changeHandler(e)} />
                            <p className=" text-slate-500 text-[.8rem]">Must be at least 8 characters.</p>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-500 text-center  text-white font-bold py-2  rounded-xl mb-4 ">
                        Log in to Dashboard
                    </button>
                    <p className="text-center text-balance text-slate-500 ">
                        Don't have an Business account ?
                        <Link to={`/vendorRegister`} className="text-blue-500 underline ml-1">Create Business account</Link>
                    </p>

                </form>
                <img src={poster} alt="" className="lg:h-[330px] lg:w-[455px] md:h-[300px] md:w-[400px]" />
            </main>
            <Outlet />
        </>
    )
}