
import { useState } from 'react';
import { SignInUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ setUser }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await SignInUser(formValues);

      setFormValues({ email: '', password: '' });
      setUser(user);

      localStorage.setItem('userId', user.id);
      console.log('Login successful. User ID and tokens stored.');

      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMessage('Wrong credentials, sign in failed!');
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Sign In</h2>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="example@example.com"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={!formValues.email || !formValues.password}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
