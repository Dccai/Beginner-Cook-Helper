import { useState, useEffect } from 'react'

function Progress({ setCurrentPage }) {
  const [stats, setStats] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [difficultyProgress, setDifficultyProgress] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/recipes/progress/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivities(data.recentActivities)
        setDifficultyProgress(data.difficultyProgress)
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      'recipe_viewed': '👀',
      'recipe_started': '🎯',
      'recipe_completed': '✅',
      'profile_updated': '👤',
      'login': '🔐',
      'search': '🔍'
    }
    return icons[type] || '📝'
  }

  const getActivityDescription = (activity) => {
    const types = {
      'recipe_viewed': 'Viewed a recipe',
      'recipe_started': 'Started cooking',
      'recipe_completed': 'Completed a recipe',
      'profile_updated': 'Updated profile',
      'login': 'Logged in',
      'search': 'Searched recipes'
    }
    return types[activity.activityType] || activity.activityType
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
        <div className="navbar">
          <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>🍳 Cooking Helper</div>
          <div className="navbar-links">
            <span className="nav-link" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
            <span className="nav-link" onClick={() => setCurrentPage('discover')}>Discover</span>
            <span className="nav-link active" onClick={() => setCurrentPage('progress')}>Progress</span>
            <span className="nav-link" onClick={() => setCurrentPage('profile')}>Profile</span>
          </div>
        </div>
        <div className="loading"><div className="spinner"></div></div>
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
          <span className="nav-link active" onClick={() => setCurrentPage('progress')}>Progress</span>
          <span className="nav-link" onClick={() => setCurrentPage('profile')}>Profile</span>
        </div>
      </div>

      <div className="page-container">
        <h1 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Your Progress</h1>
        <p style={{ color: '#78350f', marginBottom: '2rem' }}>Track your cooking journey and achievements</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{stats?.completed_count || 0}</div>
            <div className="stat-label">Recipes Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.in_progress_count || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.saved_count || 0}</div>
            <div className="stat-label">Saved Recipes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {stats?.avg_rating ? parseFloat(stats.avg_rating).toFixed(1) : 'N/A'}
            </div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>Recent Activity</h2>
            <div className="card">
              {recentActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#78350f' }}>
                  <p>No activity yet. Start cooking to see your progress!</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setCurrentPage('discover')}
                    style={{ marginTop: '1rem' }}
                  >
                    Browse Recipes
                  </button>
                </div>
              ) : (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={activity._id || index}
                      style={{ 
                        padding: '1rem',
                        borderBottom: index < recentActivities.length - 1 ? '1px solid #f3f4f6' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ fontSize: '2rem' }}>
                        {getActivityIcon(activity.activityType)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#92400e', fontWeight: '500' }}>
                          {getActivityDescription(activity)}
                        </div>
                        {activity.metadata?.recipeName && (
                          <div style={{ color: '#78350f', fontSize: '0.9rem' }}>
                            {activity.metadata.recipeName}
                          </div>
                        )}
                        {activity.metadata?.query && (
                          <div style={{ color: '#78350f', fontSize: '0.9rem' }}>
                            Searched: "{activity.metadata.query}"
                          </div>
                        )}
                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>Difficulty Breakdown</h2>
            <div className="card">
              {difficultyProgress.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#78350f' }}>
                  <p>Complete recipes to see your difficulty breakdown</p>
                </div>
              ) : (
                <div>
                  {difficultyProgress.map((item) => {
                    const total = difficultyProgress.reduce((sum, d) => sum + parseInt(d.count), 0)
                    const percentage = total > 0 ? (parseInt(item.count) / total) * 100 : 0
                    
                    return (
                      <div key={item.difficulty} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ 
                            color: '#92400e', 
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {item.difficulty}
                          </span>
                          <span style={{ color: '#d97706', fontWeight: 'bold' }}>
                            {item.count} recipes
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <h2 style={{ color: '#92400e', marginBottom: '1rem', marginTop: '2rem' }}>Quick Stats</h2>
            <div className="card">
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ color: '#78350f', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Success Rate
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                  {stats?.completed_count > 0 
                    ? Math.round((stats.completed_count / (stats.completed_count + (stats.in_progress_count || 0))) * 100) 
                    : 0}%
                </div>
              </div>
              <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ color: '#78350f', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Total Activities
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                  {recentActivities.length}
                </div>
              </div>
              <div>
                <div style={{ color: '#78350f', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Avg Rating Given
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                  {stats?.avg_rating ? `${parseFloat(stats.avg_rating).toFixed(1)} ⭐` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
          <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>Keep Going! 🎉</h2>
          <p style={{ color: '#78350f', marginBottom: '1.5rem' }}>
            You're making great progress on your cooking journey. Ready for your next challenge?
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentPage('discover')}
          >
            Discover New Recipes
          </button>
        </div>
      </div>
    </div>
  )
}

export default Progress