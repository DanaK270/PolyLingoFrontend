
import "./App.css"
import { useState, useEffect } from "react"
import { useNavigate, Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Home from "./pages/Home"
import SignIn from "./pages/Signin"
import Discussion from "./components/Discussion"
import Translate from "./components/Translation"
import UserNotes from "./components/UserNotes"
import Discussion2 from "./components/Discussion2"
import Main from "./components/Main"
import LessonDetails from "./components/LessonDetails"
import LanguageDetails from "./components/LanguageDetails"
import CreateLanguageForm from './components/NewLesson'

import { CheckSession } from "./services/auth"
import ExerciseList from "./pages/ExerciseList"
import ExerciseForm from "./pages/ExerciseForm"
import ExerciseDetail from "./pages/ExerciseDetail"
import axios from "axios"

const App = () => {
  const [user, setUser] = useState(null)
  const [issues, setIssues] = useState([])
  let navigate = useNavigate()

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
    navigate("/")
  }

  const checkToken = async () => {
    try {
      const user = await CheckSession()
      setUser(user)
    } catch (error) {
      console.error("Session check failed:", error)
      handleLogOut()
    }
  }

  const getIssues = async () => {
    try {
      let res = await axios.get("http://localhost:3001/issues")
      console.log("Fetched issues:", res.data) // Verify the data structure
      setIssues(res.data) // This should update your issues state
    } catch (err) {
      console.log("Error fetching issues:", err)
    }
  }

  useEffect(() => {
    getIssues()
    const token = localStorage.getItem("token")
    if (token) {
      ;(async () => {
        await checkToken()
      })()
    }
  }, [])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="sign-in" element={<SignIn setUser={setUser} />} />
        <Route path="register" element={<Register />} />

        <Route
          path="/discuss"
          element={
            <Discussion
              getIssues={getIssues}
              issues={issues}
              setIssues={setIssues}
            />
          }
        />

        <Route path="/translate" element={<Translate />} />

        <Route
          path="/discuss2"
          element={<Discussion2 issues={issues} setIssues={setIssues} />}
        />
        <Route
          path="/main"
          element={<Main issues={issues} setIssues={setIssues} />}
        />
        <Route
          path="/languages/:languageId"
          element={<LanguageDetails issues={issues} setIssues={setIssues} />}
        />
        <Route
          path="/lessons/:lessonId"
          element={<LessonDetails issues={issues} setIssues={setIssues} />}
        />

        <Route
          path="/discuss"
          element={
            <Discussion
              getIssues={getIssues}
              issues={issues}
              setIssues={setIssues}
            />
          }
        />
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/exercises/add" element={<ExerciseForm />} />
        <Route path="/exercises/edit/:id" element={<ExerciseForm />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route
          path="/languages/createlanguage"
          element={<CreateLanguageForm />}
        />
        <Route path="userNote" element={<UserNotes userId={user?.id} />} />
      </Routes>
    </div>
  )
}

export default App

