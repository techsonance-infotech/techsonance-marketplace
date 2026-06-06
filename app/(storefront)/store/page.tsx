import { ShoppingList } from "@/components/customer/ShoppingList";
import { ReactPromise } from "react";
export const dynamic = 'force-dynamic';
interface ShoppingPageProps {
    searchParams: Promise<{
        search?: string;
        category_id?: string;
        min_price?: string;
        max_price?: string;
        sort_by?: string;
        page?: string;
    }>;
}
export default async function ShoppingPage({ searchParams }: ShoppingPageProps) {

    // 3. Await the searchParams Promise explicitly
    const resolvedParams = await searchParams;

    // 4. Now safely build your object
    const safeParams = {
        search: resolvedParams?.search || "",
        category_id: resolvedParams?.category_id || "",
        min_price: resolvedParams?.min_price ? Number(resolvedParams.min_price) : 0,
        max_price: resolvedParams?.max_price ? Number(resolvedParams.max_price) : 0,
        sort_by: resolvedParams?.sort_by || "",
        page: resolvedParams?.page ? Number(resolvedParams.page) : 1,
    }

    console.log("Server received search:", safeParams.search);
    return (
        <main className="flex gap-8 xl:pt-10 pb-8 xl:px-16 lg:px-8 md:px-4 sm:px-2 py-1 px-2">
            <section className="w-full content-visibility-auto contain-intrinsic-size-[100dvh]">
                <ShoppingList initialSearchParams={safeParams} />
            </section>
        </main>
    );
}