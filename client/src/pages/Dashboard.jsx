function Dashboard({ setCurrentPage }) {
  const recommendedRecipes = [
    { id: 1, name: 'Classic Spaghetti Carbonara', difficulty: 'easy', time: '20 min', image: '🍝' },
    { id: 2, name: 'Chicken Stir Fry', difficulty: 'easy', time: '25 min', image: '🍗' },
    { id: 3, name: 'Veggie Fried Rice', difficulty: 'easy', time: '15 min', image: '🍚' },
  ]

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
        <div className="navbar-links">
          <span className="nav-link active" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
          <span className="nav-link" onClick={() => setCurrentPage('discover')}>Discover</span>
          <span className="nav-link" onClick={() => setCurrentPage('progress')}>Progress</span>
          <span className="nav-link" onClick={() => setCurrentPage('profile')}>Profile</span>
        </div>
      </div>

      <div className="page-container">
        <h1 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Welcome Back, Chef! 👨‍🍳</h1>
        <p style={{ color: '#78350f', marginBottom: '2rem' }}>Here's your cooking journey at a glance</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">12</div>
            <div className="stat-label">Recipes Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">Beginner</div>
            <div className="stat-label">Current Level</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">350</div>
            <div className="stat-label">XP Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Your Skill Progress</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#78350f' }}>Beginner → Intermediate</span>
              <span style={{ color: '#d97706', fontWeight: 'bold' }}>70%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '70%' }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#78350f', marginTop: '0.5rem' }}>
              Complete 3 more recipes to level up!
            </p>
          </div>
        </div>

        <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>Recommended For You</h2>
        <div className="grid">
          {recommendedRecipes.map((recipe) => (
            <div key={recipe.id} className="card recipe-card" onClick={() => setCurrentPage('recipe')}>
              <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>{recipe.image}</div>
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.name}</h3>
                <div className="recipe-meta">
                  <span>⏱️ {recipe.time}</span>
                  <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-primary" onClick={() => setCurrentPage('discover')}>
            Browse All Recipes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard