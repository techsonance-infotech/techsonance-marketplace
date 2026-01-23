import BRAND_LOGO from "../assets/e-commerce_brand_logo.png"
import CUSTOMER_LOGIN_POSTER from '../assets/customer form poster 2.png'
import BAR_TOGGLE_ICON from "../assets/bar toggle icon.png"
import vendor_icon from "../assets/vendor icon.png"
import customers_icon from '../assets/customers icon.png'
import analytics_icon from '../assets/analytics icon.png'
import settings_icon from '../assets/settings icon.png'
import customer_care_icon from '../assets/customer care icon.png'
import dashboard_icon from '../assets/dashboard icon.png'
// Navigation Links
export const NAV_LINKS = [{ Home: '/' }, { Shop: '/shop' }, { About: '/about' }, { Contact: '/contact' }]
// Footer Text
export const FOOTER_TEXT = "Copyright © 2026 Sound Sphere. All rights reserved."


export const ADMIN_NAV_LINKS = [
  { Dashboard: '/admin/dashboard', icon: dashboard_icon },
  { Vendor: '/admin/vendor', icon: vendor_icon },
  { Customers: '/admin/customers', icon: customers_icon },
  { Analytics: '/admin/analytics', icon: analytics_icon },
  { "Customer Care": '/admin/customer-care', icon: customer_care_icon },
  { Settings: '/admin/settings', icon: settings_icon },
]



// Base URLs from environment variables//
export const VENDOR_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;
export const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_BASE_URL;
export const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;




// Exporting all constants
export { CUSTOMER_LOGIN_POSTER, BRAND_LOGO, BAR_TOGGLE_ICON };
