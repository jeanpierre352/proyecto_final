import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import CategoryFilter from '../components/CategoryFilter'
import { useCart } from '../context/CartContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const { addToCart, count, total } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      let query = supabase.from('products').select('*')
      if (selectedCat) query = query.eq('category', selectedCat)
      const { data } = await query
      setProducts(data || [])
    }
    fetchProducts()
  }, [selectedCat])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('products').select('category').neq('category', null)
      const unique = [...new Set(data.map((p) => p.category).filter(Boolean))]
      setCategories(unique)
    }
    fetchCategories()
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tienda de Videojuegos</h1>
        <Link to="/carrito" className="cart-icon">
          🛒 {count} - S/ {total.toFixed(2)}
        </Link>
      </header>
      <div className="category-filter">
        <CategoryFilter categories={categories} selected={selectedCat} onSelect={setSelectedCat} />
      </div>
      <main className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addToCart} />
        ))}
      </main>
    </div>
  )
}

export default Home
