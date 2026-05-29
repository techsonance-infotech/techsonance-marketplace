'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { fetchCompanyCompliance, uploadComplianceProofDocument, deleteCompanyComplianceField } from '@/utils/vendorApiClient';
import { authToken } from '@/utils/authToken';

// ─── Types inferred from schema ───────────────────────────────────────────────

interface ComplianceDocument {
  id: string;
  document_type: string;
  document_url: string;
  document_status: string | null;
  created_at: string;
  updated_at: string;
  vendor_id: string | null;
  company_id: string | null;
}

interface ComplianceField {
  id: string;
  company_id: string;
  country_code: string;
  field_key: string;
  field_value: string;
  field_details: unknown;
  document_id: string | null;
  is_active: boolean;
  valid_until: string | null;
  display_name: string | null;
  rejection_reason: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined document when returned by API
  document?: ComplianceDocument | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FIELD_KEY_LABELS: Record<string, { label: string; icon: string; description: string }> = {
  gstin:       { label: 'GST Registration',    icon: 'receipt-tax',    description: 'Goods and Services Tax Identification Number — mandatory for invoicing' },
  pan:         { label: 'PAN',                 icon: 'id-badge',       description: 'Permanent Account Number — issued by the Income Tax Department of India' },
  cin:         { label: 'CIN',                 icon: 'building-store', description: 'Corporate Identification Number — issued by the Ministry of Corporate Affairs' },
  vat_number:  { label: 'VAT Number',          icon: 'world',          description: 'Value Added Tax registration number for applicable jurisdictions' },
  ein:         { label: 'EIN',                 icon: 'id-badge-2',     description: 'Employer Identification Number — US federal tax ID' },
  kvk:         { label: 'KVK Number',          icon: 'building',       description: 'Netherlands Chamber of Commerce registration number' },
  trade_license: { label: 'Trade License',     icon: 'certificate',    description: 'Locally issued trade or business license' },
};

function getFieldMeta(key: string) {
  return FIELD_KEY_LABELS[key] ?? { label: key.replace(/_/g, ' ').toUpperCase(), icon: 'file-certificate', description: 'Regulatory compliance identifier' };
}

function getStatusConfig(status: string | null | undefined, isActive: boolean) {
  if (!isActive) return { label: 'Inactive',         color: 'gray',   icon: 'circle-off' };
  switch (status?.toLowerCase()) {
    case 'verified':       return { label: 'Verified',         color: 'green',  icon: 'circle-check' };
    case 'approved':       return { label: 'Approved',         color: 'green',  icon: 'circle-check' };
    case 'rejected':       return { label: 'Rejected',         color: 'red',    icon: 'circle-x' };
    case 'pending_review': return { label: 'Pending review',   color: 'amber',  icon: 'clock' };
    case 'expired':        return { label: 'Expired',          color: 'red',    icon: 'alert-triangle' };
    default:               return { label: 'Submitted',        color: 'blue',   icon: 'circle-dot' };
  }
}

function isPdf(url: string) { return /\.pdf(\?.*)?$/i.test(url); }
function isImage(url: string) { return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url); }

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isExpiringSoon(validUntil: string | null) {
  if (!validUntil) return false;
  const daysLeft = Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000);
  return daysLeft > 0 && daysLeft <= 30;
}

function isExpired(validUntil: string | null) {
  if (!validUntil) return false;
  return new Date(validUntil).getTime() < Date.now();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status, isActive }: { status: string | null | undefined; isActive: boolean }) {
  const cfg = getStatusConfig(status, isActive);
  const colorMap: Record<string, string> = {
    green: 'background: #EAF3DE; color: #3B6D11;',
    red:   'background: #FCEBEB; color: #A32D2D;',
    amber: 'background: #FAEEDA; color: #854F0B;',
    blue:  'background: #E6F1FB; color: #185FA5;',
    gray:  'background: #F1EFE8; color: #5F5E5A;',
  };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px',
      borderRadius: 20, fontSize: 12, fontWeight: 500,
      ...(Object.fromEntries(colorMap[cfg.color].split(';').filter(Boolean).map(s => {
        const [k, v] = s.split(':').map(x => x.trim());
        return [k === 'background' ? 'background' : 'color', v];
      }))),
    }}>
      <i className={`ti ti-${cfg.icon}`} aria-hidden="true" style={{ fontSize: 13 }} />
      {cfg.label}
    </span>
  );
}

function DocumentPreviewModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const pdf = isPdf(url);
  const image = isImage(url);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-lg)',
          border: '0.5px solid var(--color-border-tertiary)',
          width: '100%', maxWidth: 860,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className={`ti ti-${pdf ? 'file-type-pdf' : 'photo'}`} aria-hidden="true"
              style={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
            <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' }}>{title}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                fontSize: 13, color: 'var(--color-text-primary)',
                textDecoration: 'none', background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <i className="ti ti-external-link" aria-hidden="true" style={{ fontSize: 14 }} />
              Open
            </a>
            <button
              onClick={onClose}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Close preview"
            >
              <i className="ti ti-x" aria-hidden="true" style={{ fontSize: 16 }} />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          {pdf ? (
            <iframe
              src={url}
              title={title}
              style={{ width: '100%', height: '65vh', border: 'none', borderRadius: 'var(--border-radius-md)' }}
            />
          ) : image ? (
            <img
              src={url}
              alt={title}
              style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 'var(--border-radius-md)' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <i className="ti ti-file-unknown" aria-hidden="true" style={{ fontSize: 40, display: 'block', marginBottom: 12 }} />
              <p style={{ fontSize: 14 }}>Preview not available for this file type.</p>
              <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-info)' }}>Download file</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Compliance Card ──────────────────────────────────────────────────────────

function ComplianceCard({
  field,
  token,
  onUpload,
  onDelete,
}: {
  field: ComplianceField;
  token: string;
  onUpload: (fieldId: string, file: File) => Promise<void>;
  onDelete: (fieldId: string) => Promise<void>;
}) {
  const meta = getFieldMeta(field.field_key);
  const doc = field.document;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const expiring = isExpiringSoon(field.valid_until);
  const expired = isExpired(field.valid_until);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await onUpload(field.id, file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDelete = async () => {
    if (!confirm(`Remove this compliance record for ${meta.label}?`)) return;
    setDeleting(true);
    try {
      await onDelete(field.id);
    } finally {
      setDeleting(false);
    }
  };

  const docIcon = doc ? (isPdf(doc.document_url) ? 'file-type-pdf' : 'photo') : 'file-plus';

  return (
    <>
      {previewUrl && (
        <DocumentPreviewModal
          url={previewUrl}
          title={`${meta.label} — ${field.field_value}`}
          onClose={() => setPreviewUrl(null)}
        />
      )}

      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.15s',
      }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--border-radius-md)', flexShrink: 0,
              background: 'var(--color-background-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`ti ti-${meta.icon}`} aria-hidden="true"
                style={{ fontSize: 20, color: 'var(--color-text-secondary)' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' }}>
                {field.display_name ?? meta.label}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {field.field_value}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <StatusBadge status={doc?.document_status} isActive={field.is_active} />
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Remove compliance record"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 30, height: 30, borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-secondary)',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                opacity: deleting ? 0.5 : 1,
              }}
              aria-label={`Delete ${meta.label}`}
            >
              {deleting
                ? <i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 14 }} />
                : <i className="ti ti-trash" aria-hidden="true" style={{ fontSize: 14 }} />}
            </button>
          </div>
        </div>

        {/* Description */}
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          {meta.description}
        </p>

        {/* Validity / country row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: 'var(--color-text-secondary)',
          }}>
            <i className="ti ti-world" aria-hidden="true" style={{ fontSize: 13 }} />
            {field.country_code}
          </span>
          {field.valid_until && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12,
              color: expired ? 'var(--color-text-danger)' : expiring ? 'var(--color-text-warning)' : 'var(--color-text-secondary)',
            }}>
              <i className={`ti ti-${expired ? 'alert-circle' : expiring ? 'alert-triangle' : 'calendar'}`}
                aria-hidden="true" style={{ fontSize: 13 }} />
              {expired ? 'Expired' : expiring ? 'Expires soon'  : 'Valid until'} {formatDate(field.valid_until)}
            </span>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: 'var(--color-text-secondary)',
          }}>
            <i className="ti ti-clock" aria-hidden="true" style={{ fontSize: 13 }} />
            Added {formatDate(field.created_at)}
          </span>
        </div>

        {/* Rejection reason */}
        {field.rejection_reason && (
          <div style={{
            display: 'flex', gap: 8, padding: '10px 12px',
            background: 'var(--color-background-danger)',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-danger)',
          }}>
            <i className="ti ti-alert-circle" aria-hidden="true"
              style={{ fontSize: 16, color: 'var(--color-text-danger)', flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-danger)', lineHeight: 1.5 }}>
              <strong style={{ fontWeight: 500 }}>Rejection reason: </strong>{field.rejection_reason}
            </p>
          </div>
        )}

        {/* Document section */}
        <div style={{
          borderTop: '0.5px solid var(--color-border-tertiary)',
          paddingTop: 14,
        }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Proof document
          </p>

          {doc ? (
            /* Document present */
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-tertiary)',
            }}>
              <i className={`ti ti-${docIcon}`} aria-hidden="true"
                style={{ fontSize: 24, color: 'var(--color-text-secondary)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                  {doc.document_type.replace(/_/g, ' ')}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--color-text-secondary)' }}>
                  Uploaded {formatDate(doc.created_at)} · {isPdf(doc.document_url) ? 'PDF' : 'Image'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => setPreviewUrl(doc.document_url)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: 12, color: 'var(--color-text-primary)',
                  }}
                >
                  <i className="ti ti-eye" aria-hidden="true" style={{ fontSize: 13 }} />
                  Preview
                </button>
                <a
                  href={doc.document_url}
                  download
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 'var(--border-radius-md)',
                    border: '0.5px solid var(--color-border-secondary)',
                    background: 'transparent', cursor: 'pointer',
                    fontSize: 12, color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                  }}
                >
                  <i className="ti ti-download" aria-hidden="true" style={{ fontSize: 13 }} />
                </a>
              </div>
            </div>
          ) : (
            /* Upload zone */
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--border-radius-md)',
                border: `1.5px dashed ${dragOver ? 'var(--color-border-info)' : 'var(--color-border-secondary)'}`,
                background: dragOver ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                cursor: uploading ? 'wait' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {uploading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 18, color: 'var(--color-text-secondary)' }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Uploading…</span>
                </div>
              ) : (
                <>
                  <i className="ti ti-upload" aria-hidden="true"
                    style={{ fontSize: 22, color: 'var(--color-text-secondary)', display: 'block', margin: '0 auto 6px' }} />
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    Drop file here or <span style={{ color: 'var(--color-text-info)' }}>browse</span>
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                    PDF, JPG, PNG, WEBP up to 10 MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  countryFilter, setCountryFilter,
  countries,
}: {
  search: string; setSearch: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  countryFilter: string; setCountryFilter: (v: string) => void;
  countries: string[];
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: '1 1 220px' }}>
        <i className="ti ti-search" aria-hidden="true"
          style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'var(--color-text-tertiary)', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search by key or value…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 32, width: '100%', boxSizing: 'border-box' }}
        />
      </div>
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: '0 0 auto' }}>
        <option value="">All statuses</option>
        <option value="verified">Verified</option>
        <option value="pending_review">Pending review</option>
        <option value="rejected">Rejected</option>
        <option value="expired">Expired</option>
        <option value="no_document">No document</option>
      </select>
      {countries.length > 1 && (
        <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} style={{ flex: '0 0 auto' }}>
          <option value="">All countries</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
    </div>
  );
}

// ─── Summary banner ───────────────────────────────────────────────────────────

function SummaryBanner({ fields }: { fields: ComplianceField[] }) {
  const total     = fields.length;
  const verified  = fields.filter(f => f.document?.document_status?.toLowerCase() === 'verified' || f.document?.document_status?.toLowerCase() === 'approved').length;
  const pending   = fields.filter(f => f.document?.document_status?.toLowerCase() === 'pending_review').length;
  const noDocs    = fields.filter(f => !f.document).length;
  const expiring  = fields.filter(f => isExpiringSoon(f.valid_until)).length;

  const items = [
    { label: 'Total registrations', value: total, icon: 'file-certificate', color: '#185FA5', bg: '#E6F1FB' },
    { label: 'Verified',            value: verified, icon: 'circle-check', color: '#3B6D11', bg: '#EAF3DE' },
    { label: 'Pending review',      value: pending,  icon: 'clock',        color: '#854F0B', bg: '#FAEEDA' },
    { label: 'Missing documents',   value: noDocs,   icon: 'file-off',     color: '#A32D2D', bg: '#FCEBEB' },
    ...(expiring > 0 ? [{ label: 'Expiring soon', value: expiring, icon: 'alert-triangle', color: '#854F0B', bg: '#FAEEDA' }] : []),
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
      {items.map(it => (
        <div key={it.label} style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className={`ti ti-${it.icon}`} aria-hidden="true" style={{ fontSize: 15, color: it.color }} />
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)' }}>{it.value}</p>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-secondary)' }}>{it.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [fields, setFields] = useState<ComplianceField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // TODO: get real token from your auth context / cookie
  const token = authToken()
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCompanyCompliance(token);
      setFields(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setError('Failed to load compliance records.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = useCallback(async (fieldId: string, file: File) => {
    await uploadComplianceProofDocument(fieldId, file, undefined, token);
    await load();
  }, [token, load]);

  const handleDelete = useCallback(async (fieldId: string) => {
    await deleteCompanyComplianceField(fieldId, token);
    await load();
  }, [token, load]);

  // Unique countries for filter
  const countries = Array.from(new Set(fields.map(f => f.country_code))).sort();

  // Filtered list
  const filtered = fields.filter(f => {
    const meta = getFieldMeta(f.field_key);
    const matchSearch = !search ||
      f.field_value.toLowerCase().includes(search.toLowerCase()) ||
      meta.label.toLowerCase().includes(search.toLowerCase()) ||
      f.field_key.toLowerCase().includes(search.toLowerCase()) ||
      (f.display_name ?? '').toLowerCase().includes(search.toLowerCase());

    const docStatus = f.document?.document_status?.toLowerCase() ?? null;
    const matchStatus = !statusFilter ||
      (statusFilter === 'no_document' ? !f.document : docStatus === statusFilter);

    const matchCountry = !countryFilter || f.country_code === countryFilter;

    return matchSearch && matchStatus && matchCountry;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Page header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <i className="ti ti-shield-check" aria-hidden="true"
            style={{ fontSize: 22, color: 'var(--color-text-secondary)' }} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Compliance &amp; documents
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          All regulatory registrations and proof documents submitted during and after onboarding. Each record may have a linked certificate or proof file.
        </p>
      </div>

      {/* Summary */}
      {!loading && !error && fields.length > 0 && (
        <SummaryBanner fields={fields} />
      )}

      {/* Filters */}
      {!loading && !error && fields.length > 0 && (
        <FilterBar
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          countryFilter={countryFilter} setCountryFilter={setCountryFilter}
          countries={countries}
        />
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: 12, color: 'var(--color-text-secondary)' }}>
          <i className="ti ti-loader-2" aria-hidden="true" style={{ fontSize: 20 }} />
          <span style={{ fontSize: 14 }}>Loading compliance records…</span>
        </div>
      ) : error ? (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10, padding: '1rem 1.25rem',
          background: 'var(--color-background-danger)',
          border: '0.5px solid var(--color-border-danger)',
          borderRadius: 'var(--border-radius-md)',
        }}>
          <i className="ti ti-alert-circle" aria-hidden="true"
            style={{ fontSize: 18, color: 'var(--color-text-danger)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: 'var(--color-text-danger)' }}>{error}</p>
            <button onClick={load} style={{ marginTop: 8, fontSize: 13, cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--color-text-danger)', textDecoration: 'underline', padding: 0 }}>
              Try again
            </button>
          </div>
        </div>
      ) : fields.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          border: '0.5px solid var(--color-border-tertiary)',
        }}>
          <i className="ti ti-file-certificate" aria-hidden="true"
            style={{ fontSize: 40, color: 'var(--color-text-tertiary)', display: 'block', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' }}>No compliance records yet</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Compliance fields such as GSTIN, PAN, and CIN are added during onboarding and will appear here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
          <i className="ti ti-search" aria-hidden="true" style={{ fontSize: 28, display: 'block', marginBottom: 10 }} />
          <p style={{ margin: 0, fontSize: 14 }}>No records match your filters.</p>
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setCountryFilter(''); }}
            style={{ marginTop: 10, fontSize: 13, cursor: 'pointer', background: 'transparent', border: 'none', color: 'var(--color-text-info)', textDecoration: 'underline', padding: 0 }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
          {filtered.map(field => (
            <ComplianceCard
              key={field.id}
              field={field}
              token={token}
              onUpload={handleUpload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      {!loading && !error && fields.length > 0 && (
        <p style={{ margin: 0, fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center', lineHeight: 1.6 }}>
          Documents marked as <strong style={{ fontWeight: 500 }}>Verified</strong> have been reviewed by the platform team.
          Contact support if you believe a rejection was made in error.
        </p>
      )}
    </div>
  );
}