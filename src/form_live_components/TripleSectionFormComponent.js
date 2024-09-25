import { useState, useEffect } from 'react';
import CustomSelector from './CustomSelector';

const TripleSectionFormComponent = ({ field, handleSelectorChange }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  // Initialize values based on selected options
  useEffect(() => {
    const initialValues = field.value.map(item => item.options.find(option => option.selected)?.title || '');
    setSelectedValues(initialValues);
  }, [field.value]);

  const handleSelectorValueChange = (selectedOption, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = selectedOption; // Update the respective value
    setSelectedValues(newSelectedValues);

    handleSelectorChange(selectedOption, index); // Call additional change logic
  };

  return (
    <div className="form-component-triple-section-container">
      {field.labels.map((label, index) => (
        <div className="form-component-double-section" key={index}>
          <div className="form-section-label">
            {label}
          </div>
          <CustomSelector
            options={field.value[index].options}
            selectedValue={selectedValues[index]} // Bind selected value to state
            setSelectorValue={(selectedOption) => handleSelectorValueChange(selectedOption, index)}
          />
          <input
            fieldtype={field.type}
            id={field.id}
            name={field.id}
            sectionName={label}
            customtype="triple_section"
            disabled={field.read_only}
            value={selectedValues[index]} // Bind input value to state
            onChange={() => {}} // Ensure input control
            hidden
          />
        </div>
      ))}
    </div>
  );
};

export default TripleSectionFormComponent;