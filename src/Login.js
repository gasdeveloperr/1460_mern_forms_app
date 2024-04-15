// src/components/Login.js
import { useState } from 'react';
import axios from 'axios';
import './Login.css';


const Login = () => {


  const backend_point = 'http://localhost:8000'
  //'http://localhost:8000'
  //'https://one460-forms-backend.onrender.com'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backend_point}/api/auth/login`, { email, password });
      const { token } = response.data;

      // Store the token in local storage or cookies
      localStorage.setItem('token', token);

      // Redirect the user to the dashboard or homepage
      window.location.href = '/';
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Welcome to Form Builder!</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;