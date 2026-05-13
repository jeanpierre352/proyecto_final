import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cart, updateQuantity, removeFromCart, total } = useCart()

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h2>Carrito</h2>
        <p>El carrito está vacío.</p>
        <Link to="/">← Seguir comprando</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h2>Carrito de Compras</h2>
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image_url} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Precio: S/ {item.price.toFixed(2)}</p>
            </div>
            <div className="item-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <button className="remove" onClick={() => removeFromCart(item.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">
        <h2>Total: S/ {total.toFixed(2)}</h2>
        <p>Funcionalidad de checkout en Parte 3</p>
      </div>
    </div>
  )
}

export default CartPage
