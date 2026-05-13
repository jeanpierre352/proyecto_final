import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductCard from './components/ProductCard'
import { useCart } from './context/CartContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { cart, addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = cart.reduce((acc, item) => acc + item.quantity, 0)

  if (loading) return <div className="app"><p>Cargando productos...</p></div>
  if (error) return <div className="app"><p>Error: {error}</p></div>

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tienda de Videojuegos</h1>
        <div className="cart-icon">
          🛒 {count} - S/ {total.toFixed(2)}
        </div>
      </header>
      <main className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addToCart} />
        ))}
      </main>
    </div>
  )
}

export default App
