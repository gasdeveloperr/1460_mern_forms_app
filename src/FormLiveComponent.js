import React, { useEffect, useRef, useState } from 'react';
import file_upload_icon from './icons/file-upload-icon.svg'
import calendar_icon from './icons/calendar-icon.svg'
import time_icon from './icons/time-icon.svg' 
import CustomSelector from './form_live_components/CustomSelector';
import TripleSectionFormComponent from './form_live_components/TripleSectionFormComponent';
import DoubleSectionFormComponent from './form_live_components/DoubleSectionFormComponent';
import DoubleInputsSectionFormComponent from './form_live_components/DoubleInputsSectionFormComponent';
import TripleInputsSectionFormComponent from './form_live_components/TripleInputsSectionFormComponent';
import FourSectionFormComponent from './form_live_components/FourSectionFormComponent';
import FiveSectionFormComponent from './form_live_components/FiveSectionFormComponent';
import FileUploadFormComponent from './form_live_components/FileUploadFormComponent';
import AutoResizingTextareaComponent from './form_live_components/AutoResizingTextareaComponent';
import MultipleSectionFormComponent from './form_live_components/MultipleSectionFormComponent';
import ColumnsFormComponent from './form_live_components/ColumnsFormComponent';



const FormLiveComponent = ({field, index, onFileChange}) => {

  const [inputValue, setInputValue] = useState(field.value || '');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [fieldData, setFieldData] = useState(field);

  const [selectorValue, setSelectorValue] = useState(null);

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
    if(field.type === 'dropdown'){
      const selectedOption = field.dropdown.find(
        (option) => option.title === e.target.value
      );
      setSelectBgColor(selectedOption ? selectedOption.color : '');
    }
  };

  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto to shrink if needed
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
    }
  };

  const handleResize = (event) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputsChange = (e, sectionIndex) => {
    const updatedField = { ...field };
    
    updatedField.value[sectionIndex] = e.target.value;
    setFieldData(updatedField);
  };
  
  const handleSelectorChange = (selectedOption, sectionIndex) => {
    const updatedField = { ...field };
    
    updatedField.value[sectionIndex].options.forEach(option => {
      option.selected = option.title === selectedOption.title;
    });
    setFieldData(updatedField);
  };  

  const [selectBgColor, setSelectBgColor] = useState('');

  useEffect(() => {
    if(field.type === 'dropdown'){
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
                  fieldtype={field.type} value={inputValue}
                  name={field.title} onChange={handleInputChange} 
                  required={field.required} 
                  disabled={field.read_only}/>
                }
            </div>
          </label>
        )}
        {field.type === 'long_answer' && 
        <AutoResizingTextareaComponent field={field} handleInputChange={handleInputChange}/>}
        {field.type === 'title' && (
          <div className="form-short-answer">
            <div className='form-title-component-title' style={{backgroundColor: field.color || '#FFFFFF'}}>
              {field.title}
            </div>
          </div>
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
        {field.type === 'dropdown' && (
          <label key={field.id} htmlFor={field.id} className="form-live-component-container">
            <div className="form-component-dropdown">
              {field.required && <span>*</span>}
              {field.title}
              <CustomSelector options={field.dropdown} setSelectorValue={setSelectorValue}/>
              <input 
                fieldtype={field.type}
                id={field.id}
                name={field.id}
                disabled={field.read_only}
                value={selectorValue}
                hidden/>
            </div>
          </label>
        )}
        {field.type === 'double_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <DoubleSectionFormComponent field={field} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'triple_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <TripleSectionFormComponent field={field} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'two_inputs_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <DoubleInputsSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'triple_inputs_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <TripleInputsSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'four_inputs_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <FourSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'five_inputs_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <FiveSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'multi_section' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <MultipleSectionFormComponent field={field} handleInputChange={handleInputsChange} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'columns' && (
          <div className="form-live-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <ColumnsFormComponent field={field} handleInputChange={handleInputsChange} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
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
        {field.type === 'file_upload' && 
        <FileUploadFormComponent field={field} onFileChange={onFileChange}/>}
      </>
    );
};

export default FormLiveComponent;