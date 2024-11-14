import React, { useEffect, useState } from 'react'
import {
  createExercise,
  getExerciseById,
  updateExercise
} from '../services/exerise'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const ExerciseForm = () => {
  const [exerciseData, setExerciseData] = useState({
    lessonId: '',
    question: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    hints: ''
  })
  const [lessons, setLessons] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchLessons()
    if (id) fetchExercise()
  }, [id])

  const fetchLessons = async () => {
    try {
      const res = await axios.get('http://localhost:3001/language/lessons')
      setLessons(res.data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const fetchExercise = async () => {
    const response = await getExerciseById(id)
    setExerciseData(response.data.data)
  }

  const handleChange = (e) => {
    setExerciseData({ ...exerciseData, [e.target.name]: e.target.value })
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...exerciseData.options]
    newOptions[index] = value
    setExerciseData({ ...exerciseData, options: newOptions })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (id) {
      await updateExercise(id, exerciseData)
    } else {
      await createExercise(exerciseData)
    }
    navigate('/')
  }

  return (
    <div className="exercise-form-container">
      <h2 className="exercise-form-title">{id ? 'Edit' : 'Add'} Exercise</h2>
      <form onSubmit={handleSubmit} className="exercise-form">
        
        <div className="exercise-form-input-group">
          <label className="exercise-form-label">Lesson:</label>
          <select
            name="lessonId"
            value={exerciseData.lessonId}
            onChange={handleChange}
            required
            className="exercise-form-input"
          >
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson._id} value={lesson._id}>
                {lesson.name}
              </option>
            ))}
          </select>
        </div>

        <div className="exercise-form-input-group">
          <label className="exercise-form-label">Question:</label>
          <input
            name="question"
            value={exerciseData.question}
            onChange={handleChange}
            required
            className="exercise-form-input"
          />
        </div>

        <div className="exercise-form-input-group">
          <label className="exercise-form-label">Correct Answer:</label>
          <input
            type="text"
            name="correctAnswer"
            value={exerciseData.correctAnswer}
            onChange={handleChange}
            required
            className="exercise-form-input"
          />
        </div>

        <div className="exercise-form-input-group">
          <label className="exercise-form-label">Options:</label>
          {exerciseData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="exercise-form-input"
            />
          ))}
        </div>

        <div className="exercise-form-input-group">
          <label className="exercise-form-label">Hint:</label>
          <input
            name="hints"
            value={exerciseData.hints}
            onChange={handleChange}
            className="exercise-form-input"
          />
        </div>

        <button type="submit" className="exercise-form-submit-btn">
          Save
        </button>
      </form>
    </div>
  )
}

export default ExerciseForm
