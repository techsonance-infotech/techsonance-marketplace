'use client';
import { useFieldArray, useForm } from "react-hook-form";
import { use, useEffect, useState } from "react";
import { Trash2, Plus, UploadCloud, RefreshCw, Package, Tag, Image, Building2, ChevronDown, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "@/constants/constants";
type Feature = { title: string; description: string };
type Option = { name: string; values: string };
type Variant = { attributes: Record<string, string>; sku: string; price: number; stock: number };
const organizationTaxationFields =
    [
        {
            name: "status",
            label: "Status",
            options: [
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "draft", label: "Draft" },
            ],
        },
        {
            name: "taxProfile",
            label: "Tax Profile",
            options: [
                { value: "standard", label: "GST Standard (18%)" },
                { value: "reduced", label: "GST Reduced (5%)" },
                { value: "zero", label: "Zero Rated (0%)" },
            ],
        },
    ];
type ProductFormValues = {
    productName: string;
    description: string;
    features: Feature[];
    basePrice: number;
    discountPercent: number;
    stocks: number;
    sku: string;
    hasVariants: boolean;
    options: Option[];
    variants: Variant[];
    productMedia: File[];
    featureMedia: File[];
    category: string;
    status: string;
    taxProfile: string;
};

export default function ProductForm() {
    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({
        defaultValues: {
            productName: "",
            description: "",
            features: [{ title: "", description: "" }],
            basePrice: 0,
            discountPercent: 0,
            stocks: 0,
            sku: "",
            hasVariants: false,
            options: [{ name: "", values: "" }],
            variants: [],
            productMedia: [],
            featureMedia: [],
            category: "",
            status: "",
            taxProfile: "",
        },
    });

    const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });
    const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({ control, name: "options" });
    const { fields: variantFields, remove: removeVariant } = useFieldArray({ control, name: "variants" });
    const { user } = useSelector((state: any) => state.auth);
    const [productFiles, setProductFiles] = useState<File[]>([]);
    const [featureFiles, setFeatureFiles] = useState<File[]>([]);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const hasVariants = watch("hasVariants");
    const options = watch("options");
    const basePrice = watch("basePrice");
    const variants = watch("variants");
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);  // ← add this

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}categories`);
                const data = await response.json();
                setCategoryOptions(data.map((cat: any) => ({ value: cat.id, label: cat.name })));
            } catch (error) {
                console.error('Failed to load categories', error);
            } finally {
                setCategoriesLoading(false);  // ← always set false
            }
        };
        fetchCategories();
    }, []);
    // --- Unified file handler ---
    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        currentFiles: File[],
        setFiles: React.Dispatch<React.SetStateAction<File[]>>,
        fieldName: keyof ProductFormValues
    ) => {
        if (!e.target.files) return;
        const updated = [...currentFiles, ...Array.from(e.target.files)];
        setFiles(updated);
        setValue(fieldName, updated as any);
        e.target.value = ""; // allow re-selecting same file
    };

    const handleFileRemove = (
        index: number,
        currentFiles: File[],
        setFiles: React.Dispatch<React.SetStateAction<File[]>>,
        fieldName: keyof ProductFormValues
    ) => {
        const updated = currentFiles.filter((_, i) => i !== index);
        setFiles(updated);
        setValue(fieldName, updated as any);
    };

    // --- Variant matrix generator (resets before regenerating) ---
    const generateVariantMatrix = () => {
        const validOptions = options.filter((opt) => opt.name.trim() && opt.values.trim());
        if (validOptions.length === 0) return;

        let matrix: Record<string, string>[] = [{}];
        validOptions.forEach((option) => {
            const vals = option.values.split(",").map((v) => v.trim()).filter(Boolean);
            const newMatrix: Record<string, string>[] = [];
            matrix.forEach((combo) => {
                vals.forEach((val) => newMatrix.push({ ...combo, [option.name]: val }));
            });
            matrix = newMatrix;
        });

        const generated: Variant[] = matrix.map((combo) => {
            const suffix = Object.values(combo).map((v) => v.substring(0, 3).toUpperCase()).join("-");
            return { attributes: combo, sku: `PROD-${suffix}`, price: Number(basePrice) || 0, stock: 0 };
        });

        // Reset first, then set — prevents stale appending
        setValue("variants", []);
        setTimeout(() => setValue("variants", generated), 0);
    };

    // --- Submit ---
    const onSubmit = async (data: ProductFormValues) => {
        // Guard checks FIRST, before building FormData
        if (productFiles.length === 0 || featureFiles.length === 0) {
            setSubmitStatus("error");
            return;
        }
        if (!user || !user.vendor_id || !user.company_id) {
            setSubmitStatus("error");
            return;
        }

        const totalStock = data.hasVariants
            ? data.variants.reduce((sum, v) => sum + Number(v.stock), 0)
            : Number(data.stocks);

        const payload = {
            name: data.productName,
            description: data.description,
            features: data.features,
            category_id: data.category,
            status: data.status.toLowerCase(),
            tax_profile: data.taxProfile,
            base_price: String(data.basePrice),
            discount_percent: String(data.discountPercent),
            stock_quantity: totalStock,
            has_variants: data.hasVariants,
            sku: data.hasVariants ? undefined : data.sku,
            variants: data.hasVariants
                ? data.variants.map(v => ({
                    ...v,
                    stock_quantity: v.stock,
                    price: v.price,
                }))
                : [],
        };

        const formData = new FormData();
        productFiles.forEach((file) => formData.append('product', file));
        featureFiles.forEach((file) => formData.append('product_spec', file));
        formData.append('product_data', JSON.stringify(payload));
        formData.append('vendor_id', user.vendor_id);
        formData.append('company_id', user.company_id);
        console.log(formData.getAll('product'));
        console.log(formData.getAll('product_spec'));
        console.log(formData.getAll('product_data'));
        try {
            const response = await fetch(`${BASE_API_URL}products`, {
                method: "POST",
                body: formData,
            });
            if (!response.status) throw new Error("Failed to create product");
            setSubmitStatus("success");
        } catch {
            setSubmitStatus("error");
        }
    };


    return (
        <main className="min-h-screen  py-8 ">
            <div className=" mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>

                    {/* ── HEADER ── */}
                    <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Create New Product</h1>
                            <p className="text-sm text-slate-500 mt-0.5">Fill in the details below to list a new product.</p>
                        </div>
                        {/* <div className="flex items-center gap-3 flex-wrap">
                            {submitStatus === "success" && (
                                <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                                    <CheckCircle2 size={16} /> Published!
                                </span>
                            )}
                            {submitStatus === "error" && (
                                <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                                    <AlertCircle size={16} /> Something went wrong
                                </span>
                            )}
                            <button type="button" className="border border-slate-300 bg-white text-slate-700 text-sm font-semibold py-2.5 px-5 rounded-xl hover:bg-slate-50 transition shadow-sm">
                                Save Draft
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Publishing…</> : "Publish Product"}
                            </button>
                        </div> */}
                    </header>

                    <div className={"section"}>
                        <div className={"section_header"}>
                            <Package size={18} className="text-indigo-500" />
                            <h2 className="text-base font-semibold text-slate-800">General Information</h2>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className={"form_label"}>Product Name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    className={'form_input'}
                                    placeholder="e.g. Classic Cotton T-Shirt"
                                    {...register("productName", { required: "Product name is required" })}
                                />
                                {errors.productName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.productName.message}</p>}
                            </div>
                            <div>
                                <label className={"form_label"}>Description <span className="text-red-400">*</span></label>
                                <textarea
                                    rows={4}
                                    className={"form_input"}
                                    placeholder="Describe your product…"
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.description.message}</p>}
                            </div>

                            {/* Features */}
                            <div className="pt-2 border-t border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-semibold text-slate-700">Product Features</h3>
                                    <button
                                        type="button"
                                        onClick={() => appendFeature({ title: "", description: "" })}
                                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                                    >
                                        <Plus size={14} /> Add Feature
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featureFields.map((field, index) => (
                                        <div key={field.id} className="relative border border-slate-200 rounded-xl p-4 bg-slate-50 group">
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 bg-white rounded-md p-1 border border-slate-200 shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="mb-3">
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Feature Title</label>
                                                <input
                                                    type="text"
                                                    className={'form_input'}
                                                    placeholder="e.g. Waterproof"
                                                    {...register(`features.${index}.title`, { required: "Required" })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">Details</label>
                                                <textarea
                                                    rows={2}
                                                    className={"form_input"}
                                                    placeholder="Feature description…"
                                                    {...register(`features.${index}.description`, { required: "Required" })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 2. PRICING, INVENTORY & VARIANTS ── */}
                    <div className={"section"}>
                        <div className={"section_header"}>
                            <Tag size={18} className="text-blue-500" />
                            <h2 className="text-base font-semibold text-slate-800">Pricing & Inventory</h2>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-5 mb-6">
                                <div className="flex-1 min-w-[180px]">
                                    <label className={'form_label'}>Base Price (₹) <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min={0}
                                            className={`my-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500  w-full bg-white focus:border-blue-500 outline-none transition text-sm text-slate-800 placeholder:text-slate-400 pl-7`}
                                            placeholder="0.00"
                                            {...register("basePrice", { required: "Required", min: { value: 0, message: "Must be ≥ 0" } })}
                                        />
                                    </div>
                                    {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
                                </div>
                                <div className="flex-1 min-w-[180px]">
                                    <label className={"form_label"}>Discount (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        className={"form_input"}
                                        placeholder="0"
                                        {...register("discountPercent", { min: 0, max: 100 })}
                                    />
                                </div>
                                {!hasVariants && (
                                    <>
                                        <div className="flex-1 min-w-[180px]">
                                            <label className={"form_label"}>Stock Quantity</label>
                                            <input type="number" min={0} className={"form_input"} placeholder="0" {...register("stocks", { min: 0 })} />
                                        </div>
                                        <div className="flex-1 min-w-[180px]">
                                            <label className={"form_label"}>SKU</label>
                                            <input type="text" className={"form_input"} placeholder="e.g. SHIRT-001" {...register("sku")} />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Variant toggle */}
                            <div className="border-t border-slate-100 pt-6">
                                <label className="flex items-center gap-3 cursor-pointer select-none w-fit group">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only peer" {...register("hasVariants")} />
                                        <div className="w-11 h-6 bg-slate-200 peer-checked:bg-blue-600 rounded-full transition-colors" />
                                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700">This product has variants (size, color, etc.)</span>
                                </label>

                                {hasVariants && (
                                    <div className="mt-6 bg-blue-50/40 rounded-xl border border-blue-100 p-5">
                                        <h3 className="text-sm font-bold text-blue-900 mb-4">Step 1 — Define Options</h3>
                                        {optionFields.map((field, index) => (
                                            <div key={field.id} className="flex flex-wrap md:flex-nowrap gap-3 mb-3 items-end">
                                                <div className="flex-1 min-w-[140px]">
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Option Name</label>
                                                    <input type="text" placeholder="e.g. Color" className={'form_input'} {...register(`options.${index}.name`)} />
                                                </div>
                                                <div className="flex-[2] min-w-[220px]">
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Values (comma-separated)</label>
                                                    <input type="text" placeholder="e.g. Red, Blue, Green" className={"form_input"} {...register(`options.${index}.values`)} />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(index)}
                                                    disabled={optionFields.length === 1}
                                                    className="h-10 px-3 border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed bg-white shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="flex flex-wrap gap-3 mt-4 items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => appendOption({ name: "", values: "" })}
                                                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                                            >
                                                <Plus size={14} /> Add another option
                                            </button>
                                            <button
                                                type="button"
                                                onClick={generateVariantMatrix}
                                                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
                                            >
                                                <RefreshCw size={14} /> Generate Matrix
                                            </button>
                                        </div>

                                        {variantFields.length > 0 && (
                                            <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-slate-700">Step 2 — Set Prices & Stock per Variant</h3>
                                                    <span className="text-xs text-slate-400 font-medium">{variantFields.length} variants</span>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                                                                <th className="text-left px-4 py-3 font-semibold">Variant</th>
                                                                <th className="text-left px-4 py-3 font-semibold">Price (₹)</th>
                                                                <th className="text-left px-4 py-3 font-semibold">Stock</th>
                                                                <th className="text-left px-4 py-3 font-semibold">SKU</th>
                                                                <th className="px-4 py-3 w-10" />
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {variantFields.map((field: any, index) => {
                                                                const label = Object.values(field.attributes || {}).join(" · ");
                                                                return (
                                                                    <tr key={field.id} className="hover:bg-slate-50/60 transition group">
                                                                        <td className="px-4 py-2.5 font-medium text-slate-800">{label}</td>
                                                                        <td className="px-4 py-2">
                                                                            <div className="relative">
                                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                                                                                <input
                                                                                    type="number"
                                                                                    step="0.01"
                                                                                    min={0}
                                                                                    className="w-28 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                                                    {...register(`variants.${index}.price`)}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <input
                                                                                type="number"
                                                                                min={0}
                                                                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                                                                {...register(`variants.${index}.stock`)}
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2">
                                                                            <input
                                                                                type="text"
                                                                                className="w-36 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                                                                                {...register(`variants.${index}.sku`)}
                                                                            />
                                                                        </td>
                                                                        <td className="px-4 py-2 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeVariant(index)}
                                                                                className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                                                                            >
                                                                                <Trash2 size={15} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        {/* {variants.length > 0 && (
                                                            <tfoot>
                                                                <tr className="bg-slate-50 text-xs text-slate-500">
                                                                    <td className="px-4 py-2.5 font-semibold" colSpan={2}>Total Stock</td>
                                                                    <td className="px-4 py-2.5 font-bold text-slate-700">
                                                                        {variants.reduce((s, v) => s + Number(v.stock || 0), 0)}
                                                                    </td>
                                                                    <td colSpan={2} />
                                                                </tr>
                                                            </tfoot>
                                                        )} */}
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── 3. MEDIA ── */}
                    <div className={"section"}>
                        <div className={"section_header"}>
                            <Image size={18} className="text-indigo-500" />
                            <h2 className="text-base font-semibold text-slate-800">Media</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(
                                [
                                    { label: "Product Images", files: productFiles, setFiles: setProductFiles, fieldName: "productMedia" as keyof ProductFormValues },
                                    { label: "Feature / Spec Media", files: featureFiles, setFiles: setFeatureFiles, fieldName: "featureMedia" as keyof ProductFormValues },
                                ] as const
                            ).map(({ label, files, setFiles, fieldName }) => (
                                <div key={fieldName} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">{label}</h3>
                                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-blue-300 bg-blue-50/30 rounded-xl cursor-pointer hover:bg-blue-50 transition group">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            className="hidden"
                                            onChange={(e) => handleFileSelect(e, files, setFiles as any, fieldName)}
                                        />
                                        <UploadCloud size={32} className="text-blue-400 group-hover:text-blue-600 transition mb-2" />
                                        <p className="text-xs font-semibold text-blue-500 group-hover:text-blue-700">Click to upload</p>
                                        <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, MP4 up to 10MB</p>
                                    </label>
                                    {files.length > 0 && (
                                        <ul className="mt-3 space-y-2">
                                            {files.map((file, i) => (
                                                <li key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-sm">
                                                    <span className="truncate max-w-[180px] font-medium text-slate-700">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFileRemove(i, files, setFiles as any, fieldName)}
                                                        className="ml-2 text-slate-300 hover:text-red-500 transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── 4. ORGANIZATION & TAXATION ── */}
                    <div className={"section"}>
                        <div className={"section_header"}>
                            <Building2 size={18} className="text-blue-500" />
                            <h2 className="text-base font-semibold text-slate-800">Organization & Taxation (GST)</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="form_label">Category <span className="text-red-400">*</span></label>
                                <div className="relative">
                                    <select
                                        {...register("category", { required: "Required" })}
                                        disabled={categoriesLoading}
                                        className="form_input appearance-none pr-9 disabled:opacity-50"
                                    >
                                        <option value="">
                                            {categoriesLoading ? "Loading categories…" : "Select Category"}
                                        </option>
                                        {categoryOptions.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} />{errors.category.message}
                                    </p>
                                )}
                            </div>
                            {organizationTaxationFields.map(({ name, label, options: opts }) => (
                                <div key={name}>
                                    <label className={'form_label'}>{label} <span className="text-red-400">*</span></label>
                                    <div className="relative">
                                        <select
                                            {...register(name, { required: "Required" })}
                                            className={`form_input appearance-none pr-9`}
                                        >
                                            <option value="">Select {label}</option>
                                            {opts.map((o) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                    {errors[name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[name]?.message}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── FOOTER CTA ── */}
                    <div className="flex justify-end gap-3 pb-8">
                        <button type="button" className="border border-slate-300 bg-white text-slate-700 text-sm font-semibold py-2.5 px-5 rounded-xl hover:bg-slate-50 transition shadow-sm">
                            Save Draft
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold py-2.5 px-8 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Publishing…</> : "Publish Product"}
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
}