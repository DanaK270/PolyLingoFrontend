import './App.css'
import { useState, useEffect } from 'react'
import { useNavigate, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Home from './pages/Home'
import SignIn from './pages/Signin'
import Discussion from './components/Discussion'
import Translate from './components/Translation'

const App = () => {
  const [user, setUser] = useState(null)
  const [issues, setIssues] = useState([]);
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
      let res = await axios.get('http://localhost:3001/issues');
      console.log('Fetched issues:', res.data);  // Verify the data structure
      setIssues(res.data);  // This should update your issues state
    } catch (err) {
      console.log('Error fetching issues:', err);
    }
  };
  




  useEffect(() => {
    getIssues();
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
        <Route path="/discuss" element={<Discussion getIssues={getIssues} issues={issues} setIssues={setIssues} />} />
        <Route path="/translate" element={<Translate  />} />
      </Routes>
    </div>
  )
}

export default App
