import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import RemoveButton from './RemoveButton';
import { OutsideClickContext } from './OutsideClickContext';
import FieldDropZone from './FieldDropZone';
import isEqual from 'lodash/isEqual';

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
          {field.type === 'address' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'email' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'phone' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'number' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
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
          <RemoveButton opacityVal={removeOpacity} onClick={() => handleRemoveClick(field.id)} />
        </div>
        </div>
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'bottom'}/>
      </div>
    );
};

export default FormBuilderField;