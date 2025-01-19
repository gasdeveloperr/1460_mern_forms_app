import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddingWindowStyles.css';
import { backend_point } from '../consts';
import Spinner from '../Spinner';
import { getAuthToken, getCurrentOrganization } from '../utils';


const CreateCorrectiveActionWindow = ({isOpen, onClose, setIsLoading}) => {
  const [text, setText] = useState('');
  const [logic, setLogic] = useState('');

  if (!isOpen) return null;

  const saveActionChanges = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };

    setIsLoading(true);
    try {
      await axios.post(`${backend_point}/api/correctiveActions/new`, 
        { text: text, logic: logic }, 
        config
      );
      setIsLoading(false);
      onClose()
    } catch (error) {
      if (error.response) {
        console.error('Error saving action:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="window-overlay" id='saving-options-window'>
      <div className="window-content">
        <h2>Create new Corrective Action</h2>
        <form onSubmit={saveActionChanges}>
          <div className="form-group">
            <label htmlFor="name">Corrective action text:</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="name">Show action if option value equal to:</label>
            <input
              type="text"
              id="logic"
              value={logic}
              onChange={(e) => setLogic(e.target.value)}
              required
            />
          </div> */}
          <div className="form-actions">
            <button className='modal-button' type="submit">Create</button>
            <button className='usual-button' type="button" onClick={() => onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default CreateCorrectiveActionWindow;