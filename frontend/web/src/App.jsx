import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import AdminProducts from "./pages/AdminProducts";
import OrderCreate from "./pages/OrderCreate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import { AuthProvider } from "./context/AuthContext";
import AdminLogin from "./pages/AdminLogin";

function AppInner() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/p/:slug" element={<ProductDetail />} />
        <Route path="/orders/new" element={<OrderCreate />} />
        <Route path="/admin/products" element={
          <RequireAdmin>
            <AdminProducts />
          </RequireAdmin>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/*" element={
          <RequireAuth>
            <AppInner />
          </RequireAuth>
        } />
      </Routes>
    </AuthProvider>
  );
}
