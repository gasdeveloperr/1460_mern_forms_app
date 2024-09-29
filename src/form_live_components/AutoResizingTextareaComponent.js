import React, { useState, useRef, useEffect } from 'react';

const AutoResizingTextareaComponent = ({field, handleInputChange}) => {
  const [value, setValue] = useState(field.value);
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  // Adjust height on mount and when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <label key={field.id} className="form-live-component-container">
      <div className="form-short-answer">
        <div className='form-component-title'>
          {field.required && <span>*</span>}
          {field.title}
        </div>
        <textarea className='long-answer-input' id={field.id} 
          fieldtype={field.type} value={field.value}
          name={field.title} 
          ref={textareaRef} onChange={(event) => {
            handleInputChange(event);
          }}
          required={field.required} 
          disabled={field.read_only}/>
      </div>
    </label>
  );
};

export default AutoResizingTextareaComponent;
