import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

   useEffect(() => {
     const init = async () => {
       const { data: { user } } = await supabase.auth.getUser()
       console.log('[AuthContext] init - usuario:', user?.email, user?.id)
      setUser(user)
      if (user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        console.log('[AuthContext] perfil consultado:', data, 'error:', error)
        setProfile(data)
      } else {
        localStorage.removeItem('cart')
      }
      setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[AuthContext] onAuthStateChange - evento:', event, 'user:', session?.user?.email)
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        console.log('[AuthContext] perfil en onAuthStateChange:', data, 'error:', error)
        setProfile(data)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // Limpiar carrito y código admin al iniciar sesión
      localStorage.removeItem('cart')
      sessionStorage.removeItem('admin_verified')
    } catch (err) {
      console.error('SignIn exception:', err)
      throw err
    }
  }

  const signUp = async (email, password, username) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            role: 'user'
          }
        }
      })
      if (error) {
        console.error('SignUp error:', error.message, error.status, error.details)
        throw new Error(error.message || 'Error al registrarse')
      }
      console.log('SignUp success:', data)

      await new Promise(resolve => setTimeout(resolve, 1000))

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            username: username,
            role: 'user',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'id',
            ignoreDuplicates: true
          })
        if (profileError) {
          console.warn('Profile upsert warning:', profileError.message)
        } else {
          console.log('Profile upsert exitoso')
        }
      }
      localStorage.removeItem('cart')
    } catch (err) {
      console.error('SignUp exception:', err)
      throw err
    }
  }

  const signOut = async () => {
    console.log('Signing out...')
    try {
      // Limpiar carrito y código admin al cerrar sesión
      localStorage.removeItem('cart')
      sessionStorage.removeItem('admin_verified')
      await supabase.auth.signOut()
      console.log('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
