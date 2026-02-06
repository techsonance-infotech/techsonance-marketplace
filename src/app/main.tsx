import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from '../components/common/ProtectedRoute.tsx'
import { UserRole } from '../features/auth/authSlice.ts'
import { Login, VendorLogin, VendorRegister, CustomerRegister, CustomerLogin, Navbar, Footer, DashBoard, VendorManagement, VendorForm, ApproveVendor, SupportTickets, AuditLog, Dashboard, Orders, Inventory, Products, ProductForm, ProductUpdateForm, Finances, Marketing, CustomerCare, Profile, Locations, BillingAndBanking, BusinessProfile, Security , Home} from '../utils/constants';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
          </Route>
          <Route path="adminLogin" element={<ProtectedRoute allowedRoles={[UserRole.Admin]}><Login /></ProtectedRoute>} />
          <Route path="vendorLogin" element={<ProtectedRoute allowedRoles={[UserRole.Vendor]}><VendorLogin /></ProtectedRoute>} />
          <Route path="vendorRegister" element={<ProtectedRoute allowedRoles={[UserRole.Vendor]}><VendorRegister /></ProtectedRoute>} />
          <Route path="customerRegister" element={<ProtectedRoute allowedRoles={[UserRole.Customer]}><CustomerRegister /></ProtectedRoute>} />
          <Route path="customerLogin" element={<ProtectedRoute allowedRoles={[UserRole.Customer]}><CustomerLogin /></ProtectedRoute>} />
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
