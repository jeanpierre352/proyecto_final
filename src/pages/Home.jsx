import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import AdminCodeModal from '../components/AdminCodeModal'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const navigate = useNavigate()
  const { addToCart, count, total } = useCart()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase.from('products').select('*')
        if (selectedCat) query = query.eq('category', selectedCat)
        if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
        const { data, error } = await query
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedCat, search])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('products').select('category').neq('category', null)
        if (error) {
          console.error('Error fetching categories:', error)
          setCategories([])
        } else {
          const unique = [...new Set(data.map((p) => p.category).filter(Boolean))]
          setCategories(unique)
        }
      } catch (err) {
        console.error('Categories fetch error:', err)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleAdminClick = () => {
    if (sessionStorage.getItem('admin_verified') === 'true') {
      navigate('/admin')
    } else {
      setShowAdminModal(true)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Tienda de Videojuegos</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar videojuegos, consolas, accesorios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="header-nav">
          <Link to="/carrito" className="cart-icon">
            🛒 {count} - S/ {total.toFixed(2)}
          </Link>
          {user ? (
            <>
              <span style={{ color: '#00ff88', fontWeight: '600' }}>{profile?.username || user.email}</span>
              <Link to="/perfil">Perfil</Link>
              {profile?.role?.toLowerCase() === 'admin' && (
                <button type="button" onClick={handleAdminClick}>
                  Admin
                </button>
              )}
              <button type="button" onClick={handleSignOut}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/registro">Registro</Link>
            </>
          )}
        </div>
      </header>
      <div className="category-filter">
        <CategoryFilter categories={categories} selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <main className="product-grid">
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p style={{ color: '#e94560', textAlign: 'center', gridColumn: '1/-1' }}>
            Error: {error}
          </p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>No hay productos.</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} canAdd={!!user} />
          ))
        )}
      </main>
      <AdminCodeModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </div>
  )
}

export default Home
