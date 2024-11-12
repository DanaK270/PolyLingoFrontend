import { useState } from 'react'
import { SignInUser } from '../services/auth'
import { useNavigate } from 'react-router-dom'

const SignIn = ({ setUser }) => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await SignInUser(formValues)

      setFormValues({ email: '', password: '' })
      setUser(user)

      localStorage.setItem('userId', user.id)
      console.log('Login successful. User ID and tokens stored.')

      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
      setErrorMessage('Wrong credentials, sign in failed!')
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Sign In</h2>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="example@example.com"
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={!formValues.email || !formValues.password}
            style={{
              ...buttonStyle,
              opacity: !formValues.email || !formValues.password ? 0.6 : 1,
              cursor:
                !formValues.email || !formValues.password
                  ? 'not-allowed'
                  : 'pointer'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

// Styles
const containerStyle = {
  backgroundColor: '#f0f4ff',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const formContainerStyle = {
  width: '400px',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '15px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  textAlign: 'center'
}

const headingStyle = {
  fontSize: '28px',
  marginBottom: '20px',
  color: '#333'
}

const errorStyle = {
  color: 'red',
  marginBottom: '15px'
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
}

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px'
}

const labelStyle = {
  fontSize: '16px',
  color: '#555'
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px'
}

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  borderRadius: '25px',
  backgroundColor: '#6C85F7',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer'
}

export default SignIn
