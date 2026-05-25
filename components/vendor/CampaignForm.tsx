// components/vendor/CampaignForm.tsx  — fully rewritten
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AxiosAPI from "@/lib/axios";
import { authToken } from "@/utils/authToken";
import { PromotionType, PromotionStatus } from "@/utils/Types";
import { Calendar, Megaphone, Tag } from "lucide-react";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/lib/store";
import { PromotionConfigurator } from "./PromotionConfigurator";
 
const fieldBase = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white";
const labelBase = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";
const sectionContainer = "border border-gray-100 rounded-2xl p-5 bg-gray-50/50";
// Maps frontend-friendly labels to backend enum values
const PROMOTION_TYPE_OPTIONS = [
  { label: "Percentage Off", value: PromotionType.PERCENTAGE },
  { label: "Fixed Amount Off", value: PromotionType.FIXED_AMOUNT },
  { label: "Buy X Get Y", value: PromotionType.BUY_X_GET_Y },
  { label: "Free Shipping", value: PromotionType.FREE_SHIPPING },
  { label: "Tiered Discount", value: PromotionType.TIERED_DISCOUNT },
  { label: "Bundle Deal", value: PromotionType.BUNDLE_DEAL },
];

function buildDiscountConfig(type: string, fields: Record<string, string>): Record<string, unknown> {
  switch (type) {
    case PromotionType.PERCENTAGE:
      return { value: Number(fields.pct_value), ...(fields.pct_cap ? { cap: Number(fields.pct_cap) } : {}) };
    case PromotionType.FIXED_AMOUNT:
      return { value: Number(fields.fixed_value) };
    case PromotionType.FREE_SHIPPING:
      return { max_shipping_waived: Number(fields.shipping_max) };
    case PromotionType.BUY_X_GET_Y:
      return {
        buy_qty: Number(fields.bxgy_buy),
        get_qty: Number(fields.bxgy_get),
        get_product_variant_id: fields.bxgy_variant_id,
        get_discount_percent: Number(fields.bxgy_discount_pct ?? 100),
      };
    case PromotionType.TIERED_DISCOUNT:
      return {
        tiers: (fields.tiers_json ? JSON.parse(fields.tiers_json) : []),
      };
    case PromotionType.BUNDLE_DEAL:
      return {
        product_variant_ids: fields.bundle_variants ? fields.bundle_variants.split(",").map((s) => s.trim()) : [],
        bundle_price: Number(fields.bundle_price),
      };
    default:
      return {};
  }
}

export interface ExistingPromotion {
  id: string;
  name: string;
  description: string | null;
  internal_note: string | null;
  promotion_type: string;
  discount_config: Record<string, unknown>;
  is_auto_applied: boolean;
  is_exclusive: boolean;
  priority: number;
  status: string;
  valid_from: string;
  valid_to: string | null;
  max_uses_total: number | null;
  max_uses_per_user: number | null;
  rules: { rule_type: string; rule_config: Record<string, unknown>; negate: boolean }[];
}

export default function CampaignForm({ existingData }: { existingData?: ExistingPromotion }) {
  const { vendorId } = useParams<{ vendorId: string }>();
  const router = useRouter();
  const token = authToken();
  const isEdit = !!existingData?.id;
  const {user}=useAppSelector((state:RootState)=>state.auth);
const userId= user && 'user_id' in user  ? user.user_id : user && 'id' in user ? user.id : '';
  const [loading, setLoading] = useState(false);
  const [promoType, setPromoType] = useState<PromotionType|string>(existingData?.promotion_type ?? PromotionType.PERCENTAGE);

  // Core fields
  const [name, setName] = useState(existingData?.name ?? "");
  const [description, setDescription] = useState(existingData?.description ?? "");
  const [internalNote, setInternalNote] = useState(existingData?.internal_note ?? "");
  const [isAutoApplied, setIsAutoApplied] = useState(existingData?.is_auto_applied ?? true);
  const [isExclusive, setIsExclusive] = useState(existingData?.is_exclusive ?? false);
  const [priority, setPriority] = useState(String(existingData?.priority ?? 10));
  const [status, setStatus] = useState(existingData?.status ?? PromotionStatus.DRAFT);

  // Schedule
  const [validFrom, setValidFrom] = useState(
    existingData?.valid_from ? new Date(existingData.valid_from).toISOString().slice(0, 16) : ""
  );
  const [validTo, setValidTo] = useState(
    existingData?.valid_to ? new Date(existingData.valid_to).toISOString().slice(0, 16) : ""
  );
  const [maxUsesTotal, setMaxUsesTotal] = useState(String(existingData?.max_uses_total ?? ""));
  const [maxUsesPerUser, setMaxUsesPerUser] = useState(String(existingData?.max_uses_per_user ?? 1));

  // Discount config fields — kept flat for easy binding
  const [discountFields, setDiscountFields] = useState<Record<string, string>>({
    pct_value: String((existingData?.discount_config?.value as number) ?? ""),
    pct_cap: String((existingData?.discount_config?.cap as number) ?? ""),
    fixed_value: String((existingData?.discount_config?.value as number) ?? ""),
    shipping_max: String((existingData?.discount_config?.max_shipping_waived as number) ?? ""),
    bxgy_buy: String((existingData?.discount_config?.buy_qty as number) ?? ""),
    bxgy_get: String((existingData?.discount_config?.get_qty as number) ?? ""),
    bxgy_variant_id: String((existingData?.discount_config?.get_product_variant_id as string) ?? ""),
    bxgy_discount_pct: String((existingData?.discount_config?.get_discount_percent as number) ?? "100"),
    tiers_json: existingData?.discount_config?.tiers ? JSON.stringify(existingData.discount_config.tiers) : "",
    bundle_variants: Array.isArray(existingData?.discount_config?.product_variant_ids)
      ? (existingData.discount_config.product_variant_ids as string[]).join(", ")
      : "",
    bundle_price: String((existingData?.discount_config?.bundle_price as number) ?? ""),
  });

  // Rules — simple min_cart_value support; extend here for other rule types
  const [minCartValue, setMinCartValue] = useState(
    () => {
      const r = existingData?.rules?.find((r) => r.rule_type === "min_cart_value");
      return r ? String((r.rule_config as { amount: number }).amount) : "";
    }
  );

  const df = (key: string, val: string) => setDiscountFields((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validFrom) { toast.error("Valid From date is required"); return; }
    setLoading(true);

    try {
      const rules = [];
      if (minCartValue && Number(minCartValue) > 0) {
        rules.push({ rule_type: "min_cart_value", rule_config: { amount: Number(minCartValue) }, negate: false });
      }

      const payload = {
        name,
        description: description || null,
        internal_note: internalNote || null,
        promotion_type: promoType,
        discount_config: buildDiscountConfig(promoType, discountFields),
        is_auto_applied: isAutoApplied,
        is_exclusive: isExclusive,
        priority: Number(priority),
        status,
        valid_from: new Date(validFrom).toISOString(),
        valid_to: validTo ? new Date(validTo).toISOString() : null,
        max_uses_total: maxUsesTotal ? Number(maxUsesTotal) : null,
        max_uses_per_user: maxUsesPerUser ? Number(maxUsesPerUser) : 1,
        rules,
      };

      if (isEdit) {
        await AxiosAPI.patch(`/v1/promotions/${existingData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Campaign updated");
      } else {
        await AxiosAPI.post(`/v1/promotions/${userId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Campaign created");
      }

      router.push(`/vendor/${vendorId}/marketing/campaigns`);
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to save campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
          <Megaphone size={22} />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">
            {isEdit ? "Edit Campaign" : "Create New Campaign"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure your promotion details, rules, and scheduling.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ── Basic Information ── */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Campaign Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Summer Sale 20% Off" className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className={fieldBase}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={PromotionStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={PromotionStatus.ACTIVE}>Active (publish now)</SelectItem>
                  <SelectItem value={PromotionStatus.PENDING_REVIEW}>Submit for Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className={labelBase}>Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Customer-facing description" className={fieldBase} />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={isAutoApplied} onChange={(e) => setIsAutoApplied(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Auto-apply</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" checked={isExclusive} onChange={(e) => setIsExclusive(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-gray-700">Exclusive</span>
            </label>
          </div>
        </section>

        {/* ── Discount Configuration ── */}
        <section className={sectionContainer}>
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm">
            <Tag size={16} /> Discount Configuration
          </div>
          
<PromotionConfigurator
  promoType={promoType}
  setPromoType={setPromoType}
  discountFields={discountFields}
  updateField={df} // pass your existing 'df' function here
/>
        </section>

        {/* ── Schedule & Usage ── */}
        <section className={sectionContainer}>
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm">
            <Calendar size={16} /> Schedule & Usage
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>Valid From *</label>
              <Input type="datetime-local" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Valid To</label>
              <Input type="datetime-local" value={validTo} onChange={(e) => setValidTo(e.target.value)} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Total Uses Allowed</label>
              <Input type="number" value={maxUsesTotal} onChange={(e) => setMaxUsesTotal(e.target.value)} className={fieldBase} />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 font-bold shadow-md shadow-blue-100">
            {loading ? "Saving…" : isEdit ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}