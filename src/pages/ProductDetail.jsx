import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { useCart } from '../context/CartContext'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      setProduct(data)
    }
    fetchProduct()
  }, [id])

  if (!product) return <div className="app"><p>Cargando...</p></div>

  return (
    <div className="app">
      <Link to="/" className="back-btn">← Volver</Link>
      <div className="product-detail">
        <div className="detail-content">
          <img src={product.image_url} alt={product.name} />
          <div className="detail-info">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">S/ {product.price.toFixed(2)}</p>
            <p>Stock: {product.stock}</p>
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
