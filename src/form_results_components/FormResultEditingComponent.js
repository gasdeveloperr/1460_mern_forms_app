import React, { useEffect, useRef, useState } from 'react';
import calendar_icon from '../icons/calendar-icon.svg'
import time_icon from '../icons/time-icon.svg' 
import CustomSelector from '../form_live_components/CustomSelector';
import TripleSectionFormComponent from '../form_live_components/TripleSectionFormComponent';
import DoubleSectionFormComponent from '../form_live_components/DoubleSectionFormComponent';
import DoubleInputsSectionFormComponent from '../form_live_components/DoubleInputsSectionFormComponent';
import TripleInputsSectionFormComponent from '../form_live_components/TripleInputsSectionFormComponent';
import FourSectionFormComponent from '../form_live_components/FourSectionFormComponent';
import FiveSectionFormComponent from '../form_live_components/FiveSectionFormComponent';
import FileUploadFormComponent from '../form_live_components/FileUploadFormComponent';
import AutoResizingTextareaComponent from '../form_live_components/AutoResizingTextareaComponent';
import MultipleSectionFormComponent from '../form_live_components/MultipleSectionFormComponent';
import AddButtonComponent from '../form_live_components/AddButtonComponent';
import EditingColumnsComponent from './EditingColumnsComponent';



const FormResultEditingComponent = ({field, data, index, sectionIndex, 
  onFileChange, handleAddingComponent, isSectionComponent}) => {


  let fieldPreData = {};
  if (data && data.hasOwnProperty(field.id) && data[field.id] !== undefined) {
    fieldPreData = data[field.id];
    //console.log('field pre-data :', fieldPreData, data[field.id])
  } else if(field.type !== 'title'){
    //console.log(`No data found for field ID: ${field.id}`);
    fieldPreData = '';
  }

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
    if(field.type === 'dropdown'){
      Object.defineProperty(field, 'dropdown', {
        get() {
          return this.options;
        },
        set(value) {
          this.options = value;
        }
      });
    }
    setInputValue(value);
    if(field.type === 'dropdown'){
      const selectedOption = field.options?.find(
        (option) => option.title === e.target.value
      );
      setSelectBgColor(selectedOption ? selectedOption.color : '');
    }
  };

  //console.log('field in live comp: ', field)
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
  const handleColumnInputsChange = (e, sectionIndex) => {
    const updatedField = { ...field };
    //console.log('handleInputsChange', updatedField.value[sectionIndex])
    updatedField.value[sectionIndex].value = e;
    setFieldData(updatedField);
  };
  const handleColumnSelectorChange = (selectedOption, sectionIndex) => {
    const updatedField = { ...field };
    //console.log('handleColumnSelectorChange : ', selectedOption, sectionIndex)
    updatedField.value[sectionIndex].options.forEach(option => {
      option.selected = option.title === selectedOption.title;
    });
    setFieldData(updatedField);
  };  

  const [selectBgColor, setSelectBgColor] = useState('');

  useEffect(() => {
    if(field.type === 'dropdown'){
      // Find the initial selected option and set its color as the background
      const initialSelectedOption = field.options?.find(option => option.title === field.value);
      if (initialSelectedOption) {
        setSelectBgColor(initialSelectedOption.color || '');
      }
    }
  }, [field]); 


    return (
      <>
        {field.type === 'short_answer' && (
          <label key={field.id} className="form-result-component-container">
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
                  placeholder={fieldPreData.value && fieldPreData.value.result ? fieldPreData.value.result
                    : fieldPreData.value && !fieldPreData.value.result ? fieldPreData.value
                    : ''}
                  name={field.title} onChange={handleInputChange} 
                  required={field.required} 
                  disabled={field.read_only}/>
                }
            </div>
          </label>
        )}
        {field.type === 'long_answer' && 
        <AutoResizingTextareaComponent field={field} handleInputChange={handleInputChange}/>
        }
        {field.type === 'title' && (
          <div className="form-short-answer">
            <div className='form-title-component-title' style={{backgroundColor: field.color || '#FFFFFF'}}>
              {field.title}
            </div>
          </div>
        )}
        {field.type === 'email'  && (
          <label key={field.id} className="form-result-component-container">
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
                name={field.title} value={inputValue} 
                placeholder={fieldPreData.value && fieldPreData.value.result ? fieldPreData.value.result
                  : fieldPreData.value && !fieldPreData.value.result ? fieldPreData.value
                  : ''}
                onChange={e => handleInputChange(e, field.type)} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'number'  && (
          <label key={field.id} className="form-result-component-container">
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
                name={field.title} value={inputValue} 
                placeholder={fieldPreData.value && fieldPreData.value.result ? fieldPreData.value.result
                  : fieldPreData.value && !fieldPreData.value.result ? fieldPreData.value
                  : ''}
                onChange={e => handleInputChange(e, field.type)} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'address' && (
          <label key={field._id} className="form-result-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <input className='form-live-input' id={field.id} 
                fieldtype={field.type}
                name={field.title} value={inputValue} 
                placeholder={fieldPreData.value && fieldPreData.value.result ? fieldPreData.value.result
                  : fieldPreData.value && !fieldPreData.value.result ? fieldPreData.value
                  : ''}
                onChange={handleInputChange} 
                required={field.required} 
                disabled={field.read_only}/>
            </div>
          </label>
        )}
        {field.type === 'phone' && (
          <label key={field._id} className="form-result-component-container">
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <input className='form-live-input' id={field.id} 
                fieldtype={field.type}
                name={field.title} value={inputValue} 
                placeholder={fieldPreData.value && fieldPreData.value.result ? fieldPreData.value.result
                  : fieldPreData.value && !fieldPreData.value.result ? fieldPreData.value
                  : ''}
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
              <label key={field._id+'0'} className="form-result-component-container">
                <input className='form-live-input' id={field.id} 
                  fieldtype={field.type} customtype='first_name' 
                  name={field.title+'_'+field.labels[0]} 
                  required={field.required} 
                  disabled={field.read_only}/>
                <div className='form-component-label'>
                  {field.labels[0]}
                </div>
              </label>
              <label key={field._id+'1'} className="form-result-component-container">
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
        
        {field.type === 'radio' && (
          <label key={field.id} className="form-result-component-container">
            <div className='form-component-title'>
              {field.title}
            </div>
            <div className={`form-component-container ${field.layout}`}>
              {field.options.map((option, index) => {
                  let matchingValue
                  if(fieldPreData.value && fieldPreData.value.result){
                    matchingValue = fieldPreData.value.result === option.title
                  } else if(fieldPreData.value && !fieldPreData.value.result){
                    matchingValue = fieldPreData.value === option.title
                  }
                  return (
                    <div key={index}>
                      <label className={`form-component-radio-container ${field.layout}`}>
                        <input
                          type="radio"
                          fieldtype={field.type}
                          id={field.id}
                          name={option.title}
                          correctiveactiontext={option?.correctiveAction?.text || ''}
                          correctiveactionid={option?.correctiveAction?._id || ''}
                          defaultChecked={!!matchingValue}
                          disabled={field.read_only}
                        />
                        <span className="form-component-radiomark"></span>
                        {option.title}
                      </label>
                      {/* Show corrective action only for matched options that have it */}
                      {matchingValue?.correctiveActionData && (
                        <div className="field-result-option-corrective-action">
                          Corrective action: {matchingValue.correctiveActionData.text}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </label>
        )}
        {field.type === 'checkbox' && (
          <label key={field.id} className="form-result-component-container">
            <div className='form-component-title'>
              {field.title}
            </div>
            <div className={`form-component-container ${field.layout}`}>
              {field.options.map((option, index) => {
                let matchingValue
                if(fieldPreData && fieldPreData.value.length !== 0){
                  matchingValue = fieldPreData.value?.find(value => 
                    value.result === option.title || value === option.title
                  );
                }
                return (
                  <div key={index}>
                    <label className={`form-component-checkbox-container ${field.layout}`}>
                      <input
                        type="checkbox"
                        fieldtype={field.type}
                        id={field.id}
                        name={option.title}
                        correctiveactiontext={option?.correctiveAction?.text || ''}
                        correctiveactionid={option?.correctiveAction?._id || ''}
                        defaultChecked={!!matchingValue}
                        disabled={field.read_only}
                      />
                      <span className="form-component-checkmark"></span>
                      {option.title}
                    </label>
                    {/* Show corrective action only for matched options that have it */}
                    {matchingValue?.correctiveActionData && (
                      <div className="field-result-option-corrective-action">
                        Corrective action: {matchingValue.correctiveActionData.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </label>
        )}
        {field.type === 'dropdown' && (
          <label key={field.id} htmlFor={field.id} className="form-result-component-container">
            <div className="form-component-dropdown">
              {field.required && <span>*</span>}
              {field.title}
              <CustomSelector options={field.options} 
              selectedValue={selectorValue?.value || ''}
              setSelectorValue={setSelectorValue}
              preFilledData={fieldPreData.value}/>
              <input 
                fieldtype={field.type}
                id={field.id}
                name={field.id}
                disabled={field.read_only}
                value={selectorValue?.value}
                correctiveactiontext={selectorValue?.correctiveAction?.text || ''}
                correctiveactionid={selectorValue?.correctiveAction?._id || ''}
                hidden/>
            </div>
          </label>
        )}
        {field.type === 'double_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <DoubleSectionFormComponent field={field} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'triple_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <TripleSectionFormComponent field={field} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'two_inputs_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <DoubleInputsSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'triple_inputs_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <TripleInputsSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'four_inputs_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <FourSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'five_inputs_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <FiveSectionFormComponent field={field} handleInputChange={handleInputsChange}/>
          </div>
        )}
        {field.type === 'multi_section' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <MultipleSectionFormComponent field={field} handleInputChange={handleInputsChange} handleSelectorChange={handleSelectorChange}/>
          </div>
        )}
        {field.type === 'columns' && (
          <div className="form-result-component-container">
            <div className="form-component-title">
              {field.required && <span>*</span>}
              {field.title} 
            </div>
            <EditingColumnsComponent field={field} handleInputsChange={handleColumnInputsChange} 
            handleSelectorChange={handleColumnSelectorChange} onFileChange={onFileChange} 
            preFilledData={fieldPreData.value}/>
          </div>
        )}
        {field.type === 'add_component_button' && (
          <div className="form-result-component-container">
            <AddButtonComponent field={field} index={index} handleAddingComponent={handleAddingComponent}/>
          </div>
        )}
        {field.type === 'date_time' && (
          <div className="form-result-component-container">
            <div className='form-component-title'>
              {field.required && <span>*</span>}
              {field.title}
            </div>
            <div className='form-live-date-time-container'>
              <label key={field._id} className="form-result-component-container">
                <div className="form-date-time-answer">
                  <input className='form-live-input' id={field.id} fieldtype={field.type} customtype='date' name={field.title+'_date'} placeholder={field.dateFormat}
                  onChange={handleInputChange} required={field.required} disabled={field.read_only}/>
                  <img src={calendar_icon}/>
                </div>
              </label>
              <label key={field._id} className="form-result-component-container">
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
        <FileUploadFormComponent field={field} onFileChange={onFileChange}/>
        }
      </>
    );
};

export default FormResultEditingComponent;