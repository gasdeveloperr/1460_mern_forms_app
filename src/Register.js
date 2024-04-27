import axios from 'axios';
import { useState } from 'react';
import './Login.css';
import { backend_point } from './consts';


const Register= () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backend_point}/api/auth/register`, {
        email,
        password,
        role,
      });
      const { token } = response.data;

      // Store the token in local storage or cookies
      localStorage.setItem('token', token);

      // Redirect the user to the dashboard or homepage
      window.location.href = '/';
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Register to Form Builder!</h2>
        {error && <p>{error}</p>}
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
          <div className="form-group">
            <label className="form-label">Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Editor</option>
              <option value="admin">Contibutor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="login-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;