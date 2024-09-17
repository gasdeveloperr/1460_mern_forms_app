import React, { useState, useEffect } from 'react';
import '../clients_page_components/ClientAddingWindow.css';

const UserEditWindow = ({ onClose, chosenUser, editUserHandler, changeStatusHandler }) => {
  // State for the form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [workFunctions, setWorkFunctions] = useState('');
  const [password, setPassword] = useState('');
  const [details, setDetails] = useState('');

  // Pre-populate the form fields when the chosenUser changes
  useEffect(() => {
    if (chosenUser) {
      setEmail(chosenUser.email || '');
      setName(chosenUser.name || '');
      setRole(chosenUser.role || 'user');
      setOrganization(chosenUser.organization || '');
      setPosition(chosenUser.position || '');
      setWorkFunctions(chosenUser.work_functions || '');
      setPassword(''); // Set password empty initially for security
      setDetails(chosenUser.details || '');
    }
  }, [chosenUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      email,
      name,
      role,
      organization,
      position,
      work_functions: workFunctions,
      password: password || undefined, // Only send password if it’s updated
      details,
      status: 'inactive', // Assuming status update is handled elsewhere
    };

    editUserHandler(updatedUser);
    onClose();
  };

  if (!chosenUser) return null;

  return (
    <div className="window-overlay">
      <div className="window-content">
        <h2>Edit User</h2>
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
              placeholder="Leave blank to keep unchanged"
            />
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
            <button className='modal-button' type="submit">Save User</button>
            {
            chosenUser.status === 'inactive' ? 
              <button type="usual" onClick={() => changeStatusHandler('active')}>Activate User</button>
            : 
              <button type="usual" onClick={() => changeStatusHandler('inactive')}>Inactivate User</button>
            }
           
            <button type="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditWindow;
