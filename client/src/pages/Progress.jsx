function Progress({ setCurrentPage }) {
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

        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ color: '#92400e' }}>Progress tracking coming soon!</h2>
          <p style={{ color: '#78350f' }}>We're building an amazing progress dashboard for you.</p>
        </div>
      </div>
    </div>
  )
}

export default Progress