import { useState } from 'react'

function Auth({ setCurrentPage, setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add API call for authentication
    console.log('Form submitted:', formData)
    setIsAuthenticated(true)
    setCurrentPage('onboarding')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{ background: '#faf8f5'}}>
      <div className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('landing')}>
          🍳 Cooking Helper
        </div>
        <div className="navbar-links">
          <button className="btn btn-secondary" onClick={() => setCurrentPage('landing')}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#92400e' }}>
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
        </h2>
        <p style={{ textAlign: 'center', color: '#78350f', marginBottom: '2rem' }}>
          {isLogin ? 'Sign in to continue your cooking journey' : 'Join thousands of home cooks'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label style={{ color: '#92400e', fontWeight: '600' }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label style={{ color: '#92400e', fontWeight: '600' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label style={{ color: '#92400e', fontWeight: '600' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {!isLogin && (
              <small style={{ color: '#78350f', fontSize: '0.85rem' }}>
                Must be at least 8 characters long
              </small>
            )}
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <a 
                href="#" 
                style={{ color: '#d97706', fontSize: '0.9rem', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault()
                  alert('Password reset would be implemented here')
                }}
              >
                Forgot password?
              </a>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem', 
          padding: '1rem 0', 
          borderTop: '1px solid #f3f4f6' 
        }}>
          <p style={{ color: '#78350f' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                color: '#d97706', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth