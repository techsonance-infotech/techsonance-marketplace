import BRAND_LOGO from "../assets/e-commerce_brand_logo.png"
import CUSTOMER_LOGIN_POSTER from '../assets/customer form poster 2.png'
import TS_LOGO from '../assets/TS_Logo.png'
import BAR_TOGGLE_ICON from "../assets/bar toggle icon.png"
import vendor_icon from "../assets/vendor icon.png"
import customers_icon from '../assets/customers icon.png'
import analytics_icon from '../assets/analytics icon.png'
import settings_icon from '../assets/settings icon.png'
import customer_care_icon from '../assets/customer care icon.png'
import dashboard_icon from '../assets/dashboard icon.png';
import searchImgDark from "../assets/Search dark.png"
import searchImgLight from "../assets/Search light.png"
import heartLight from "../assets/icons-heart-light.png"
import heartDark from "../assets/icons-heart-dark.png"
import cartImgDark from "../assets/shoppingCart.png"
import userIcon from "../assets/user icon.png";
import delete_icon from "../assets/delete_icon.png"
import arrow from '../assets/arrow_icon.png'
import down_arrow from '../assets/down_arrow.png';
import internet_icon from '../assets/internet_icon.png'
import file_icon from '../assets/file_icon.png'
import product_icon from '../assets/box_icon.png'
import order_icon from '../assets/order_icon.png'
import marketing_icon from '../assets/marketing_icon.png'
import finance_icon from '../assets/finance_icon.png'
import inventory_icon from '../assets/notes_icon.png'
// Social Media Icons
import instagram from "../assets/instagram icon.png"
import facebook from "../assets/facebook icon.png"
import youtube from "../assets/youtube icon.png"

// Theme Toggle Icons
import toggle_light from '../assets/toggle-light.png';
import toggle_dark from '../assets/toggle-dark.png';
// Navigation Links
export const NAV_LINKS = [{ Home: '/' }, { Shop: '/shop' }, { About: '/about' }, { Contact: '/contact' }]
// Footer Text

export const FOOTER_TEXT = "Copyright © 2026 Sound Sphere. All rights reserved."
export interface NavLinkType {
  [key: string]: string;
}
export const VENDOR_NAV_LINKS: NavLinkType[] = [
  { Dashboard: '/vendor', icon: dashboard_icon },
  { Products: '/vendor/products', icon: product_icon },
  { Orders: '/vendor/orders', icon: order_icon },
  { Inventory: '/vendor/inventory', icon: inventory_icon },
  { Analytics: '/vendor/finances', icon: finance_icon },
  { Marketing: '/vendor/marketing', icon: marketing_icon },
  { 'Customer Care': '/vendor/customerCare', icon: customer_care_icon },
  { Settings: '/vendor/settings', icon: settings_icon },
]

export const ADMIN_NAV_LINKS: NavLinkType[] = [
  { Dashboard: '/admin', icon: dashboard_icon },
  { Vendor: '/admin/vendorManagement', icon: vendor_icon },
  // { Customers: '/admin/customers', icon: customers_icon },
  { Analytics: '/admin/auditLog', icon: analytics_icon },
  { "Support Tickets": '/admin/supportTickets', icon: customer_care_icon },
  { Settings: '/admin/settings', icon: settings_icon },
]



// Base URLs from environment variables//
export const VENDOR_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;
export const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_BASE_URL;
export const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;




// Exporting all constants
export { CUSTOMER_LOGIN_POSTER, BRAND_LOGO, BAR_TOGGLE_ICON, TS_LOGO, toggle_light, toggle_dark, vendor_icon, customers_icon, analytics_icon, settings_icon, customer_care_icon, dashboard_icon, instagram, facebook, youtube, searchImgDark, searchImgLight, heartLight, heartDark, cartImgDark, userIcon, delete_icon, arrow, down_arrow, internet_icon, file_icon };
