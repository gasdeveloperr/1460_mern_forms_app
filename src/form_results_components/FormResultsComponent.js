import './FormResultsStyles.css';
import '../FormLiveStyles.css';

const FormResultsComponent = ({ field, data }) => {
  // Get the submitted data for this field
  const fieldData = data[field.id]; 

  return (
    <>
      {field.type === 'short_answer' && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          {!field.read_only &&
            <div className="form-live-component-value">
              {fieldData ? fieldData.value : 'No response'}
            </div>
          }
        </div>
      )}

      {field.type === 'long_answer' && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          <div className="form-live-component-value">
            {fieldData ? fieldData.value : 'No response'}
          </div>
        </div>
      )}

      {field.type === 'title' && (
        <div className="form-short-answer">
          <div className='form-title-component-title' style={{backgroundColor: field.color || '#FFFFFF'}}>
            {field.title}
          </div>
        </div>
      )}
      {field.type === 'radio' && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          <div className="form-live-component-value">
            {fieldData ? fieldData.value : 'No selection'}
          </div>
        </div>
      )}

      {field.type === 'checkbox' && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
            <div className={`form-component-container ${field.layout}`}>
              { field.checkbox.map((option, index)=> (
                <label key={index} className={`form-component-checkbox-container ${field.layout}`}>
                  <input type="checkbox" 
                    fieldtype={field.type}
                    id={field.id} 
                    name={option.title} 
                    disabled={field.read_only}/>
                  <span className="form-component-checkmark"></span>
                  {option.title}
                </label>
                ))
              }
            </div>
          <div className="form-live-component-value">
            {fieldData && fieldData.value.length > 0 ? fieldData.value.join(', ') : 'No selection'}
          </div>
        </div>
      )}

      {field.type === 'name' && fieldData && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          <div className="form-live-component-value">
            {fieldData.value.first_name} {fieldData.value.last_name}
          </div>
        </div>
      )}

      {field.type === 'date_time' && fieldData && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          <div className="form-live-component-value">
            {fieldData.value.date} {fieldData.value.time}
          </div>
        </div>
      )}

      {field.type === 'dropdown' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}:
          </div>
          <div className="form-live-component-dropdown-value">
            {/* Show the selected dropdown option and color */}
            {fieldData ? (
              <div
                className="form-live-component-selected-option"
                style={{
                  backgroundColor: field.dropdown.find(option => option.title === fieldData.value)?.color || '#fff',
                  padding: '5px',
                  borderRadius: '5px',
                  color: '#000'
                }}
              >
                {fieldData.value}
              </div>
            ) : (
              'No selection'
            )}
          </div>
        </div>
      )}
      {field.type === 'double_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}:
          </div>
          <div className="form-component-double-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index].value}
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'triple_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}:
          </div>
          <div className="form-component-triple-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index].value}
              </div>
            ))}
          </div>
        </div>
      )}

      {field.type === 'file_upload' && (
        <div className="form-live-component-container">
          <div className='form-results-component-title'>
            {field.title}:
          </div>
          <div className="form-live-component-value">
            {fieldData ? 'File uploaded' : 'No file uploaded'}
          </div>
        </div>
      )}
    </>
  );
};

export default FormResultsComponent;
