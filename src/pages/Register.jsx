import { useState } from 'react';
import { RegisterUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  let navigate = useNavigate();
  const initState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default is user
  };
  const [formValues, setFormValues] = useState(initState);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await RegisterUser({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
      });
      setFormValues(initState);
      navigate('/sign-in');
    } catch (err) {
      console.log(err);
      setErrorMessage(
        'Registration failed! Please try again with different credentials.'
      );
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create Account</h2>
        {errorMessage && <p className="error-text">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="John Smith"
              value={formValues.name}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="example@example.com"
              value={formValues.email}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              value={formValues.password}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              !formValues.email ||
              !formValues.password ||
              formValues.password !== formValues.confirmPassword
            }
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;