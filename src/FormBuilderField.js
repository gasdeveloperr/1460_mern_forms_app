import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import RemoveButton from './RemoveButton';
import { OutsideClickContext } from './OutsideClickContext';
import FieldDropZone from './FieldDropZone';
import isEqual from 'lodash/isEqual';
import selector_icon from './icons/selector-icon.svg'
import plus_icon from './icons/plus-icon.svg'
import file_upload_icon from './icons/file-upload-icon.svg'
import calendar_icon from './icons/calendar-icon.svg'
import FormBuilderSection from './FormBuilderSection';
import UltimateColumnComponent from './form_builder_editor_components/UltimateColumnComponent';

const FormBuilderField = ({field, index, isDragging, setIsDragging, 
  handleDrop, 
  updateFormField, updateFormFieldToServer, removeFormField, 
  editingField, setEditingField,
  editingSectionField, setEditingSectionField}) => {

  const ref = useRef(null);
  
  const { formFieldRef, registerOutsideClickHandler, unregisterOutsideClickHandler } = useContext(OutsideClickContext);

  const [removeOpacity, setRemoveOpacity] = useState('0')

  const handleOutsideClick = useCallback(() => {
    if (field.id === editingField.id) {
      setRemoveOpacity('0');
      //console.log('clicked outside', field, editingField)
      //if (!isEqual(field, editingField)) {
        //updateFormField(field.id, editingField);
        updateFormFieldToServer(field.id, editingField)
      //}
      setEditingField({ id: '' });
    }
  }, [field, editingField, updateFormField, setEditingField]);

  const handleRemoveClick = (fieldId) => {
    removeFormField(fieldId)
    setEditingField({ id: '' });
  }

  useEffect(() => {
    registerOutsideClickHandler(handleOutsideClick);
    return () => {
      unregisterOutsideClickHandler(handleOutsideClick);
    };
  }, [handleOutsideClick]);

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

  const onClickEditorHandler = (event, field) => {
    const isRemoveButton = event.target.closest('.remove-button');
    
    if (!isRemoveButton) {
      setRemoveOpacity('1');
      setEditingField(field);
    }
  };
 
  drag(ref);

  const [columnsStyle, setColumnsStyle] = useState({ gridTemplateColumns: 'repeat(3, 1fr)'});
  const [columnStyle, setColumnStyle] = useState({ borderRadius: '4px'});
  const [columnLabelStyle, setColumnLabelStyle] = useState({ border: '1px solid rgb(211, 221, 225)', padding: '8px'});

  useEffect(() =>{
    if(field && field.labels){
      if(field && field.style && field.style === 'tabular'){
        setColumnsStyle({...columnsStyle, gap: '0px', gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
        setColumnStyle({...columnStyle, borderRadius: '0px', border: '1px solid rgb(211, 221, 225)'})
        setColumnLabelStyle({...columnLabelStyle, border: '1px solid rgb(211, 221, 225)', padding: '8px'})
      }else{
        setColumnsStyle({...columnsStyle, gap: '4px', gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`})
        setColumnStyle({borderRadius: '4px'})
        setColumnLabelStyle({...columnLabelStyle, border: 'none', padding: '0'})
      }
    }
  }, [field])

    return (
      <div key={field.id}  style={{ opacity }} className="form-field-container">
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'top'}/>
        <div className={`form-field ${field.id === editingField.id ? 'chosen-field' : '' }`} ref={formFieldRef} 
        onClick={(e) => onClickEditorHandler(e, field)}>
          <div ref={ref}>
          {field.type === 'short_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
                {field.value}
              </div>
            </div>
          )}
          {field.type === 'long_answer' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div long'>
                {field.value}
              </div>
            </div>
          )}
          {field.type === 'title' && (
            <div className="form-short-answer">
              <div className='form-component-title' style={{backgroundColor: field.color || '#FFFFFF'}}>
                {field.title}
              </div>
            </div>
          )}
          {(field.type === 'email' || field.type === 'phone' || field.type === 'number' || field.type === 'address') && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-input-div short'>
              </div>
            </div>
          )}
          {field.type === 'checkbox' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className={`form-checkbox-answers-${field.layout}`}>
                { field.options &&
                  field.options.map((option, index)=> (
                    <div key={index} className='form-checkbox-option'>
                      <div className={`form-checkbox-option-checker${option.checked ? '-checked' : ''}`}/>
                      <div className='form-checkbox-option-title'>
                        {option.title}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          {field.type === 'radio' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className={`form-checkbox-answers-${field.layout}`}>
                { field.options &&
                  field.options.map((option, index)=> (
                    <div key={index} className='form-checkbox-option'>
                      <div className={`form-checkbox-option-radio${option.checked ? '-checked' : ''}`}/>
                      <div className='form-checkbox-option-title'>
                        {option.title}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
          {field.type === 'date_time' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-form-date-time-inputs">
                <div className="form-component-form-date-inputs">
                  {(field.dateFormat === 'MM/DD/YYYY' || field.dateFormat === 'DD/MM/YYYY' || field.dateFormat === 'YYYY-MM-DD') && (
                    <>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                      <div className='form-component-date-time-input-div'>
                        <img src={selector_icon} />
                      </div>
                    </>
                  )}
                </div>
                <img src={calendar_icon} />
                <div className="form-component-form-time-inputs">
                  {(field.timeFormat === '12' || field.timeFormat === '24') && (
                    <>
                    <div className='form-component-date-time-input-div'>
                      <img src={selector_icon} />
                    </div>
                    <div className='form-component-date-time-input-div'>
                      <img src={selector_icon} />
                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {field.type === 'dropdown' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-dropdown-div' style={{backgroundColor: field.options[0]?.color ? field.options[0]?.color : ''}}>
                {field.options[0]?.title}
                <img src={selector_icon} />
              </div>
            </div>
          )}
          {field.type === 'name' && (
            <div className="form-component-name">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
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
                  {field.labels[0]}
                </div>
                <div className='form-component-label'>
                  {field.labels[1]}
                </div>
              </div>
            </div>
          )}
          {field.type === 'double_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-double-section-container">
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[0]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[0].options[0].color ? field.value[0].color : ''}}>
                    {field.value[0].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[1]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[1].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {field.type === 'triple_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[0]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[0].options[0].color ? field.value[0].color : ''}}>
                    {field.value[0].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[1]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[1].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
                <div className="form-component-double-section">
                  <div className='form-component-label'>
                    {field.labels[2]}
                  </div>
                  <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                    {field.value[2].options[0].title|| '⠀'}
                    <img src={selector_icon} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {field.type === 'two_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-double-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'triple_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'four_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-four-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
         {field.type === 'five_inputs_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-five-section-container">
                {field.labels.map((label, index) => (
                  <div key={index} className="form-component-double-section">
                    <div className='form-component-label'>
                      {label}
                    </div>
                    <div className='form-component-input-div short'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {field.type === 'multi_section' && (
            <div>
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className="form-component-triple-section-container">
              <div key={index} className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[0]}
                </div>
                <div className='form-component-input-div short'>
                  {field.value[0]}
                </div>
              </div>
              <div className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[1]}
                </div>
                <div className='form-component-dropdown-div' style={{backgroundColor: field.value[1].options[0].color ? field.value[1].color : ''}}>
                  {field.value[1].options[0].title|| '⠀'}
                  <img src={selector_icon} />
                </div>
              </div>
              <div key={index} className="form-component-double-section">
                <div className='form-component-label'>
                  {field.labels[2]}
                </div>
                <div className='form-component-input-div short'>
                  {field.value[2]}
                </div>
              </div>
              </div>
            </div>
           )}
           {field.type === 'columns' && (
              <div>
                <div className='form-component-title'>
                  {field.required && <span className='required_sign'>*</span>}
                  {field.title}
                </div>
                <table className={"form-component-dynamic-columns-table"} style={columnsStyle}>
                  {field.labels.map((label, index) => (
                    <td className='form-component-table-label' key={index} style={columnLabelStyle}>
                      {label}
                    </td>
                  ))}
                  {field.value.map((value, index) => (
                    <UltimateColumnComponent key={index} field={value} columnStyle={columnStyle}/>
                  ))}
                </table>
              </div>
            )}
          {field.type === 'add_component_button' && (
            <div className='form-component-add-button'>
              <img src={plus_icon}/>
              {field.adding_component.type ? 
              'Add '+field.adding_component.type.replace(/_/g, ' ')
              : field.title }
            </div>
          )}
           {field.type === 'file_upload' && (
            <div className="form-short-answer">
              <div className='form-component-title'>
                {field.required && <span className='required_sign'>*</span>}
                {field.title}
              </div>
              <div className='form-component-file-upload'>
                <img src={file_upload_icon}/>
              </div>
            </div>
          )}
          {field.type === 'section' && (
            <FormBuilderSection index={index} isDragging={isDragging} setIsDragging={setIsDragging}
             handleDrop={handleDrop} section={field}
             editingField={editingField} setEditingField={setEditingField}
             editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField}/>
          )}
          {/* <RemoveButton opacityVal={removeOpacity} onClick={() => handleRemoveClick(field.id)} /> */}
        </div>
        </div>
        <FieldDropZone index={index} isDragging={isDragging} handleDrop={handleDrop} position={'bottom'}/>
      </div>
    );
};

export default FormBuilderField;