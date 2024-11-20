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
  const minMaxValue = '1fr'

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, '+minMaxValue+')'});
  const [columnStyle, setColumnStyle] = useState({ borderRadius: '4px'});
  const [columnLabelStyle, setColumnLabelStyle] = useState({ border: '1px solid rgb(211, 221, 225)',  padding: '10px 6px'});

  useEffect(() =>{
    if(field && field.labels){
      if(field && field.style && field.style === 'tabular'){
        setColumnsStyle({...columnsStyle, gap: '0px', gridTemplateColumns: `repeat(${field.labels.length}, ${minMaxValue})`})
        setColumnStyle({...columnStyle, borderRadius: '0px'})
        setColumnLabelStyle({...columnLabelStyle, border: '1px solid rgb(211, 221, 225)', padding: '10px 6px'})
      }else{
        setColumnsStyle({...columnsStyle, gap: '10px', gridTemplateColumns: `repeat(${field.labels.length}, ${minMaxValue})`})
        setColumnStyle({...columnStyle, borderRadius: '4px'})
        setColumnLabelStyle({...columnLabelStyle, border: 'none', padding: '8px'})
      }
    }
  }, [field])

  return (
    <table className={"form-component-dynamic-columns-table"} style={columnsStyle}>
      {field.labels.map((label, index) => (
        <td className="form-section-table-label" style={columnLabelStyle}>
          {label}
        </td>
      ))}
      {field.labels.map((label, index) => (
        <td className="form-component-column" key={index}>    
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
        </td>
      ))}
    </table>
  );
};

export default ColumnsFormComponent;
