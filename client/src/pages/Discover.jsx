import { useState, useEffect } from 'react'

function Discover({ setCurrentPage, setSelectedRecipeId }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCuisine, setActiveCuisine] = useState('all')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    fetchRecipes()
  }, [activeFilter, activeCuisine, debouncedSearch])

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      
      if (activeFilter !== 'all') {
        params.append('difficulty', activeFilter)
      }
      if (activeCuisine !== 'all') {
        params.append('cuisine', activeCuisine)
      }
      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim())
      }

      const response = await fetch(`http://localhost:5000/api/recipes?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setRecipes(data.recipes)
      } else {
        console.error('Failed to fetch recipes')
        setRecipes([])
      }
    } catch (error) {
      console.error('Error fetching recipes:', error)
      setRecipes([])
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeClick = (recipe) => {
    setSelectedRecipeId(recipe.id)
    setCurrentPage('recipe')
  }

  const cuisines = ['all', 'Italian', 'Asian', 'Mexican', 'American', 'Mediterranean', 'Indian']

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
          <input 
            type="text" 
            placeholder="Search recipes by name or ingredients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px', 
              fontSize: '1rem',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#d97706'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          {searchQuery && (
            <div style={{ marginTop: '0.5rem', color: '#78350f', fontSize: '0.9rem' }}>
              {loading ? 'Searching...' : `Searching for: "${searchQuery}"`}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Filter by Difficulty:</h3>
          <div className="filters">
            <button 
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
              onClick={() => setActiveFilter('all')}
            >
              All Recipes
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'easy' ? 'active' : ''}`} 
              onClick={() => setActiveFilter('easy')}
            >
              Easy
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'medium' ? 'active' : ''}`} 
              onClick={() => setActiveFilter('medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-btn ${activeFilter === 'hard' ? 'active' : ''}`} 
              onClick={() => setActiveFilter('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Filter by Cuisine:</h3>
          <div className="filters">
            {cuisines.map(cuisine => (
              <button 
                key={cuisine}
                className={`filter-btn ${activeCuisine === cuisine ? 'active' : ''}`} 
                onClick={() => setActiveCuisine(cuisine)}
              >
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : recipes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>No recipes found</h2>
            <p style={{ color: '#78350f' }}>
              {searchQuery ? `No recipes match "${searchQuery}". Try a different search term.` : 'Try adjusting your filters or check back later for new recipes.'}
            </p>
            {(activeFilter !== 'all' || activeCuisine !== 'all' || searchQuery) && (
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setActiveFilter('all')
                  setActiveCuisine('all')
                  setSearchQuery('')
                }}
                style={{ marginTop: '1rem' }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1rem', color: '#78350f' }}>
              Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
            </div>
            <div className="grid">
              {recipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="card recipe-card" 
                  onClick={() => handleRecipeClick(recipe)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '5rem', textAlign: 'center', padding: '1rem' }}>🍳</div>
                  <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.name}</h3>
                    <p style={{ 
                      color: '#78350f', 
                      fontSize: '0.9rem', 
                      marginTop: '0.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {recipe.description}
                    </p>
                    <div className="recipe-meta" style={{ marginTop: '0.5rem' }}>
                      <span>⏱️ {recipe.cook_time} min</span>
                      <span>🌍 {recipe.cuisine_type}</span>
                    </div>
                    <span className={`difficulty-badge difficulty-${recipe.difficulty}`} style={{ marginTop: '0.5rem' }}>
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Discover