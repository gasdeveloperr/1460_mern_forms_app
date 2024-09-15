import React, { useEffect, useRef, useState } from 'react';
import file_upload_icon from './icons/file-upload-icon.svg'
import calendar_icon from './icons/calendar-icon.svg'
import time_icon from './icons/time-icon.svg' 
import CustomSelector from './form_live_components/CustomSelector';



const FormLiveComponent = ({field, index}) => {

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e, type) => {
    const value = e.target.value;

    // if(type ==='email'){
    //   if (value.length < 5) {
    //     setErrorMessage('Input must be at least 5 characters long');
    //   } else {
    //     setErrorMessage('');
    //   }
    // }
    setInputValue(value);
    if(field.type == 'dropdown'){
      const selectedOption = field.dropdown.find(
        (option) => option.title === e.target.value
      );
      setSelectBgColor(selectedOption ? selectedOption.color : '');
    }
  };

  const [selectBgColor, setSelectBgColor] = useState('');

  useEffect(() => {
    if(field.type == 'dropdown'){
      // Find the initial selected option and set its color as the background
      const initialSelectedOption = field.dropdown.find(option => option.title === field.value);
      if (initialSelectedOption) {
        setSelectBgColor(initialSelectedOption.color || '');
      }
    }
  }, [field]); 


    return (
      <>
        {field.type === 'short_answer' && (
          <label key={field.id} className="form-live-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              {errorMessage && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{errorMessage}</span>
                </div>
              )}
              {!field.read_only &&
                <input className='form-live-input' id={field.id} 
                  fieldtype={field.type}
                  name={field.title} onChange={handleInputChange} 
                  required={field.required} 
                  disabled={field.read_only}/>
                }
            </div>
          </label>
        )}
        {field.type === 'long_answer' && (
          <label key={field.id} className="form-live-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <textarea className='long-answer-input' id={field.id} 
                fieldtype={field.type}
                name={field.title} onChange={handleInputChange} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'email' || field.type === 'number'  && (
          <label key={field.id} className="form-live-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              {errorMessage && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{errorMessage}</span>
                </div>
              )}
              <input className='form-live-input' id={field.id} 
                fieldtype={field.type}
                name={field.title}
                onChange={e => handleInputChange(e, field.type)} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'address' && (
          <label key={field._id} className="form-live-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <input className='form-live-input' id={field.id} 
                fieldtype={field.type}
                name={field.title}
                onChange={handleInputChange} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'phone' && (
          <label key={field._id} className="form-live-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <input className='form-live-input' id={field.id} 
                fieldtype={field.type}
                name={field.title}
                onChange={handleInputChange} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'name' && (
          <div key={field.id} className="form-component-name">
            <div className='form-component-title'>
              {field.required && <span>*</span>}
              {field.title}
            </div>
            <div className="form-component-name-fields">
              <label key={field._id+'0'} className="form-live-component-container">
                <input className='form-live-input' id={field.id} 
                  fieldtype={field.type} customtype='first_name' 
                  name={field.title+'_'+field.labels[0]} 
                  required={field.required} 
                  disabled={field.read_only}/>
                <div className='form-component-label'>
                  {field.labels[0]}
                </div>
              </label>
              <label key={field._id+'1'} className="form-live-component-container">
                <input className='form-live-input' id={field.id} 
                  fieldtype={field.type} customtype='last_name' 
                  name={field.title+'_'+field.labels[1]} 
                  required={field.required} 
                  disabled={field.read_only}/>
                <div className='form-component-label'>
                  {field.labels[1]}
                </div>
              </label>
            </div>
          </div>
        )}
        {field.type === 'checkbox' && (
          <label key={field.id} className="form-live-component-container">
            <div className='form-component-title'>
              {field.title}
            </div>
            <div className={`form-component-container ${field.layout}`}>
              { field.checkbox.map((option, index)=> (
                <label key={index} className={`form-component-checkbox-container ${field.layout}`}>
                  <input type="checkbox" 
                    fieldtype={field.type}
                    id={field.id} 
                    name={option.title} 
                    disabled={field.read_only}/>
                  <span className="form-component-checkmark"></span>
                  {option.title}
                </label>
                ))
              }
            </div>
          </label>
        )}
        {field.type === 'radio' && (
          <label key={field.id} className="form-live-component-container">
            <div className='form-component-title'>
              {field.title}
            </div>
            <div className={`form-component-container ${field.layout}`}>
              { field.radio.map((option, index)=> (
                <label key={index} className='form-component-radio-container'>
                  <input
                    type="radio"
                    fieldtype={field.type}
                    id={field.id}
                    name={field.id}
                    value={option.title}
                    disabled={field.read_only}
                  />
                  <span className="form-component-radiomark"></span>
                  {option.title}
                </label>
                ))
              }
            </div>
          </label>
        )}
        {field.type === 'dropdown' && <CustomSelector field={field}/>}
        {/* {field.type === 'dropdown' && (
          <label key={field.id} htmlFor={field.id} className="form-live-component-container">
            <div className="form-component-dropdown">
              {field.title}
              <select id={field.id} name={field.title} className="form-component-select">
                { field.dropdown.map((option, index)=> (
                  <option key={index} value={option.title} 
                  className="form-component-select-option" style={{backgroundColor: option.color ? option.color : ''}}>
                    {option.title}
                  </option>
                  ))
                }
              </select>
            </div>
          </label>
        )} */}
        {field.type === 'date_time' && (
          <div className="form-live-component-container">
            <div className='form-component-title'>
              {field.required && <span>*</span>}
              {field.title}
            </div>
            <div className='form-live-date-time-container'>
              
              <label key={field._id} className="form-live-component-container">
                <div className="form-date-time-answer">
                  <input className='form-live-input' id={field.id} fieldtype={field.type} customtype='date' name={field.title+'_date'} placeholder={field.dateFormat}
                  onChange={handleInputChange} required={field.required} disabled={field.read_only}/>
                  <img src={calendar_icon}/>
                </div>
              </label>
              <label key={field._id} className="form-live-component-container">
                <div className="form-date-time-answer">
                  <input className='form-live-input' id={field.id} fieldtype={field.type} customtype='time' name={field.title+'_time'} placeholder='hh:mm'
                  onChange={handleInputChange} required={field.required} disabled={field.read_only}/>
                  <img src={time_icon}/>
                </div>
              </label>
            </div>
          </div>
        )}
        {field.type === 'file_upload' && (
          <label key={field._id} htmlFor={field.id} className="form-live-component-container">
              <input type="file" id={field.id} name={field.title} className="file-input" 
              required={field.required} disabled={field.read_only} hidden/>
              <label htmlFor={field.id} className="form-file-label">
                {field.required && <span>*</span>}
                Chose File
              </label>
          </label>
        )}
      </>
    );
};

export default FormLiveComponent;