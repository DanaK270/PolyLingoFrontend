import React, { useEffect, useState } from 'react'
import { getExerciseById } from '../services/exerise'
import { useParams, Link } from 'react-router-dom'

const ExerciseDetail = () => {
  const { id } = useParams()
  const [exercise, setExercise] = useState(null)

  useEffect(() => {
    fetchExercise()
  }, [id])

  const fetchExercise = async () => {
    const response = await getExerciseById(id)
    setExercise(response.data.data)
  }

  if (!exercise) return <div>Loading...</div>

  return (
    <div>
      <h2>Exercise Detail</h2>
      <p>
        <strong>Lesson ID:</strong> {exercise.lessonId}
      </p>
      <p>
        <strong>Question:</strong> {exercise.question}
      </p>
      <p>
        <strong>Correct Answer:</strong> {exercise.correctAnswer}
      </p>
      <p>
        <strong>Options:</strong> {exercise.options.join(', ')}
      </p>
      <p>
        <strong>Hints:</strong> {exercise.hints}
      </p>
      <Link to={`/exercises/edit/${exercise._id}`} className="btn btn-primary">
        Edit Exercise
      </Link>
    </div>
  )
}

export default ExerciseDetail
