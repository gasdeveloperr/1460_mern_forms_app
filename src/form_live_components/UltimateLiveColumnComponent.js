import plus_icon from '../icons/plus-icon.svg'
import calendar_icon from '../icons/calendar-icon.svg'
import time_icon from '../icons/time-icon.svg' 
import file_upload_icon from '../icons/file-upload-icon.svg'
import CustomSelector from './CustomSelector'
import FileUploadFormComponent from './FileUploadFormComponent'
import { useState } from 'react'

const UltimateLiveColumnComponent = ({field, columnValue, labelName, columnStyle, isTabular,
  columnIndex, sectionValues, handleValueChange, onFileChange}) => {

    const [selectorValue, setSelectorValue] = useState(null);

  return ( 
    <>
      {(columnValue.type === 'short_answer' || columnValue.type === 'long_answer') && (
        <input
          className="form-live-input"
          id={field.id}
          columnIndex={columnIndex}
          style={{height: isTabular ? '100%' : '', border: isTabular ? 'none' : ''}} 
          fieldtype={field.type}
          columnType={columnValue.type}
          value={sectionValues[columnIndex]}
          name={`${field.id}-${columnIndex}`}
          onChange={(e) => handleValueChange(e.target.value, columnIndex)}
          required={columnValue.required}
          disabled={columnValue.read_only}
        />
      )}
      {(columnValue.type === 'email' || columnValue.type === 'phone' || columnValue.type === 'number' || columnValue.type === 'address') && (
        <input
          className="form-live-input"
          id={field.id}
          columnIndex={columnIndex}
          style={{height: isTabular ? '100%' : '', border: isTabular ? 'none' : ''}} 
          fieldtype={field.type}
          columnType={columnValue.type}
          value={sectionValues[columnIndex]}
          name={`${field.id}-${columnIndex}`}
          onChange={(e) => handleValueChange(e.target.value, columnIndex)}
          required={columnValue.required}
          disabled={columnValue.read_only}
        />
      )}
      {columnValue.type === 'checkbox' && (
        <div className={`form-component-container ${columnValue.layout}`} style={{padding:'6px'}}>
          { columnValue.options.map((option, optionIndex)=> (
            <label key={optionIndex} className={`form-component-checkbox-container ${columnValue.layout}`}>
              <input 
                type="checkbox" 
                fieldtype={field.type}
                id={field.id} 
                columnIndex={columnIndex}
                name={option.title} 
                columnType={'checkbox'}
                customtype="columns"
                disabled={columnValue.read_only}/>
              <span className="form-component-checkmark"></span>
              {option.title}
            </label>
            ))
          }
        </div>
      )}
      {columnValue.type === 'radio' && (
        <div className={`form-component-container ${columnValue.layout}`} style={{padding:'6px'}}>
          { columnValue.options.map((option, optionIndex)=> (
            <label key={optionIndex} className='form-component-radio-container'>
              <input
                type="radio"
                fieldtype={field.type}
                id={field.id}
                columnIndex={columnIndex}
                name={field.id}
                columnType={'radio'}
                sectionName={labelName}
                customtype="columns"
                value={option.title}
                disabled={columnValue.read_only}
              />
              <span className="form-component-radiomark"></span>
              {option.title}
            </label>
            ))
          }
        </div>
      )}
      {columnValue.type === 'date_time' && (
        <div className='form-live-date-time-container'>
          <label key={columnValue._id} className="form-live-component-container">
            <div className="form-date-time-answer">
              <input className='form-live-input' id={field.id} fieldtype={field.type} customtype='date' name={columnValue.title+'_date'} placeholder={columnValue.dateFormat}
              onChange={handleValueChange} required={columnValue.required} disabled={columnValue.read_only}/>
              <img src={calendar_icon}/>
            </div>
          </label>
          <label key={columnValue._id} className="form-live-component-container">
            <div className="form-date-time-answer">
              <input className='form-live-input' id={field.id} fieldtype={field.type} customtype='time' name={columnValue.title+'_time'} placeholder='hh:mm'
              onChange={handleValueChange} required={columnValue.required} disabled={columnValue.read_only}/>
              <img src={time_icon}/>
            </div>
          </label>
        </div>
      )}
      {columnValue.type === 'dropdown' && (
        <>
          <CustomSelector
            options={columnValue.options}
            selectedValue={selectorValue?.value || ''}
            columnStyle={columnStyle} isTabular={isTabular}
            setSelectorValue={setSelectorValue}
          />
          <input
            fieldtype={field.type}
            id={field.id}
            columnIndex={columnIndex}
            name={field.id}
            sectionName={labelName}
            customtype="columns"
            disabled={columnValue.read_only}
            value={selectorValue?.value}
            correctiveactiontext={selectorValue?.correctiveAction?.text || ''}
            correctiveactionid={selectorValue?.correctiveAction?._id || ''}
            onChange={() => {}}
            hidden
          />
        </>
      )}
      {columnValue.type === 'name' && (
        <td className="form-component-name">
          <div className='form-component-title'>
            {columnValue.required && <span className='required_sign'>*</span>}
            {columnValue.title}
          </div>
          <div className="form-component-name-fields">

            <div className='form-component-input-div short'>
            </div>
            <div className='form-component-input-div short'>
            </div>
          </div>
          <div className="form-component-name-fields">
            <div className='form-component-label'>
              {columnValue.labels[0]}
            </div>
            <div className='form-component-label'>
              {columnValue.labels[1]}
            </div>
          </div>
        </td>
      )}
      {/* {columnValue.type === 'add_component_button' && (
        <div className='form-component-add-button'>
          <img src={plus_icon}/>
          {columnValue.adding_component.type ? 
          'Add '+columnValue.adding_component.type.replace(/_/g, ' ')
          : columnValue.title }
        </div>
      )} */}
      {columnValue.type === 'file_upload' && (
        <td className="form-component-name">
          <FileUploadFormComponent columnValue={columnValue} onFileChange={onFileChange}/>
        </td>
      )}
    </>
   );
}
 
export default UltimateLiveColumnComponent;