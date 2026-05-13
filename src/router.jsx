import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <ProductDetail /> },
  { path: '/carrito', element: <CartPage /> },
])

export default router
