import React, { useEffect } from 'react';
import { Select, SelectContent, SelectGroup,  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "./Input";
import { Textarea } from "./TextArea";
import { PromotionType } from '@/utils/Types';
import { authToken } from '@/utils/authToken';
import { RootState } from '@/lib/store';
import { useAppSelector } from '@/hooks/reduxHooks';
import { fetchVendorProductsOptions } from '@/utils/vendorApiClient';

 
// ── Reusable Styles (Keep these consistent) ──
const fieldBase = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white";
const labelBase = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

const PROMOTION_TYPE_OPTIONS = [
  { value: PromotionType.PERCENTAGE, label: "Percentage (%)" },
  { value: PromotionType.FIXED_AMOUNT, label: "Fixed Amount (₹)" },
  { value: PromotionType.BUY_X_GET_Y, label: "Buy X Get Y" },
  { value: PromotionType.BOGO, label: "Buy 1 Get 1 (BOGO)" },
  { value: PromotionType.FREE_SHIPPING, label: "Free Shipping" },
  { value: PromotionType.TIERED_DISCOUNT, label: "Tiered Discount" },
  { value: PromotionType.BUNDLE_DEAL, label: "Bundle Deal" },
];

interface PromotionConfiguratorProps {
  promoType: PromotionType | string;
  setPromoType: (type: PromotionType) => void;
  discountFields: any;
  updateField: (key: string, value: any) => void; // This replaces your 'df' function
}

export function PromotionConfigurator({ 
  promoType, 
  setPromoType, 
  discountFields, 
  updateField 
}: PromotionConfiguratorProps) {
    const {user}=useAppSelector((state:RootState)=>state.auth);
    const userId= user && 'user_id' in user  ? user.user_id : user && 'id' in user ? user.id : '';
    const token = authToken();
    const [variantOptions, setVariantOptions] = React.useState<{ value: string; label: string }[]>([]);
    const fetchProductVariants = async () => {
    
        const res = await fetchVendorProductsOptions(token!);
        setVariantOptions(res.data);
 
    };

  useEffect(() => {
    if(promoType === PromotionType.BUY_X_GET_Y) {
        fetchProductVariants();
    }
  }, [promoType, updateField]);

  return (
    <div className="space-y-4">
      {/* ── Type Selector ── */}
      <div className="max-w-xs">
        <label className={labelBase}>Promotion Type *</label>
        <Select value={promoType} onValueChange={(v) => setPromoType(v as PromotionType)}>
          <SelectTrigger className={fieldBase}><SelectValue /></SelectTrigger>
          <SelectContent>
            {PROMOTION_TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Dynamic Config Fields ── */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* PERCENTAGE */}
        {promoType === PromotionType.PERCENTAGE && (
          <>
            <div>
              <label className={labelBase}>Percentage (%) *</label>
              <Input type="number" value={discountFields.pct_value || ""} onChange={(e) => updateField("pct_value", e.target.value)} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Max Discount Cap (₹)</label>
              <Input type="number" value={discountFields.pct_cap || ""} onChange={(e) => updateField("pct_cap", e.target.value)} className={fieldBase} />
            </div>
          </>
        )}

        {/* FIXED AMOUNT */}
        {promoType === PromotionType.FIXED_AMOUNT && (
          <div className="col-span-2">
            <label className={labelBase}>Amount Off (₹) *</label>
            <Input type="number" value={discountFields.fixed_amount || ""} onChange={(e) => updateField("fixed_amount", e.target.value)} className={fieldBase} />
          </div>
        )}

        {/* BUY X GET Y */}
        {promoType === PromotionType.BUY_X_GET_Y && (
          <>
            <div>
              <label className={labelBase}>Buy Quantity *</label>
              <Input type="number" value={discountFields.bxgy_buy_qty || ""} onChange={(e) => updateField("bxgy_buy_qty", e.target.value)} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Get Quantity *</label>
              <Input type="number" value={discountFields.bxgy_get_qty || ""} onChange={(e) => updateField("bxgy_get_qty", e.target.value)} className={fieldBase} />
            </div>
            <div className="col-span-2">
              <label className={labelBase}>Free Product Variant ID *</label>
              <Select name="bxgy_variant_id" id="bxgy_variant_id" value={discountFields.bxgy_variant_id || ""} onValueChange={(e) => updateField("bxgy_variant_id", e)} className={fieldBase+'w-full max-w-xs truncate'}>
                <SelectTrigger className={`${fieldBase} w-full max-w-xs`}>
                  <SelectValue placeholder="Select Variant" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        
                {variantOptions? variantOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id} className='truncate' title={option.name} >
                    {option.name}
                  </SelectItem>
                )): <SelectItem value="">Select Variant</SelectItem>}
                </SelectGroup>
              </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className={labelBase}>Discount % on Get Items</label>
              <Input type="number" value={discountFields.bxgy_discount_pct || ""} onChange={(e) => updateField("bxgy_discount_pct", e.target.value)} className={fieldBase} />
            </div>
            </>
        )}

        {/* BOGO */}
        {promoType === PromotionType.BOGO && (
          <>
            <div>
              <label className={labelBase}>Buy Qty *</label>
              <Input type="number" value={discountFields.bogo_buy_qty || ""} onChange={(e) => updateField("bogo_buy_qty", e.target.value)} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Free Product Variant ID *</label>
              <Input value={discountFields.bogo_variant_id || ""} onChange={(e) => updateField("bogo_variant_id", e.target.value)} className={fieldBase} />
            </div>
          </>
        )}

        {/* FREE SHIPPING */}
        {promoType === PromotionType.FREE_SHIPPING && (
          <div className="col-span-2">
            <label className={labelBase}>Max Shipping Waived (₹) *</label>
            <Input type="number" value={discountFields.shipping_max_amount || ""} onChange={(e) => updateField("shipping_max_amount", e.target.value)} className={fieldBase} />
          </div>
        )}

        {/* TIERED DISCOUNT */}
        {promoType === PromotionType.TIERED_DISCOUNT && (
          <div className="col-span-2">
            <label className={labelBase}>Tiers (JSON) *</label>
            <Textarea 
              value={discountFields.tiers_json || ""} 
              onChange={(e) => updateField("tiers_json", e.target.value)} 
              rows={3} 
              placeholder={`[{"min_cart": 500, "percent": 5}]`}
              className={fieldBase}
            />
          </div>
        )}

        {/* BUNDLE DEAL */}
        {promoType === PromotionType.BUNDLE_DEAL && (
          <>
            <div className="col-span-2">
              <label className={labelBase}>Variant IDs (comma separated) *</label>
              <Input value={discountFields.bundle_variant_ids || ""} onChange={(e) => updateField("bundle_variant_ids", e.target.value)} className={fieldBase} />
            </div>
            <div className="col-span-2">
              <label className={labelBase}>Bundle Price (₹) *</label>
              <Input type="number" value={discountFields.bundle_price || ""} onChange={(e) => updateField("bundle_price", e.target.value)} className={fieldBase} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}