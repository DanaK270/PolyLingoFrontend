import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useParams } from 'react-router-dom'

// Register the ArcElement and other necessary components
ChartJS.register(ArcElement, Tooltip, Legend)

const ProgressDetails = () => {
  const { progressId } = useParams()
  const [progressData, setProgressData] = useState(null)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/userProgress/id/${progressId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        setProgressData(response.data.data)
      } catch (error) {
        console.error('Error fetching progress data', error)
      }
    }
    fetchProgress()
  }, [progressId])

  if (!progressData) return <p>Loading...</p>

  const completedLessons = progressData.completedLessons.length
  const totalLessons = progressData.language_id.fields.length
  const incompleteLessons = totalLessons - completedLessons

  // Calculate progress percentage
  const progressPercentage = ((completedLessons / totalLessons) * 100).toFixed(2)

  const pieData = {
    labels: ['Completed Lessons', 'Incomplete Lessons'],
    datasets: [
      {
        data: [completedLessons, incompleteLessons],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }
    ]
  }

  return (
    <div className="progress-details-container">
      <h2>Progress Details for {progressData.language_id.languagename}</h2>
      <div className="chart-container">
        <Pie data={pieData} />
      </div>
      <p className="progress-percentage">Progress: {progressPercentage}%</p>
    </div>
  )
}

export default ProgressDetails
