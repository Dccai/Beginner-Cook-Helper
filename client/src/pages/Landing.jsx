function Landing({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('landing')}>
            <span className="text-5xl animate-pan-shake">🍳</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Cooking Helper
            </span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentPage('auth')}
              className="px-6 py-2 rounded-full border-2 border-orange-500 text-orange-600 font-semibold hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            >
              Sign In
            </button>
            <button 
              onClick={() => setCurrentPage('auth')}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse-glow"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 animate-gradient">
        <div className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                  Learn to Cook
                </span>
                <br />
                <span className="text-orange-900">with Confidence</span>
              </h1>
              <p className="text-xl text-orange-800 leading-relaxed">
                Discover recipes tailored to your skill level. Track your progress 
                as you grow from beginner to expert chef. Start your culinary journey today.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setCurrentPage('auth')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Start Cooking 🔥
                </button>
                <button 
                  onClick={() => setCurrentPage('discover')}
                  className="px-8 py-4 rounded-full bg-white text-orange-600 font-bold text-lg border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 hover:scale-105"
                >
                  Browse Recipes
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl animate-float">👨‍🍳</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#faf8f5" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      <div className="py-20 px-8 bg-gradient-to-b from-orange-50 to-amber-50">
        <h2 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
          Everything You Need to Succeed
        </h2>
        <p className="text-center text-orange-600 mb-16 text-lg">
          Your complete cooking companion
        </p>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: '📊', title: 'Personalized Assessment', desc: 'AI-powered skill evaluation' },
            { icon: '⏱️', title: 'Step-by-Step Guidance', desc: 'Never feel lost while cooking' },
            { icon: '📈', title: 'Track Your Growth', desc: 'Watch your skills improve' },
            { icon: '🎯', title: 'Smart Recommendations', desc: 'Perfect recipes for you' },
            { icon: '📚', title: 'Recipe Library', desc: 'Hundreds of delicious options' },
            { icon: '🏆', title: 'Achievements', desc: 'Celebrate your progress' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="group bg-white rounded-3xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-orange-900 mb-3">{feature.title}</h3>
              <p className="text-orange-700 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative py-20 px-8 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 animate-gradient overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Start Your Cooking Journey?
          </h2>
          <p className="text-2xl text-orange-100 mb-8">
            Join thousands of home cooks improving their skills every day
          </p>
          <button 
            onClick={() => setCurrentPage('auth')}
            className="px-12 py-5 rounded-full bg-white text-orange-600 font-bold text-xl hover:bg-orange-50 transition-all duration-300 hover:scale-110 shadow-2xl"
          >
            Get Started for Free ✨
          </button>
        </div>
      </div>

      <footer className="bg-orange-900 text-orange-100 py-8 text-center">
        <p className="text-lg">© 2025 Cooking Helper. All rights reserved. 🍳</p>
      </footer>
    </div>
  )
}

export default Landing