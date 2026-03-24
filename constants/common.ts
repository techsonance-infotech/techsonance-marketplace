import type { Link } from "@/components/common/InnerSideBar";

// ============================================================
// ASSET PATHS (served from /public/assets/)
// ============================================================

export const BRAND_LOGO = "/assets/e-commerce_brand_logo.png";
export const CUSTOMER_LOGIN_POSTER = "/assets/customer form poster 2.png";
export const TS_LOGO = "/assets/TS_Logo.png";
export const BAR_TOGGLE_ICON = "/assets/bar toggle icon.png";

// Role Icons
export const vendor_icon = "/assets/vendor icon.png";
export const customers_icon = "/assets/customers icon.png";
export const analytics_icon = "/assets/analytics icon.png";
export const settings_icon = "/assets/settings icon.png";
export const customer_care_icon = "/assets/customer care icon.png";
export const dashboard_icon = "/assets/dashboard icon.png";

// Search / UI Icons
export const searchImgDark = "/assets/Search dark.png";
export const searchImgLight = "/assets/Search light.png";
export const heartLight = "/assets/icons-heart-light.png";
export const heartDark = "/assets/icons-heart-dark.png";
export const cartImgDark = "/assets/shoppingCart.png";
export const userIcon = "/assets/user icon.png";
export const delete_icon = "/assets/delete_icon.png";
export const arrow = "/assets/arrow_icon.png";
export const down_arrow = "/assets/down_arrow.png";
export const internet_icon = "/assets/internet_icon.png";
export const file_icon = "/assets/file_icon.png";
export const product_icon = "/assets/box_icon.png";
export const order_icon = "/assets/order_icon.png";
export const marketing_icon = "/assets/marketing_icon.png";
export const finance_icon = "/assets/finance_icon.png";
export const inventory_icon = "/assets/notes_icon.png";
export const replacement_icon = "/assets/replacement icon.png";

// Social Media Icons
export const instagram = "/assets/instagram icon.png";
export const facebook = "/assets/facebook icon.png";
export const youtube = "/assets/youtube icon.png";

// Theme Toggle Icons
export const toggle_light = "/assets/toggle-light.png";
export const toggle_dark = "/assets/toggle-dark.png";

// ============================================================
// TYPES  (Re-exported from utils/Types.ts)
// ============================================================

export { UserRole } from "@/utils/Types";
export type { UserProfile, Address, Cart, CartItem, Wishlist, UserOrder, OrderStatus, Order, Permission, RoleDefinition } from "@/utils/Types";

// ============================================================
// SHARED INTERFACES
// ============================================================

export interface NavLinkType {
  [key: string]: string | null;
}

export interface FooterLinkType {
  title: string;
  url: string;
  icon?: string;
  styles?: string;
  category?: string;
}

export interface FooterSectionType {
  header: string;
  links: FooterLinkType[];
}

export interface tabLinkType {
  [key: string]: string | null;
}
// ============================================================
// CATEGORY OPTIONS (for vendor registration)
// ============================================================

export const categoryOptions: { value: string; label: string }[] = [
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "home_and_garden", label: "Home & Garden" },
  { value: "health_and_beauty", label: "Health & Beauty" },
  { value: "sports_and_outdoors", label: "Sports & Outdoors" },
  { value: "toys_and_games", label: "Toys & Games" },
  { value: "automotive", label: "Automotive" },
  { value: "books_and_media", label: "Books & Media" },
  { value: "food_and_beverage", label: "Food & Beverage" },
  { value: "art_and_collectibles", label: "Art & Collectibles" }
];

export const BusinessStructure: { value: string; label: string }[] = [
  { value: "sole_proprietorship", label: "Sole Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "corporation", label: "Corporation" },
  { value: "llc", label: "LLC" }
];
// ============================================================
// COUNTRY CODES
// ============================================================

export const COUNTRY_CODES = [
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+91", label: "🇮🇳 +91" },
  { value: "+61", label: "🇦🇺 +61" },
  { value: "+33", label: "🇫🇷 +33" },
  { value: "+49", label: "🇩🇪 +49" },
  { value: "+81", label: "🇯🇵 +81" },
  { value: "+86", label: "🇨🇳 +86" },
  { value: "+55", label: "🇧🇷 +55" },
  { value: "+52", label: "🇲🇽 +52" },
  { value: "+27", label: "🇿🇦 +27" },
  { value: "+971", label: "🇦🇪 +971" },
];
export interface ComplianceField {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  helperText: string;
}

export interface CountryCompliance {
  country_code: string;
  country_name: string;
  fields: ComplianceField[];
}

export const COUNTRIES: CountryCompliance[] = [
  {
    country_code: "IN",
    country_name: "India",
    fields: [
      { id: "gstin", label: "GSTIN", placeholder: "15-digit GST Number", required: true, helperText: "Mandatory for all e-commerce. Regulated by GSTN." },
      { id: "pan", label: "Business PAN", placeholder: "ABCDE1234F", required: true, helperText: "Linked to GSTIN for tax tracking." },
      { id: "fssai", label: "FSSAI License", placeholder: "14-digit License No.", required: false, helperText: "Only required for food/supplement categories." },
      { id: "dpdp_dpo", label: "Data Protection Officer", placeholder: "Name of DPO", required: true, helperText: "Mandatory compliance with DPDP Act 2023 Rules." }
    ]
  },
  {
    country_code: "BD",
    country_name: "Bangladesh",
    fields: [
      { id: "bin", label: "BIN (VAT Reg)", placeholder: "Business Identification No.", required: true, helperText: "Regulated by NBR. Mushak 6.3 required on invoices." },
      { id: "tin", label: "TIN Number", placeholder: "Taxpayer Identification No.", required: true, helperText: "Standard income tax registration." }
    ]
  },
  {
    country_code: "LK",
    country_name: "Sri Lanka",
    fields: [
      { id: "tin", label: "TIN Number", placeholder: "Taxpayer Identification No.", required: true, helperText: "Inland Revenue Board (IRB) registration." },
      { id: "vat_reg", label: "VAT Number", placeholder: "Enter VAT No.", required: false, helperText: "2026 Threshold: LKR 36M annual turnover." }
    ]
  },
  {
    country_code: "AE",
    country_name: "United Arab Emirates",
    fields: [
      { id: "trn", label: "TRN (VAT ID)", placeholder: "Tax Registration Number", required: true, helperText: "Federal Tax Authority (FTA) registration." },
      { id: "trade_license", label: "Trade License No.", placeholder: "Enter License Number", required: true, helperText: "Issued by DED or Free Zone Authority." },
      { id: "vara_status", label: "VARA Permit ID", placeholder: "Virtual Asset License", required: false, helperText: "Required for digital asset/crypto services." }
    ]
  },
  {
    country_code: "SA",
    country_name: "Saudi Arabia",
    fields: [
      { id: "cr_no", label: "CR Number", placeholder: "Commercial Registration", required: true, helperText: "Ministry of Commerce (MISA) prerequisite." },
      { id: "zatca_id", label: "ZATCA E-Invoice ID", placeholder: "FATOORA Integration ID", required: true, helperText: "Mandatory Phase 2 E-Invoicing compliance." },
      { id: "ubo_disclosure", label: "UBO Reference", placeholder: "Ultimate Beneficial Owner ID", required: true, helperText: "Ministerial Decision 235 compliance." }
    ]
  },
  {
    country_code: "KW",
    country_name: "Kuwait",
    fields: [
      { id: "moci_license", label: "MOCI License", placeholder: "Ministry of Commerce No.", required: true, helperText: "Primary trade license." },
      { id: "aml_ref", label: "AML Rulebook ID", placeholder: "Law 106 Compliance ID", required: true, helperText: "Regulated by CBK/KWFIU." }
    ]
  },
  {
    country_code: "QA",
    country_name: "Qatar",
    fields: [
      { id: "qfc_id", label: "QFC License", placeholder: "Qatar Financial Centre No.", required: false, helperText: "For financial/regulated entities." },
      { id: "tax_card", label: "Tax Card ID", placeholder: "Enter Tax Card No.", required: true, helperText: "Ministry of Justice/Tax Authority." }
    ]
  },
  {
    country_code: "OM",
    country_name: "Oman",
    fields: [
      { id: "cr_id", label: "CR Number", placeholder: "Commercial Registration", required: true, helperText: "Ministry of Commerce registration." },
      { id: "cma_license", label: "CMA License", placeholder: "Capital Market ID", required: false, helperText: "Required for investment-related services." }
    ]
  },
  {
    country_code: "BH",
    country_name: "Bahrain",
    fields: [
      { id: "cbb_license", label: "CBB License", placeholder: "Central Bank Reference", required: true, helperText: "Regulated by Central Bank of Bahrain." },
      { id: "cr_number", label: "CR Number", placeholder: "Commercial Registration", required: true, helperText: "Ministry of Industry & Commerce." }
    ]
  },
  {
    country_code: "CN",
    country_name: "China",
    fields: [
      { id: "samr_id", label: "Unified Social Credit Code", placeholder: "Business License No.", required: true, helperText: "Regulated by SAMR." },
      { id: "pipl_compliance", label: "PIPL ID", placeholder: "Data Privacy Officer", required: true, helperText: "Compliance with Cybersecurity Law & PIPL." }
    ]
  },
  {
    country_code: "JP",
    country_name: "Japan",
    fields: [
      { id: "corp_no", label: "Corporate Number", placeholder: "13-digit ID", required: true, helperText: "Legal Affairs Bureau registration." },
      { id: "jct_id", label: "JCT Number", placeholder: "Japan Consumption Tax ID", required: false, helperText: "Mandatory if turnover > ¥10M (NTA)." }
    ]
  },
  {
    country_code: "SG",
    country_name: "Singapore",
    fields: [
      { id: "uen", label: "UEN", placeholder: "Unique Entity Number", required: true, helperText: "Accounting and Corporate Regulatory Authority (ACRA)." },
      { id: "pdpa_rep", label: "PDPA Officer", placeholder: "Data Protection Representative", required: true, helperText: "Mandatory under Personal Data Protection Act." }
    ]
  },
  {
    country_code: "US",
    country_name: "United States",
    fields: [
      { id: "ein", label: "EIN", placeholder: "XX-XXXXXXX", required: true, helperText: "Federal Employer Identification Number (IRS)." },
      { id: "sales_tax", label: "State Sales Tax ID", placeholder: "Enter State ID", required: true, helperText: "Required for nexus-based selling." },
      { id: "fincen_boi", label: "BOI Report ID", placeholder: "FinCEN Tracking ID", required: true, helperText: "Required for all non-exempt entities (CTA 2026)." }
    ]
  },
  {
    country_code: "CA",
    country_name: "Canada",
    fields: [
      { id: "bn", label: "Business Number", placeholder: "9-digit BN", required: true, helperText: "Issued by Canada Revenue Agency (CRA)." },
      { id: "gst_hst", label: "GST/HST No.", placeholder: "12345 6789 RT0001", required: false, helperText: "Mandatory if turnover > CAD 30K." }
    ]
  },
  {
    country_code: "BR",
    country_name: "Brazil",
    fields: [
      { id: "cnpj", label: "CNPJ", placeholder: "Alphanumeric Format (2026)", required: true, helperText: "Receita Federal (Transitioned to Alphanumeric in 2026)." },
      { id: "lgpd_dpo", label: "LGPD DPO", placeholder: "Data Protection Officer", required: true, helperText: "General Data Protection Law (ANPD)." }
    ]
  },
  {
    country_code: "MX",
    country_name: "Mexico",
    fields: [
      { id: "rfc", label: "RFC ID", placeholder: "Tax ID Number", required: true, helperText: "SAT (Tax Administration Service) registration." },
      { id: "data_privacy", label: "Data Privacy Officer", placeholder: "Legal Rep Name", required: true, helperText: "Regulated by INAI." }
    ]
  },
  {
    country_code: "HK",
    country_name: "Hong Kong",
    fields: [
      { id: "brn", label: "BRN", placeholder: "Business Registration No.", required: true, helperText: "Inland Revenue Department (IRD)." },
      { id: "pdpo_status", label: "PDPO Compliance", placeholder: "Privacy Officer Name", required: true, helperText: "Privacy Commissioner (PCPD) rules." }
    ]
  },
  {
    country_code: "MY",
    country_name: "Malaysia",
    fields: [
      { id: "ssm_no", label: "SSM Registration No.", placeholder: "Enter 12-digit Co. No.", required: true, helperText: "Managed by Companies Commission (SSM)." },
      { id: "sst_id", label: "SST Number", placeholder: "Sales/Service Tax ID", required: false, helperText: "Mandatory if taxable services > MYR 500k (Customs)." },
      { id: "pdpa_cert", label: "PDPA Reg. Certificate", placeholder: "JPDP Registration No.", required: true, helperText: "Personal Data Protection Act (Act 709) compliance." }
    ]
  },
  {
    country_code: "TH",
    country_name: "Thailand",
    fields: [
      { id: "dbd_id", label: "DBD Business ID", placeholder: "13-digit Registration No.", required: true, helperText: "Department of Business Development." },
      { id: "thai_tin", label: "Thai Tax ID", placeholder: "Revenue Dept Tax ID", required: true, helperText: "Used for VAT and withholding (RD)." },
      { id: "pdpa_officer", label: "PDPA Compliance Lead", placeholder: "Assigned DPO Name", required: true, helperText: "Regulated by PDPC (Personal Data Protection Committee)." }
    ]
  },
  {
    country_code: "ID",
    country_name: "Indonesia",
    fields: [
      { id: "nib", label: "NIB (Business ID)", placeholder: "Nomor Induk Berusaha", required: true, helperText: "Primary ID from the OSS-RBA System." },
      { id: "npwp", label: "NPWP (Tax ID)", placeholder: "15-digit Taxpayer ID", required: true, helperText: "Directorate General of Taxes (DJP)." },
      { id: "pse_id", label: "PSE Registration", placeholder: "Electronic System Provider ID", required: true, helperText: "Mandatory for all digital platforms (Kominfo)." }
    ]
  },
  {
    country_code: "PH",
    country_name: "Philippines",
    fields: [
      { id: "tin_no", label: "BIR TIN", placeholder: "Taxpayer ID Number", required: true, helperText: "Bureau of Internal Revenue (BIR) registration." },
      { id: "sec_dti", label: "SEC/DTI Number", placeholder: "Registration Certificate No.", required: true, helperText: "Securities and Exchange Commission (Corporations) or DTI (Soles)." },
      { id: "npc_reg", label: "NPC Seal of Reg.", placeholder: "Data Privacy ID", required: true, helperText: "National Privacy Commission compliance." }
    ]
  },
  {
    country_code: "KR",
    country_name: "South Korea",
    fields: [
      { id: "biz_reg", label: "Business Reg. No.", placeholder: "XXX-XX-XXXXX", required: true, helperText: "Issued by the National Tax Service." },
      { id: "pipa_dpo", label: "Chief Privacy Officer", placeholder: "Designated CPO Name", required: true, helperText: "PIPA 2026 Update: Mandatory reporting to PIPC." }
    ]
  },
  // --- LATIN AMERICA ---
  {
    country_code: "AR",
    country_name: "Argentina",
    fields: [
      { id: "cuit", label: "CUIT", placeholder: "XX-XXXXXXXX-X", required: true, helperText: "Tax ID from ARCA (formerly AFIP)." },
      { id: "aaip_id", label: "Data Protection Reg.", placeholder: "AAIP Registration Number", required: true, helperText: "Agencia de Acceso a la Información Pública." }
    ]
  },
  {
    country_code: "CO",
    country_name: "Colombia",
    fields: [
      { id: "nit", label: "NIT Number", placeholder: "Tax Identification Number", required: true, helperText: "Managed by DIAN." },
      { id: "rues_id", label: "RUES / Cámara ID", placeholder: "Chamber of Commerce No.", required: true, helperText: "Commercial Registry compliance." }
    ]
  },
  {
    country_code: "CL",
    country_name: "Chile",
    fields: [
      { id: "rut", label: "RUT / RUN", placeholder: "XX.XXX.XXX-X", required: true, helperText: "SII (Internal Revenue Service) Tax ID." },
      { id: "uaf_aml", label: "UAF AML ID", placeholder: "Anti-Money Laundering Ref", required: true, helperText: "Financial Intelligence Unit (UIF) reporting." }
    ]
  },
  {
    country_code: "PE",
    country_name: "Peru",
    fields: [
      { id: "ruc", label: "RUC Number", placeholder: "11-digit Tax ID", required: true, helperText: "Issued by SUNAT." },
      { id: "apdp_reg", label: "Personal Data ID", placeholder: "DPA Registration No.", required: true, helperText: "Regulated by the Ministry of Justice (APDP)." }
    ]
  },
  // --- EUROPEAN UNION (REMAINING) ---
  {
    country_code: "IT",
    country_name: "Italy",
    fields: [
      { id: "partita_iva", label: "Partita IVA", placeholder: "ITXXXXXXXXXXX", required: true, helperText: "Agenzia delle Entrate Tax ID." },
      { id: "privacy_guarantor", label: "GDPR DPO", placeholder: "Responsabile Protezione Dati", required: true, helperText: "Garante per la Protezione dei Dati Personali." },
      { id: "ai_compliance", label: "Law 132/2025 AI Ref", placeholder: "AI Risk Assessment ID", required: false, helperText: "Italy’s 2026 AI Act alignment mandate." }
    ]
  },
  {
    country_code: "ES",
    country_name: "Spain",
    fields: [
      { id: "nif_cif", label: "NIF/CIF", placeholder: "Tax ID Number", required: true, helperText: "Tax Agency (AEAT) ID." },
      { id: "aesia_reg", label: "AESIA Registry No.", placeholder: "AI Supervision ID", required: false, helperText: "Spanish Agency for AI Supervision (AESIA) - mandatory for high-risk." }
    ]
  },
  {
    country_code: "NL",
    country_name: "Netherlands",
    fields: [
      { id: "kvk", label: "KvK Number", placeholder: "8-digit Chamber of Commerce No.", required: true, helperText: "Kamer van Koophandel (KvK)." },
      { id: "btw_id", placeholder: "NLXXXXXXXXXBXX", label: "BTW Identification", required: true, helperText: "Dutch VAT identification (Belastingdienst)." }
    ]
  },
  // --- PACIFIC ISLANDS ---
  {
    country_code: "FJ",
    country_name: "Fiji",
    fields: [
      { id: "roc_id", label: "ROC Pass Number", placeholder: "e-Profile/ROC ID", required: true, helperText: "Registrar of Companies (ROC) Digital Fiji." },
      { id: "fiji_tin", label: "TIN", placeholder: "Fiji Tax ID", required: true, helperText: "Fiji Revenue and Customs Service (FRCS)." }
    ]
  },
  {
    country_code: "PG",
    country_name: "Papua New Guinea",
    fields: [
      { id: "ipa_reg", label: "IPA Number", placeholder: "Co. Registration No.", required: true, helperText: "Investment Promotion Authority (IPA)." },
      { id: "png_tin", label: "TIN", placeholder: "Tax ID Number", required: true, helperText: "Internal Revenue Commission (IRC)." }
    ]
  }

];
// ============================================================
// BASE URLs (from environment variables)
// ============================================================

export const VENDOR_BASE_URL = process.env.NEXT_PUBLIC_VENDOR_URL;
export const CUSTOMER_BASE_URL = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL;
export const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_BASE_URL;
export const VENDOR_AUTH_URL = process.env.NEXT_PUBLIC_VENDOR_AUTH_URL;
export const CUSTOMER_AUTH_URL = process.env.NEXT_PUBLIC_CUSTOMER_AUTH_URL;

// ============================================================
// HERO / HOME CONTENT
// ============================================================

export const HOME_HERO_TITLE = "Welcome to Sound Sphere - Your Ultimate Music Marketplace";
export const HOME_HERO_DESC = "Discover, buy, and sell music products with ease. Join our vibrant community of music lovers and elevate your sound experience today!";
