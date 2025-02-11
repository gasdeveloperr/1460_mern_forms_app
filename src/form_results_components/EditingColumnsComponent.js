import { useState, useEffect } from 'react';
import UltimateLiveColumnComponent from './UltimateEditingColumnComponent';
import add_icon from '../icons/plus-icon.svg';
import UltimateResultColumnComponent from './UltimateResultColumnComponent';
import UltimateEditingColumnComponent from './UltimateEditingColumnComponent';

const EditingColumnsComponent = ({ field, handleInputsChange, 
  handleSelectorChange, onFileChange, handleFieldChange, preFilledData }) => {
  const [rows, setRows] = useState([]);
  const [sectionValues, setSectionValues] = useState([]);

  // Initialize rows and sectionValues based on field structure
  useEffect(() => {
    const groupedRows = [];
    const initialValues = [];
    for (let i = 0; i < field.value.length; i += field.labels.length) {
      groupedRows.push(field.value.slice(i, i + field.labels.length));
    }
    field.value.forEach((col) => {
      if (col.type === 'dropdown') {
        initialValues.push(col.options.find(option => option.selected)?.title || '');
      } else {
        initialValues.push(col.value || '');
      }
    });

    setRows(groupedRows);
    setSectionValues(initialValues);
  }, [field.value, field.labels]);

  const handleAddingNewRow = () => {
    const newRow = rows[0].map(col => {
        if (col.type === 'dropdown') {
            return { ...col, options: col.options.map(option => ({ ...option, selected: false })) };
        } else {
            return { ...col, value: '' };
        }
    });
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);

    // Update sectionValues
    const newRowValues = newRow.map(col => (col.type === 'dropdown' ? '' : ''));
    const updatedValues = [...sectionValues, ...newRowValues];
    setSectionValues(updatedValues);

    // Flatten rows back into field.value for storage
    const updatedFieldValue = updatedRows.flat();
    console.log('updatedFieldValue ', updatedFieldValue);
    handleFieldChange(updatedFieldValue);
};

  // Add a new column
  const handleAddingNewColumn = (newLabel) => {
    const updatedLabels = [...field.labels, newLabel];
    const updatedRows = rows.map((row) => [...row, { type: 'text', value: '' }]);

    setRows(updatedRows);
    field.labels = updatedLabels;

    // Update sectionValues with default values for the new column
    const updatedValues = [...sectionValues];
    rows.forEach(() => updatedValues.push(''));
    setSectionValues(updatedValues);

    const updatedFieldValue = updatedRows.flat();
    handleInputsChange(updatedFieldValue);
  };

  // Handle value change
  const handleValueChange = (value, rowIndex, colIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex].value = value;
    setRows(updatedRows);

    // Update sectionValues
    const flatIndex = rowIndex * field.labels.length + colIndex;
    const updatedValues = [...sectionValues];
    updatedValues[flatIndex] = value;
    setSectionValues(updatedValues);

    // Flatten rows back into field.value for storage
    const updatedFieldValue = updatedRows.flat();
    handleInputsChange(value, flatIndex);
  };

  const minMaxValue = '1fr'

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, '+minMaxValue+')'});
  const [columnStyle, setColumnStyle] = useState({ borderRadius: '4px'});
  const [columnLabelStyle, setColumnLabelStyle] = useState({ border: '1px solid rgb(211, 221, 225)',  padding: '10px 6px'});

  useEffect(() =>{
    if(field && field.labels){
      if(field && field.style && field.style === 'tabular'){
        setColumnsStyle({...columnsStyle, gap: '0px', gridTemplateColumns: `repeat(${field.labels.length}, ${minMaxValue})`})
        setColumnStyle({...columnStyle, borderRadius: '0px', border: '1px solid rgb(211, 221, 225)'})
        setColumnLabelStyle({...columnLabelStyle, border: '1px solid rgb(211, 221, 225)', padding: '10px 6px'})
      }else{
        setColumnsStyle({...columnsStyle, gap: '4px', gridTemplateColumns: `repeat(${field.labels.length}, ${minMaxValue})`})
        setColumnStyle({borderRadius: '4px'})
        setColumnLabelStyle({...columnLabelStyle, border: 'none', padding: '2px 4px'})
      }
    }
  }, [field])

  return (
    <div>
      <table className="form-component-dynamic-columns-table">
        <tr className="form-component-dynamic-columns-table-row" 
        style={columnsStyle}>
          {field.labels.map((label, index) => (
            <td key={index} 
            className="form-section-table-label" style={columnLabelStyle}>
              {label}
            </td>
          ))}
        </tr>
        {rows.length !== 0 && rows.map((row, rowIndex) => (
          <tr className="form-component-dynamic-columns-table-row" 
           key={rowIndex} style={columnsStyle}>
            {row.map((col, colIndex) => (
              <td className="form-component-column" key={colIndex} style={columnStyle}>
                <UltimateEditingColumnComponent
                  field={field}
                  columnValue={col}
                  labelName={field.labels[colIndex]}
                  columnIndex={colIndex} rowIndex={rowIndex} 
                  columnStyle={columnStyle}
                  sectionValues={sectionValues}
                  isTabular={field.style === 'tabular'}
                  handleValueChange={(value) => handleValueChange(value, rowIndex, colIndex)}
                  onFileChange={onFileChange}
                  preFilledData={preFilledData[rowIndex][colIndex]}
                />
              </td>
            ))}
          </tr>
        ))}
        {
          field.settings && field.settings === 'add_row' &&
          <div className="form-component-dynamic-columns-table-add-row" 
          id='add_new_row' onClick={() => handleAddingNewRow()}>
            <img src={add_icon} alt="" className="size22-icon"/>
          </div>
        }
      </table>
    </div>
  );
};

export default EditingColumnsComponent;
