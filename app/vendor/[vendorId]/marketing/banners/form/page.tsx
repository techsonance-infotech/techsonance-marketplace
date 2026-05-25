"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Image as ImageIcon, Layout, X, Loader2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AxiosAPI from "@/lib/axios";
import { Input } from "@/components/vendor/Input";
import { Textarea } from "@/components/vendor/TextArea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerSchema } from "@/utils/validation";
import { authToken } from "@/utils/authToken";
import { set } from "zod";
import { useAppSelector } from "@/hooks/reduxHooks";
import { RootState } from "@/lib/store";
// ── Constants & Types ──
export enum BannerPlacement {
  HOMEPAGE_HERO = 'homepage_hero',
  HOMEPAGE_SECONDARY = 'homepage_secondary',
  CATEGORY_TOP = 'category_top',
  PRODUCT_PAGE = 'product_page',
  CART_SIDEBAR = 'cart_sidebar',
  CHECKOUT_TOP = 'checkout_top',
  MY_OFFERS_PAGE = 'my_offers_page',
}


const fieldBase = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all bg-white";
const labelBase = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";
const sectionContainer = "border border-gray-100 rounded-2xl p-5 bg-gray-50/50";

export default function BannerForm() {
 const bannerId = useSearchParams().get("id");
  const router = useRouter();
  const isEdit = !!bannerId;
  const {user}=useAppSelector((state:RootState)=>state.auth);
const userId= user && 'user_id' in user  ? user.user_id : user && 'id' in user ? user.id : '';
const { register, handleSubmit, control, setValue, reset, watch } = useForm({
    resolver:zodResolver(bannerSchema),
    defaultValues: {
      placement: BannerPlacement.HOMEPAGE_HERO,
      is_active: true,
      display_order: 0,
      image_alt_text: "",
      headline: "",
      sub_headline: "",
      cta_label: "",
      cta_url: "",
    }
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [previews, setPreviews] = useState<{ desktop: string | null; mobile: string | null }>({ desktop: null, mobile: null });
  const token = authToken();
  const [bannersToDelete, setBannersToDelete] = useState<string[] | null>(null);

  // ── Fetch Existing Data ──
  const fetchBanner = useCallback(async () => {
    if (!isEdit) return;
    setFetching(true);
    try {
      const { data } = await AxiosAPI.get(`/v1/banners/${bannerId}`);
      reset(data);
      setPreviews({ desktop: data.image_url || null, mobile: data.image_url_mobile || null });
    } catch (err: any) {
      toast.error("Failed to load banner");
    } finally {
      setFetching(false);
    }
  }, [bannerId, isEdit, reset]);

  useEffect(() => { fetchBanner(); }, [fetchBanner]);

  // ── Image Handlers ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: "desktop" | "mobile") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(p => ({ ...p, [key]: url }));
      setValue(key === "desktop" ? "image_url" : "image_url_mobile", file);
    }
  };

  const removeImage = (key: "desktop" | "mobile",imageUrl: string | null) => {
    setBannersToDelete((prev) => [...(prev ?? []), imageUrl ?? ""] );
    setPreviews(p => ({ ...p, [key]: null }));
    setValue(key === "desktop" ? "image_url" : "image_url_mobile", null);
    // Explicitly flag for removal if your API supports this
    setValue(key === "desktop" ? "remove_image_url" : "remove_image_url_mobile", true);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    // Append files if they are File objects
    if (data.image_url instanceof File) formData.append("image_url", data.image_url);
    if (data.image_url_mobile instanceof File) formData.append("image_url_mobile", data.image_url_mobile);

    // Clean data and append as JSON
    const payload = { ...data };
    console.log('form data:', data);
    delete payload.image_url;
    delete payload.image_url_mobile;
    formData.append("formData", JSON.stringify(payload));

    try {
      if (isEdit) {
        await AxiosAPI.patch(`/v1/banners/${bannerId}`, formData,{
               headers: { Authorization: `Bearer ${token}`,'Content-Type': 'multipart/form-data' },
        });
        toast.success("Banner updated");
      } else {
        await AxiosAPI.post(`/v1/banners/${userId}`, formData,{
          headers: { Authorization: `Bearer ${token}`,'Content-Type': 'multipart/form-data' },
        });
        toast.success("Banner created");
      }
      router.back();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save banner");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm   mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600"><Layout size={22} /></div>
        <div>
          <h2 className="text-base font-bold text-gray-800">{isEdit ? "Edit Banner" : "Create New Banner"}</h2>
          <p className="text-xs text-gray-500 mt-0.5">Define your banner placement and visual assets.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* ── Basic Setup ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelBase}>Placement *</label>
            <Controller name="placement" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={fieldBase}><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.values(BannerPlacement).map(p => <SelectItem key={p} value={p}>{p.toUpperCase().replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            )}/>
          </div>
          <div>
            <label className={labelBase}>Display Order</label>
            <Input type="number" {...register("display_order", { valueAsNumber: true })} className={fieldBase} />
          </div>
        </div>

        {/* ── Assets Section ── */}
        <section className={sectionContainer}>
          <div className="flex items-center gap-2 mb-4 font-bold text-sm text-gray-800"><ImageIcon size={16} /> Assets</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Upload */}
            <div className="space-y-2">
              <label className={labelBase}>Desktop Image</label>
              {!previews.desktop ? (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <ImageIcon className="text-gray-400 mb-2" size={24} />
                  <span className="text-xs text-gray-400">Click to upload desktop</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "desktop")} />
                </label>
              ) : (
                <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200">
                  <img src={previews.desktop} alt="Desktop Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage("desktop", watch("image_url"))} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Upload */}
            <div className="space-y-2">
              <label className={labelBase}>Mobile Image</label>
              {!previews.mobile ? (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                  <ImageIcon className="text-gray-400 mb-2" size={24} />
                  <span className="text-xs text-gray-400">Click to upload mobile</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "mobile")} />
                </label>
              ) : (
                <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200">
                  <img src={previews.mobile} alt="Mobile Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage("mobile", watch("image_url_mobile"))} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className={labelBase}>Alt Text</label>
            <Input {...register("image_alt_text")} className={fieldBase} placeholder="Description for screen readers" />
          </div>
        </section>

        {/* ── Content & Meta ── */}
        <section className={sectionContainer}>
          <div className="space-y-4">
            <div>
              <label className={labelBase}>Headline</label>
              <Input {...register("headline")} className={fieldBase} />
            </div>
            <div>
              <label className={labelBase}>Sub-headline</label>
              <Textarea {...register("sub_headline")} className={fieldBase} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={labelBase}>CTA Label</label>
                  <Input {...register("cta_label")} className={fieldBase} />
               </div>
               <div>
                  <label className={labelBase}>CTA URL</label>
                  <Input {...register("cta_url")} className={fieldBase} />
               </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t">
           <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
           <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 flex items-center gap-2">
             {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
             {loading ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
           </Button>
        </div>
      </form>
    </div>
  );
}