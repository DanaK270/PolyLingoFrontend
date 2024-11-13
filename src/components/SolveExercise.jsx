import React, { useState } from 'react'

const SolveExercise = ({ exercise, onAnswerSubmit, isCompleted }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleOptionChange = (option) => {
    setSelectedAnswer(option)
    if (!isAnswered) {
      const points = option === exercise.correctAnswer ? 10 : 0
      onAnswerSubmit(points) // Pass points to parent
      setIsAnswered(true) // Prevent further submissions
    }
  }

  return (
    <div className="exercise-card">
      <p>
        <strong>Question:</strong> {exercise.question}
      </p>
      {exercise.options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name={`exercise-${exercise._id}`}
              value={option}
              onChange={() => handleOptionChange(option)}
              disabled={isCompleted || isAnswered}
            />
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}

export default SolveExercise
