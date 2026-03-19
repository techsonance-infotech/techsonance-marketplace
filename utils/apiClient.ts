import { loginFailure, loginSuccess } from "@/Redux store/features/auth/authSlice";
import axios from "axios";
import { UserProfile, UserRole, VendorRegisterFormData } from "./Types";
import { VENDOR_AUTH_URL } from "@/constants/constants";
import { useDispatch } from "react-redux";


export const vendorLogin = async (data: { email: string, password: string }) => {
    const dispatch = useDispatch();
    try {
        const response = await axios.post(`${VENDOR_AUTH_URL}/login-vendor`, {
            email: data.email,
            password: data.password
        });
        if (response.status === 201) {
            const payload: { user: UserProfile, token: string, role: UserRole } = {
                user: response.data.user,
                token: response.data.token,
                role: response.data.user_role as UserRole
            };
            dispatch(loginSuccess(payload));
            return { status: true, message: "Login successful" };
        }
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Login failed";
        dispatch(loginFailure(errorMessage));
        return { status: false, message: errorMessage };
    }
}
export const vendorRegister = async (data: VendorRegisterFormData) => {

    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const response = await axios.post(`${VENDOR_AUTH_URL}/register-vendor`, {
            user_role: "vendor",
            store_name: data.store_name,
            phone_number: data.phone_number,
            store_owner_first_name: data.store_owner_first_name,
            store_owner_last_name: data.store_owner_last_name,
            category: data.category,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            hash_password: data.password,
            country_code: data.country_code,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });
        console.log(response.data);
        if (response.status === 201) {
            return { status: true, message: "Registration successful", data: response.data };
        }
    } catch (error: unknown) {
        console.log('Registration failed. Please try again.', error);
        return { status: false, message: "Registration failed. Please try again.", error };
    }
}