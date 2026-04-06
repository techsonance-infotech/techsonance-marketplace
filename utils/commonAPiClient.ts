import { BASE_API_URL } from "@/constants";

export const fetchProduct = async (productId: string) => {
    try {
        const response = await fetch(`${BASE_API_URL}products/${productId}`, {
            method: 'GET',
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        if (response.status !== 200) {
            console.error('Failed to fetch product');
        }
        console.log("Product Response:", response);
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}
export const fetchProductVendorProducts = async (companyId: string = '975b2777-b12e-4188-9236-954dae4397e2') => {
    try {
        // const response = await fetch(`${BASE_API_URL}products/${companyId}/all`, {
        const response = await fetch(`${BASE_API_URL}products/${'975b2777-b12e-4188-9236-954dae4397e2'}/all`, {
            method: 'GET',
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        if (response.status !== 200) {
            console.error('Failed to fetch vendor products');
        }
        console.log("Vendor Products Response:", response);
        return await response.json();
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        return [];
    }
}
