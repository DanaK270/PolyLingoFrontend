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
      const res = await axios.get('http://localhost:3001/lessons')
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
    <div>
      <h2>{id ? 'Edit' : 'Add'} Exercise</h2>
      <form onSubmit={handleSubmit}>
        <label>Lesson:</label>
        <select
          name="lessonId"
          value={exerciseData.lessonId}
          onChange={handleChange}
          required
        >
          <option value="">Select a lesson</option>
          {lessons.map((lesson) => (
            <option key={lesson._id} value={lesson._id}>
              {lesson.title}
            </option>
          ))}
        </select>

        <label>Question:</label>
        <textarea
          name="question"
          value={exerciseData.question}
          onChange={handleChange}
          required
        />

        <label>Correct Answer:</label>
        <input
          type="text"
          name="correctAnswer"
          value={exerciseData.correctAnswer}
          onChange={handleChange}
          required
        />

        <label>Options:</label>
        {exerciseData.options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}

        <label>Hints:</label>
        <textarea
          name="hints"
          value={exerciseData.hints}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default ExerciseForm
