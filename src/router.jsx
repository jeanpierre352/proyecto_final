import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import InventoryManager from './pages/InventoryManager'
import SearchStats from './pages/SearchStats'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <ProductDetail /> },
  {
    path: '/carrito',
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  { path: '/login', element: <Login /> },
  { path: '/registro', element: <Register /> },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/perfil',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/inventario',
    element: (
      <AdminRoute>
        <InventoryManager />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/busquedas',
    element: (
      <AdminRoute>
        <SearchStats />
      </AdminRoute>
    ),
  },
])

export default router
