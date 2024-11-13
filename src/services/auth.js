import Client from './api'

// Login user and store tokens
export const SignInUser = async (data) => {
  try {
    const res = await Client.post('/auth/login', data)
    const { accessToken, refreshToken, user } = res.data

    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    return user
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

// Register new user
export const RegisterUser = async (data) => {
  try {
    const res = await Client.post('/auth/register', data)
    return res.data
  } catch (error) {
    console.error('Registration failed:', error)
    throw error
  }
}

// Check user session using access token
export const CheckSession = async () => {
  try {
    const res = await Client.get('/auth/session')
    return res.data
  } catch (error) {
    console.error('Session check failed:', error)
    throw error
  }
}

// Refresh access token using refresh token
export const RefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  try {
    const res = await Client.post('/auth/refresh-token', { refreshToken })
    const { accessToken } = res.data

    localStorage.setItem('token', accessToken)
    console.log('Access token refreshed.')

    return accessToken
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    throw error
  }
}
