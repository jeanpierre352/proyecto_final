import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

const ADMIN_CODE = '654321'

export default function AdminCodeModal({ isOpen, onClose }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code === ADMIN_CODE) {
      sessionStorage.setItem('admin_verified', 'true')
      setError('')
      onClose()
      navigate('/admin')
    } else {
      setError('Código incorrecto')
    }
  }

  const handleClose = () => {
    setCode('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Acceso Admin</h2>
        <p>Ingresa el código de acceso:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código"
            autoFocus
            style={{ width: '100%', padding: '1rem', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem' }}
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={handleClose}>Cancelar</button>
            <button type="submit">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
