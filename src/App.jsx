import './App.css'
import { useState, useEffect } from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import SignIn from './pages/Signin'

const App = () => {
  const [user, setUser] = useState(null)
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

  useEffect(() => {
    const token = localStorage.getItem('token')
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
      </Routes>
    </div>
  )
}

export default App
