import { useState, useEffect } from 'react'

function Profile({ setCurrentPage }) {
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    skillLevel: '',
    favoriteType: '',
    dietaryRestrictions: []
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          skillLevel: data.user.skill_level || 'Beginner',
          favoriteType: data.user.favorite_cuisine || 'Italian',
          dietaryRestrictions: data.user.dietary_restrictions || []
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          skill_level: profileData.skillLevel,
          favorite_cuisine: profileData.favoriteType,
          dietary_restrictions: profileData.dietaryRestrictions
        })
      })

      if (response.ok) {
        const user = JSON.parse(localStorage.getItem('user'))
        user.name = profileData.name
        localStorage.setItem('user', JSON.stringify(user))
        
        setEditMode(false)
        alert('Profile updated successfully!')
      } else {
        alert('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    )
    
    if (!confirmDelete) return

    const doubleConfirm = window.prompt(
      'Please type "DELETE" in all caps to confirm account deletion:'
    )
    
    if (doubleConfirm !== 'DELETE') {
      alert('Account deletion cancelled. You must type "DELETE" exactly.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        alert('Your account has been permanently deleted.')
        setCurrentPage('landing')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
        <div className="navbar">
          <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>
            🍳 Cooking Helper
          </div>
          <div className="navbar-links">
            <span className="nav-link" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
            <span className="nav-link" onClick={() => setCurrentPage('discover')}>Discover</span>
            <span className="nav-link" onClick={() => setCurrentPage('progress')}>Progress</span>
            <span className="nav-link active" onClick={() => setCurrentPage('profile')}>Profile</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh' }}>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('dashboard')}>
          🍳 Cooking Helper
        </div>
        <div className="navbar-links">
          <span className="nav-link" onClick={() => setCurrentPage('dashboard')}>Dashboard</span>
          <span className="nav-link" onClick={() => setCurrentPage('discover')}>Discover</span>
          <span className="nav-link" onClick={() => setCurrentPage('progress')}>Progress</span>
          <span className="nav-link active" onClick={() => setCurrentPage('profile')}>Profile</span>
        </div>
      </div>

      <div className="page-container">
        <h1 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Profile Settings</h1>
        <p style={{ color: '#78350f', marginBottom: '2rem' }}>
          Manage your account information and preferences
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: '#92400e' }}>Personal Information</h2>
              {!editMode ? (
                <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" onClick={() => { setEditMode(false); fetchProfile(); }}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {editMode ? (
              <div>
                <div className="form-group">
                  <label style={{ color: '#92400e', fontWeight: '600' }}>Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: '#92400e', fontWeight: '600' }}>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#78350f', fontSize: '0.85rem' }}>
                    Email cannot be changed
                  </small>
                </div>
                <div className="form-group">
                  <label style={{ color: '#92400e', fontWeight: '600' }}>Skill Level</label>
                  <select
                    value={profileData.skillLevel}
                    onChange={(e) => setProfileData({ ...profileData, skillLevel: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ color: '#92400e', fontWeight: '600' }}>Favorite Cuisine</label>
                  <select
                    value={profileData.favoriteType}
                    onChange={(e) => setProfileData({ ...profileData, favoriteType: e.target.value })}
                  >
                    <option>Italian</option>
                    <option>Asian</option>
                    <option>Mexican</option>
                    <option>American</option>
                    <option>Mediterranean</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <label style={{ color: '#78350f', fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>
                    Full Name
                  </label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#92400e' }}>
                    {profileData.name}
                  </p>
                </div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <label style={{ color: '#78350f', fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>
                    Email Address
                  </label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#92400e' }}>
                    {profileData.email}
                  </p>
                </div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <label style={{ color: '#78350f', fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>
                    Current Skill Level
                  </label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#92400e' }}>
                    {profileData.skillLevel}
                  </p>
                </div>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  <label style={{ color: '#78350f', fontSize: '0.9rem', display: 'block', marginBottom: '0.3rem' }}>
                    Favorite Cuisine
                  </label>
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#92400e' }}>
                    {profileData.favoriteType}
                  </p>
                </div>
                <div>
                  <label style={{ color: '#78350f', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                    Dietary Restrictions
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {profileData.dietaryRestrictions.length > 0 ? (
                      profileData.dietaryRestrictions.map((restriction) => (
                        <span
                          key={restriction}
                          style={{
                            padding: '0.4rem 1rem',
                            background: '#fef3c7',
                            color: '#92400e',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                          }}
                        >
                          {restriction}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#78350f', fontStyle: 'italic' }}>None specified</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Account Stats</h3>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#78350f', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  Member Since
                </div>
                <div style={{ fontWeight: '600', color: '#92400e' }}>January 2025</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#78350f', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  Total Recipes
                </div>
                <div style={{ fontWeight: '600', color: '#92400e' }}>12 Completed</div>
              </div>
              <div>
                <div style={{ color: '#78350f', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  Current Streak
                </div>
                <div style={{ fontWeight: '600', color: '#92400e' }}>🔥 5 Days</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Preferences</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    style={{ accentColor: '#d97706' }}
                  />
                  <span style={{ color: '#78350f' }}>Email notifications</span>
                </label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    defaultChecked
                    style={{ accentColor: '#d97706' }}
                  />
                  <span style={{ color: '#78350f' }}>Recipe recommendations</span>
                </label>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox"
                    style={{ accentColor: '#d97706' }}
                  />
                  <span style={{ color: '#78350f' }}>Weekly summary</span>
                </label>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Quick Actions</h3>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginBottom: '0.5rem' }}
                onClick={() => setCurrentPage('progress')}
              >
                View Progress
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={() => setCurrentPage('discover')}
              >
                Browse Recipes
              </button>
            </div>
          </div>
        </div>

        <div 
          className="card" 
          style={{ 
            marginTop: '2rem', 
            borderLeft: '4px solid #dc2626',
            background: '#fef2f2'
          }}
        >
          <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Danger Zone</h3>
          <p style={{ color: '#7f1d1d', marginBottom: '1rem' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button 
            className="btn" 
            style={{ 
              background: '#dc2626', 
              color: 'white',
              border: 'none'
            }}
            onClick={handleDeleteAccount}
          >
            Delete Account Permanently
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile