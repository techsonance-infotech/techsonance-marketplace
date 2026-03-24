'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { passwordValidationSchema } from "@/utils/validation";
import { BusinessStructure, categoryOptions, COUNTRIES, COUNTRY_CODES } from "@/constants/common";
import { vendorRegister } from "@/utils/apiClient";
import { VendorDocumentType, VendorRegisterFormData } from "@/utils/Types";
import { DynamicIcon } from "lucide-react/dynamic";
import { RegistrationSuccessModal } from "@/components/vendor/RegistrationSuccessModal";
import FinancialCompliance from "@/components/vendor/FinancialCompliance";

export default function VendorRegisterPage() {
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [countryCode, setCountryCode] = useState("");
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<VendorRegisterFormData>({
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
    });

    const { fields: financialDocumentFields, append: financialAppendDocument, remove: financialRemoveDocument } = useFieldArray({ control, name: "documents" });
    const { fields: legalDocumentFields, append: legalAppendDocument, remove: legalRemoveDocument } = useFieldArray({ control, name: "documents" });
    const onSubmit = async (data: VendorRegisterFormData) => {
        setGlobalError(null);
        console.log(data);
        const result = await vendorRegister(data);
        if (result.status) {
            reset();
            setShowSuccessModal(true);
        };
    }
    return (
        <>
            <RegistrationSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
            <main className="py-20 m-auto max-w-4xl px-6 font-[inter] mb-2 flex flex-col items-center">
                <div className="w-full mb-6">
                    <h1 className="font-bold text-2xl mb-1">Business Registration</h1>
                    <p className="text-sm text-gray-500 text-balance">
                        Setup the organization profile, assign a domain, and create the admin account.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
                    {/* Organization Details */}
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
                    {/* Business Admin Account */}
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        <h2 className="font-bold text-xl mb-1">Business Admin Account</h2>
                        <p className="text-sm text-gray-500 mb-6 text-balance">
                            These credentials will be used for the first login to the Vendor Dashboard.
                        </p>
                        <div className="flex flex-col gap-6">
                            <span className="flex lg:flex-col flex-col  justify-between gap-6 w-full">
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
                                    {errors.first_name && errors.last_name && <p className="input-error">{errors.last_name.message}</p>}
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
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        <h2 className="font-bold text-xl mb-2">Legal & Financial Information</h2>
                        <p className="text-sm text-gray-500 text-balance mb-4">Mandatory financial information is required for vendor registration.</p>
                        <label htmlFor="country_code" className="input-label">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <select name="country_code" id="country_code" className="input-select w-full mt-2" onChange={(e) => setCountryCode(e.target.value)}>
                            <option value="">Select Country</option>
                            {COUNTRIES.map((country) => (
                                <option key={country.country_code} value={country.country_code}>
                                    {country.country_name}
                                </option>
                            ))}
                        </select>
                        <FinancialCompliance country_code={countryCode} />
                    </section>
                    {globalError && <p className="text-red-600 text-center text-sm font-medium">{globalError}</p>}
                    {/* Legal Document Upload */}
                    <section className="border border-gray-100 bg-white p-6 rounded-2xl w-full shadow-md shadow-gray-100/80 transition-all duration-300">
                        {/* Toggle Row */}

                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            Legal & Financial Document Upload
                        </h2>
                        <p className="text-sm text-gray-500 mb-6  w-full">
                            Uploading legal and financial documents required for verification and compliance. Please ensure all documents are clear and legible.
                        </p>
                        {/* Document Upload Panel */}

                        <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 flex flex-wrap justify-between gap-2">
                            {/* Legal Documents */}
                            <div className="w-full pb-3 border-b-2 border-b-black/10">
                                <div className="flex items-center justify-between  mb-2">
                                    <p className={`input-label mb-0`}>Legal Documents</p>
                                    <button
                                        type="button"
                                        onClick={() => legalAppendDocument({ document: undefined, document_type: undefined })}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                    >
                                        <DynamicIcon name="plus" className="w-3.5 h-3.5" />
                                        Add Document
                                    </button>
                                </div>

                                {legalDocumentFields.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                                        <DynamicIcon name="file-text" className="w-8 h-8 mb-2 opacity-40" />
                                        <p className="text-sm">No documents added yet</p>
                                        <p className="text-xs mt-0.5">Click "Add Document" to get started</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    {legalDocumentFields.map((field, index) => (
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
                                                {VendorDocumentType.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </select>

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => legalRemoveDocument(index)}
                                                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                                                title="Remove document"
                                            >
                                                <DynamicIcon name="trash" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Financial Documents */}
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`input-label mb-0`}>Financial Documents</p>
                                    <button
                                        type="button"
                                        onClick={() => financialAppendDocument({ document: undefined, document_type: undefined })}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors duration-150"
                                    >
                                        <DynamicIcon name="plus" className="w-3.5 h-3.5" />
                                        Add Document
                                    </button>
                                </div>

                                {financialDocumentFields.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                                        <DynamicIcon name="file-text" className="w-8 h-8 mb-2 opacity-40" />
                                        <p className="text-sm">No documents added yet</p>
                                        <p className="text-xs mt-0.5">Click "Add Document" to get started</p>
                                    </div>
                                )}
                                <div className="flex flex-col gap-3">
                                    {financialDocumentFields.map((field, index) => (
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
                                                className="block text-sm text-gray-500 file:mr-3 file:py-1 file:px-1 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-gray-700 file:shadow-sm file:border-gray-200 hover:file:bg-gray-50 cursor-pointer flex-1 min-w-0"
                                                {...register(`documents.${index}.document` as const, { required: "Please upload a document" })}
                                            />

                                            {/* Document type select */}
                                            <select
                                                id="document_type"
                                                className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-150 shrink-0"
                                                {...register(`documents.${index}.document_type` as const, { required: "Please select a document type" })}
                                            >
                                                <option value="" disabled>Select type</option>
                                                {countryCode ?
                                                    COUNTRIES.find((c) => c.country_code === countryCode)?.fields.map((field) => (
                                                        <option key={field.id} value={field.id}>{field.label}</option>
                                                    ))
                                                    :
                                                    <option value="" disabled>No document types available or country not selected</option>

                                                }
                                            </select>

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={() => financialRemoveDocument(index)}
                                                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                                                title="Remove document"
                                            >
                                                <DynamicIcon name="trash" className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </section>
                    {/* Actions */}
                    <div className="flex gap-4 justify-end mb-4">
                        <button type="button" onClick={() => reset()} className="py-2 px-6 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="py-2 px-6 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-all">
                            {isSubmitting ? "Creating..." : "Create Business Account"}
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mb-4">
                        Already have an account?{" "}
                        <Link className="text-blue-500 underline" href="/auth/vendorLogin">Log in</Link>
                    </p>
                </form>
            </main>
        </>
    );
}
