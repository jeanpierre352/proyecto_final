import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()
  const { user } = useAuth()

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
            <button onClick={() => addToCart(product)} disabled={!user} title={user ? 'Agregar al carrito' : 'Inicia sesión para comprar'}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
