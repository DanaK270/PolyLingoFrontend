import React, { useEffect, useState } from 'react'
import { getExercises, deleteExercise } from '../services/exerise'
import { Link } from 'react-router-dom'

const ExerciseList = () => {
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    const response = await getExercises()
    setExercises(response.data.data)
  }

  const handleDelete = async (id) => {
    await deleteExercise(id)
    fetchExercises() // Refresh list after deletion
  }

  return (
    <div>
      <h2>Exercises</h2>
      <Link to="/exercises/add" className="btn btn-primary">
        Add Exercise
      </Link>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise._id}>
            <Link to={`/exercises/${exercise._id}`}>{exercise.question}</Link>
            <button onClick={() => handleDelete(exercise._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ExerciseList
