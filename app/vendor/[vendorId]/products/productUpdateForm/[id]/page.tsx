import { fetchVendorOneProducts, fetchVendorsProductsCategory, updateProduct } from "@/utils/vendorApiClient";
import { ProductForm } from "@/components/vendor/ProductForm";
import { ProductFormValuesType } from "@/utils/Types";

type ProductImage = {
    id: string;
    image_url: string;
    alt_text: string;
    imgType: "main" | "gallery";
    is_primary: boolean;
    created_at: string;
    updated_at: string;
    product_id: string;
    variant_id: string;
};

type ProductFeature = {
    title: string;
    description: string;
};

type AttributesType = {
    name: string,
    values: string
}
type VariantsType = {
    id: string
    variant_name: string,
    sku: string,
    attributes: AttributesType[]

}
type ProductType = {
    id: string;
    name: string;
    description: string;
    features: ProductFeature[];
    base_price: string;
    discount_percent: string;
    stock_quantity: string;
    status: "active" | "inactive";
    has_variants: boolean;
    created_at: string;
    updated_at: string;
    company_id: string;
    vendor_id: string;
    category_id: string;
    images: ProductImage[];
    variants: VariantsType,
    tax_profile: string,

};

export default async function ProductFormPage({ params }: { params: Promise<{ vendorId: string, id: string }> }) {

    const { vendorId, id } = await params;
    const getExitingProduct: ProductType | null = id ? await fetchVendorOneProducts(id).then((res) => {
        return res.data;
    }).catch((error) => {
        console.error("Error fetching existing product data:", error);
        return null;
    }) : null;
    console.log(getExitingProduct)

    const exitingData: Partial<ProductFormValuesType> = {
        productName: getExitingProduct?.name || '',
        description: getExitingProduct?.description || '',
        features: getExitingProduct?.features || [],
        attributes: getExitingProduct?.variants ? getExitingProduct.variants.attributes : [],
        basePrice: getExitingProduct?.base_price || '',
        discountPercent: getExitingProduct?.discount_percent || '',
        stocks: String(getExitingProduct?.stock_quantity) || '',
        sku: getExitingProduct?.variants ? getExitingProduct.variants.sku : '',
        has_variants: getExitingProduct?.has_variants || false,
        productMedia: getExitingProduct?.images.filter((img) => img.imgType === "main") || [],
        featureMedia: getExitingProduct?.images.filter((img) => img.imgType === "gallery") || [],
        category: getExitingProduct?.category_id || '',
        status: getExitingProduct?.status || '',
        taxProfile: getExitingProduct?.tax_profile || '',
        variantId: getExitingProduct?.variants.id
    }
    const categoryOptions = await fetchVendorsProductsCategory(vendorId).then((res) => {
        return res.data.map((c: any) => ({ value: c.id, label: c.name }));
    }).catch((error) => {
        console.error("Error fetching category options:", error);
        return [];
    });
    console.log("exitingData", exitingData)

    return (
        <main className="min-h-screen  py-8 ">
            <div className=" mx-auto">
                <ProductForm categoryOptions={categoryOptions} vendorId={vendorId} existingData={exitingData} productId={id} />
            </div>
        </main>
    );
}