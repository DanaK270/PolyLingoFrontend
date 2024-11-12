import axios from 'axios'

const API_URL = 'http://localhost:3001/exercise'

export const getExercises = () => axios.get(API_URL)
export const getExerciseById = (id) => axios.get(`${API_URL}/${id}`)
export const createExercise = (exerciseData) =>
  axios.post(API_URL, exerciseData)
export const updateExercise = (id, exerciseData) =>
  axios.put(`${API_URL}/${id}`, exerciseData)
export const deleteExercise = (id) => axios.delete(`${API_URL}/${id}`)
export const getExercisesByLessonId = (lessonId) =>
  axios.get(`${API_URL}/lesson/${lessonId}`)
