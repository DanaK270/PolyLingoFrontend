import React, { useEffect, useState } from 'react'
import {
  createExercise,
  getExerciseById,
  updateExercise
} from '../services/exerise'
import { useNavigate, useParams } from 'react-router-dom'

const ExerciseForm = () => {
  const [exerciseData, setExerciseData] = useState({
    lessonId: '',
    question: '',
    correctAnswer: '',
    options: ['', '', '', ''],
    hints: ''
  })
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (id) fetchExercise()
  }, [id])

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
        <label>Lesson ID:</label>
        <input
          type="text"
          name="lessonId"
          value={exerciseData.lessonId}
          onChange={handleChange}
          required
        />

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
