import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

// Datos de ejemplo para desarrollo
const EXAMPLE_PRODUCTS = [
  { id: 'p1', name: 'God of War Ragnarok', stock: 25, price: 199.99 },
  { id: 'p2', name: 'Elden Ring', stock: 40, price: 179.99 },
  { id: 'p3', name: 'Spider-Man 2 PS5', stock: 30, price: 219.99 },
  { id: 'p4', name: 'Halo Infinite', stock: 15, price: 59.99 },
  { id: 'p5', name: 'Cyberpunk 2077', stock: 50, price: 89.99 },
  { id: 'p6', name: 'Steam Deck', stock: 10, price: 549.99 },
  { id: 'p7', name: 'Nintendo Switch OLED', stock: 20, price: 349.99 },
  { id: 'p8', name: 'Xbox Series X', stock: 8, price: 499.99 },
  { id: 'p9', name: 'PlayStation 5', stock: 12, price: 549.99 },
  { id: 'p10', name: 'Redragon Keyboard', stock: 100, price: 45.99 },
]

function InventoryManager() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('products').select('*')
      if (!data || data.length === 0) {
        if (import.meta.env.DEV) {
          console.log('[InventoryManager] Sin datos reales, mostrando ejemplos de desarrollo')
          setProducts(EXAMPLE_PRODUCTS)
          return
        } else {
          setProducts([])
          return
        }
      }
      setProducts(data)
    }
    fetch()
  }, [])

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Inventario</h2>
        <Link to="/" className="back-to-store-btn">
          ← Volver a la Tienda
        </Link>
      </div>
      <nav className="admin-nav">
        <a href="/admin">Dashboard</a>
        <a href="/admin/inventario" className="active">Inventario</a>
        <a href="/admin/busquedas">Búsquedas</a>
      </nav>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - Stock: {p.stock} - S/ {p.price}</li>
        ))}
      </ul>
    </div>
  )
}

export default InventoryManager
