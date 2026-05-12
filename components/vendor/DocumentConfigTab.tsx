'use client';
import { docConfigSchema } from "@/utils/validation";
import { fetchCompanyDocumentConfig, upsertCompanyDocumentConfig } from "@/utils/vendorApiClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Field } from "./Field";
import { Input } from "./Input";
import { Select } from "./Select";
import { Hash, LinkIcon } from "lucide-react";
import { Textarea } from "./TextArea";
import { SaveButton } from "./SaveButton";
import { z } from "zod";

export function DocumentConfigTab({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [previewNumber, setPreviewNumber] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm({
      resolver: zodResolver(docConfigSchema),
      defaultValues: {
        invoice_number_prefix: 'INV',
        invoice_number_format: '{PREFIX}-{YYYY}-{SEQ8}',
        invoice_sequence_reset: 'APRIL',
        default_currency: 'INR',
        default_timezone: 'Asia/Kolkata',
        date_format: 'DD/MM/YYYY',
      },
    });

  useEffect(() => {
    fetchCompanyDocumentConfig(token).then((res) => {
      if (res?.data) {
        const d = res.data;
        Object.entries(d).forEach(([k, v]) => {
          if (v !== null && v !== undefined) setValue(k as any, v as any);
        });
      }
    });
  }, [token]);

  // Live invoice number preview
  const prefix = watch('invoice_number_prefix');
  const format = watch('invoice_number_format');
  useEffect(() => {
    const now = new Date();
    const preview = (format || '')
      .replace('{PREFIX}', prefix || 'INV')
      .replace('{YYYY}', String(now.getFullYear()))
      .replace('{MM}', String(now.getMonth() + 1).padStart(2, '0'))
      .replace('{SEQ8}', '00000001')
      .replace('{SEQ6}', '000001');
    setPreviewNumber(preview);
  }, [prefix, format]);

  const onSubmit = (data: z.infer<typeof docConfigSchema>) => {
    startTransition(async () => {
      await upsertCompanyDocumentConfig(data, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  const TIMEZONES = ['Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Singapore'];
  const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY'];
  const CURRENCIES = ['INR', 'USD', 'GBP', 'EUR', 'AED', 'SGD'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Invoice Numbering */}
      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-900 rounded-full" />
          Invoice Numbering
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prefix" error={errors.invoice_number_prefix?.message}
            hint="e.g. INV, TAX-INV, SINV">
            <Input {...register('invoice_number_prefix')} placeholder="INV" className="font-mono uppercase" />
          </Field>
          <Field label="Format String" error={errors.invoice_number_format?.message}
            hint="Tokens: {PREFIX} {YYYY} {MM} {SEQ8} {SEQ6}">
            <Input {...register('invoice_number_format')} placeholder="{PREFIX}-{YYYY}-{SEQ8}" className="font-mono" />
          </Field>
          <Field label="Sequence Reset">
            <Select {...register('invoice_sequence_reset')}>
              <option value="APRIL">Indian Financial Year (April 1)</option>
              <option value="CALENDAR">Calendar Year (January 1)</option>
            </Select>
          </Field>
        </div>

        {/* Live preview */}
        {previewNumber && (
          <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <Hash size={13} className="text-gray-400 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Preview</p>
              <code className="text-sm font-mono font-bold text-gray-800">{previewNumber}</code>
            </div>
          </div>
        )}
      </section>

      {/* Signatory Block */}
      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-900 rounded-full" />
          Authorized Signatory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Signatory Name">
            <Input {...register('signatory_name')} placeholder="e.g. Rahul Sharma" />
          </Field>
          <Field label="Designation">
            <Input {...register('signatory_designation')} placeholder="e.g. Managing Director" />
          </Field>
          <Field label="Signature Image URL" hint="PNG with transparent background, hosted on S3/CDN">
            <div className="relative">
              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <Input {...register('signatory_signature_url')} placeholder="https://cdn.example.com/sig.png" className="pl-8" />
            </div>
          </Field>
        </div>
      </section>

      {/* Footer & Terms */}
      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-900 rounded-full" />
          Invoice Footer & Terms
        </h3>
        <div className="space-y-4">
          <Field label="Footer Text" hint="Printed at the bottom of every invoice page">
            <Input {...register('invoice_footer_text')}
              placeholder="Thank you for shopping with us. All disputes subject to Surat jurisdiction." />
          </Field>
          <Field label="Terms & Conditions" hint="Printed on last page or as a section">
            <Textarea {...register('invoice_terms_and_conditions')} rows={4}
              placeholder="1. All sales are final unless otherwise specified…" />
          </Field>
        </div>
      </section>

      {/* Locale Defaults */}
      <section>
        <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-gray-900 rounded-full" />
          Output Locale
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Default Currency">
            <Select {...register('default_currency')}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Timezone">
            <Select {...register('default_timezone')}>
              {TIMEZONES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Date Format">
            <Select {...register('date_format')}>
              {DATE_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
        </div>
      </section>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <SaveButton isPending={isPending} saved={saved} />
      </div>
    </form>
  );
}
