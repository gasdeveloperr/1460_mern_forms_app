import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddingWindowStyles.css';
import { backend_point } from '../consts';
import Spinner from '../Spinner';
import { getAuthToken } from '../utils';


const SaveNewCustomFieldWindow = ({isOpen, onClose, editingField, editingSectionField}) => {
  
  const [isLoading, setIsLoading] = useState(false)
  const [fieldData, setFieldData] = useState({})

  useEffect(() => {
    //console.log(" editingField, editingSectionField, : ",  editingField, editingSectionField)
    if(editingSectionField.id !== ''){
      setFieldData(editingSectionField)
    }else{
      setFieldData(editingField)
    }
  }, [isOpen]);

  const saveNewCustomField = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };

    setIsLoading(true);
    try {
      //console.log(" fieldData ", fieldData)
      await axios.post(`${backend_point}/api/customFields/new`, 
        { title: fieldData.title, 
          type: fieldData.type, 
          value: fieldData.value, 
          options: fieldData.options, 
          layout: fieldData.layout || '', 
          components: fieldData.components || '', 
          required: fieldData.required, 
          read_only: fieldData.read_only, 
        }, 
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
        <h2 className="window-content-title">
          Save
          <span className='window-content-title-field-name'>
            {' '+fieldData.title+' '}
          </span>
          as new custom field ?
        </h2>
        <form onSubmit={saveNewCustomField}>
          <div className="form-actions">
            <button className='modal-button' type="submit">Save</button>
            <button className='usual-button' type="button" onClick={() => onClose()}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
export default SaveNewCustomFieldWindow;