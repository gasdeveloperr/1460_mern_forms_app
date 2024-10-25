import { useState, useEffect } from 'react';
import CustomSelector from './CustomSelector';

const ColumnsFormComponent = ({ field, handleInputValueChange, handleSelectorChange }) => {
  const [sectionValues, setSectionValues] = useState([]);

  // Initialize values based on field structure
  useEffect(() => {
    const initialValues = field.value.map((col) => {
      if (col.type === 'dropdown') {
        return col.options.find(option => option.selected)?.title || '';
      }
      return col.value || '';
    });
    setSectionValues(initialValues);
  }, [field.columns]);

  const handleValueChange = (value, index) => {
    const newValues = [...sectionValues];
    newValues[index] = value;
    setSectionValues(newValues);

    if (field.columns[index].type === 'dropdown') {
      handleSelectorChange(value, index); // Handle custom dropdown change
    } else {
      handleInputValueChange(value, index); // Handle regular input change
    }
  };

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, 1fr)'});

  useEffect(() =>{
    if(field && field.labels){
      setColumnsStyle({...columnsStyle, gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
    }
  }, [field])

  return (
    <div className={"form-component-dynamic-columns-container"} style={columnsStyle}>
      {field.labels.map((label, index) => (
        <div className="form-component-column" key={index}>
          <div className="form-section-label">
            {label}
          </div>
          
          {field.value[index].type === 'dropdown' ? (
            <CustomSelector
              options={field.value[index].options}
              selectedValue={sectionValues[index]}
              setSelectorValue={(selectedOption) => handleValueChange(selectedOption, index)}
            />
          ) : (
            <input
              className="form-live-input"
              id={field.id}
              fieldtype={field.value[index].type}
              value={sectionValues[index]}
              name={`${field.id}-${index}`}
              onChange={(e) => handleValueChange(e.target.value, index)}
              required={field.required}
              disabled={field.read_only}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ColumnsFormComponent;
