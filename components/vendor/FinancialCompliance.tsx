import { COUNTRIES } from "@/constants";

export default function FinancialCompliance({ country_code }: { country_code: string }) {
    return (
        <>
            {COUNTRIES.find((c) => c.country_code === country_code)?.fields.map((field) => (
                <div key={field.value} className="my-4">
                    <label htmlFor={field.value} className="block mb-1.5 text-sm font-semibold text-slate-700">{field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                        className="my-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white focus:border-blue-500 outline-none transition text-sm text-slate-800 placeholder:text-slate-400"
                        type="text"
                        id={field.value}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                    <p className="text-xs text-slate-500 mt-1">{field.helperText}</p>
                </div>
            ))}
        </>
    )
}
