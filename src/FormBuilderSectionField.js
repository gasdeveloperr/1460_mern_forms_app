import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import RemoveButton from './RemoveButton';
import { OutsideClickContext } from './OutsideClickContext';
import FieldDropZone from './FieldDropZone';
import isEqual from 'lodash/isEqual';
import selector_icon from './icons/selector-icon.svg'
import plus_icon from './icons/plus-icon.svg'
import file_upload_icon from './icons/file-upload-icon.svg'
import calendar_icon from './icons/calendar-icon.svg'
import FormBuilderSectionComponent from './FormBuilderSection';

const FormBuilderSectionField = ({field, index, isDragging, setIsDragging, 
  handleDrop, sectionId,
  updateFormField, removeFormField, 
  editingField, setEditingField,
  editingSectionField, setEditingSectionField}) => {

  const ref = useRef(null);
  
  const { formFieldRef, registerOutsideClickHandler, unregisterOutsideClickHandler } = useContext(OutsideClickContext);

  const [removeOpacity, setRemoveOpacity] = useState('0')

  const handleOutsideClick = useCallback(() => {
    if (field.id === editingSectionField.id) {
      setRemoveOpacity('0');
      //console.log('clicked outside W', editingField, editingSectionField)
      // if (!isEqual(field, editingSectionField)) {
      //   updateFormField(field.id, editingSectionField);
      // }
      setEditingSectionField({ id: '' });
    }
  }, [field, editingField, updateFormField, setEditingSectionField]);

  const handleRemoveClick = (fieldId) => {
    removeFormField(fieldId)
    setEditingSectionField({ id: '' });
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

  const onClickEditorHandler = (event, field) => {
    const isRemoveButton = event.target.closest('.remove-button');
    
    if (!isRemoveButton) {
      setRemoveOpacity('1');
      setEditingSectionField(field);
      console.log('setEditingSectionField : ',editingSectionField)
    }
  };
 
  drag(ref);

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, 1fr)'});

  useEffect(() =>{
    if(field && field.labels){
      setColumnsStyle({...columnsStyle, gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
    }
  }, [field])

    return (
      <div key={field.id}  style={{ opacity }} className="form-field-container">
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'top'} sectionId={sectionId}/>
        <div className={`form-field ${field.id === editingSectionField.id ? 'chosen-field' : '' }`} ref={formFieldRef} 
        onClick={(e) => onClickEditorHandler(e, field)}>
          <div ref={ref}>
          {field.type === 'short_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
                {field.value}
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
                {field.value}
              </div>
            </div>
          )}
          {field.type === 'title' && (
            <div className="form-short-answer">
              <div className='form-component-title' style={{backgroundColor: field.color || '#FFFFFF'}}>
                {field.title}
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
              <div className='form-component-dropdown-div' style={{backgroundColor: field.dropdown[0].color ? field.dropdown[0].color : ''}}>
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
          {field.type === 'double_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-double-section-container">
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[0]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[0].options[0].color ? field.value[0].color : ''}}>
                    {field.value[0].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[1]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[1].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {field.type === 'triple_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[0]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[0].options[0].color ? field.value[0].color : ''}}>
                    {field.value[0].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[1]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[1].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[2]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[2].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {field.type === 'two_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-double-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'triple_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'four_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-four-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
         {field.type === 'five_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-five-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'multi_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
              <div key={index} className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[0]}
                </div>
                <div className='form-component-input-div short'>
                  {field.value[0]}
                </div>
              </div>
              <div className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[1]}
                </div>
                <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                  {field.value[1].options[0].title|| '⠀'}
                  <img src={selector_icon} />
                </div>
              </div>
              <div key={index} className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[2]}
                </div>
                <div className='form-component-input-div short'>
                  {field.value[2]}
                </div>
              </div>
              </div>
            </div>
           )}
           {field.type === 'columns' && (
              <div>
                <div className='form-component-title'>
                  {field.required && <span className='required_sign'>*</span>}
                  {field.title}
                </div>
                <div className={"form-component-dynamic-columns-container"} style={columnsStyle}>
                  {field.labels.map((label, index) => (
                    <div key={index} className="form-component-double-section">
                      <div className='form-component-label'>
                        {label}
                      </div>
                      {
                        field.value[index].type === 'dropdown' ?
                        <div className='form-component-dropdown-div' style={{backgroundColor: field.value[index].options[0].color ? field.value[1].color : ''}}>
                          {field.value[index].options[0].title|| '⠀'}
                          <img src={selector_icon} />
                        </div>
                        :
                        <div className='form-component-input-div short'>
                        </div>
                      }
                    </div>
                  ))}
                </div>
              </div>
            )}
          {field.type === 'add_component_button' && (
            <div className='form-component-add-button'>
              <img src={plus_icon}/>
              {field.title}
            </div>
          )}
          {field.type === 'file_upload' && (
            <div className="form-short-answer">
              <div className='form-component-file-upload'>
                <img src={plus_icon}/>
                {field.title}
              </div>
            </div>
          )}
        </div>
        </div>
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'bottom'} sectionId={sectionId}/>
      </div>
    );
};

export default FormBuilderSectionField;