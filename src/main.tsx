import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './app/App'
import Shop from './app/Shop'
import Cart from './app/Cart'
import Login from './app/Login'
import Signup from './app/Signup'
import ProductPage from './app/Product'
import Checkout from './app/Checkout'
import Account from './app/Account'
import {
  AboutPage,
  ContactPage,
  IngredientsPage,
  JournalPage,
  PrivacyPage,
  ShippingPage,
  TermsPage,
  NotFoundPage,
} from './app/Pages'
import { CartProvider } from './app/contexts/CartContext'
import { AuthProvider } from './app/contexts/AuthContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
