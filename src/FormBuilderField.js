import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import RemoveButton from './RemoveButton';
import { OutsideClickContext } from './OutsideClickContext';
import FieldDropZone from './FieldDropZone';
import isEqual from 'lodash/isEqual';
import selector_icon from './icons/selector-icon.svg'
import file_upload_icon from './icons/file-upload-icon.svg'
import calendar_icon from './icons/calendar-icon.svg'

const FormBuilderField = ({field, index, isDragging, setIsDragging, 
  handleDrop, 
  updateFormField, removeFormField, 
  editingField, setEditingField}) => {

  const ref = useRef(null);
  
  const { formFieldRef, registerOutsideClickHandler, unregisterOutsideClickHandler } = useContext(OutsideClickContext);

  const [removeOpacity, setRemoveOpacity] = useState('0')

  const handleOutsideClick = useCallback(() => {
    if (field.id === editingField.id) {
      setRemoveOpacity('0');
      //console.log('clicked outside')
      if (!isEqual(field, editingField)) {
        updateFormField(field.id, editingField);
      }
      setEditingField({ id: '' });
    }
  }, [field, editingField, updateFormField, setEditingField]);

  const handleRemoveClick = (fieldId) => {
    removeFormField(fieldId)
    setEditingField({ id: '' });
  }

  useEffect(() => {
    registerOutsideClickHandler(handleOutsideClick);
    return () => {
      unregisterOutsideClickHandler(handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const [{ isFieldDragging }, drag] = useDrag({
    type: field.type,
    item: { ...field, index },
    collect: (monitor) => ({
      isFieldDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    setIsDragging(isFieldDragging)
  }, [isFieldDragging])

  const opacity = isFieldDragging ? 0.7 : 1;

  const onClickEditorHandler = (event, fieldId) => {
    const isRemoveButton = event.target.closest('.remove-button');
    
    if (!isRemoveButton) {
      setRemoveOpacity('1');
      setEditingField(fieldId);
    }
  };
 
  drag(ref);

    return (
      <div key={field.id}  style={{ opacity }} className="form-field-container">
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'top'}/>
        <div className={`form-field ${field.id === editingField.id ? 'chosen-field' : '' }`} ref={formFieldRef} 
        onClick={(e) => onClickEditorHandler(e, field)}>
          <div ref={ref}>
          {field.type === 'short_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'long_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div long'>
              </div>
            </div>
          )}
          {(field.type === 'email' || field.type === 'phone' || field.type === 'number' || field.type === 'address') && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'checkbox' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className={`form-checkbox-answers-${field.layout}`}>
                { field.checkbox &&
                  field.checkbox.map((option, index)=> (
                    <div key={index} className='form-checkbox-option'>
                      <div className={`form-checkbox-option-checker${option.checked ? '-checked' : ''}`}/>
                      <div className='form-checkbox-option-title'>
                        {option.title}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          {field.type === 'radio' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className={`form-checkbox-answers-${field.layout}`}>
                { field.radio &&
                  field.radio.map((option, index)=> (
                    <div key={index} className='form-checkbox-option'>
                      <div className={`form-checkbox-option-radio${option.checked ? '-checked' : ''}`}/>
                      <div className='form-checkbox-option-title'>
                        {option.title}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          {field.type === 'date_time' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-form-date-time-inputs">
                <div className="form-component-form-date-inputs">
                  {(field.dateFormat === 'MM/DD/YYYY' || field.dateFormat === 'DD/MM/YYYY' || field.dateFormat === 'YYYY-MM-DD') && (
                    <>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                    </>
                  )}
                </div>
                <img src={calendar_icon} />
                <div className="form-component-form-time-inputs">
                  {(field.timeFormat === '12' || field.timeFormat === '24') && (
                    <>
                    <div className='form-component-date-time-input-div'>
                      <img src={selector_icon} />
                    </div>
                    <div className='form-component-date-time-input-div'>
                      <img src={selector_icon} />
                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {field.type === 'dropdown' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-dropdown-div'>
                {field.dropdown[0].title}
                <img src={selector_icon} />
              </div>
            </div>
          )}
          {field.type === 'name' && (
            <div className="form-component-name">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-name-fields">

                <div className='form-component-input-div short'>
                </div>
                <div className='form-component-input-div short'>
                </div>
              </div>
              <div className="form-component-name-fields">
                <div className='form-component-label'>
                  {field.labels[0]}
                </div>
                <div className='form-component-label'>
                  {field.labels[1]}
                </div>
              </div>
            </div>
          )}
          {field.type === 'file_upload' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-file-upload'>
                <img src={file_upload_icon}/>
              </div>
            </div>
          )}
          <RemoveButton opacityVal={removeOpacity} onClick={() => handleRemoveClick(field.id)} />
        </div>
        </div>
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'bottom'}/>
      </div>
    );
};

export default FormBuilderField;