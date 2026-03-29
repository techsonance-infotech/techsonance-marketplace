import { ADMIN_BASE_URL, BASE_API_URL } from "@/constants";
import { authToken } from "./authToken";

export const fetchRoles = async () => {
    try {
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
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};
export const fetchPermissions = async () => {
    try {
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
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
};
export const createRole = async (role: string) => {
    try {
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
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

export const createPermission = async (permissionName: string) => {
    try {
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
    } catch (error) {
        console.error('Error creating permission:', error);
        throw error;
    }
}

export const fetchApplications = async () => {
    try {
        const response = await fetch(`${ADMIN_BASE_URL}/vendor-applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch vendor applications');
        }
        return await response.json();

    } catch (error) {
        console.error('Error fetching vendor applications:', error);
        throw error;
    }
};
export const approveVendor = async (vendorId: string) => {
    try {
        console.log(vendorId);
        const response = await fetch(`${ADMIN_BASE_URL}/approve-vendor/${vendorId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to approve vendor');
        }
        return await response.json();
    } catch (error) {
        console.error('Error approving vendor:', error);
        throw error;
    }
};

export const rejectVendor = async (vendorId: string) => {
    try {
        const response = await fetch(`${ADMIN_BASE_URL}/reject-vendor/${vendorId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to reject vendor');
        }
        return await response.json();
    } catch (error) {
        console.error('Error rejecting vendor:', error);
        throw error;
    }
};
