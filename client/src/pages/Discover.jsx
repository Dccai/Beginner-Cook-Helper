import { useState } from 'react'

function Discover({ setCurrentPage, setSelectedRecipeId }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const recipes = [
    { id: 1, name: 'Classic Spaghetti Carbonara', difficulty: 'easy', time: '20 min', cuisine: 'Italian', image: '🍝' },
    { id: 2, name: 'Chicken Stir Fry', difficulty: 'easy', time: '25 min', cuisine: 'Asian', image: '🍗' },
    { id: 3, name: 'Beef Tacos', difficulty: 'easy', time: '30 min', cuisine: 'Mexican', image: '🌮' },
    { id: 4, name: 'Homemade Pizza', difficulty: 'medium', time: '45 min', cuisine: 'Italian', image: '🍕' },
    { id: 5, name: 'Thai Green Curry', difficulty: 'medium', time: '35 min', cuisine: 'Asian', image: '🍛' },
    { id: 6, name: 'Grilled Salmon', difficulty: 'medium', time: '30 min', cuisine: 'Mediterranean', image: '🐟' },
  ]

  const filteredRecipes = activeFilter === 'all' ? recipes : recipes.filter(r => r.difficulty === activeFilter)

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
        <div className="navbar-links">
          <span className="nav-link" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
          <span className="nav-link active" onClick={() => setCurrentPage('discover')}>Discover</span>
          <span className="nav-link" onClick={() => setCurrentPage('progress')}>Progress</span>
          <span className="nav-link" onClick={() => setCurrentPage('profile')}>Profile</span>
        </div>
      </div>

      <div className="page-container">
        <h1 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Discover Recipes</h1>
        <p style={{ color: '#78350f', marginBottom: '2rem' }}>Find the perfect recipe for your skill level</p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <input type="text" placeholder="Search recipes..." style={{ width: '100%', padding: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1rem' }} />
        </div>

        <div className="filters">
          <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All Recipes</button>
          <button className={`filter-btn ${activeFilter === 'easy' ? 'active' : ''}`} onClick={() => setActiveFilter('easy')}>Easy</button>
          <button className={`filter-btn ${activeFilter === 'medium' ? 'active' : ''}`} onClick={() => setActiveFilter('medium')}>Medium</button>
          <button className={`filter-btn ${activeFilter === 'hard' ? 'active' : ''}`} onClick={() => setActiveFilter('hard')}>Hard</button>
        </div>

        <div className="grid">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="card recipe-card" onClick={() => { setSelectedRecipeId(recipe.id); setCurrentPage('recipe') }}>
              <div style={{ fontSize: '5rem', textAlign: 'center', padding: '1rem' }}>{recipe.image}</div>
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.name}</h3>
                <div className="recipe-meta">
                  <span>⏱️ {recipe.time}</span>
                  <span>🌍 {recipe.cuisine}</span>
                </div>
                <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Discover