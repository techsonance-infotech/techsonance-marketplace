import { ProductVariantForm } from "@/components/vendor/ProductVariantForm";
import { fetchVariant } from "@/utils/vendorApiClient";

export default async function ProductVariantFormPage({ params }: { params: Promise<{ vendorId: string,variantId: string }> }) {
    const { vendorId, variantId } = await params;
    const existVariant = await fetchVariant(variantId).then((res) => {
        console.log(res)
        return res.data;
    }).catch((error) => {
        console.error("Error fetching variant data:", error);
        return null;
    }
    );
    return (
        <main className="min-h-screen w-full py-8 px-4">
            <div className="mx-auto">
                <ProductVariantForm vendorId={vendorId}  existVariant={existVariant} />
            </div >
        </main >
    );
}