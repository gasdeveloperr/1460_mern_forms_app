// src/components/Login.js
import { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { backend_point } from './consts';
import simmonssafe_logo_login from './icons/simmonssafe-logo-login.png'


const Login = () => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backend_point}/api/auth/login`, { email, password });
      const { token, role, id } = response.data;

      // Store the token in local storage or cookies
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', id);

      // Redirect the user to the dashboard or homepage
      window.location.href = '/';
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo-container">
          <img src={simmonssafe_logo_login} alt="" />
        </div>
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