import { useState, useEffect } from 'react';
import CustomSelector from './CustomSelector';

const MultipleSectionFormComponent = ({ field, handleInputValueChange, handleSelectorChange }) => {
  const [sectionValues, setSectionValues] = useState([]);

  // Initialize values based on selected options
  useEffect(() => {
    const initialValues = [field.value[0], field.value[1].options.find(option => option.selected)?.title || '', field.value[2]];
    setSectionValues(initialValues);
  }, [field.value]);

  const handleSelectorValueChange = (selectedOption, index) => {
    const newSelectedValues = [...sectionValues];
    newSelectedValues[index] = selectedOption; // Update the respective value
    setSectionValues(newSelectedValues);

    handleSelectorChange(selectedOption, index); // Call additional change logic
  };

  return (
    <div className="form-component-triple-section-container">
      <div className="form-component-input-section" key={0}>
        <div className="form-section-label">
          {field.labels[0]}
        </div>
        <input
          className='form-live-input'
          id={field.id}
          fieldtype={field.type}
          value={sectionValues[0]}
          name={field.id}
          onChange={(e) => handleInputValueChange(e, 0)}
          required={field.required}
          disabled={field.read_only}
        />
      </div>
      <div className="form-component-double-section" key={1}>
        <div className="form-section-label">
          {field.labels[1]}
        </div>
        <CustomSelector
          options={field.value[1].options}
          selectedValue={sectionValues[1]}
          setSelectorValue={(selectedOption) => handleSelectorValueChange(selectedOption, 1)}
        />
        <input
          fieldtype={field.type}
          id={field.id}
          name={field.id}
          sectionName={field.labels[1]}
          customtype="triple_section"
          disabled={field.read_only}
          value={sectionValues[1]}
          onChange={() => {}}
          hidden
        />
      </div>
     
      <div className="form-component-input-section" key={2}>
        <div className="form-section-label">
          {field.labels[2]}
        </div>
        <input
          className='form-live-input'
          id={field.id}
          fieldtype={field.type}
          value={sectionValues[2]}
          name={field.id}
          onChange={(e) => handleInputValueChange(e, 2)}
          required={field.required}
          disabled={field.read_only}
        />
      </div>
    </div>
  );
};

export default MultipleSectionFormComponent;