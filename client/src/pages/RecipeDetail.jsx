function RecipeDetail({ setCurrentPage, recipeId }) {
  const recipe = {
    id: 1,
    name: 'Classic Spaghetti Carbonara',
    difficulty: 'easy',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4,
    image: '🍝',
    description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and black pepper.',
    ingredients: ['400g spaghetti', '200g pancetta or bacon, diced', '4 large eggs', '100g Parmesan cheese, grated', '2 cloves garlic, minced', 'Black pepper to taste', 'Salt for pasta water'],
    steps: [
      { order: 1, instruction: 'Bring a large pot of salted water to boil', duration: '5 min' },
      { order: 2, instruction: 'Cook spaghetti according to package directions', duration: '8-10 min' },
      { order: 3, instruction: 'Meanwhile, cook pancetta in a large skillet until crispy', duration: '5 min' },
      { order: 4, instruction: 'Whisk eggs and Parmesan cheese together in a bowl', duration: '2 min' },
      { order: 5, instruction: 'Drain pasta, reserving 1 cup pasta water', duration: '1 min' },
      { order: 6, instruction: 'Add hot pasta to the skillet with pancetta', duration: '1 min' },
      { order: 7, instruction: 'Remove from heat and quickly stir in egg mixture', duration: '2 min' },
      { order: 8, instruction: 'Season with black pepper and serve immediately', duration: '1 min' }
    ]
  }

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
        <div className="navbar-links">
          <span className="nav-link" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
          <span className="nav-link" onClick={() => setCurrentPage('discover')}>Discover</span>
          <span className="nav-link" onClick={() => setCurrentPage('progress')}>Progress</span>
          <span className="nav-link" onClick={() => setCurrentPage('profile')}>Profile</span>
        </div>
      </div>

      <div className="page-container">
        <button className="btn btn-secondary" onClick={() => setCurrentPage('discover')} style={{ marginBottom: '1rem' }}>← Back</button>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ fontSize: '6rem' }}>{recipe.image}</div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: '#92400e' }}>{recipe.name}</h1>
              <p style={{ color: '#78350f', marginTop: '0.5rem' }}>{recipe.description}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                <span>⏱️ Prep: {recipe.prepTime}</span>
                <span>🍳 Cook: {recipe.cookTime}</span>
                <span>🍽️ Servings: {recipe.servings}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>🎯 Start Cooking</button>
            <button className="btn btn-secondary">❤️ Save Recipe</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div className="card">
            <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Ingredients</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} style={{ padding: '0.8rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" style={{ accentColor: '#d97706' }} />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Instructions</h2>
            {recipe.steps.map((step) => (
              <div key={step.order} style={{ padding: '1rem', borderLeft: '4px solid #d97706', marginBottom: '1rem', background: '#fef3c7', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#92400e' }}>Step {step.order}</strong>
                  <span style={{ color: '#d97706' }}>⏱️ {step.duration}</span>
                </div>
                <p style={{ margin: 0, color: '#78350f' }}>{step.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetail