import { useState, useEffect } from 'react'

function RecipeDetail({ setCurrentPage, recipeId }) {
  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCooking, setIsCooking] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepTimer, setStepTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    if (recipeId) {
      fetchRecipeDetails()
    }
  }, [recipeId])

  useEffect(() => {
    let interval
    if (timerActive && steps[currentStep]) {
      interval = setInterval(() => {
        setStepTimer(prev => {
          const stepDuration = steps[currentStep].duration || 0
          if (prev >= stepDuration * 60) {
            setTimerActive(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, currentStep, steps])

  const fetchRecipeDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setRecipe(data.recipe)
        setIngredients(data.ingredients)
        setSteps(data.steps)
        setReviews(data.reviews || [])
        setIsSaved(data.progress?.status === 'saved' || data.progress?.status === 'in_progress')
      } else {
        console.error('Failed to fetch recipe')
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartCooking = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        setIsCooking(true)
        setCurrentStep(0)
        setStepTimer(0)
      }
    } catch (error) {
      console.error('Error starting recipe:', error)
      alert('Error starting recipe. Please try again.')
    }
  }

  const handleSaveRecipe = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/api/recipes/${recipeId}/save`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setIsSaved(true)
        alert(data.message || 'Recipe saved successfully!')
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
      alert('Error saving recipe. Please try again.')
    }
  }

  const handleCompleteRecipe = async () => {
    setShowReviewForm(true)
  }

  const submitReview = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const completeResponse = await fetch(`http://localhost:5000/api/recipes/${recipeId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: reviewForm.rating, notes: reviewForm.comment })
      })

      if (completeResponse.ok) {
        const completeData = await completeResponse.json()
        
        if (reviewForm.comment.trim()) {
          await fetch(`http://localhost:5000/api/recipes/${recipeId}/review`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rating: reviewForm.rating, comment: reviewForm.comment })
          })
        }

        alert(`Congratulations! Recipe completed! +${completeData.xpEarned || 100} XP`)
        setIsCooking(false)
        setCurrentStep(0)
        setShowReviewForm(false)
        fetchRecipeDetails()
      }
    } catch (error) {
      console.error('Error completing recipe:', error)
      alert('Error completing recipe. Please try again.')
    }
  }

  const startStepTimer = () => {
    setStepTimer(0)
    setTimerActive(true)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setStepTimer(0)
      setTimerActive(false)
    } else {
      handleCompleteRecipe()
    }
  }

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setStepTimer(0)
      setTimerActive(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const toggleIngredient = (id) => {
    setCheckedIngredients(prev => ({ ...prev, [id]: !prev[id] }))
  }

  if (loading) {
    return (
      <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
        <div className="navbar">
          <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
        </div>
        <div className="loading"><div className="spinner"></div></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
        <div className="navbar">
          <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
        </div>
        <div className="page-container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ color: '#92400e' }}>Recipe not found</h2>
            <button className="btn btn-primary" onClick={() => setCurrentPage('discover')} style={{ marginTop: '1rem' }}>
              Browse Recipes
            </button>
          </div>
        </div>
      </div>
    )
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

        {showReviewForm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
              <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>How was it?</h2>
              <div className="form-group">
                <label style={{ color: '#92400e', fontWeight: '600' }}>Rating (1-5)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.8rem', border: '2px solid #e0e0e0', borderRadius: '8px' }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                  <option value="4">⭐⭐⭐⭐ Good</option>
                  <option value="3">⭐⭐⭐ Average</option>
                  <option value="2">⭐⭐ Below Average</option>
                  <option value="1">⭐ Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ color: '#92400e', fontWeight: '600' }}>Review (Optional)</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  style={{ width: '100%', padding: '0.8rem', border: '2px solid #e0e0e0', borderRadius: '8px', minHeight: '100px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={submitReview} style={{ flex: 1 }}>
                  Complete Recipe
                </button>
                <button className="btn btn-secondary" onClick={() => setShowReviewForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {!isCooking ? (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ fontSize: '6rem' }}>🍳</div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ color: '#92400e' }}>{recipe.name}</h1>
                  <p style={{ color: '#78350f', marginTop: '0.5rem' }}>{recipe.description}</p>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                    <span>⏱️ Prep: {recipe.prep_time} min</span>
                    <span>🍳 Cook: {recipe.cook_time} min</span>
                    <span>🍽️ Servings: {recipe.servings}</span>
                    <span>🌍 {recipe.cuisine_type}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleStartCooking}>
                  🎯 Start Cooking
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleSaveRecipe}
                  disabled={isSaved}
                  style={{ 
                    background: isSaved ? '#d97706' : 'white', 
                    color: isSaved ? 'white' : '#d97706',
                    cursor: isSaved ? 'default' : 'pointer'
                  }}
                >
                  {isSaved ? '✓ Saved' : '❤️ Save Recipe'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Ingredients</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {ingredients.map((ingredient) => (
                    <li key={ingredient.id} style={{ padding: '0.8rem', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        style={{ accentColor: '#d97706' }}
                        checked={checkedIngredients[ingredient.id] || false}
                        onChange={() => toggleIngredient(ingredient.id)}
                      />
                      <span style={{ textDecoration: checkedIngredients[ingredient.id] ? 'line-through' : 'none' }}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.ingredient_name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Instructions</h2>
                {steps.map((step) => (
                  <div key={step.id} style={{ padding: '1rem', borderLeft: '4px solid #d97706', marginBottom: '1rem', background: '#fef3c7', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#92400e' }}>Step {step.step_order}</strong>
                      {step.duration && <span style={{ color: '#d97706' }}>⏱️ {step.duration} min</span>}
                    </div>
                    <p style={{ margin: 0, color: '#78350f' }}>{step.instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 0 && (
              <div className="card" style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Reviews</h2>
                {reviews.map((review) => (
                  <div key={review._id} style={{ padding: '1rem', borderBottom: '1px solid #f3f4f6', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ color: '#d97706', fontWeight: 'bold' }}>
                        {'⭐'.repeat(review.rating)}
                      </div>
                      <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {review.comment && (
                      <p style={{ color: '#78350f', margin: 0 }}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ color: '#92400e' }}>Cooking Mode</h1>
              <p style={{ color: '#78350f' }}>
                Step {currentStep + 1} of {steps.length}
              </p>
              <div className="progress-bar" style={{ maxWidth: '400px', margin: '1rem auto' }}>
                <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
              </div>
            </div>

            <div style={{ background: '#fef3c7', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>
                Step {steps[currentStep]?.step_order}
              </h2>
              <p style={{ fontSize: '1.2rem', color: '#78350f', lineHeight: '1.8', marginBottom: '1rem' }}>
                {steps[currentStep]?.instruction}
              </p>
              
              {steps[currentStep]?.duration && (
                <div style={{ marginTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ color: '#92400e', fontWeight: 'bold' }}>
                      Timer: {formatTime(stepTimer)} / {steps[currentStep].duration}:00
                    </span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => timerActive ? setTimerActive(false) : startStepTimer()}
                    >
                      {timerActive ? '⏸️ Pause' : '▶️ Start Timer'}
                    </button>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(stepTimer / (steps[currentStep].duration * 60)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button 
                className="btn btn-secondary" 
                onClick={previousStep}
                disabled={currentStep === 0}
                style={{ opacity: currentStep === 0 ? 0.5 : 1 }}
              >
                ← Previous Step
              </button>
              <button 
                className="btn btn-primary" 
                onClick={nextStep}
              >
                {currentStep === steps.length - 1 ? '✓ Complete Recipe' : 'Next Step →'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to exit cooking mode?')) {
                    setIsCooking(false)
                  }
                }}
                style={{ background: '#dc2626', color: 'white', border: 'none' }}
              >
                Exit Cooking Mode
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#78350f', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Quick jump to step:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStep(index)
                      setStepTimer(0)
                      setTimerActive(false)
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: index === currentStep ? '2px solid #d97706' : '1px solid #e0e0e0',
                      background: index <= currentStep ? '#fef3c7' : 'white',
                      color: '#92400e',
                      cursor: 'pointer',
                      fontWeight: index === currentStep ? 'bold' : 'normal'
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeDetail