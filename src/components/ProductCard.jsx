import React from 'react'

function ProductCard({ product, onAdd }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="price">S/ {product.price.toFixed(2)}</span>
      <button onClick={() => onAdd(product)}>Agregar</button>
    </div>
  )
}

export default ProductCard
