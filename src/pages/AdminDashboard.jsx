import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

// Datos de ejemplo para desarrollo
const EXAMPLE_TOP_PRODUCTS = [
  { name: 'God of War Ragnarok', cantidad: 42 },
  { name: 'Elden Ring', cantidad: 38 },
  { name: 'Spider-Man 2', cantidad: 31 },
  { name: 'Halo Infinite', cantidad: 28 },
  { name: 'Cyberpunk 2077', cantidad: 24 },
]

const EXAMPLE_SEARCH_STATS = [
  { term: 'god of war', count: 15 },
  { term: 'playstation 5', count: 12 },
  { term: 'xbox series x', count: 10 },
  { term: 'nintendo switch', count: 8 },
  { term: 'steam deck', count: 6 },
]

const EXAMPLE_RECENT_ORDERS = [
  { id: 'ord_001', total: 299.99, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'ord_002', total: 149.50, status: 'pending', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'ord_003', total: 89.99, status: 'completed', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'ord_004', total: 499.00, status: 'cancelled', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'ord_005', total: 59.99, status: 'completed', created_at: new Date(Date.now() - 432000000).toISOString() },
]

const EXAMPLE_SALES_DATA = [
  { date: '10/05/2026', total: 1250.50 },
  { date: '11/05/2026', total: 1890.75 },
  { date: '12/05/2026', total: 2340.00 },
]

function AdminDashboard() {
  const [topProducts, setTopProducts] = useState([])
  const [searchStats, setSearchStats] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [salesData, setSalesData] = useState([])

   useEffect(() => {
     const fetchStats = async () => {
       try {
         const { data: orders, error: ordersError } = await supabase.from('orders').select('*, order_items(*)')
         if (ordersError) throw ordersError

         // Si no hay órdenes en desarrollo, usar datos de ejemplo
         if (!orders || orders.length === 0) {
           if (import.meta.env.DEV) {
             console.log('[AdminDashboard] Sin datos reales, mostrando ejemplos de desarrollo')
             setTopProducts(EXAMPLE_TOP_PRODUCTS)
             setSearchStats(EXAMPLE_SEARCH_STATS)
             setRecentOrders(EXAMPLE_RECENT_ORDERS)
             setSalesData(EXAMPLE_SALES_DATA)
             return
           } else {
             setTopProducts([])
             setSearchStats([])
             setRecentOrders([])
             setSalesData([])
             return
           }
         }
        const productSales = {}
        orders?.forEach((o) => {
          o.order_items?.forEach((item) => {
            productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity
          })
        })
        const top = Object.entries(productSales)
          .map(([product_id, quantity]) => ({ product_id, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5)
        const { data: products, error: productsError } = await supabase.from('products').select('id, name').in('id', top.map(p => p.product_id))
        if (productsError) throw productsError
        console.log('products:', products)
        const map = products?.reduce((acc, p) => ({ ...acc, [p.id]: p.name }), {})
        setTopProducts(top.map(p => ({ name: map[p.product_id] || p.product_id, cantidad: p.quantity })))

        const { data: searches, error: searchesError } = await supabase.from('search_logs').select('search_term').not('search_term', 'is', null)
        if (searchesError) throw searchesError
        console.log('searches:', searches)
        const counts = {}
        searches?.forEach((s) => {
          const term = s.search_term.toLowerCase()
          counts[term] = (counts[term] || 0) + 1
        })
        setSearchStats(Object.entries(counts).map(([term, count]) => ({ term, count })).sort((a, b) => b.count - a.count).slice(0, 5))

        const { data: recent, error: recentError } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
        if (recentError) throw recentError
        console.log('recent orders:', recent)
        setRecentOrders(recent || [])

        const daily = {}
        orders?.forEach((o) => {
          const date = new Date(o.created_at).toLocaleDateString()
          daily[date] = (daily[date] || 0) + o.total
        })
        setSalesData(Object.entries(daily).map(([date, total]) => ({ date, total })))
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Panel Admin</h2>
        <Link to="/" className="back-to-store-btn">
          ← Volver a la Tienda
        </Link>
      </div>
      <nav className="admin-nav">
        <a href="/admin" className="active">Dashboard</a>
        <a href="/admin/inventario">Inventario</a>
        <a href="/admin/busquedas">Búsquedas</a>
      </nav>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Productos Más Vendidos</h3>
          {topProducts.length === 0 ? <p>Sin datos</p> : (
            <ul>
              {topProducts.map((p, i) => (
                <li key={i}>{p.name}: {p.cantidad} unidades</li>
              ))}
            </ul>
          )}
        </div>
        <div className="stat-card">
          <h3>Búsquedas Comunes</h3>
          {searchStats.length === 0 ? <p>Sin datos</p> : (
            <ul>
              {searchStats.map((s, i) => (
                <li key={i}>"{s.term}": {s.count} veces</li>
              ))}
            </ul>
          )}
        </div>
        <div className="stat-card">
          <h3>Órdenes Recientes</h3>
          {recentOrders.length === 0 ? <p>Sin órdenes</p> : (
            <ul>
              {recentOrders.map((o) => (
                <li key={o.id}>#{o.id.slice(0,8)} - S/ {o.total.toFixed(2)} - {o.status}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
       <div className="charts">
         <div className="chart-box">
           <h3>Ventas por Día</h3>
           {salesData.length === 0 ? (
             <div className="no-data-message">
               <p>No hay datos de ventas disponibles</p>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <BarChart data={salesData}>
                 <XAxis dataKey="date" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="total" fill="#0f3460" />
               </BarChart>
             </ResponsiveContainer>
           )}
         </div>
         <div className="chart-box">
           <h3>Ventas por Producto</h3>
           {topProducts.length === 0 ? (
             <div className="no-data-message">
               <p>No hay datos de productos vendidos</p>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height={300}>
               <PieChart>
                 <Pie data={topProducts} dataKey="cantidad" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                   {topProducts.map((_, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           )}
         </div>
       </div>
    </div>
  )
}

export default AdminDashboard
