import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './FormLiveStyles.css';



const FormLiveComponent = ({field, index}) => {

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e, type) => {
    const value = e.target.value;

    if(type ==='email'){
      if (value.length < 5) {
        setErrorMessage('Input must be at least 5 characters long');
      } else {
        setErrorMessage('');
      }
    }
    setInputValue(value);

    // Perform validation
  };


    return (
      <>
          {field.type === 'short_answer' && (
            <label key={index} className="form-live-component-container">
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
                <input className='form-live-input' onChange={handleInputChange} required={field.required}/>
              </div>
            </label>
          )}
          {field.type === 'long_answer' && (
            <label key={index} className="form-live-component-container">
              <div className="form-short-answer">
                <div className='form-component-title'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <textarea className='long-answer-input' onChange={handleInputChange} required={field.required}/>
              </div>
            </label>
          )}
          {field.type === 'email' || field.type === 'number'  && (
            <label key={index} className="form-live-component-container">
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
                <input className='form-live-input' onChange={e => handleInputChange(e, field.type)} type={field.type} required={field.required}/>
              </div>
            </label>
          )}
          {field.type === 'address' && (
            <label key={index} className="form-live-component-container">
              <div className="form-short-answer">
                <div className='form-component-title'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <input className='form-live-input' onChange={handleInputChange} required={field.required}/>
              </div>
            </label>
          )}
          {field.type === 'phone' && (
            <label key={index} className="form-live-component-container">
              <div className="form-short-answer">
                <div className='form-component-title'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <input className='form-live-input' onChange={handleInputChange} required={field.required}/>
              </div>
            </label>
          )}
          {field.type === 'name' && (
            <div className="form-component-name">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <div className="form-component-name-fields">
                <label key={index} className="form-live-component-container">
                  <input className='form-live-input'/>
                  <div className='form-component-label'>
                    {field.labels[0]}
                  </div>
                </label>
                <label key={index} className="form-live-component-container">
                  <input className='form-live-input'/>
                  <div className='form-component-label'>
                    {field.labels[1]}
                  </div>
                </label>
              </div>
            </div>
          )}
        </>
    );
};

export default FormLiveComponent;