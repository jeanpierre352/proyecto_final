import React from 'react'

function SearchBar({ value, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar videojuegos, consolas, accesorios..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchBar
