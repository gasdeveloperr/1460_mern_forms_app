import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import RemoveButton from './RemoveButton';
import { OutsideClickContext } from './OutsideClickContext';
import FieldDropZone from './FieldDropZone';

const FormBuilderField = ({field, index, isDragging, setIsDragging, 
  handleDrop, removeFormField, 
  editingField, setEditingField}) => {

  const ref = useRef(null);
  
  const { formFieldRef, registerOutsideClickHandler, unregisterOutsideClickHandler } = useContext(OutsideClickContext);

  const handleOutsideClick = () => {
    setEditingField(prev => ({id: ''}));
  };

  useEffect(() => {
    registerOutsideClickHandler(handleOutsideClick);
    return () => {
      unregisterOutsideClickHandler(handleOutsideClick);
    };
  }, []);

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


  const onClickEditorHandler = (fieldId) => {
    console.log('clicked', fieldId);
    setEditingField(fieldId)
  }
 
  drag(ref);

    return (
      <div key={field.id}  style={{ opacity }} className="form-field-container">
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'top'}/>
        <div className={`form-field ${field.id === editingField.id ? 'chosen-field' : '' }`} ref={formFieldRef} 
        onClick={() => onClickEditorHandler(field)}>
          <div ref={ref}>
          {field.type === 'short_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'long_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div long'>
              </div>
            </div>
          )}
          {field.type === 'name' && (
            <div className="form-component-name">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
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
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <div className='form-component-label'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
              </div>
            </div>
          )}
          <RemoveButton onClick={() => removeFormField(field.id)} />
        </div>
        </div>
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'bottom'}/>
      </div>
    );
};

export default FormBuilderField;