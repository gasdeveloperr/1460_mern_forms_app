import selector_icon from '../icons/selector-icon.svg'
import plus_icon from '../icons/plus-icon.svg'
import file_upload_icon from '../icons/file-upload-icon.svg'
import calendar_icon from '../icons/calendar-icon.svg'

const UltimateColumnComponent = ({field, columnStyle}) => {

  return ( 
    <>
      {field.type === 'short_answer' && (
        <td style={columnStyle} className='form-component-input-div short'>
          {field.value}
        </td>
      )}
      {field.type === 'long_answer' && (
        <td style={columnStyle} className='form-component-input-div long'>
          {field.value}
        </td>
      )}
      {(field.type === 'email' || field.type === 'phone' || field.type === 'number' || field.type === 'address') && (
        <td style={columnStyle} className='form-component-input-div short'>
        </td>
      )}
      {field.type === 'checkbox' && (
        <td style={{...columnStyle, padding:'6px'}} className={`form-checkbox-answers-${field.layout}`}>
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
        </td>
      )}
      {field.type === 'radio' && (
        <td style={{...columnStyle, padding:'6px'}} className={`form-checkbox-answers-${field.layout}`}>
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
        </td>
      )}
      {field.type === 'date_time' && (
        <td style={columnStyle} className="form-component-form-date-time-inputs">
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
        </td>
      )}
      {field.type === 'dropdown' && (
        <td className='form-component-dropdown-div' 
        style={{...columnStyle, backgroundColor: field.options[0].color ? field.options[0].color : ''}}>
          {field.options[0].title}
          <img src={selector_icon} />
        </td>
      )}
      {field.type === 'name' && (
        <td style={columnStyle} className="form-component-name">
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
        </td>
      )}
      {/* {field.type === 'add_component_button' && (
        <div className='form-component-add-button'>
          <img src={plus_icon}/>
          {field.adding_component.type ? 
          'Add '+field.adding_component.type.replace(/_/g, ' ')
          : field.title }
        </div>
      )} */}
      {field.type === 'file_upload' && (
        <td style={columnStyle} className='form-component-input-div'>
          <img src={file_upload_icon} className='size24-icon'/>
        </td>
      )}
    </>
   );
}
 
export default UltimateColumnComponent;