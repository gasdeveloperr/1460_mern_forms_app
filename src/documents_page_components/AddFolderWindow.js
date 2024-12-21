import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddingWindowStyles.css';
import { backend_point } from '../consts';
import { getAuthToken, getCurrentOrganization } from '../utils';


const AddFolderWindow = ({isOpen, onClose, currentPath}) => {
  const [folderName, setFolderName] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    const token = getAuthToken();
    const organization = getCurrentOrganization()
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    try {
      const response = await axios.post(`${backend_point}/api/awsFiles/createNewFolder`, {
        folderName: folderName,
        organization: organization,
        currentPath: currentPath,
      }, config);
      console.log('Form Group saved successfully:', response.data);
      onClose();
    } catch (error) {
      if (error.response) {
        console.error('Error saving options:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="window-overlay" id='saving-options-window'>
      <div className="window-content">
        <h2>Create new folder</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Folder name:</label>
            <input
              type="text"
              id="title"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className='modal-button' type="submit">Create</button>
            <button className='usual-button' type="button" onClick={() => onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default AddFolderWindow;