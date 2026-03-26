'use client';
import { Navbar } from "@/components/admin/Navbar";
import { useFieldArray, useForm } from "react-hook-form";
import { passwordValidationSchema } from "@/utils/validation";
import Link from "next/link";
import { BusinessStructure, categoryOptions, COUNTRY_CODES } from "@/constants/common";
import { useRouter } from "next/navigation";
import {  VendorRegisterFormData } from "@/utils/Types";
import { useState } from "react";
import { vendorRegister } from "@/utils/apiClient";
import { DynamicIcon } from "lucide-react/dynamic";
import { VendorDocumentTypes } from "@/constants";

export default function VendorFormPage() {
    const { register, handleSubmit, watch, reset, control, formState: { errors, isSubmitting }, } = useForm<VendorRegisterFormData>({
        defaultValues: {
            first_name: null,
            last_name: null,
            phone_number: null,
            store_name: null,
            store_owner_first_name: null,
            store_owner_last_name: null,
            category: null,
            company_domain: null,
            company_structure: null,
            email: null,
            country_code: null,
            password: null,
            confirm_password: null,
            documents: [{ document: null, document_type: null }],
        }
    })
    const router = useRouter();
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [isLegalDocumentWantToUpload, setIsLegalDocumentWantToUpload] = useState(false);
    const { fields: documentFields, append: appendDocument, remove: removeDocument } = useFieldArray({ control, name: "documents" });
    const onSubmit = async (data: VendorRegisterFormData) => {
        setGlobalError(null);
        console.log(data);
        const result = await vendorRegister(data);
        if (result.status) {
            reset();
            router.push("/admin/vendorManagement");
        };
    }
    return (
        <>
            <Navbar title={"Vendor Form"} />
            <main className="admin_vendorManagement">
                <header className="flex justify-between items-center my-6">
                    <h1 className="font-bold text-2xl">Manage Vendor domains, and platform access.</h1>
                </header>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        <h2 className="font-bold text-xl mb-6">Organization Details</h2>
                        <div className="flex flex-col gap-6">
                            <div className="flex lg:flex-row flex-col gap-6 w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="business_name" className="input-label">
                                        Legal Store / Business Name <span className="text-red-500">*</span>
                                    </label>
                                    <input id="business_name" type="text" className="input-class" placeholder="Enter your business name" {...register("store_name", { required: "Business name is required" })} />
                                    {errors.store_name && <p className="input-error">{errors.store_name.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="category" className="input-label">
                                        Business Structure <span className="text-red-500">*</span>
                                    </label>
                                    <select id="category" className="input-class" {...register("company_structure", { required: "Please select a business structure" })}>
                                        <option value="" disabled>
                                            Select Business Structure
                                        </option>
                                        {BusinessStructure.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_structure && <p className="input-error">{errors.company_structure.message}</p>}
                                </div>
                            </div>
                            <div className="flex lg:flex-row flex-col gap-6 w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="business_owner_full_name" className="input-label">
                                        Business Owner Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className='input-group-container'>
                                        <input
                                            type="text"
                                            className={`input-field border-r border-gray-200`}
                                            placeholder="First name"
                                            {...register("store_owner_first_name", { required: "Required" })}
                                        />
                                        <input
                                            type="text"
                                            className="input-field "
                                            placeholder="Last name"
                                            {...register("store_owner_last_name", { required: "Required" })}
                                        />
                                    </div>
                                    {errors.store_owner_first_name && <p className="input-error">{errors.store_owner_first_name.message}</p>}
                                    {errors.store_owner_last_name && <p className="input-error">{errors.store_owner_last_name.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="business_number" className="input-label">
                                        Business Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all bg-white">
                                        <select id="country_code" className="appearance-none bg-gray-50 border-r border-gray-300 pl-3 pr-3 py-2.5 text-sm text-gray-700 font-medium focus:outline-none cursor-pointer" {...register("country_code", { required: "Country code is required" })}>
                                            <option value="" disabled>Code</option>
                                            {COUNTRY_CODES.map((country) => (
                                                <option key={country.value} value={country.value}>
                                                    {country.label}
                                                </option>
                                            ))}
                                        </select>
                                        <input type="tel" id="business_number" className="flex-1 py-2.5 px-4 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none" placeholder="123-456-7890" {...register("phone_number", {
                                            required: "Business number is required",
                                            pattern: { value: /^[0-9]/, message: "Please use the format 123-456-7890" }
                                        })} />
                                    </div>
                                    {(errors.country_code || errors.phone_number || errors.company_structure) && (
                                        <p className="input-error">{errors.country_code?.message || errors.phone_number?.message || errors.company_structure?.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        <label className="font-bold text-xl mb-4">Instance Configuration</label>
                        <div className="w-full flex mt-3">
                            <input id="instanceConfig" {...register('company_domain', { required: "Instance Configuration is required" })} className="border-2 flex-2 border-gray-200 px-4 py-2 rounded-l-xl" />
                            <p className="border-2 flex-1 bg-gray-200 border-gray-300 px-4 py-2 rounded-r-xl">.platform.com</p>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">This Will be the URL where customers access this vendor.</p>
                        {errors.company_domain && <p className="text-red-500">{errors.company_domain.message}</p>}
                    </section>
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        <h2 className="font-bold text-xl mb-4">Initial vendor Admin Account</h2>
                        <p className="text-gray-500">These credentials will be used for the first login to the Vendor Dashboard.</p>
                        <div className="flex flex-col gap-6">
                            <span className="flex justify-between gap-6 w-full">
                                <div className="flex-1 flex flex-col gap-1.5 w-full">
                                    <label htmlFor="vendor_admin_full_name" className="input-label">
                                        Vendor Admin Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="input-group-container">
                                        <input
                                            type="text"
                                            className={`input-field border-r border-gray-200`}
                                            placeholder="First name"
                                            {...register("first_name", { required: "Required" })}
                                        />
                                        <input
                                            type="text"
                                            className="input-field "
                                            placeholder="Last name"
                                            {...register("last_name", { required: "Required" })}
                                        />
                                    </div>
                                    {(errors.first_name || errors.last_name) && <p className="input-error">{errors.first_name?.message || errors.last_name?.message}</p>}
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5 w-full">
                                    <label htmlFor="category" className="input-label">
                                        Business Category <span className="text-red-500">*</span>
                                    </label>
                                    <select id="category" className="input-class" {...register("category", { required: "Please select a business category" })}>
                                        <option value="" disabled>
                                            Select Business Category
                                        </option>
                                        {categoryOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="input-error">{errors.category.message}</p>}
                                </div>
                            </span>
                            <div className="flex flex-col gap-1.5 w-full">
                                <label htmlFor="vendor_admin_email" className="input-label">
                                    Vendor Admin Email <span className="text-red-500">*</span>
                                </label>
                                <input id="vendor_admin_email" type="email" className="input-class" placeholder="admin@vendor.com" {...register("email", {
                                    required: "Admin email is required",
                                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                                })} />
                                {errors.email && <p className="input-error">{errors.email.message}</p>}
                            </div>
                            <div className="flex lg:flex-row flex-col gap-6 w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="password" className="input-label">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input id="password" type="password" className="input-class" placeholder="Enter password" {...register("password", {
                                        required: "Password is required",
                                        validate: (val) => passwordValidationSchema.safeParse(val).success || "Must be 8+ chars with uppercase, lowercase, number & special character",
                                    })} />
                                    {errors.password && <p className="input-error">{errors.password.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label htmlFor="confirm_password" className="input-label">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input id="confirm_password" type="password" className="input-class" placeholder="Re-enter password" {...register("confirm_password", {
                                        required: "Please confirm your password",
                                        validate: (val) => val === watch("password") || "Passwords do not match",
                                    })} />
                                    {errors.confirm_password && <p className="input-error">{errors.confirm_password.message}</p>}
                                </div>
                            </div>
                        </div>
                    </section>

                    {globalError && <p className="text-red-600 text-center text-sm font-medium">{globalError}</p>}
                    {/* Legal Document Upload */}
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        {/* Toggle Row */}
                        <label
                            htmlFor="legal_document_toggle"
                            className="flex items-center gap-3 cursor-pointer group w-fit"
                        >
                            <div className="relative">
                                <input
                                    id="legal_document_toggle"
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isLegalDocumentWantToUpload}
                                    onChange={(e) => setIsLegalDocumentWantToUpload(e.target.checked)}
                                />
                                <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-colors duration-200" />
                                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-150 select-none">
                                Upload legal document now
                            </span>
                        </label>

                        {/* Document Upload Panel */}
                        {isLegalDocumentWantToUpload && (
                            <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between">
                                    <p className={`input-label mb-0`}>Legal Documents</p>
                                    <button
                                        type="button"
                                        onClick={() => appendDocument({ document: undefined, document_type: undefined })}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                    >
                                        <DynamicIcon name="plus" className="w-3.5 h-3.5" />
                                        Add Document
                                    </button>
                                </div>

                                {documentFields.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                                        <DynamicIcon name="file-text" className="w-8 h-8 mb-2 opacity-40" />
                                        <p className="text-sm">No documents added yet</p>
                                        <p className="text-xs mt-0.5">Click "Add Document" to get started</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    {documentFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 group hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-150"
                                        >
                                            {/* File number badge */}
                                            <span className="shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-150">
                                                {index + 1}
                                            </span>

                                            {/* File input */}
                                            <input
                                                type="file"
                                                className="block text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-gray-700 file:shadow-sm file:border file:border-gray-200 hover:file:bg-gray-50 cursor-pointer flex-1 min-w-0"
                                                {...register(`documents.${index}.document` as const, { required: "Please upload a document" })}
                                            />

                                            {/* Document type select */}
                                            <select
                                                id="document_type"
                                                className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-150 shrink-0"
                                                {...register(`documents.${index}.document_type` as const, { required: "Please select a document type" })}
                                            >
                                                <option value="" disabled>Select type</option>
                                                {Object.values(VendorDocumentTypes).map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                                                title="Remove document"
                                            >
                                                <DynamicIcon name="trash" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                    <div className="flex justify-end gap-6 mb-6">
                        <Link onClick={() => reset()} className="border border-gray-300 bg-gray-200 px-4 py-2 rounded-lg" href="/admin/vendorManagement">Cancel</Link>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-6 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-all">
                            {isSubmitting ? "Creating..." : "Create Business Account"}
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}