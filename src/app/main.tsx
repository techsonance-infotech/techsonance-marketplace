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
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/adminLogin" element={<Login />} />
          <Route path="/vendorLogin" element={<VendorLogin />} />
          <Route path="/vendorRegister" element={<VendorRegister />} />
          <Route path="/customerRegister" element={<CustomerRegister />} />
          <Route path="/customerLogin" element={<CustomerLogin />} />
          <Route path="/adminDashboard" element={<DashBoard />} >
          // Add more admin child routes here as needed
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
