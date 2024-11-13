import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const BASE_URL = 'http://localhost:3001' // Ensure this is defined

const Main = () => {
  const [languages, setLanguages] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLanguagesAndProgress = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          'http://localhost:3001/language/languages'
        )
        setLanguages(response.data)

        const token = localStorage.getItem('token')
        if (token) {
          const progressResponse = await axios.get(
            'http://localhost:3001/userProgress',
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          setUserProgress(progressResponse.data.data) // Store user progress data
        }
      } catch (error) {
        console.error('Error fetching languages', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLanguagesAndProgress()
  }, [])

  // Function to start learning a new language
  const startLearning = async (languageId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // Redirect to sign-in if user is not logged in
        navigate('/sign-in')
        return
      }

      // Check if user is already learning this language
      const isAlreadyLearning = userProgress.some(
        (progress) => progress.language_id._id === languageId
      )
      if (isAlreadyLearning) {
        alert('You are already learning this language!')
        return
      }

      // Call createUserProgress endpoint
      await axios.post(
        'http://localhost:3001/userProgress',
        { language_id: languageId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert('You have started learning this language!')

      // Update userProgress to include the new language
      setUserProgress([
        ...userProgress,
        { language_id: { _id: languageId } } // Add the new language progress
      ])
    } catch (error) {
      console.error('Error starting new language:', error)
      alert('Error starting the language. Please try again.')
    }
  }

  const handleDelete = async (languageId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this language?'
    )
    if (!confirmDelete) return

    try {
      await axios.delete(`${BASE_URL}/language/languages/${languageId}`)
      setLanguages(languages.filter((language) => language._id !== languageId))
      alert('Language deleted successfully!')
    } catch (error) {
      console.error('Error deleting language:', error)
      alert('Failed to delete language. Please try again.')
    }
  }

  return (
    <div className="container">
      <h2>Languages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card-stack">
          {languages.map((language) => (
            <div key={language._id} className="card">
              <div className="card-icon">🌐</div>
              <h3>{language.languagename}</h3>
              <p>{language.description}</p>
              <Link to={`/languages/${language._id}`} className="button">
                View Lessons
              </Link>
              <Link to={`/update/${language._id}`} className="button">
                Update
              </Link>

              <button
                onClick={() => startLearning(language._id)}
                className="button"
              >
                Start Learning
              </button>

              <button
                onClick={() => handleDelete(language._id)}
                className="button delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Main