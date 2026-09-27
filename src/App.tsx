import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { I18nProvider } from './contexts/I18nContext';
import { StoreProvider } from './contexts/StoreContext';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { Login } from './pages/Login';
import { Catalog } from './pages/customer/Catalog';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { Orders } from './pages/customer/Orders';
import { OrderDetail } from './pages/customer/OrderDetail';
import { Account } from './pages/customer/Account';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCustomerDetail } from './pages/admin/AdminCustomerDetail';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminSync } from './pages/admin/AdminSync';
import { AdminTranslations } from './pages/admin/AdminTranslations';

export function App() {
  return (
    <I18nProvider>
      <StoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/catalogo" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<CustomerLayout />}>
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedidos" element={<Orders />} />
              <Route path="/pedidos/:id" element={<OrderDetail />} />
              <Route path="/cuenta" element={<Account />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminCustomers />} />
              <Route path="clientes/:id" element={<AdminCustomerDetail />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="sincronizacion" element={<AdminSync />} />
              <Route path="textos" element={<AdminTranslations />} />
            </Route>
            <Route path="*" element={<Navigate to="/catalogo" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors closeButton={false} toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
      </StoreProvider>
    </I18nProvider>);

}