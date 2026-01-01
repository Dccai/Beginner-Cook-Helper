import { useState } from 'react'

function Profile({ setCurrentPage }) {
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Dean Chen',
    email: 'dean@example.com',
    skillLevel: 'Beginner',
    favoriteType: 'Japanese',
    dietaryRestrictions: ['Vegetarian']
  })

  const handleSave = () => {
    // Add API call to update profile
    setEditMode(false)
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
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
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
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
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
                    {profileData.dietaryRestrictions.map((restriction) => (
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
                    ))}
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
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Add API call to delete account
                alert('Account deletion would happen here')
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile