import { useState, useEffect } from 'react'
import './App.css'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import RecipeDetail from './pages/RecipeDetail'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Progress from './pages/Progress'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedRecipeId, setSelectedRecipeId] = useState(null)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token & user) {
      setIsAuthenticated(true)
      checkOnboardingStatus()
    }
  }, [])

  const checkOnboardingStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setHasCompletedOnboarding(!!data.user.skill_level)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
      return <Auth setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} setHasCompletedOnboarding={setHasCompletedOnboarding}/>
    } 

    if (isAuthenticated && !hasCompletedOnboarding && currentPage !== 'onboarding' && currentPage !== 'auth') {
      return <Onboarding setCurrentPage={setCurrentPage} setHasCompletedOnboarding={setHasCompletedOnboarding} />
    }

    switch (currentPage) {
      case 'landing':
        return <Landing setCurrentPage={setCurrentPage} />
      case 'auth':
        return <Auth setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} setHasCompletedOnboarding={setHasCompletedOnboarding} />
      case 'onboarding':
        return <Onboarding setCurrentPage={setCurrentPage} setHasCompletedOnboarding={setHasCompletedOnboarding} />
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />
      case 'discover':
        return <Discover setCurrentPage={setCurrentPage} setSelectedRecipeId={setSelectedRecipeId} />
      case 'recipe':
        return <RecipeDetail setCurrentPage={setCurrentPage} recipeId={selectedRecipeId} />
      case 'progress':
        return <Progress setCurrentPage={setCurrentPage} />
      case 'profile':
        return <Profile setCurrentPage={setCurrentPage }/>
      default:
        return <Landing setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className='app'>
      {renderPage()}
    </div>
  )
}

export default App
