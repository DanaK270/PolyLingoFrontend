import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Discussion2 from './Discussion2' // Ensure this component exists

const Main = ({ issues, setIssues }) => {
  const [languages, setLanguages] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [loading, setLoading] = useState(false)

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

  const handleLanguageClick = async (languageId) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:3001/language/languages/${languageId}`
      )
      setSelectedLanguage(response.data)
      setSelectedLesson(null) // Reset lesson when changing language
    } catch (error) {
      console.error('Error fetching language details', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = async (lessonId) => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:3001/language/lesson/${lessonId}`
      )
      setSelectedLesson(response.data)
    } catch (error) {
      console.error('Error fetching lesson details', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Languages</h2>
      {loading && <p>Loading...</p>} {/* Show loading text */}
      <ul>
        {languages.map((language) => (
          <li key={language._id}>
            <button onClick={() => handleLanguageClick(language._id)}>
              {language.languagename}
            </button>
          </li>
        ))}
      </ul>
      {selectedLanguage && (
        <div>
          <h3>{selectedLanguage.languagename} Details</h3>
          <p>{selectedLanguage.description}</p>
          <ul>
            {selectedLanguage.fields.map((lesson) => (
              <li key={lesson._id}>
                <button onClick={() => handleLessonClick(lesson._id)}>
                  {lesson.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedLesson && (
        <div>
          <h3>{selectedLesson.name} Details</h3>
          <p>{selectedLesson.description}</p>
          {selectedLesson.video && selectedLesson.video.length > 0 && (
            <div>
              <h4>Videos</h4>
              {selectedLesson.video.map((video, index) => (
                <video key={index} src={video.url} controls />
              ))}
            </div>
          )}
          <div>
            <div>
              
              <Discussion2
                selectedLesson={selectedLesson}
                issues={issues}
                setIssues={setIssues}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Main
