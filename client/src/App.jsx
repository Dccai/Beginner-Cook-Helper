import { useState } from 'react'
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

  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'landing' && currentPage !== 'auth') {
      return <Auth setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />
    } 

    switch (currentPage) {
      case 'landing':
        return <Landing setCurrentPage={setCurrentPage} />
      case 'auth':
        return <Auth setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />
      case 'onboarding':
        return <Onboarding setCurrentPage={setCurrentPage} />
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
