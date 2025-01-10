import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddingWindowStyles.css';
import { backend_point } from '../consts';
import Spinner from '../Spinner';
import { getAuthToken } from '../utils';


const AddCorrectiveActionWindow = ({isOpen, onClose, handleAdding}) => {
  const [actions, setActions] = useState([]);
  const [text, setText] = useState('');
  const [logic, setLogic] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const fetchActions = async () => {

    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };

    try {
      const response = await axios.get(`${backend_point}/api/correctiveActions/all`, config);
      //console.log('actions taked successfully:', response.data);
      setActions(response.data);
      setIsLoading(false);
    } catch (err) {
        console.error('Error fetching actions:', err);
      }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchActions();
  }, [isOpen]);

  const saveActionChanges = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };

    setIsLoading(true);
    try {
      const response = await axios.post(`${backend_point}/api/correctiveActions/new`, 
        { text: text, logic: logic }, 
        config
      );
      handleAdding(response.data)
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

  if (!isOpen) return null;
  if (isLoading) return (
    <div className="window-overlay">
      <div className="window-content">
        <Spinner />
      </div>
    </div>
  )

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
            <button className='modal-button' type="submit">Add new</button>
          </div>
        </form>
        <h2>Choose corrective action: </h2>
        <div className='options-chooser-body'>
          {actions && actions.length !== 0 ?
            actions.map((action, actionIndex) => (
              <div key={actionIndex} className='option-chooser-container'>
                <div className="corrective-action-text">
                  Corrective text :
                </div>
                <div className="corrective-action-text">
                  {action.text}
                </div>
                {/* <hr className='option-hr'/>
                <div className='options-chooser-list'>
                  Show if option equal: {action.logic}
                </div> */}
                <div className="form-actions">
                  <button className='modal-button' type="submit" onClick={() => handleAdding(action)}>
                    Chose
                  </button>
                </div>
              </div>
            ))
          : <></>
          }
        </div>
        <div className="form-actions">
          <button className='usual-button' type="button" onClick={() => onClose()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
 
export default AddCorrectiveActionWindow;