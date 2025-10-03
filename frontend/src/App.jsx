import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./pages/Register"; 
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/customerdashboard/DashboardLayout";
import DashboardHome from "./pages/customerdashboard/DashboardHome";
import Orders from "./pages/customerdashboard/Orders";
import Products from "./pages/customerdashboard/Products";
import Profile from "./pages/customerdashboard/Profile";
import AdminProtectedRoute from "./components/AdminDashboard/AdminProtectedRoute";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import AdminDashboardHome from "./pages/AdminDashboard/AdminDashboardHome";
import UserManagement from "./pages/AdminDashboard/UserManagement";
import AdminProfile from "./pages/AdminDashboard/AdminProfile";
import OrdersManagement from "./pages/AdminDashboard/OrdersManagement";
import LedgerPayments from "./pages/AdminDashboard/LedgerPayments";
import RetailerProfiles from "./pages/AdminDashboard/RetailerProfiles";
import AnalyticsForecasting from "./pages/AdminDashboard/AnalyticsForecasting";
import DigitalMarketingTools from "./pages/AdminDashboard/DigitalMarketingTools";
import Settings from "./pages/AdminDashboard/Settings";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true
        });
        
        if (response.data.success) {
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Only show Header if user is NOT authenticated */}
      {!isAuthenticated && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Customer Dashboard Routes */}
        <Route path="/customer-dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<div>Messages Page</div>} />
          <Route path="analytics" element={<div>Analytics Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
          <Route path="help" element={<div>Help Page</div>} />
        </Route>

        {/* ✅ Protected Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
         <Route index element={<AdminDashboardHome />} />
          <Route path="inventory-management" element={<UserManagement />} />
          <Route path="products" element={<div>Admin Products Page</div>} />
          <Route path="orders-management" element={<OrdersManagement />} />
           <Route path="ledger-payments" element={<LedgerPayments />} />
           <Route path="retailer-profiles" element={<RetailerProfiles />} />
          <Route path="analytics-forecasting" element={<AnalyticsForecasting />} />
          <Route path="digital-marketing-tools" element={<DigitalMarketingTools />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<div>Admin Help Page</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;