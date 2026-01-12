import { useState, useEffect } from 'react'

function Dashboard({ setCurrentPage }) {
  const [userName, setUserName] = useState('')
  const [userStats, setUserStats] = useState({
    recipesCompleted: 0,
    skillLevel: 'Beginner',
    xpPoints: 0,
    achievements: 0
  })

  const [recommendedRecipes, setRecommendedRecipes] = useState([])
  const [useAiRecommendations, setUseAiRecommendations] = useState(true)
  const [showAiChat, setShowAiChat] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      setUserName(user.name)
    }
    fetchUserStats()
    fetchRecommendations()
  }, [])

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserStats({
          recipesCompleted: data.user.total_recipes_completed || 0,
          skillLevel: data.user.skill_level || 'Beginner',
          xpPoints: data.user.xp_points || 0,
          achievements: 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token')
      const aiRecs = localStorage.getItem('aiRecommendations')
      if (aiRecs && useAiRecommendations) {
        const parsed = JSON.parse(aiRecs)
        setRecommendedRecipes(parsed)
        return
      }
      const response = await fetch('http://localhost:5000/api/recipes/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendedRecipes(data.recommendations)
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const handleResetAiRecommendations = () => {
    localStorage.removeItem('aiRecommendations')
    localStorage.removeItem('aiProfile')
    setUseAiRecommendations(false)
    fetchRecommendations()
  }

  const progressPercentage = Math.min((userStats.recipesCompleted / 15) * 100, 100)

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

      <button
        onClick={() => setShowAiChat(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.4)',
          zIndex: 100,
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        👨‍🍳
      </button>

      {showAiChat && (
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
          zIndex: 200
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#92400e', margin: 0 }}>🧑‍🍳 Personal Chef Assistant</h2>
              <button 
                onClick={() => setShowAiChat(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  color: '#92400e'
                }}
              >
                ✕
              </button>
            </div>
            <AiChatInterface 
              setShowAiChat={setShowAiChat} 
              fetchRecommendations={fetchRecommendations}
              setUseAiRecommendations={setUseAiRecommendations}
            />
          </div>
        </div>
      )}

      <div className="page-container">
        <h1 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
          Welcome Back, {userName}! 👨‍🍳
        </h1>
        <p style={{ color: '#78350f', marginBottom: '2rem' }}>Here's your cooking journey at a glance</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{userStats.recipesCompleted}</div>
            <div className="stat-label">Recipes Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userStats.skillLevel}</div>
            <div className="stat-label">Current Level</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userStats.xpPoints}</div>
            <div className="stat-label">XP Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userStats.achievements}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: '#92400e' }}>Your Skill Progress</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#78350f' }}>{userStats.skillLevel} → {userStats.skillLevel === 'Beginner' ? 'Intermediate' : 'Advanced'}</span>
              <span style={{ color: '#d97706', fontWeight: 'bold' }}>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#78350f', marginTop: '0.5rem' }}>
              Complete {15 - userStats.recipesCompleted} more recipes to level up!
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#92400e', margin: 0 }}>
            Recommended For You
            {localStorage.getItem('aiRecommendations') && (
              <span style={{ 
                marginLeft: '0.5rem', 
                fontSize: '0.8rem', 
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px'
              }}>
                ✨ AI Powered
              </span>
            )}
          </h2>
          {localStorage.getItem('aiRecommendations') && (
            <button 
              className="btn btn-secondary"
              onClick={handleResetAiRecommendations}
              style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
            >
              🔄 Reset to Default
            </button>
          )}
        </div>

        <div className="grid">
          {recommendedRecipes.length > 0 ? (
            recommendedRecipes.map((recipe) => (
              <div key={recipe.id} className="card recipe-card" onClick={() => {
                setCurrentPage('recipe')
              }}>
                <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>🍳</div>
                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.name}</h3>
                  <div className="recipe-meta">
                    <span>⏱️ {recipe.cook_time} min</span>
                    <span className={`difficulty-badge difficulty-${recipe.difficulty}`}>{recipe.difficulty}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: '#78350f', marginBottom: '1rem' }}>
                No recommendations yet. Click the chef assistant to get personalized suggestions!
              </p>
            </div>
          )}
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

function AiChatInterface({ setShowAiChat, fetchRecommendations, setUseAiRecommendations }) {
  const [step, setStep] = useState(0)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your personal chef assistant. Let me help you find the perfect recipes! What type of meal are you in the mood for today?" }
  ])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationData, setConversationData] = useState({
    moodPreference: '',
    timeAvailable: '',
    skillComfort: '',
    dietaryNeeds: ''
  })

  const questions = [
    "What type of meal are you in the mood for today? (e.g., comfort food, healthy, quick meal, fancy dinner)",
    "How much time do you have to cook? (e.g., under 20 minutes, 30-45 minutes, over an hour)",
    "What's your comfort level with cooking today? (e.g., want something easy, ready for a challenge, somewhere in between)",
    "Any dietary restrictions or preferences for today? (e.g., vegetarian, low-carb, no restrictions)"
  ]

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    const newMessages = [...messages, { role: 'user', content: userInput }]
    setMessages(newMessages)
    
    const dataKeys = ['moodPreference', 'timeAvailable', 'skillComfort', 'dietaryNeeds']
    const updatedData = { ...conversationData, [dataKeys[step]]: userInput }
    setConversationData(updatedData)
    
    setUserInput('')
    setLoading(true)

    if (step < questions.length - 1) {
      setTimeout(() => {
        setMessages([...newMessages, { role: 'assistant', content: questions[step + 1] }])
        setStep(step + 1)
        setLoading(false)
      }, 500)
    } else {
        await getAiRecommendations(updatedData, newMessages)
    }
  }

  const getAiRecommendations = async (data, currentMessages) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/recipes/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ conversationData: data })
      })

      if (response.ok) {
        const result = await response.json()

        localStorage.setItem('aiRecommendations', JSON.stringify(result.recommendations))
        localStorage.setItem('aiProfile', result.profile)
        
        setMessages([
          ...currentMessages,
          { 
            role: 'assistant', 
            content: `Perfect! Based on your preferences, here's what I recommend:\n\n${result.profile}\n\nI've updated your recommendations on the dashboard. Are you happy with these suggestions?` 
          }
        ])

        setStep(step + 1)
        setUseAiRecommendations(true)
      }
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
      setMessages([
        ...currentMessages,
        { role: 'assistant', content: 'Sorry, I had trouble getting recommendations. Please try again later.' }
      ])
    }
    setLoading(false)
  }

  const handleResponse = async (satisfied) => {
    if (satisfied) {
      setMessages([
        ...messages,
        { role: 'user', content: 'Yes, these look great!' },
        { role: 'assistant', content: 'Wonderful! Your personalized recommendations are now on your dashboard. Happy cooking! 👨‍🍳' }
      ])
      setTimeout(() => {
        fetchRecommendations()
        setShowAiChat(false)
      }, 2000)
    } else {
      setMessages([
        ...messages,
        { role: 'user', content: 'Not quite what I was looking for.' },
        { role: 'assistant', content: "No problem! Let's try again. " + questions[0] }
      ])
      setStep(0)
      setConversationData({
        moodPreference: '',
        timeAvailable: '',
        skillComfort: '',
        dietaryNeeds: ''
      })
    }
  }

  return (
    <div>
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto', 
        marginBottom: '1rem',
        padding: '1rem',
        background: '#fef3c7',
        borderRadius: '8px'
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              background: msg.role === 'user' ? '#d97706' : 'white',
              color: msg.role === 'user' ? 'white' : '#92400e',
              borderRadius: '8px',
              marginLeft: msg.role === 'user' ? '2rem' : '0',
              marginRight: msg.role === 'user' ? '0' : '2rem'
            }}
          >
            <strong>{msg.role === 'user' ? 'You' : '👨‍🍳 Chef'}:</strong>
            <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-line' }}>{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', color: '#d97706' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
          </div>
        )}
      </div>

      {step < questions.length && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your answer..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
            disabled={loading}
          />
          <button 
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={loading || !userInput.trim()}
          >
            Send
          </button>
        </div>
      )}

      {step === questions.length && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={() => handleResponse(true)}
          >
            ✓ Yes, Perfect!
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleResponse(false)}
          >
            ✗ Try Again
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard