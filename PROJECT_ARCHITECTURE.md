# TechSonance Marketplace - Architecture & Data Flow Documentation

## Project Overview
**TechSonance Marketplace** is a multi-tenant music marketplace platform with three distinct user roles: **Admin**, **Vendor**, and **Customer**, built using **React + TypeScript + Vite + Redux Toolkit**.

---

## Tech Stack

### Frontend Framework
- **React** 19.2.4
- **TypeScript** 5.9.3
- **Vite** (Build tool)
- **React Router** v7.12.0

### State Management
- **Redux Toolkit** 2.11.2
- **React Redux** 9.2.0

### UI & Styling
- **Tailwind CSS** 4.1.18
- **Radix UI** components
- **shadcn/ui** components
- **Lucide React** icons

### Forms & Validation
- **React Hook Form** 7.71.1
- **Zod** 4.3.5

### Data Visualization
- **Recharts** 2.15.4

### HTTP Client
- **Axios** 1.13.4

### Other Libraries
- **date-fns** 4.1.0
- **embla-carousel-react** 8.6.0
- **class-variance-authority** 0.7.1

---

## Data Flow Architecture

### Redux Store Structure

Located in [src/app/store.ts](src/app/store.ts), the application uses **4 main slices**:

```typescript
{
  auth: authReducer,              // User authentication & authorization
  adminTheme: adminThemeReducer,  // Theme preferences (dark/light mode)
  sidebar: sidebarReducer,        // Sidebar toggle state
  menu: menuReducer               // Mobile menu state
}
```

**Type Definitions**:
```typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## Authentication System

### Auth State Structure
Located in [src/features/auth/authSlice.ts](src/features/auth/authSlice.ts)

```typescript
interface AuthType {
  isAuthenticated: boolean,
  user: {
    user_id: String,
    company_id: String,
    user_role_type: 'admin' | 'vendor' | 'customer',
    name: String,
    email: String,
    phone: String,
    user_status: "Active" | "Inactive" | "Banned"
  } | null,
  token: string | null,  // Stored in localStorage with key 'authToken'
  loading: boolean,
  error: string | null
}
```

### User Roles & Permissions

```typescript
enum UserRole {
  Admin = 'admin',
  Vendor = 'vendor',
  Customer = 'customer'
}
```

**Permission Matrix**:
| Role     | Permissions                              |
|----------|------------------------------------------|
| Admin    | `['read', 'create', 'delete', 'update']` |
| Vendor   | `['read', 'create', 'update']`          |
| Customer | `['read']`                              |

### Auth Actions

1. **loginStart()** - Sets loading state to true
2. **loginSuccess(payload)** - Stores user data + token in state & localStorage
3. **loginFailure(error)** - Handles authentication errors
4. **logOut()** - Clears auth state and localStorage

### Authentication Flow

```
User submits login form
    ↓
dispatch(loginStart())
    ↓
API call to backend
    ↓
Success? → dispatch(loginSuccess({ user, token }))
         → Store token in localStorage
         → Redirect based on role
    ↓
Failure? → dispatch(loginFailure(error))
         → Display error message
```

---

## Routing Architecture

The application uses **React Router v7** with nested routes and layouts.

### Route Structure

```
/                          # Customer Shop
  └─ index                 # Home page

/auth                      # Authentication routes
  ├─ adminLogin            # Admin login
  ├─ vendorLogin           # Vendor login
  ├─ vendorRegister        # Vendor registration
  ├─ customerLogin         # Customer login
  └─ customerRegister      # Customer registration

/admin                     # Admin Panel (Protected)
  ├─ index                 # Dashboard
  ├─ vendorManagement      # Vendor list
  │   ├─ vendorForm        # Create/Edit vendor
  │   └─ approveVendors    # Approve pending vendors
  ├─ supportTickets        # Support ticket management
  └─ auditLog              # System audit logs

/vendor                    # Vendor Dashboard (Protected)
  ├─ index                 # Dashboard
  ├─ products              # Product management
  │   ├─ productForm       # Create product
  │   └─ productUpdateForm/:id  # Edit product
  ├─ orders                # Order management
  ├─ inventory             # Inventory tracking
  ├─ finances              # Financial analytics
  ├─ marketing             # Marketing tools
  ├─ customerCare          # Customer support
  └─ settings              # Settings (nested routes)
      ├─ index             # Profile settings
      ├─ locations         # Locations & warehouses
      ├─ security          # Security & password
      ├─ businessProfile   # Business information
      └─ billing           # Billing & banking

/404                       # Not Found page
```

### Layout Components

#### 1. **ShopLayout** (`/`)
- **File**: [src/app/pages/shop/ShopLayout.tsx](src/app/pages/shop/ShopLayout.tsx)
- **Structure**: Navbar → Content → Footer
- **Features**: Customer-facing storefront

#### 2. **AdminLayout** (`/admin`)
- **File**: [src/app/pages/admin/AdminLayout.tsx](src/app/pages/admin/AdminLayout.tsx)
- **Structure**: Sidebar → Content
- **Dynamic Margin**: Adjusts based on sidebar state
  - Collapsed: `ml-24`
  - Expanded: `ml-50`

#### 3. **VendorLayout** (`/vendor`)
- **File**: [src/app/pages/vendor/VendorLayout.tsx](src/app/pages/vendor/VendorLayout.tsx)
- **Structure**: Sidebar → Content
- **Same responsive behavior as AdminLayout**

#### 4. **VendorSettingLayout** (`/vendor/settings`)
- **File**: [src/app/pages/vendor/settings/VendorSettingLayout.tsx](src/app/pages/vendor/settings/VendorSettingLayout.tsx)
- **Structure**: InnerSidebar → Settings pages
- **Nested settings navigation**

### Protected Routes

**Component**: [src/components/common/ProtectedRoute.tsx](src/components/common/ProtectedRoute.tsx)

**Flow**:
```typescript
<ProtectedRoute allowedRoles={['admin']}>
  <Component />
</ProtectedRoute>

// Checks:
1. Is user authenticated? → Check auth.isAuthenticated
2. Is user role allowed? → Check user.user_role_type in allowedRoles
3. Pass? → Render children
4. Fail? → Navigate to /unauthorized
```

---

## Data Models

### Order Type
[src/utils/Types.ts](src/utils/Types.ts)

```typescript
export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered';

export interface Order {
  orderId: string;        // Format: #ORD-2024-001
  customerName: string;
  status: OrderStatus;
  amount: number;
  action: 'Ship Now' | 'View';
}
```

### Product Category Type
[src/utils/customer/constants.ts](src/utils/customer/constants.ts)

```typescript
export interface CATEGORY_LIST_TYPE {
  title: string;
  url: string;  // Image URL
}
```

**Available Categories**:
- Guitars
- Drums
- Keyboards
- Microphones
- Headphones
- Audio Interfaces
- Studio Monitors
- DJ Equipment

### Best Selling Product Type

```typescript
export interface BestSellingProductType {
  title: string;
  url: string;
  description: string;
  satisfaction: string;  // e.g., "98%"
}
```

### Navigation Link Type

```typescript
export interface NavLinkType {
  [key: string]: string;  // Label: Path
}
```

---

## Component Architecture

### Common Components
Located in [src/components/common/](src/components/common/)

1. **ProtectedRoute** - RBAC wrapper
2. **Sidebar** - Dynamic navigation (Admin/Vendor)
3. **InnerSideBar** - Nested navigation (Settings)
4. **Pagination** - Reusable pagination
5. **Carousel** - Image slider for hero sections

### Role-Specific Components

#### Admin Components
[src/components/admin/](src/components/admin/)
- **Navbar** - Admin header with page title
- **DashboardChart** - Analytics visualization

#### Vendor Components
[src/components/vendor/](src/components/vendor/)
- **Navbar** - Vendor header

#### Customer Components
[src/components/customer/](src/components/customer/)
- **Navbar** - Customer storefront header with search/cart
- **Footer** - Site footer with links
- **CategoryList** - Product category grid
- **BestSelling** - Featured product showcase
- **ProductList** - Product grid display

### UI Components (shadcn/ui)
[src/components/ui/](src/components/ui/)

- **button** - Button variants
- **calendar** - Date picker
- **card** - Card container
- **carousel** - Embla carousel wrapper
- **chart** - Recharts wrapper
- **select** - Dropdown select
- **spinner** - Loading indicator

---

## State Management Slices

### 1. Sidebar Slice
[src/features/sidebar.ts](src/features/sidebar.ts)

```typescript
interface SidebarState {
  isSidebarOpen: boolean;
}

// Actions:
toggleSidebar() // Toggles sidebar open/closed state
```

**Usage**:
```typescript
const { isSidebarOpen } = useSelector((state) => state.sidebar);
dispatch(toggleSidebar());
```

### 2. Menu Slice
[src/features/menuBar.ts](src/features/menuBar.ts)

```typescript
interface MenuState {
  isMenuOpen: boolean;
}

// Actions:
openMenu()  // Opens mobile menu
closeMenu() // Closes mobile menu
```

### 3. Admin Theme Slice
[src/features/theme/adminThemeSlice.ts](src/features/theme/adminThemeSlice.ts)

Manages dark/light mode preferences for admin panel.

---

## Data Flow Patterns

### Pattern 1: User Authentication Flow

```
┌─────────────────┐
│ Login Component │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Form Validation     │
│ (React Hook Form +  │
│  Zod)               │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Axios POST Request  │
│ to Auth API         │
└────────┬────────────┘
         │
         ├─── Success ───▶ dispatch(loginSuccess(data))
         │                  └─▶ Store token in localStorage
         │                  └─▶ Update Redux auth state
         │                  └─▶ Navigate based on role
         │
         └─── Failure ───▶ dispatch(loginFailure(error))
                            └─▶ Display error message
```

### Pattern 2: Vendor Product Management

```
┌──────────────────┐
│ ProductForm      │
│ (Create/Edit)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Form Validation  │
│ (Zod Schema)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Axios POST/PUT Request   │
│ to VENDOR_BASE_URL/api   │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────┐
│ Backend API Updates  │
│ Database             │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Re-fetch Product List│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Update UI Component  │
└──────────────────────┘
```

### Pattern 3: Admin Dashboard Analytics

```
┌─────────────────┐
│ Dashboard       │
│ Component Mounts│
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ useEffect Hook Triggers │
└────────┬────────────────┘
         │
         ▼
┌────────────────────────┐
│ Fetch Vendor Metrics   │
│ - Total Vendors        │
│ - Growth %             │
│ - Active Instances     │
│ - System Operations    │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Update Component State │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ Render Stats Cards +   │
│ Charts + Active List   │
└────────────────────────┘
```

### Pattern 4: Protected Route Authorization

```
┌──────────────────────┐
│ User Navigates to    │
│ Protected Route      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│ ProtectedRoute Component     │
│ Checks:                      │
│ 1. auth.isAuthenticated      │
│ 2. user.user_role_type       │
└──────────┬───────────────────┘
           │
           ├─── Authorized ────▶ Render Children Component
           │
           └─── Not Authorized ▶ Navigate to /unauthorized
                                  (with location state)
```

---

## Navigation Configuration

### Admin Navigation Links
[src/utils/constants.ts](src/utils/constants.ts)

```typescript
ADMIN_NAV_LINKS = [
  { Dashboard: '/admin', icon: dashboard_icon },
  { Vendor: '/admin/vendorManagement', icon: vendor_icon },
  { Analytics: '/admin/auditLog', icon: analytics_icon },
  { "Support Tickets": '/admin/supportTickets', icon: customer_care_icon },
  { Settings: '/admin/settings', icon: settings_icon },
]
```

### Vendor Navigation Links

```typescript
VENDOR_NAV_LINKS = [
  { Dashboard: '/vendor', icon: dashboard_icon },
  { Products: '/vendor/products', icon: product_icon },
  { Orders: '/vendor/orders', icon: order_icon },
  { Inventory: '/vendor/inventory', icon: inventory_icon },
  { Analytics: '/vendor/finances', icon: finance_icon },
  { Marketing: '/vendor/marketing', icon: marketing_icon },
  { 'Customer Care': '/vendor/customerCare', icon: customer_care_icon },
  { Settings: '/vendor/settings', icon: settings_icon },
]
```

### Vendor Settings Links

```typescript
VENDOR_SETTINGS_LINKS = [
  {
    section: "general",
    list: [
      { title: 'Store Profile', path: '/vendor/settings' },
      { title: 'Locations & Warehouses', path: '/vendor/settings/locations' },
    ]
  },
  {
    section: "organization",
    list: [
      { title: 'Billing & Banking', path: '/vendor/settings/billing' },
    ]
  },
  {
    section: "account",
    list: [
      { title: 'Business Profile', path: '/vendor/settings/businessProfile' },
      { title: 'Security & Password', path: '/vendor/settings/security' },
    ]
  }
]
```

### Customer Navigation Links

```typescript
NAV_LINKS = [
  { Home: '/' },
  { Shop: '/shop' },
  { About: '/about' },
  { Contact: '/contact' }
]
```

---

## UI State Management

### Sidebar Toggle Mechanism

```typescript
// User clicks hamburger icon
dispatch(toggleSidebar())
  ↓
Updates: sidebar.isSidebarOpen = !sidebar.isSidebarOpen
  ↓
Layout Component Re-renders
  ↓
Dynamic Class Applied:
  - Open: className="ml-50"
  - Closed: className="ml-24"
```

**Implementation**:
```typescript
const { isSidebarOpen } = useSelector((state) => state.sidebar);

<main className={`${isSidebarOpen ? 'ml-50' : 'ml-24'}`}>
  <Outlet />
</main>
```

---

## Environment Configuration

### API Base URLs
[src/utils/constants.ts](src/utils/constants.ts)

```typescript
export const VENDOR_BASE_URL = import.meta.env.VITE_VENDOR_BASE_URL;
export const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_BASE_URL;
export const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_BASE_URL;
```

**Expected .env variables**:
```env
VITE_VENDOR_BASE_URL=http://api.example.com/vendor
VITE_CUSTOMER_BASE_URL=http://api.example.com/customer
VITE_ADMIN_BASE_URL=http://api.example.com/admin
```

---

## Customer-Facing Features

### Home Page Content
[src/utils/customer/constants.ts](src/utils/customer/constants.ts)

```typescript
HOME_HERO_TITLE = "Welcome to Sound Sphere - Your Ultimate Music Marketplace"
HOME_HERO_DESC = "Discover, buy, and sell music products with ease..."
```

### Brand Features

```typescript
HOME_BRAND_FEATURES = [
  { title: 'Secure Payment', icon: 'Wallet' },
  { title: 'Free Shipping', icon: 'Package' },
  { title: 'Delivered with Care and on time', icon: 'Truck' },
  { title: 'High Quality audio', icon: 'audio-lines' },
]
```

### Shop Page Features

1. **Hero Carousel** - Rotating product images with blur effect
2. **Category Grid** - 8 music product categories
3. **Best Selling Section** - Featured product showcase
4. **Product List** - Grid of popular products
5. **Brand Features** - Trust indicators (payment, shipping, quality)

---

## Key Design Patterns

### 1. Role-Based Access Control (RBAC)
- Every protected route validates user role
- Permission-based UI rendering
- Centralized role definitions

### 2. Layout Pattern with React Router
- Shared layouts using `<Outlet />`
- Nested route hierarchies
- Consistent navigation across sections

### 3. Redux Slice Pattern
- Feature-based state organization
- Separate reducers for distinct concerns
- Type-safe state access

### 4. Higher-Order Component (HOC) Pattern
- `ProtectedRoute` wraps authenticated components
- Reusable authorization logic
- Route-level access control

### 5. Responsive Sidebar Pattern
- Toggle state managed globally
- Persistent across navigation
- Dynamic layout adjustments

### 6. Constants-Based Configuration
- Centralized navigation definitions
- Environment-based API URLs
- Reusable UI constants

---

## File Structure Summary

```
src/
├── app/
│   ├── main.tsx           # App entry point with routing
│   ├── store.ts           # Redux store configuration
│   ├── pages/
│   │   ├── admin/         # Admin panel pages
│   │   ├── vendor/        # Vendor dashboard pages
│   │   ├── shop/          # Customer shop pages
│   │   └── auth/          # Authentication pages
│   └── not-found.tsx      # 404 page
│
├── components/
│   ├── common/            # Shared components
│   ├── admin/             # Admin-specific components
│   ├── vendor/            # Vendor-specific components
│   ├── customer/          # Customer-specific components
│   └── ui/                # shadcn/ui components
│
├── features/              # Redux slices
│   ├── auth/
│   ├── theme/
│   ├── sidebar.ts
│   └── menuBar.ts
│
├── utils/
│   ├── constants.ts       # Global constants
│   ├── Types.ts           # TypeScript type definitions
│   ├── validation.ts      # Zod schemas
│   └── customer/
│       └── constants.ts   # Customer-specific constants
│
└── lib/
    └── utils.ts           # Utility functions (cn, etc.)
```

---

## Multi-Tenant Architecture

### Tenant Isolation
- Each vendor operates independently
- Company-specific data segregation via `company_id`
- Admin oversees all vendor instances

### User Hierarchy
```
Admin
  └─ Manages all vendors
  └─ Views system-wide analytics
  └─ Handles approvals

Vendor
  └─ Manages own products
  └─ Processes own orders
  └─ Views own analytics

Customer
  └─ Browses all vendor products
  └─ Places orders
  └─ Read-only access
```

---

## Development Workflow

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Adding New Features

1. **Create Redux slice** (if needed) in `src/features/`
2. **Add to store** in `src/app/store.ts`
3. **Create components** in appropriate directory
4. **Add routes** in `src/app/main.tsx`
5. **Update constants** in `src/utils/constants.ts`
6. **Add navigation links** if needed

---

## Future Considerations

### Potential Enhancements
- Real-time notifications (WebSockets)
- Advanced search & filtering
- Shopping cart implementation
- Payment gateway integration
- Order tracking system
- Vendor analytics dashboard
- Customer reviews & ratings
- Multi-language support
- Progressive Web App (PWA)

---

## Documentation Updates

**Last Updated**: February 9, 2026  
**Version**: 0.0.0  
**Maintainer**: TechSonance Development Team

---

## Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
