import { useState } from 'react'

function Onboarding({ setCurrentPage, setHasCompletedOnboarding }) {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState({
    experience: '',
    cookingFrequency: '',
    favoriteType: '',
    dietaryRestrictions: []
  })

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            skill_level: answers.experience,
            cooking_frequency: answers.cookingFrequency,
            favorite_cuisine: answers.favoriteType,
            dietary_restrictions: answers.dietaryRestrictions
          })
        })

        if (response.ok) {
          setHasCompletedOnboarding(true)
          setCurrentPage('dashboard')
        } else {
          alert('Failed to save profile')
        }
      } catch (error) {
        console.error('Profile save error:', error)
        alert('Error saving profile')
      }
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div style={{ background: '#faf8f5', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="navbar">
        <div className="navbar-logo">🍳 Cooking Helper</div>
      </div>

      <div className="form-container" style={{ maxWidth: '600px', marginTop: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center', color: '#92400e', marginBottom: '0.5rem' }}>
          Let's Get to Know You
        </h2>
        <p style={{ textAlign: 'center', color: '#78350f', marginBottom: '2rem' }}>
          Step {step} of 4
        </p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#92400e' }}>What's your cooking experience?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {[
                { level: 'Beginner', desc: 'I can make basic meals like pasta or scrambled eggs' },
                { level: 'Intermediate', desc: 'I can follow most recipes and cook several dishes' },
                { level: 'Advanced', desc: 'I can improvise and create complex meals' }
              ].map(({ level, desc }) => (
                <button
                  key={level}
                  className="card"
                  style={{ 
                    cursor: 'pointer',
                    border: answers.experience === level ? '3px solid #d97706' : '1px solid #f3f4f6',
                    textAlign: 'left'
                  }}
                  onClick={() => setAnswers({ ...answers, experience: level })}
                >
                  <strong style={{ color: '#92400e' }}>{level}</strong>
                  <p style={{ fontSize: '0.9rem', color: '#78350f', marginTop: '0.5rem', margin: 0 }}>
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#92400e' }}>How often do you cook?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {['Rarely', 'A few times a week', 'Almost daily'].map((freq) => (
                <button
                  key={freq}
                  className="card"
                  style={{ 
                    cursor: 'pointer',
                    border: answers.cookingFrequency === freq ? '3px solid #d97706' : '1px solid #f3f4f6'
                  }}
                  onClick={() => setAnswers({ ...answers, cookingFrequency: freq })}
                >
                  <strong style={{ color: '#92400e' }}>{freq}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#92400e' }}>What type of food do you enjoy?</h3>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {['Italian', 'Asian', 'Mexican', 'American', 'Mediterranean', 'Other'].map((type) => (
                <button
                  key={type}
                  className="card"
                  style={{ 
                    cursor: 'pointer',
                    padding: '1.5rem',
                    border: answers.favoriteType === type ? '3px solid #d97706' : '1px solid #f3f4f6'
                  }}
                  onClick={() => setAnswers({ ...answers, favoriteType: type })}
                >
                  <strong style={{ color: '#92400e' }}>{type}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#92400e' }}>Any dietary restrictions?</h3>
            <p style={{ color: '#78350f', fontSize: '0.9rem' }}>Select all that apply</p>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut Allergies'].map((restriction) => (
                <button
                  key={restriction}
                  className="card"
                  style={{ 
                    cursor: 'pointer',
                    padding: '1.5rem',
                    border: answers.dietaryRestrictions.includes(restriction) ? '3px solid #d97706' : '1px solid #f3f4f6'
                  }}
                  onClick={() => {
                    const current = answers.dietaryRestrictions
                    if (current.includes(restriction)) {
                      setAnswers({ ...answers, dietaryRestrictions: current.filter(r => r !== restriction) })
                    } else {
                      setAnswers({ ...answers, dietaryRestrictions: [...current, restriction] })
                    }
                  }}
                >
                  <strong style={{ color: '#92400e' }}>{restriction}</strong>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={step === 1}
            style={{ opacity: step === 1 ? 0.5 : 1 }}
          >
            Back
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding