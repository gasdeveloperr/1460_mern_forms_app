import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients_page_components/ClientAddingWindow.css';
import { backend_point } from './consts';
import Spinner from './Spinner';
import { getAuthToken } from './utils';


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

  if (!isOpen) return null;
  if (isOptionsLoading) return (
    <div className="window-overlay">
      <div className="window-content">
        <Spinner />
      </div>
    </div>
  )

  return (
    <div className="window-overlay">
      <div className="window-content">
        <h2>Choose options: </h2>
        {options && options.length !== 0 ?
          options.map((optionObject, optionObjectIndex) => (
            <div key={optionObjectIndex} className='option-container' onClick={() => choseOption(optionObject)}>
              {optionObject.title}
              <div className='options-group'>
                {optionObject.options.map((option, optionIndex) => (
                  <div key={optionIndex} className='option-container'>
                    {option.title}
                  </div>
                ))}
              </div>
            </div>
          ))
        : <></>
        }
      </div>
    </div>
  );
}
 
export default OptionsChoosingWindow;