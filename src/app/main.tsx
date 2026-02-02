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
import { CreateVendor } from './pages/admin/CreateVendor.tsx'
import { ApproveVendor } from './pages/admin/ApproveVendor.tsx'
import { SupportTickets } from './pages/admin/SupportTickets.tsx'
import { AuditLog } from './pages/admin/AuditLog.tsx';
import { Dashboard } from './pages/vendor/Dashboard.tsx'
import { Orders } from './pages/vendor/Orders.tsx'
import { Inventory } from './pages/vendor/Inventory.tsx'
import { Products } from './pages/vendor/Products/Products.tsx'
import { ProductForm } from './pages/vendor/Products/ProductForm.tsx'
import {ProductUpdateForm } from './pages/vendor/Products/ProductUpdateForm .tsx'

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
              <Route path="createVendor" element={<CreateVendor />} />
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
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
