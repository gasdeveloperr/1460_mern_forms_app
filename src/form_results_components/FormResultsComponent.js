import './FormResultsStyles.css';
import '../FormLiveStyles.css';
import UltimateResultColumnComponent from './UltimateResultColumnComponent';

const FormResultsComponent = ({ field, data }) => {
  
  let fieldData = {};
  if (data && data.hasOwnProperty(field.id) && data[field.id] !== undefined) {
    fieldData = data[field.id];
  } else if(field.type !== 'title'){
    //console.log(`No data found for field ID: ${field.id}`);
    return null;
  }

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
      {field.type === 'email' && (
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
      {field.type === 'number' && (
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
          <div className='form-result-title-component' style={{backgroundColor: field.color || '#FFFFFF'}}>
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
              { fieldData && fieldData.value.length !== 0 ?
               fieldData.value.map((value, index)=> (
                <label key={index} className={`form-component-checkbox-container ${field.layout}`}>
                  <input type="checkbox" 
                    name={value} 
                    checked={true}
                    disabled={true}/>
                  <span className="form-component-checkmark"></span>
                  {value}
                </label>
                ))
                :
                <div className="form-live-component-value">
                  No selection
                </div>
              }
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
            {field.title}
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
            {field.title}
          </div>
          <div className="form-component-triple-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                <div 
                style={{color: fieldData.value[index].value==='Current'? '#7bb163' :
                  fieldData.value[index].value==='Out of Date (15-30 Days)'? '#f1c336':
                  fieldData.value[index].value==='Out of Date (30-60 Days)'? '#e6933b':
                  fieldData.value[index].value==='Out of Date (More than 60 Days)' ? '#ff0909':
                  ''}}>
                {fieldData.value[index].value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'two_inputs_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
          <div className="form-component-double-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index]}
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'triple_inputs_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
          <div className="form-component-triple-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index]}
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'four_inputs_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
          <div className="form-component-four-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index]}
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'five_inputs_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
          <div className="form-component-five-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                {fieldData.value[index]}
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'multi_section' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
          <div className="form-component-triple-section-container">
            {field.labels.map((label, index) => (
              <div className="form-component-double-section" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                <div 
                style={{color: fieldData.value[index]==='Monthly'? '#7bb163' :
                fieldData.value[index]==='Quarterly'? '#f1c336':
                (fieldData.value[index]==='Annually' || fieldData.value[index]==='Not Reviewed')? '#ff0909':
                ''}}>
                  {fieldData.value[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {field.type === 'columns' && (
        <div className="form-live-component-container">
          <div className="form-results-component-title">
            {field.title}
          </div>
  
          {
            field.style && field.style === 'tabular' ? 
            <table className="form-results-table">
              <tr>
                {field.labels.map((label, index) => (
                  <td className="form-results-td">
                    {label}
                  </td>
                ))}
              </tr>
              <tr>
                {field.value.map((value, index) => (
                  <td className="form-results-td">
                    {
                      fieldData.value && fieldData.value[index] &&
                      <UltimateResultColumnComponent fieldValue={fieldData.value[index]} field={value}/>
                    }
                  </td>
                ))}
              </tr>
            </table>
          :
          <div className="form-component-dynamic-columns-container" 
            style={{gridTemplateColumns: `repeat(${field.labels.length}, 1fr)`}}>
            {field.labels.map((label, index) => (
              <div className="form-component-column" key={index}>
                <div className="form-results-section-label">
                  {label}
                </div>
                <div className="form-results-section-result"
                // style={{color: fieldData.value[index]==='Monthly'? '#7bb163' :
                // fieldData.value[index]==='Quarterly'? '#f1c336':
                // (fieldData.value[index]==='Annually' || fieldData.value[index]==='Not Reviewed')? '#ff0909':
                // ''}}
                >
                  {
                    fieldData.value && fieldData.value[index] &&
                    <UltimateResultColumnComponent fieldValue={fieldData.value[index]} field={field.value[index]}/>
                  }
                </div>
              </div>
            ))}
          </div>
          }
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
