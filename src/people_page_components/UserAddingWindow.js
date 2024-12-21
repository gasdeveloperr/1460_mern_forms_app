import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddingWindowStyles.css';
import { getAuthToken } from '../utils';
import { backend_point } from '../consts';

const UserAddingWindow = ({ isOpen, onClose, onAddUser }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [workFunctions, setWorkFunctions] = useState('');
  const [role, setRole] = useState('user');
  const [details, setDetails] = useState('');
  const [clients, setClients] = useState([]);

  const [isError, setIsError] = useState('')

  const fetchClients = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/clients/all`, config);
      setClients(response.data);
    } catch (err) {
      setIsError('Error fetching clients, please refresh the page')
      console.error('Error fetching clients:', err);
    }
  };

  // Fetch clients for the organization dropdown
  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      email,
      name,
      role,
      organization,
      position,
      work_functions: workFunctions,
      password,
      details,
      status: 'inactive'
    };
    onAddUser(newUser);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="window-overlay">
      <div className="window-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="organization">Organization:</label>
            <select
              id="organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              required
            >
              <option value="" disabled>Select organization</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="position">Position:</label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="workFunctions">Work Functions:</label>
            <input
              type="text"
              id="workFunctions"
              value={workFunctions}
              onChange={(e) => setWorkFunctions(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="contributor">Contributor</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="details">Details:</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button className='modal-button' type="submit">Add User</button>
            <button className='usual-button' type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAddingWindow;
