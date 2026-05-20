import AxiosAPI from '@/lib/axios';
import { authToken } from '@/utils/authToken';
import { CouponDiscountTypeEum, CouponStatusEnum } from '@/utils/Types';
import { couponSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
const createNewCoupon = async (data: any, token: string) => {
    return await AxiosAPI.post(`/v1/coupon`, data,{
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const CouponModel = ({ setIsModalOpen,isModalOpen}) => {
    
       const [isSubmitting, setIsSubmitting] = useState(false);
          const modalRef = useRef<HTMLDivElement>(null);
          const token = authToken()
      const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
            resolver: zodResolver(couponSchema),
        defaultValues: {
            discount_type: CouponDiscountTypeEum.PERCENTAGE,
            code: "",
            description: "",
            value: 0,
            valid_from: new Date().toISOString().split('T')[0],
            valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            rules: [{ rule_type: "Min Purchase", rule_value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rules",
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            let min_order_amount, max_discount_amount, max_uses_per_user;
            
            data.rules?.forEach((rule: any) => {
                if (rule.rule_type === "Min Purchase" && rule.rule_value) min_order_amount = Number(rule.rule_value);
                if (rule.rule_type === "Max Discount" && rule.rule_value) max_discount_amount = Number(rule.rule_value);
                if (rule.rule_type === "User Limit" && rule.rule_value) max_uses_per_user = Number(rule.rule_value);
            });

            const payload = {
                code: data.code,
                description: data.description,
                discount_type: data.discount_type,
                discount_value: Number(data.value),
                valid_from: new Date(data.valid_from).toISOString(),
                valid_to: new Date(data.valid_to).toISOString(),
                min_order_amount,
                max_discount_amount,
                max_uses_per_user,
            };

            await createNewCoupon(payload, token as string);
            
            alert("Coupon created successfully!");
            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error("Failed to create coupon:", error);
            alert("Failed to create coupon. Please check your inputs and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
        useEffect(() => {
            const handler = (e: MouseEvent) => {
                if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                    setIsModalOpen(false);
                    reset();
                }
            };
            if (isModalOpen) document.addEventListener("mousedown", handler);
            return () => document.removeEventListener("mousedown", handler);
        }, [isModalOpen, reset]);
  return (
    
    <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div ref={modalRef} className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">New Promo Code</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Coupon Code</label>
                                    <input type="text" required {...register("code")} className="border border-gray-300 rounded-xl p-2.5 text-sm uppercase placeholder:normal-case" placeholder="e.g. SUMMER50" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <input type="text" required {...register("description")} className="border border-gray-300 rounded-xl p-2.5 text-sm" placeholder="Summer Sale 2026" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Discount Type</label>
                                    <select {...register("discount_type")} className="border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed_cart">Fixed Cart Amount</option>
                                        <option value="fixed_product">Fixed Product Amount</option>
                                        <option value="free_shipping">Free Shipping</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Value</label>
                                    <input type="number" step="0.01" required {...register("value")} className="border border-gray-300 rounded-xl p-2.5 text-sm" placeholder="0.00" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Valid From</label>
                                    <input type="date" required {...register("valid_from")} className="border border-gray-300 rounded-xl p-2.5 text-sm" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Valid To</label>
                                    <input type="date" required {...register("valid_to")} className="border border-gray-300 rounded-xl p-2.5 text-sm" />
                                </div>
                            </div>

                            <div className="pt-4 space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-800">Advanced Limits</label>
                                    <button type="button" onClick={() => append({ rule_type: "Min Purchase", rule_value: "" })} className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                                        <Plus size={14} /> Add Rule
                                    </button>
                                </div>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
                                        <select {...register(`rules.${index}.rule_type`)} className="flex-1 border border-gray-300 rounded-lg p-2 text-xs bg-white">
                                            <option value="Min Purchase">Min Cart Amount</option>
                                            <option value="Max Discount">Max Discount Cap</option>
                                            <option value="User Limit">Uses Per User</option>
                                        </select>
                                        <input type="number" {...register(`rules.${index}.rule_value`)} placeholder="Amount/Limit" className="flex-1 border border-gray-300 rounded-lg p-2 text-xs" />
                                        <button type="button" onClick={() => remove(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <p className="text-xs text-gray-400 italic">No limits set. Coupon can be used infinitely.</p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : "Create Coupon"}
                            </button>
                        </form>
                    </div>
                </div>
    </>
  )
}
