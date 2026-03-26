export interface UserProfile {
  company_id: string;
  vendor_id: string | null;
  user_id: string;
  role: string;
  email: string;
  phone: string;
  // profileImgUrl: string;
  // user_status: 'active' | 'suspended' | 'pending';
  first_name: string;
  last_name: string;
  country_code: string
  phone_number: string
  store_name: string
  category: string
  vendor_status: string
  joined_at: Date;


  // Linked Addresses (from 'addresses' table)
  addresses: Address[] | null;

  // Active Shopping State
  cart: Cart | null;
  wishlist: Wishlist | null;

  // History
  orders: UserOrder[];
}

// Supporting Interfaces based on your schema
export interface Address {
  address_id: string;
  name?: string;
  address_for: 'home' | 'work' | 'other';
  address_line1: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  postal_code: string;
  is_default: boolean;
}

export interface Cart {
  cart_id: string;
  items: CartItem[];
  created_at: string;
}

export interface CartItem {
  cart_item_id: number;
  variant_id: number;
  quantity: number;
}

export interface Wishlist {
  wishlist_id: number;
  items: number[]; // Array of product_ids
}

export interface UserOrder {
  order_id: number;
  order_status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  delivered_at?: string;
  shippingTo: Address | string;
  products?: { product_id: string; quantity: number }[];
  total_amount: number;
  address_id: number;
  created_at: string;
}
export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface Order {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  amount: number;
  action: 'Ship Now' | 'View';
}
export enum UserRole {
  Admin = 'admin',
  Vendor = 'vendor',
  Customer = 'customer'
}

export type Permission = 'read' | 'create' | 'delete' | 'update';
export interface RoleDefinition {
  can: Permission[];
}
export const role: Record<UserRole, RoleDefinition> = {
  [UserRole.Admin]: {
    can: ['read', 'create', 'delete', 'update']
  },
  [UserRole.Vendor]: {
    can: ['read', 'create', 'update']
  },
  [UserRole.Customer]: {
    can: ['read']
  }
}

export interface Product {
  id: string; // Used for React keys and API calls
  productName: string;
  sku: string;
  stock: number;
  price: number;
  status: 'Active' | 'Inactive';
  imageUrl: string;
}
export interface OrderItem {
  id: string;
  name: string;
  image: string;
  color: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentMethod {
  type: string;
  details: string;
}export interface BestSellingProductType {
  title: string;
  url: string;
  description: string;
  satisfaction: string;
}
export interface CATEGORY_LIST_TYPE {
  title: string;
  url: string;
}

export interface FeedbackType {
  customerName: string;
  feedback: string;
  rating: number;
}
export interface CATEGORY_LIST_TYPE {
  title: string;
  url: string;
}
export interface OrderSuccessStatusTypes {
  orderId?: string;
  orderDate?: string;
  estimatedDelivery?: string;
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  items?: OrderItem[];
  subtotal?: number;
  discount?: number;
  delivery?: number;
  total?: number;

}

export interface OrderFailedStatusTypes {
  errorCode?: string;
  transactionId?: string;
  attemptedAmount?: number;
  possibleReasons?: string[];
}

export interface VendorRegisterTypes {
  company_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  store_owner_first_name: string | null;
  store_owner_last_name: string | null;
  company_domain: string | null;
  company_structure: string | null;
  category: string | null;
  country_code?: string | null;
  email: string | null;
  password: string | null;
  confirm_password: string | null;
}
export interface VendorRegisterFormData {
  vendor: VendorRegisterTypes;
  documents: File[] | undefined

}

export interface CATEGORY_LIST_TYPE {
  title: string;
  url: string;
}

export interface BestSellingProductType {
  title: string;
  url: string;
  description: string;
  satisfaction: string;
}

export interface FeedbackType {
  customerName: string;
  feedback: string;
  rating: number;
}

export interface ReviewType {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PRODUCT_LIST_TYPE {
  id: string;
  title: string;
  price: number;
  discount: number;
  category: string;
  imgUrl: string;
  description: string;
  satisfaction: string;
  rating?: number;
  reviewCount?: number;
  productDetails?: {
    brand: string;
    model: string;
    specifications: {
      [key: string]: string;
    };
  };
  specificationsImgUrl?: string[];
  reviews?: ReviewType[];
}

export interface Vendor {
  id: string;
  store_owner_first_name: string;
  store_owner_last_name: string;
  store_name: string;
  store_description: string;
  category: string;
  vendor_status: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  company_id: string;
  user_id: string;
}

export interface User {
  id: string;
  profile_picture_url: string | null;
  first_name: string;
  last_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  user_status: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  role_id: string;
}

export interface Company {
  id: string;
  company_name: string;
  company_domain: string;
  company_structure: string;
  company_status: string;
  created_at: string;
  updated_at: string;
}

export interface VendorApplication {
  vendor: Vendor;
  user: User;
  company: Company;
}
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

export type FeatureType = { title: string; description: string };
export type OptionType = { name: string; values: string };
export type VariantType = { attributes: Record<string, string>; sku: string; price: number; stock: number };
export type ProductFormValues = {
  productName: string;
  description: string;
  features: FeatureType[];
  basePrice: number;
  discountPercent: number;
  stocks: number;
  sku: string;
  has_variants: boolean;
  productMedia: File[];
  featureMedia: File[];
  category: string;
  status: string;
  taxProfile: string;
};