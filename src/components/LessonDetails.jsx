import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Discussion2 from './Discussion2'

const LessonDetails = ({ issues, setIssues }) => {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [languageId, setLanguageId] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          `http://localhost:3001/language/lesson/${lessonId}`
        )
        setLesson(response.data)
      } catch (error) {
        console.error('Error fetching lesson details', error)
      } finally {
        setLoading(false)
      }
    }

    // Fetch language associated with this lesson to get the languageId
    const fetchLanguageId = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/language/languages'
        )
        const languages = response.data

        // Find language containing the current lesson
        const language = languages.find((lang) =>
          lang.fields.some((field) => field._id === lessonId)
        )
        if (language) {
          setLanguageId(language._id)
        } else {
          console.error('Language not found for the given lesson ID')
        }
      } catch (error) {
        console.error('Error fetching languages', error)
      }
    }

    // Fetch user progress and role for the specific language
    const fetchUserProgressAndRole = async () => {
      try {
        const token = localStorage.getItem('token')
        const userProgressResponse = await axios.get(
          `http://localhost:3001/userProgress/${languageId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setUserProgress(userProgressResponse.data.data)

        // Assuming user role is included in the payload when token is verified
        const userInfoResponse = await axios.get(
          'http://localhost:3001/user/info',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setUserRole(userInfoResponse.data.role)
      } catch (error) {
        console.error('Error fetching user progress or role', error)
      }
    }

    fetchLesson()
    fetchLanguageId()
    fetchUserProgressAndRole()
  }, [lessonId, languageId])

  // Function to handle marking the lesson as complete
  const completeLesson = async () => {
    try {
      const userProgressId = userProgress._id

      // Update user progress by adding the completed lesson and incrementing the streak
      await axios.put(
        `http://localhost:3001/userProgress/stats/${userProgressId}`,
        {
          completedLessonId: lessonId,
          points: 10,
          streak: userProgress.streak + 1
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )

      alert('Lesson marked as completed!')
      // Update local state to reflect lesson completion
      setUserProgress((prevProgress) => ({
        ...prevProgress,
        completedLessons: [...prevProgress.completedLessons, { _id: lessonId }]
      }))
    } catch (error) {
      console.error('Error completing the lesson', error)
      alert('Failed to mark the lesson as complete.')
    }
  }

  const isLessonCompleted = userProgress?.completedLessons.some(
    (lesson) => lesson._id === lessonId
  )

  if (loading) return <p className="loading-text">Loading...</p>
  if (!lesson) return <p className="error-text">Lesson not found.</p>

  return (
    <div className="lesson-details-container">
      <div className="lesson-card">
        <h3 className="lesson-name">{lesson.name} Details</h3>
        <p className="lesson-description">{lesson.description}</p>
        {lesson.video && lesson.video.length > 0 && (
          <div className="video-section">
            <h4 className="video-title">Videos</h4>
            {lesson.video.map((video, index) => (
              <video
                key={index}
                className="lesson-video"
                src={video.url}
                controls
              />
            ))}
          </div>
        )}
        {/* Display "Lesson Completed" if the lesson is already completed; otherwise, show the "Complete Lesson" button, but only if the user is not an admin */}
        {userRole !== 'admin' &&
          (isLessonCompleted ? (
            <p className="completed-text">Lesson Completed</p>
          ) : (
            <button className="complete-lesson-button" onClick={completeLesson}>
              Complete Lesson
            </button>
          ))}
        <Discussion2
          selectedLesson={lesson}
          issues={issues}
          setIssues={setIssues}
        />
      </div>
    </div>
  )
}

export default LessonDetails
