import { useState } from 'react';

const FiveSectionFormComponent = ({ field, handleInputChange }) => {
  const [inputValues, setInputValues] = useState(field.value);

  const handleInputValueChange = (e, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);

    handleInputChange(e, index);
  };

  return (
    <div className="form-component-five-section-container">
      {field.labels.map((label, index) => (
        <div className="form-component-input-section" key={index}>
          <div className="form-section-label">
            {label}
          </div>
          <input
            className='form-live-input'
            id={field.id}
            fieldtype={field.type}
            value={inputValues[index]}
            name={field.id}
            onChange={(e) => handleInputValueChange(e, index)}
            required={field.required}
            disabled={field.read_only}
          />
        </div>
      ))}
    </div>
  );
};

export default FiveSectionFormComponent;
