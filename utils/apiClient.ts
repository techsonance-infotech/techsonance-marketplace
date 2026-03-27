import { loginFailure, loginSuccess } from "@/Redux store/features/auth/authSlice";
import axios from "axios";
import { UserProfile, UserRole, VendorRegisterFormData } from "./Types";
import { ADMIN_AUTH_URL, BASE_API_URL, VENDOR_AUTH_URL } from "@/constants/constants";
import { authToken } from "./authToken";

export const vendorLogin = async (data: { email: string, password: string }, dispatch: any) => {
    try {
        const response = await axios.post(`${VENDOR_AUTH_URL}/login-vendor`, {
            email: data.email,
            password: data.password
        },
            { withCredentials: true });
        if (response.status === 201) {
            const payload: { user: UserProfile, token: string, role: UserRole } = {
                user: response.data.user,
                token: response.data.token,
                role: response.data.user_role as UserRole
            };
            dispatch(loginSuccess(payload));
            return { user: response.data.user, status: true, message: "Login successful" };
        }
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Login failed";
        dispatch(loginFailure(errorMessage));
        return { status: false, message: errorMessage };
    }
}
export const vendorRegister = async (data: VendorRegisterFormData) => {
    console.log("data", data);
    try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const response = await fetch(`${VENDOR_AUTH_URL}/register-vendor`, {
            method: 'POST',
            body: data as any,
        });
        const result = await response.json();
        console.log(result);
        if (response.status === 201) {
            return { status: true, message: "Registration successful", data: result };
        }
    } catch (error: unknown) {
        console.log('Registration failed. Please try again.', error);
        return { status: false, message: "Registration failed. Please try again.", error };
    }
}

export const adminLogin = async (data: { admin_id: string, password: string }) => {

    try {
        const response = await fetch(`${ADMIN_AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.admin_id,
                password: data.password
            }),
            credentials: 'include'
        });
        const result = await response.json();
        console.log(result);
        if (response.status !== 200) {
            const errorMessage = result.message || "Login failed";
            console.log(errorMessage);
            return { status: false, message: errorMessage };
        }
        const payload: { user: UserProfile, token: string, role: UserRole } = {
            user: result.data,
            token: result.data.token,
            role: result.data.user_role as UserRole
        };
        console.log(payload);
        return { status: true, message: "Login successful", data: payload };
    } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Login failed";
        console.log(errorMessage, err);
        return { status: false, message: errorMessage };
    }
}


export const fetchRoles = async () => {
    const response = await fetch(`${BASE_API_URL}roles`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken()}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch roles');
    }
    return await response.json();
};
export const fetchPermissions = async () => {
    const response = await fetch(`${BASE_API_URL}permissions`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${authToken()}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch permissions');
    }
    return await response.json();
};
export const createRole = async (role: string) => {
    const response = await fetch(`${BASE_API_URL}roles/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
    });
    console.log(response);
    if (!response.ok) {
        throw new Error('Failed to create role');
    }
    return await response.json();
};

export const createPermission = async (permissionName: string) => {
    const response = await fetch(`${BASE_API_URL}permissions/create`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissionName }),
    });
    if (!response.ok) {
        throw new Error('Failed to create permission');
    }
    return await response.json();
}