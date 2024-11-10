import { useState, useEffect } from 'react';
import CustomSelector from './CustomSelector';

const ColumnsFormComponent = ({ field, handleInputsChange, handleSelectorChange }) => {
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
  }, [field.value]);

  const handleValueChange = (value, index) => {
    const newValues = [...sectionValues];
    newValues[index] = value;
    setSectionValues(newValues);
    if (field.value[index].type === 'dropdown') {
      handleSelectorChange(value, index);
    } else {
      handleInputsChange(value, index);
    }
  };

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, 1fr)'});
  const [columnStyle, setColumnStyle] = useState({ borderRadius: '4px'});
  const [columnLabelStyle, setColumnLabelStyle] = useState({ border: '1px solid rgb(211, 221, 225)', height: '44px', padding: '12px 8px'});

  useEffect(() =>{
    if(field && field.labels){
      if(field && field.style && field.style === 'tabular'){
        setColumnsStyle({...columnsStyle, gap: '0px', gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
        setColumnStyle({...columnStyle, borderRadius: '0px'})
        setColumnLabelStyle({...columnLabelStyle, border: '1px solid rgb(211, 221, 225)', height: '44px', padding: '12px 8px'})
      }else{
        setColumnsStyle({...columnsStyle, gap: '20px', gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
        setColumnStyle({...columnStyle, borderRadius: '4px'})
        setColumnLabelStyle({...columnLabelStyle, border: 'none', height: 'fit-content', padding: '8px'})
      }
    }
  }, [field])

  return (
    <div className={"form-component-dynamic-columns-container"} style={columnsStyle}>
      {field.labels.map((label, index) => (
        <div className="form-component-column" key={index}>
          <div className="form-section-label" style={columnLabelStyle}>
            {label}
          </div>
          
          {field.value[index].type === 'dropdown' ? (
            <>
              <CustomSelector
                options={field.value[index].options}
                selectedValue={sectionValues[index]}
                setSelectorValue={(selectedOption) => handleValueChange(selectedOption, index)}
              />
              <input
                fieldtype={field.type}
                id={field.id}
                name={field.id}
                sectionName={field.labels[index]}
                customtype="columns"
                disabled={field.read_only}
                value={sectionValues[index]}
                onChange={() => {}}
                hidden
              />
            </>
          ) : (
            <input
              className="form-live-input"
              style={columnStyle}
              id={field.id}
              fieldtype={field.type}
              columnType={field.type}
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
