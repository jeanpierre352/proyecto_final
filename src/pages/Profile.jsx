import React from 'react'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { profile } = useAuth()

  return (
    <div className="profile-page">
      <h2>Mi Perfil</h2>
      <p><strong>Usuario:</strong> {profile?.username}</p>
    </div>
  )
}

export default Profile
