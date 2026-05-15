import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

// Datos de ejemplo para desarrollo
const EXAMPLE_LOGS = [
  { id: '1', search_term: 'god of war', action: 'search', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', search_term: 'playstation 5', action: 'search', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', search_term: 'xbox series x', action: 'search', created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: '4', search_term: 'nintendo switch oled', action: 'search', created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: '5', search_term: 'steam deck', action: 'search', created_at: new Date(Date.now() - 18000000).toISOString() },
  { id: '6', search_term: 'elden ring', action: 'search', created_at: new Date(Date.now() - 21600000).toISOString() },
  { id: '7', search_term: 'cyberpunk 2077', action: 'search', created_at: new Date(Date.now() - 25200000).toISOString() },
  { id: '8', search_term: 'halo infinite', action: 'search', created_at: new Date(Date.now() - 28800000).toISOString() },
]

function SearchStats() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('search_logs').select('*').order('created_at', { ascending: false }).limit(50)
      if (!data || data.length === 0) {
        if (import.meta.env.DEV) {
          console.log('[SearchStats] Sin datos reales, mostrando ejemplos de desarrollo')
          setLogs(EXAMPLE_LOGS)
          return
        } else {
          setLogs([])
          return
        }
      }
      setLogs(data)
    }
    fetch()
  }, [])

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Estadísticas de Búsqueda</h2>
        <Link to="/" className="back-to-store-btn">
          ← Volver a la Tienda
        </Link>
      </div>
      <nav className="admin-nav">
        <a href="/admin">Dashboard</a>
        <a href="/admin/inventario">Inventario</a>
        <a href="/admin/busquedas" className="active">Búsquedas</a>
      </nav>
      <ul>
        {logs.map((log) => (
          <li key={log.id}>"{log.search_term}" - {log.action} - {new Date(log.created_at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  )
}

export default SearchStats
