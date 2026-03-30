import { ACCESS_TOKEN_KEY, isClient } from "@/constants";
import { cookies } from "next/headers"

export const authToken = async () => {
    const token = isClient ? sessionStorage.getItem(ACCESS_TOKEN_KEY) : (await cookies()).get("access_token")?.value;

    console.log('Auth Token:', token);
    return token || null
}