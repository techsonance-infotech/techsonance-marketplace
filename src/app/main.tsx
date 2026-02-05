import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Route, Routes } from "react-router";
import { Login } from './pages/auth/admin/login';
import { VendorLogin } from './pages/auth/vendor/login'
import { VendorRegister } from './pages/auth/vendor/register'
import { Navbar } from '../components/customer/Navbar'
import { CustomerRegister } from './pages/auth/customer/register'
import { CustomerLogin } from './pages/auth/customer/login'
import { Footer } from '../components/customer/Footer'
import { DashBoard } from './pages/admin/DashBoard'
import { VendorManagement } from './pages/admin/VendorManagement.tsx'
import { ProtectedRoute } from '../components/common/ProtectedRoute.tsx'
import { UserRole } from '../features/auth/authSlice.ts'
import { VendorForm } from './pages/admin/VendorForm.tsx'
import { ApproveVendor } from './pages/admin/ApproveVendor.tsx'
import { SupportTickets } from './pages/admin/SupportTickets.tsx'
import { AuditLog } from './pages/admin/AuditLog.tsx';
import { Dashboard } from './pages/vendor/Dashboard.tsx'
import { Orders } from './pages/vendor/Orders.tsx'
import { Inventory } from './pages/vendor/Inventory.tsx'
import { Products } from './pages/vendor/products/Products.tsx'
import { ProductForm } from './pages/vendor/products/ProductForm.tsx'
import { ProductUpdateForm } from './pages/vendor/products/ProductUpdateForm .tsx'
import { Finances } from './pages/vendor/Finances.tsx'
import { Marketing } from './pages/vendor/Marketing.tsx'
import { CustomerCare } from './pages/vendor/CustomerCare.tsx'
import { Profile } from './pages/vendor/settings/Profile.tsx'
import { Locations } from './pages/vendor/settings/Locations.tsx'
import { BillingAndBanking } from './pages/vendor/settings/BillingAndBanking.tsx'
import { BusinessProfile } from './pages/vendor/settings/BusinessProfile.tsx'
import { Security } from './pages/vendor/settings/Security.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="adminLogin" element={<ProtectedRoute allowedRoles={[UserRole.Admin]}><Login /></ProtectedRoute>} />
          <Route path="vendorLogin" element={<ProtectedRoute allowedRoles={[UserRole.Vendor]}><VendorLogin /></ProtectedRoute>} />
          <Route path="vendorRegister" element={<ProtectedRoute allowedRoles={[UserRole.Vendor]}><VendorRegister /></ProtectedRoute>} />
          <Route path="customerRegister" element={<ProtectedRoute allowedRoles={[UserRole.Customer]}><CustomerRegister /></ProtectedRoute>} />
          <Route path="customerLogin" element={<ProtectedRoute allowedRoles={[UserRole.Customer]}><CustomerLogin /></ProtectedRoute>} />
          {/* <Route path='/admin' element={<ProtectedRoute allowedRoles={[UserRole.Admin]}><DashBoard /></ProtectedRoute>} > */}

          <Route path='admin' >
            <Route index element={<DashBoard />} />
            <Route path='vendorManagement' >
              <Route index element={<VendorManagement />} />
              <Route path="vendorForm" element={<VendorForm />} />
              <Route path="approveVendors" element={<ApproveVendor />} />
            </Route>
            <Route path="supportTickets" element={<SupportTickets />} />
            <Route path="auditLog" element={<AuditLog />} />
          </Route>
          <Route path='vendor'>
            <Route index element={<Dashboard />} />
            <Route path='products'   >
              <Route index element={<Products />} />
              <Route path='productForm' element={<ProductForm />} />
              <Route path='productUpdateForm/:id' element={<ProductUpdateForm />} />
            </Route>
            <Route path='orders' element={<Orders />} />
            <Route path='inventory' element={<Inventory />} />
            <Route path='finances' element={<Finances />} />
            <Route path='marketing' element={<Marketing />} />
            <Route path='customerCare' element={<CustomerCare />} />
            <Route path='settings' >
              <Route   index element={<Profile />} />
              <Route path='locations' element={<Locations />} />


              <Route path='security' element={<Security />} />
              <Route path='businessProfile' element={<BusinessProfile />} />
              <Route path='billing' element={<BillingAndBanking />} />
            </Route>
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
