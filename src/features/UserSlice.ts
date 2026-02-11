
import { createSlice } from "@reduxjs/toolkit";
import type { UserProfile } from "../utils/Types";
import { get } from "react-hook-form";
export const MockUser: UserProfile = {
    "user_id": 1024,
    "company_id": 501,
    "user_role_id": 1,
    "name": "Alex Rivier",
    "email": "alex.rivier@soundsphere.com",
    "profileImgUrl": "https://i.pinimg.com/originals/74/a3/b6/74a3b6a8856b004dfff824ae9668fe9b.jpg",
    "phone": "+91 98765 43210",
    "user_status": "active",
    "created_at": "2025-11-15T10:30:00Z",

    "addresses": [
        {
            "address_id": 2045,
            "address_for": "home",
            "address_line1": "Flat 402, Melody Heights",
            "city": "Ahmedabad",
            "state": "Gujarat",
            "phone": "+91 98765 43210",
            "country": "India",
            "postal_code": "380001",
            "is_default": true
        }
    ],

    "cart": {
        "cart_id": 8821,
        "created_at": "2026-02-10T14:20:00Z",
        "items": [
            {
                "cart_item_id": 1,
                "variant_id": 502,
                "quantity": 1
            },
            {
                "cart_item_id": 2,
                "variant_id": 305,
                "quantity": 2
            }
        ]
    },

    "wishlist": {
        "wishlist_id": 554,
        "items": [701, 705, 812]
    },

    "orders": [
        {
            "order_id": 9001,
            "order_status": "Delivered",
            "total_amount": 19999.00,
            "address_id": 2045,
            "created_at": "2026-01-20T09:15:00Z"
        },
        {
            "order_id": 9552,
            "order_status": "Pending",
            "total_amount": 8490.00,
            "address_id": 2045,
            "created_at": "2026-02-05T16:45:00Z"
        }
    ]

}
export const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
    const result = next(action);
    if (action.type.startsWith('user/')) {
        const userState = store.getState().user;
        localStorage.setItem('user', JSON.stringify(userState));
    }
    return result;
}
export const getUserFromLocalStorage = (): UserProfile => {
    try {
        const userStr = localStorage.getItem('user');
        // Check if userStr exists and is not the string "undefined"
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
            return JSON.parse(userStr);
        }
        return MockUser;
    } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        return MockUser;
    }
};

const initialState: UserProfile =  getUserFromLocalStorage();
const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUserProfile: (state, action) => {
            const updatedState = { ...state, ...action.payload };
            localStorage.setItem('user', JSON.stringify(updatedState));
            return updatedState;
        },
        createAddress: (state, action) => {
            state.addresses.push(action.payload);
            localStorage.setItem('user', JSON.stringify(state));
        },
        updateAddress: (state, action) => {
            const index = state.addresses.findIndex(address => address.address_id === action.payload.address_id);
            if (index !== -1) {
                state.addresses[index] = action.payload;
                localStorage.setItem('user', JSON.stringify(state));
            }
        },
        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter(address => address.address_id !== action.payload);
            localStorage.setItem('user', JSON.stringify(state));
        }
    }
})
export const { updateUserProfile, createAddress, updateAddress, deleteAddress } = UserSlice.actions;
export const UserReducer = UserSlice.reducer;