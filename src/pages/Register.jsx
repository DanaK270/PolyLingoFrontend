import { useState } from 'react'
import { RegisterUser } from '../services/auth'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  let navigate = useNavigate()
  const initState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // default is user
  }
  const [formValues, setFormValues] = useState(initState)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await RegisterUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role
      })
      setFormValues(initState)
      navigate('/sign-in')
    } catch (err) {
      console.log(err)
      setErrorMessage(
        'Registration failed! Please try again with different credentials.'
      )
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}>Create Account</h2>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="name" style={labelStyle}>
              Name
            </label>
            <input
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="John Smith"
              value={formValues.name}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formValues.email}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={formValues.password}
              required
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>
              Confirm Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={
              !formValues.email ||
              !formValues.password ||
              formValues.password !== formValues.confirmPassword
            }
            style={{
              ...buttonStyle,
              opacity:
                !formValues.email ||
                !formValues.password ||
                formValues.password !== formValues.confirmPassword
                  ? 0.6
                  : 1,
              cursor:
                !formValues.email ||
                !formValues.password ||
                formValues.password !== formValues.confirmPassword
                  ? 'not-allowed'
                  : 'pointer'
            }}
          >
            Sign Up
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

export default Register
