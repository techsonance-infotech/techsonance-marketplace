import AxiosAPI from '@/lib/axios';
import { authToken } from '@/utils/authToken';
import { Coupon, PromotionType, PromotionRuleType } from '@/utils/Types';
import { couponSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

// ─── API Methods ─────────────────────────────────────────────────────────────

const createNewCoupon = async (data: any, vendorId: string, token: string) =>
  AxiosAPI.post(`/v1/coupon/${vendorId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

const updateExistingCoupon = async (
  id: string,
  data: any,
  vendorId: string,
  token: string,
) =>
  AxiosAPI.patch(`/v1/coupon/${id}/${vendorId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

const fetchCouponDetails = async (id: string, token: string) =>
  AxiosAPI.get(`/v1/coupon/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

const fetchAllProductOptions = async (token: string) =>
  AxiosAPI.get(`/v1/products/options`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ─── Types ────────────────────────────────────────────────────────────────────

interface RuleRow {
  rule_type: PromotionRuleType;
  // MIN_CART_VALUE
  amount?: number;
  // MIN_QTY
  qty?: number;
  // CUSTOMER_SEGMENT
  segment_id?: string;
  // PRODUCT_IN_CART
  product_id?: string;
  // NEW_CUSTOMER
  registered_within_days?: number;
  // DATE_RANGE
  days_of_week?: number[];
  // MAX_USES_PER_USER
  max?: number;
  negate: boolean;
}

interface CouponModelProps {
  isModalOpen: boolean;
  setIsModalOpen: (val: boolean) => void;
  id?: string | null;
  onSuccess?: () => void;
  vendorId?: string;
  setCoupons: React.Dispatch<React.SetStateAction<Coupon[]>>;
}

// ─── Rule config builder (mirrors the service) ───────────────────────────────

function buildRuleConfig(row: RuleRow): Record<string, unknown> {
  switch (row.rule_type) {
    case PromotionRuleType.MIN_CART_VALUE:
      return { amount: Number(row.amount ?? 0) };
    case PromotionRuleType.MIN_QTY:
      return { qty: Number(row.qty ?? 1) };
    case PromotionRuleType.CUSTOMER_SEGMENT:
      return { segment_id: row.segment_id ?? '' };
    case PromotionRuleType.FIRST_ORDER_ONLY:
      return {};
    case PromotionRuleType.PRODUCT_IN_CART:
      return { product_id: row.product_id ?? '' };
    case PromotionRuleType.NEW_CUSTOMER:
      return { registered_within_days: Number(row.registered_within_days ?? 30) };
    case PromotionRuleType.DATE_RANGE:
      return { days_of_week: (row.days_of_week ?? []).map(Number) };
    case PromotionRuleType.MAX_USES_PER_USER:
      return { max: Number(row.max ?? 1) };
    default:
      return {};
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RULE_TYPE_LABELS: Record<PromotionRuleType, string> = {
  [PromotionRuleType.MIN_CART_VALUE]: 'Min cart value (₹)',
  [PromotionRuleType.MIN_QTY]: 'Min quantity',
  [PromotionRuleType.CUSTOMER_SEGMENT]: 'Customer segment',
  [PromotionRuleType.FIRST_ORDER_ONLY]: 'First order only',
  [PromotionRuleType.PRODUCT_IN_CART]: 'Product in cart',
  [PromotionRuleType.NEW_CUSTOMER]: 'New customer (days)',
  [PromotionRuleType.DATE_RANGE]: 'Day-of-week range',
  [PromotionRuleType.MAX_USES_PER_USER]: 'Max uses per user',
};

// Hydrate a rule_config + rule_type from the API into a flat RuleRow
function hydrateRule(raw: { rule_type: PromotionRuleType; rule_config: any; negate: boolean }): RuleRow {
  const cfg = raw.rule_config ?? {};
  return {
    rule_type: raw.rule_type,
    negate: raw.negate ?? false,
    amount: cfg.amount,
    qty: cfg.qty,
    segment_id: cfg.segment_id,
    product_id: cfg.product_id,
    registered_within_days: cfg.registered_within_days,
    days_of_week: cfg.days_of_week ?? [],
    max: cfg.max,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const CouponModel = ({
  setIsModalOpen,
  isModalOpen,
  id,
  onSuccess,
  vendorId,
  setCoupons,
}: CouponModelProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const token = authToken();
  const isEditMode = !!id;
  const [productOptions, setProductOptions] = useState<{ id: string; name: string }[]>([]);

  // ── Local rule state (not in react-hook-form to keep zod schema clean) ──
  const [rules, setRules] = useState<RuleRow[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discount_type: PromotionType.PERCENTAGE,
      code: '',
      description: '',
      value: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      min_order_amount: '',
      max_discount_amount: '',
      max_uses: null,
      max_uses_per_user: 1,
      is_auto_applied: false,
      is_active: true,
      applicable_product_ids: [] as string[],
    },
  });

  // ── Load data on open ──
  useEffect(() => {
    const loadProductOptions = async () => {
      try {
        const res = await fetchAllProductOptions(token as string);
        setProductOptions(res.data.data ?? []);
      } catch {
        toast.error('Failed to load product options.');
      }
    };

    if (!isModalOpen) return;

    loadProductOptions();

    if (id) {
      (async () => {
        try {
          const res = await fetchCouponDetails(id, token as string);
          const c = res.data.data;
          reset({
            discount_type: c.discount_type || PromotionType.PERCENTAGE,
            code: c.code || '',
            description: c.description || '',
            value: Number(c.discount_value || 0),
            valid_from: c.valid_from ? new Date(c.valid_from).toISOString().split('T')[0] : '',
            valid_to: c.valid_to ? new Date(c.valid_to).toISOString().split('T')[0] : '',
            min_order_amount: c.min_order_amount ? String(c.min_order_amount) : '',
            max_discount_amount: c.max_discount_amount ? String(c.max_discount_amount) : '',
            max_uses: c.max_uses ? Number(c.max_uses) : null,
            max_uses_per_user: c.max_uses_per_user ? Number(c.max_uses_per_user) : null,
            is_auto_applied: c.is_auto_applied ?? false,
            is_active: c.is_active ?? true,
            applicable_product_ids: [],
          });
          // Hydrate rules from API
          if (Array.isArray(c.rules)) {
            setRules(c.rules.map(hydrateRule));
          }
        } catch {
          toast.error('Failed to load coupon details.');
        }
      })();
    } else {
      reset({
        discount_type: PromotionType.PERCENTAGE,
        code: '',
        description: '',
        value: 0,
        valid_from: new Date().toISOString().split('T')[0],
        valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        min_order_amount: '',
        max_discount_amount: '',
        max_uses: null,
        max_uses_per_user: 1,
        is_auto_applied: false,
        is_active: true,
        applicable_product_ids: [],
      });
      setRules([]);
    }
  }, [id, isModalOpen]);

  // ── Close on outside click ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModalOpen(false);
        reset();
        setRules([]);
      }
    };
    if (isModalOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isModalOpen]);

  // ── Rule helpers ──
  const addRule = () =>
    setRules((prev) => [
      ...prev,
      { rule_type: PromotionRuleType.MIN_CART_VALUE, negate: false, amount: 0 },
    ]);

  const removeRule = (idx: number) =>
    setRules((prev) => prev.filter((_, i) => i !== idx));

  const updateRule = (idx: number, patch: Partial<RuleRow>) =>
    setRules((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));

  const toggleDay = (idx: number, day: number) => {
    const current = rules[idx].days_of_week ?? [];
    const updated = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    updateRule(idx, { days_of_week: updated });
  };

  // ── Submit ──
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Build rules array from local state — maps to PromotionRuleDto[]
      const rulesPayload = rules.map((row) => ({
        rule_type: row.rule_type,
        rule_config: buildRuleConfig(row),
        negate: row.negate,
      }));

      const payload = {
        code: data.code.toUpperCase(),
        description: data.description || '',
        discount_type:
          data.discount_type === 'percentage'
            ? 'percentage'
            : data.discount_type === 'free_shipping'
            ? 'free_shipping'
            : 'fixed_amount',
        discount_value: String(data.value),
        max_discount_amount: data.max_discount_amount
          ? String(data.max_discount_amount)
          : undefined,
        // min_order_amount is now sent as a rule, not a top-level field.
        // Kept here for backward-compat with the old API path if needed:
        min_order_amount: data.min_order_amount
          ? String(data.min_order_amount)
          : undefined,
        max_uses: data.max_uses ? Number(data.max_uses) : undefined,
        max_uses_per_user: data.max_uses_per_user
          ? Number(data.max_uses_per_user)
          : 1,
        is_auto_applied: !!data.is_auto_applied,
        is_active: !!data.is_active,
        valid_from: new Date(data.valid_from).toISOString(),
        valid_to: new Date(data.valid_to).toISOString(),
        applicable_product_ids: data.applicable_product_ids || [],
       
        rules: rulesPayload,
      };

      if (isEditMode) {
        const response = await updateExistingCoupon(
          id as string,
          payload,
          vendorId as string,
          token as string,
        );
        if (response.status === 200) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === id ? response.data.data : c)),
          );
        }
        toast.success('Coupon updated successfully!');
      } else {
        const response = await createNewCoupon(
          payload,
          vendorId as string,
          token as string,
        );
        if (response.status === 201) {
          setCoupons((prev) => [...prev, response.data.data]);
        }
        toast.success('Coupon created successfully!');
      }

      setIsModalOpen(false);
      setRules([]);
      if (onSuccess) onSuccess();
      reset();
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} coupon.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const discountType = watch('discount_type');
  const applicableProductIds = watch('applicable_product_ids') ?? [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Edit Promo Code' : 'New Promo Code'}
          </h2>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setRules([]);
              reset();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          {/* ── Basic Info ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Coupon Code *
              </label>
              <input
                type="text"
                disabled={isEditMode}
                {...register('code', {
                  onChange: (e) =>
                    (e.target.value = e.target.value.toUpperCase()),
                })}
                className={`border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-xl p-2.5 text-sm uppercase ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="SUMMER50"
              />
              {errors.code && (
                <p className="text-xs text-red-500">
                  {errors.code.message?.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Description *
              </label>
              <input
                type="text"
                {...register('description')}
                className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-xl p-2.5 text-sm`}
                placeholder="Summer Sale 2026"
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* ── Discount Type & Value ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Discount Type *
              </label>
              <select
                {...register('discount_type')}
                className="border border-gray-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value={PromotionType.PERCENTAGE}>Percentage (%)</option>
                <option value={PromotionType.FIXED_AMOUNT}>
                  Fixed Cart Amount
                </option>
                <option value={PromotionType.TIERED_DISCOUNT}>
                  Tiered Discount
                </option>
                <option value={PromotionType.FREE_SHIPPING}>
                  Free Shipping
                </option>
                <option value={PromotionType.BOGO}>Buy 1 Get 1 Free</option>
              </select>
              {errors.discount_type && (
                <p className="text-xs text-red-500">
                  {errors.discount_type.message?.toString()}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Value *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('value', { valueAsNumber: true })}
                className={`border ${errors.value ? 'border-red-500' : 'border-gray-300'} rounded-xl p-2.5 text-sm`}
                placeholder="0.00"
              />
              {errors.value && (
                <p className="text-xs text-red-500">
                  {errors.value.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* ── Validity ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Valid From *
              </label>
              <input
                type="date"
                {...register('valid_from')}
                className={`border ${errors.valid_from ? 'border-red-500' : 'border-gray-300'} rounded-xl p-2.5 text-sm`}
              />
              {errors.valid_from && (
                <p className="text-xs text-red-500">
                  {errors.valid_from.message?.toString()}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Valid To *
              </label>
              <input
                type="date"
                {...register('valid_to')}
                className={`border ${errors.valid_to ? 'border-red-500' : 'border-gray-300'} rounded-xl p-2.5 text-sm`}
              />
              {errors.valid_to && (
                <p className="text-xs text-red-500">
                  {errors.valid_to.message?.toString()}
                </p>
              )}
            </div>
          </div>

          {/* ── Advanced Limits ── */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2">
              Advanced Limits (Optional)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Min Order Amount (₹)
                </label>
                <input
                  type="number"
                  {...register('min_order_amount')}
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Max Discount Amount (₹)
                </label>
                <input
                  type="number"
                  {...register('max_discount_amount')}
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Total Max Uses
                </label>
                <input
                  type="number"
                  {...register('max_uses', { valueAsNumber: true })}
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  placeholder="Infinite if empty"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">
                  Uses Per User
                </label>
                <input
                  type="number"
                  {...register('max_uses_per_user', { valueAsNumber: true })}
                  className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                  placeholder="e.g. 1"
                />
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_auto_applied')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Auto Apply at Checkout
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>
            </div>

            {/* ── Applicable Products ── */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Applicable Products (Optional)
              </label>
              <select
                className="border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-100"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) return;
                  const currentIds =
                    (watch('applicable_product_ids') as string[]) ?? [];
                  if (!currentIds.includes(selectedId)) {
                    setValue(
                      'applicable_product_ids',
                      [...currentIds, selectedId],
                      { shouldDirty: true },
                    );
                  }
                  e.target.value = '';
                }}
              >
                <option value="">-- Select a product to add --</option>
                {productOptions.map((opt) => {
                  const MAX = 30;
                  const display =
                    opt.name.length > MAX
                      ? `${opt.name.substring(0, MAX)}...`
                      : opt.name;
                  return (
                    <option key={opt.id} value={opt.id} title={opt.name}>
                      {display}
                    </option>
                  );
                })}
              </select>

              <div className="flex flex-wrap gap-2 mt-2">
                {applicableProductIds.map((pid: string) => {
                  const product = productOptions.find((p) => p.id === pid);
                  if (!product) return null;
                  return (
                    <span
                      key={pid}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-100"
                    >
                      <span className="truncate max-w-[150px]" title={product.name}>
                        {product.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentIds =
                            (watch('applicable_product_ids') as string[]) ?? [];
                          setValue(
                            'applicable_product_ids',
                            currentIds.filter((c) => c !== pid),
                            { shouldDirty: true },
                          );
                        }}
                        className="text-blue-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
                {applicableProductIds.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    No specific products selected. Coupon applies to entire cart.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Promotion Rules Section (maps to PromotionRuleDto[]) ── */}
          <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-4">
            <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Promotion Rules
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  All rules must pass for the coupon to apply (AND logic).
                </p>
              </div>
              <button
                type="button"
                onClick={addRule}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Plus size={14} /> Add Rule
              </button>
            </div>

            {rules.length === 0 && (
              <p className="text-xs text-gray-400 italic text-center py-2">
                No rules added. The coupon will apply to all eligible carts.
              </p>
            )}

            {rules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white border border-indigo-100 rounded-xl p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  {/* Rule type selector */}
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Rule Type
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-100"
                      value={rule.rule_type}
                      onChange={(e) =>
                        updateRule(idx, {
                          rule_type: e.target.value as PromotionRuleType,
                          // reset config fields on type change
                          amount: undefined,
                          qty: undefined,
                          segment_id: undefined,
                          product_id: undefined,
                          registered_within_days: undefined,
                          days_of_week: [],
                          max: undefined,
                        })
                      }
                    >
                      {Object.values(PromotionRuleType).map((t) => (
                        <option key={t} value={t}>
                          {RULE_TYPE_LABELS[t]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Negate toggle */}
                  <div className="flex flex-col gap-1 items-center pt-5">
                    <label className="text-xs font-semibold text-gray-500">
                      Negate
                    </label>
                    <input
                      type="checkbox"
                      checked={rule.negate}
                      onChange={(e) =>
                        updateRule(idx, { negate: e.target.checked })
                      }
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeRule(idx)}
                    className="mt-5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* ── Rule Config Fields ── */}

                {rule.rule_type === PromotionRuleType.MIN_CART_VALUE && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Minimum cart amount (₹)
                    </label>
                    <input
                      type="number"
                      value={rule.amount ?? ''}
                      onChange={(e) =>
                        updateRule(idx, { amount: Number(e.target.value) })
                      }
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      placeholder="e.g. 500"
                    />
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.MIN_QTY && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Minimum quantity
                    </label>
                    <input
                      type="number"
                      value={rule.qty ?? ''}
                      onChange={(e) =>
                        updateRule(idx, { qty: Number(e.target.value) })
                      }
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      placeholder="e.g. 3"
                    />
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.CUSTOMER_SEGMENT && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Segment ID
                    </label>
                    <input
                      type="text"
                      value={rule.segment_id ?? ''}
                      onChange={(e) =>
                        updateRule(idx, { segment_id: e.target.value })
                      }
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      placeholder="UUID of customer segment"
                    />
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.FIRST_ORDER_ONLY && (
                  <p className="text-xs text-indigo-600 font-medium bg-indigo-50 rounded-lg px-3 py-2">
                    Coupon applies only to a customer's first order — no extra
                    config needed.
                  </p>
                )}

                {rule.rule_type === PromotionRuleType.PRODUCT_IN_CART && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Required product
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      value={rule.product_id ?? ''}
                      onChange={(e) =>
                        updateRule(idx, { product_id: e.target.value })
                      }
                    >
                      <option value="">-- Select a product --</option>
                      {productOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name.length > 40
                            ? `${opt.name.substring(0, 40)}...`
                            : opt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.NEW_CUSTOMER && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Registered within (days)
                    </label>
                    <input
                      type="number"
                      value={rule.registered_within_days ?? ''}
                      onChange={(e) =>
                        updateRule(idx, {
                          registered_within_days: Number(e.target.value),
                        })
                      }
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      placeholder="e.g. 30"
                    />
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.DATE_RANGE && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Active on days
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS.map((day, dayIdx) => {
                        const active = (rule.days_of_week ?? []).includes(
                          dayIdx,
                        );
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(idx, dayIdx)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {rule.rule_type === PromotionRuleType.MAX_USES_PER_USER && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Max uses per user (rule-level override)
                    </label>
                    <input
                      type="number"
                      value={rule.max ?? ''}
                      onChange={(e) =>
                        updateRule(idx, { max: Number(e.target.value) })
                      }
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                      placeholder="e.g. 2"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : isEditMode ? (
              'Update Coupon'
            ) : (
              'Create Coupon'
            )}
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};