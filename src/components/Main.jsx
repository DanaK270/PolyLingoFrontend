import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Main = ({ user }) => {
  const [languages, setLanguages] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') // State to hold the search term
  const [searchType, setSearchType] = useState('languagename') // State to hold the filter type
  const BASE_URL = 'http://localhost:3001' // Ensure this is defined
  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          'http://localhost:3001/language/languages'
        )
        setLanguages(response.data)
      } catch (error) {
        console.error('Error fetching languages', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLanguages()
  }, [])

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

  // Filter languages based on search term and selected filter type
  const filteredLanguages = languages.filter((language) => {
    const fieldToSearch = language[searchType].toLowerCase()
    return fieldToSearch.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="container">
      <h2>Languages</h2>

      {/* Dropdown to choose search type */}
      <div className="search-controls">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-dropdown"
        >
          <option value="languagename">Language Name</option>
          <option value="difficulties">Difficulty</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search by ${searchType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="card-stack">
        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((language) => (
            <div key={language._id} className="card">
              <div className="difficulty-badge">{language.difficulties}</div>
              <div className="card-icon">🌐</div>
              <h3>{language.languagename}</h3>
              <p>{language.description}</p>
              {user.role === 'admin' && (
                <>
                  <Link to={`/languages/${language._id}`} className="button">
                    View Lessons
                  </Link>
                  <Link to={`/update/${language._id}`} className="button">
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(language._id)}
                    className="button delete-button"
                  >
                    Delete
                  </button>
                </>
              )}

              {user.role === 'user' && (
                <Link to={`/languages/${language._id}`} className="button">
                  <button
                    onClick={() => startLearning(language._id)}
                    className="button"
                  >
                    Start Learning
                  </button>
                </Link>
              )}
            </div>
          ))
        ) : (
          <p>No languages found.</p>
        )}
      </div>
    </div>
  )
}

export default Main
