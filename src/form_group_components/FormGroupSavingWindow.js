import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../clients_page_components/ClientAddingWindow.css';
import { backend_point } from '../consts';
import Spinner from '../Spinner';
import { getAuthToken, getCurrentOrganization } from '../utils';


const FormGroupSavingWindow = ({isOpen, onClose, handleSaving}) => {
  const [title, setTitle] = useState('');
  const [isFormGroupLoading, setIsFormGroupLoading] = useState(false);

  const [isError, setIsError] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsFormGroupLoading(true);
    const token = getAuthToken();
    const organization = getCurrentOrganization()
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    try {
      const response = await axios.post(`${backend_point}/api/formGroups/new`, {
        title: title,
        organization: organization,
      }, config);
      console.log('Form Group saved successfully:', response.data);
      setIsFormGroupLoading(false);
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
  if (isFormGroupLoading) return (
    <div className="window-overlay">
      <div className="window-content">
        <Spinner />
      </div>
    </div>
  )

  return (
    <div className="window-overlay" id='saving-options-window'>
      <div className="window-content">
        <h2>Create new Group to unite Assessments</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Group title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className='modal-button' type="submit">Save</button>
            <button type="button" onClick={() => onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default FormGroupSavingWindow;