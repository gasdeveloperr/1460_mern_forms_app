import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients_page_components/ClientAddingWindow.css';
import { backend_point } from './consts';
import Spinner from './Spinner';
import { getAuthToken } from './utils';
import './OptionsChoosingWindow.css';


const OptionsChoosingWindow = ({isOpen, choseOption, onClose}) => {
  const [options, setOptions] = useState([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  const [isError, setIsError] = useState('')


  useEffect(() => {
    if(isOpen){
      getOptionsHandler()
    }
  },[isOpen])

  const getOptionsHandler = async(e) => {
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    try {
      const response = await axios.get(`${backend_point}/api/options/all`, config);
      console.log('Options taked successfully:', response.data);
      setOptions(response.data);
      setIsOptionsLoading(false);
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
  const deleteOptionHandler = async(optionsId) => {
    setIsOptionsLoading(true);
    const token = getAuthToken();
    const config = {
      headers: {
        'Authorization': `${token}`,
      },
    };
    try {
      const response = await axios.delete(`${backend_point}/api/options/${optionsId}`, config);
      console.log('Options deleted successfully:', response.data);
      getOptionsHandler()
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
    <div className="window-overlay" id='choosing-options-window'>
      <div className="window-content">
        <h2>Choose options: </h2>
        <div className='options-chooser-body'>
          {options && options.length !== 0 ?
            options.map((optionObject, optionObjectIndex) => (
              <div key={optionObjectIndex} className='option-chooser-container'>
                <div className="option-chooser-title">
                  {optionObject.title}
                </div>
                <hr className='option-hr'/>
                <div className='options-chooser-list'>
                  {optionObject.optionsData.map((option, optionIndex) => (
                    <div key={optionIndex} className='option-chooser'>
                      {option.title}
                      <div className="color-picker-container">
                        <div
                          className="color-preview"
                          style={ !option.color ? {backgroundColor: '#FFFFFF'} : {backgroundColor: option.color}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button className='modal-button' type="submit" onClick={() => choseOption(optionObject)}>
                    Use
                  </button>
                  <button type="cancel" onClick={() => deleteOptionHandler(optionObject._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          : <></>
          }
        </div>
        <div className="form-actions">
          <button type="button" onClick={() => onClose()}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
 
export default OptionsChoosingWindow;