import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Discussion2 from './Discussion2'
import UserNotes from './UserNotes'

const LessonDetails = ({ issues, setIssues, userId, user }) => {
  const { lessonId } = useParams()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(false)
  const [languageId, setLanguageId] = useState(null)
  const [userProgress, setUserProgress] = useState(null)

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

    const fetchLanguageId = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/language/languages'
        )
        const languages = response.data

        const language = languages.find((lang) =>
          lang.fields.some((field) => field._id === lessonId)
        )
        if (language) {
          setLanguageId(language._id)
          await fetchUserProgress(language._id) // Fetch user progress once languageId is determined
        } else {
          console.error('Language not found for the given lesson ID')
        }
      } catch (error) {
        console.error('Error fetching languages', error)
      }
    }

    const fetchUserProgress = async (languageId) => {
      try {
        const userProgressResponse = await axios.get(
          `http://localhost:3001/userProgress/${languageId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setUserProgress(userProgressResponse?.data.data)
      } catch (error) {
        console.error('Error fetching user progress', error)
      }
    }

    fetchLesson()
    fetchLanguageId()
  }, [lessonId])

  const completeLesson = async () => {
    try {
      const userProgressId = userProgress._id
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

      // Update userProgress state locally to reflect completion
      setUserProgress({
        ...userProgress,
        completedLessons: [...userProgress.completedLessons, { _id: lessonId }]
      })
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
        {user.role !== 'admin' &&
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
        <UserNotes userId={userId} />
      </div>
    </div>
  )
}

export default LessonDetails