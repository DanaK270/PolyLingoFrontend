import './App.css'
import { useState, useEffect } from 'react'
import ChatBot from 'react-chatbotify'
import { useNavigate, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import SignIn from './pages/Signin'
import Discussion from './components/Discussion'
import Translate from './components/Translation'
import Discussion2 from './components/Discussion2'
import Main from './components/Main'
import LessonDetails from './components/LessonDetails'
import LanguageDetails from './components/LanguageDetails'
import CreateLanguageForm from './components/newLesson'
import { CheckSession } from './services/auth'
import ExerciseList from './pages/ExerciseList'
import ExerciseForm from './pages/ExerciseForm'
import ExerciseDetail from './pages/ExerciseDetail'
import axios from 'axios'

const App = () => {
  const [user, setUser] = useState(null)
  const [issues, setIssues] = useState([])
  const [form, setForm] = useState({}) // Initialize form state here

  let navigate = useNavigate()

  const handleLogOut = () => {
    setUser(null)
    localStorage.clear()
    navigate('/')
  }

  const checkToken = async () => {
    try {
      const user = await CheckSession()
      setUser(user)
    } catch (error) {
      console.error('Session check failed:', error)
      handleLogOut()
    }
  }

  const getIssues = async () => {
    try {
      let res = await axios.get('http://localhost:3001/issues')
      console.log('Fetched issues:', res.data)
      setIssues(res.data)
    } catch (err) {
      console.log('Error fetching issues:', err)
    }
  }

  useEffect(() => {
    getIssues()
    const token = localStorage.getItem('token')
    if (token) {
      ;(async () => {
        await checkToken()
      })()
    }
  }, [])

  const flow = {
    start: {
      message: () => {
        const seenBefore = localStorage.getItem('example_welcome')
        return seenBefore
          ? `Welcome back ${seenBefore}!`
          : 'Welcome there! What is your name?'
      },
      function: (params) =>
        localStorage.setItem('example_welcome', params.userInput),
      path: 'say_assist'
    },
    say_assist: {
      message: (params) => `${params.userInput}, How can I assist you today?`,
      path: 'ask_language'
    },
    ask_language: {
      message: 'Which language would you like to learn today?',
      options: ['English', 'French', 'Spanish'],
      path: 'ask_level'
    },
    ask_level: {
      message: 'What’s your current level in the selected language?',
      checkboxes: {
        items: ['Beginner', 'Intermediate', 'Advanced'],
        max: 1
      },
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, level: params.userInput })),
      path: 'ask_learning_goals'
    },
    ask_learning_goals: {
      message: 'What skills would you like to improve?',
      checkboxes: {
        items: ['Writing', 'Reading', 'Speaking'],
        max: 2
      },
      function: (params) =>
        setForm((prevForm) => ({ ...prevForm, skills: params.userInput })),
      path: 'show_recommendation'
    },
    show_recommendation: {
    
      function: async (params) => {
        await params.injectMessage("Sit tight! I'll send you right there!")
        setTimeout(() => {
          window.open(
            'http://localhost:5173/languages/6734ac355d580cd8d2a44008'
          )
        }, 1000)
      },
      path: 'repeat'
    },
    repeat: {
      transition: { duration: 3000 },
      path: 'start'
    }
  }

  return (
    <div>
      <ChatBot
        settings={{
          voice: { disabled: false },
          botBubble: { simStream: true },
          chatHistory: { storageKey: 'example_basic_form' },
          audio: { disabled: false, defaultToggledOn: true, tapToPlay: true },
          theme: { primaryColor: '#2A2A2A', secondaryColor: '#2A2A2A' }
        }}
        flow={flow}
      />
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
        <Route path="/exercises" element={<ExerciseList />} />
        <Route path="/exercises/add" element={<ExerciseForm />} />
        <Route path="/exercises/edit/:id" element={<ExerciseForm />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route
          path="/languages/createlanguage"
          element={<CreateLanguageForm />}
        />
      </Routes>
    </div>
  )
}

export default App
