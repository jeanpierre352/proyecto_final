import React from 'react'
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const isVerified = sessionStorage.getItem('admin_verified') === 'true'

  if (!isVerified) {
    return <Navigate to="/" replace />
  }
  return children
}
