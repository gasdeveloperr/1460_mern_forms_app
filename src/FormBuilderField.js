import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import Header from './Header';
import RemoveButton from './RemoveButton';

const FormBuilderField = ({field, index, isDragging, handleDrop, removeFormField}) => {

  const accept_types_array = ['short_answer', 'long_answer', 'name', 'address', 'email', 'phone',
  'number', 'dropdown', 'radio', 'checkbox', 'credit_card', 'date_time', 'file_upload', 
  'matrix', 'description', 'embed_code', 'event_product', 'signature', 'rating', 
  'section']

  const useDropArea = (index, onDrop) => {
    const [{ isOver }, drop] = useDrop({
      accept:accept_types_array,
      drop: (item) => onDrop(item, index),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });
  
    return { isOver, drop };
  };

  const { isOver: isOverTop, drop: dropTop } = useDropArea(index, handleDrop);
  const { isOver: isOverBottom, drop: dropBottom } = useDropArea(index + 1, handleDrop);

    return (
      <div key={field.id} className="form-field-container">
        <div
          ref={dropTop}
          className={`drop-area drop-top ${isDragging ? 'drop-over' : ''}`}
        />
        <div className="form-field">
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
        <div
          ref={dropBottom}
          className={`drop-area drop-bottom ${isDragging ? 'drop-over' : ''}`}
        />
      </div>
    );
};

export default FormBuilderField;