import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminCodeModal from '../components/AdminCodeModal'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      console.log('Login exitoso, redirigiendo a /')
      navigate('/')
    } catch (err) {
      console.error('Error en handleSubmit:', err)
      setError(err.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="auth-page">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>

      <div className="admin-access">
        <button type="button" className="admin-button" onClick={() => setShowAdminModal(true)}>
          Admin
        </button>
      </div>

      {showAdminModal && (
        <AdminCodeModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  )
}

export default Login
