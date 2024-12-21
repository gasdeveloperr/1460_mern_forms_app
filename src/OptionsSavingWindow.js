import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddingWindowStyles.css';
import { backend_point } from './consts';
import Spinner from './Spinner';
import { getAuthToken } from './utils';


const OptionsSavingWindow = ({isOpen, optionsData, onClose, handleSaving}) => {
  const [title, setTitle] = useState('');
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);

  const [isError, setIsError] = useState('')


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('to save: ', optionsData)
    setIsOptionsLoading(true);
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    
    try {
      const response = await axios.post(`${backend_point}/api/options/new`, {
        title: title,
        optionsType: 'dropdown',
        optionsData: optionsData
      }, config);
      console.log('Options saved successfully:', response.data);
      setIsOptionsLoading(false);
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
  if (isOptionsLoading) return (
    <div className="window-overlay">
      <div className="window-content">
        <Spinner />
      </div>
    </div>
  )

  return (
    <div className="window-overlay" id='saving-options-window'>
      <div className="window-content">
        <h2>Save these options to use them later</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Options title:</label>
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
            <button className='usual-button' type="button" onClick={() => onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default OptionsSavingWindow;