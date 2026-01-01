function Landing({ setCurrentPage }) {
  return (
    <div className="landing">
      
      <div className="navbar">
        <div className="navbar-logo">
          🍳 Cooking Helper
        </div>
        <div className="navbar-links">
          <button className="btn btn-secondary" onClick={() => setCurrentPage('auth')}>
            Sign In
          </button>
          <button className="btn btn-primary" onClick={() => setCurrentPage('auth')}>
            Get Started
          </button>
        </div>
      </div>

      
      <div className="landing-header">
        <div className="landing-header-content">
          <div className="landing-text">
            <h1>Learn to Cook with Confidence</h1>
            <p>
              Discover recipes tailored to your skill level. Track your progress 
              as you grow from beginner to expert chef. Start your culinary journey today.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setCurrentPage('auth')}>
                Start Cooking
              </button>
              <button className="btn btn-secondary" onClick={() => setCurrentPage('discover')}>
                Browse Recipes
              </button>
            </div>
          </div>
          <div className="landing-image">
            👨‍🍳
          </div>
        </div>
      </div>

      
      <div className="page-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>
          Everything You Need to Succeed
        </h2>
        
        <div className="grid" style={{ marginTop: '3rem' }}>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Personalized Skill Assessment</h3>
            <p className="feature-description">
              Our intelligent system evaluates your cooking abilities and suggests 
              recipes that match your current skill level, helping you build confidence gradually.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3 className="feature-title">Step-by-Step Guidance</h3>
            <p className="feature-description">
              Follow detailed instructions with timing for each step. Never feel 
              lost or overwhelmed while cooking. We guide you through every recipe.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Track Your Growth</h3>
            <p className="feature-description">
              Watch your cooking skills improve over time. Earn achievements, 
              level up, and unlock more complex recipes as you progress.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Smart Recommendations</h3>
            <p className="feature-description">
              Get recipe suggestions based on your preferences, dietary restrictions, 
              and skill level. Find exactly what you want to cook, when you want it.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Comprehensive Recipe Library</h3>
            <p className="feature-description">
              Access hundreds of recipes from various cuisines. From quick weeknight 
              dinners to impressive weekend projects, we have it all.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Achievements & Milestones</h3>
            <p className="feature-description">
              Celebrate your progress with badges and achievements. Share your 
              culinary journey and see how far you've come.
            </p>
          </div>
        </div>
      </div>

      
      <div style={{ background: 'white', padding: '4rem 2rem', borderTop: '1px solid #f3f4f6' }}>
        <div className="page-container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            How It Works
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginTop: '3rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#fef3c7', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                1️⃣
              </div>
              <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Sign Up</h3>
              <p style={{ color: '#78350f' }}>
                Create your free account in just a few seconds
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#fef3c7', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                2️⃣
              </div>
              <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Take Assessment</h3>
              <p style={{ color: '#78350f' }}>
                Answer a few questions to help us understand your skill level
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#fef3c7', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                3️⃣
              </div>
              <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Start Cooking</h3>
              <p style={{ color: '#78350f' }}>
                Get personalized recipe recommendations and start your journey
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: '#fef3c7', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                margin: '0 auto 1rem'
              }}>
                4️⃣
              </div>
              <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>Level Up</h3>
              <p style={{ color: '#78350f' }}>
                Track your progress and unlock more challenging recipes
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div style={{ 
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        padding: '4rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#92400e', fontSize: '2.5rem', marginBottom: '1rem' }}>
          Ready to Start Your Cooking Journey?
        </h2>
        <p style={{ color: '#78350f', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Join thousands of home cooks improving their skills every day
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => setCurrentPage('auth')}
          style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}
        >
          Get Started for Free
        </button>
      </div>

      
      <div style={{ 
        background: '#78350f', 
        color: 'white', 
        padding: '2rem', 
        textAlign: 'center' 
      }}>
        <p>© 2025 Cooking Helper. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Landing