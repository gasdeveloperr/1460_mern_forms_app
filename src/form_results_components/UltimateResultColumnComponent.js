const UltimateResultColumnComponent = ({fieldValue, field}) => {
  // console.log('fieldValue  :', fieldValue)
  // console.log(' field :',  field)
  return ( 
    <>
    {field.type === 'short_answer' && (
        <div className="form-result-component-container">
          {!field.read_only &&
            <div className="form-result-component-value">
              {
                fieldValue && fieldValue.result ? fieldValue.result
                : fieldValue && !fieldValue.result ? fieldValue
                : ''
              }
            </div>
          }
        </div>
      )}
      {field.type === 'email' && (
        <div className="form-result-component-container">
          {!field.read_only &&
            <div className="form-result-component-value">
              {
                fieldValue && fieldValue.result ? fieldValue.result
                : fieldValue && !fieldValue.result ? fieldValue
                : ''
              }
            </div>
          }
        </div>
      )}
      {field.type === 'number' && (
        <div className="form-result-component-container">
          {!field.read_only &&
            <div className="form-result-component-value">
              {
                fieldValue && fieldValue.result ? fieldValue.result
                : fieldValue && !fieldValue.result ? fieldValue
                : ''
              }
            </div>
          }
        </div>
      )}
      {field.type === 'address' && (
        <div className="form-result-component-container">
          {!field.read_only &&
            <div className="form-result-component-value">
              {
                fieldValue && fieldValue.result ? fieldValue.result
                : fieldValue && !fieldValue.result ? fieldValue
                : ''
              }
            </div>
          }
        </div>
      )}
      {field.type === 'phone' && (
        <div className="form-result-component-container">
          {!field.read_only &&
            <div className="form-result-component-value">
              {
                fieldValue && fieldValue.result ? fieldValue.result
                : fieldValue && !fieldValue.result ? fieldValue
                : ''
              }
            </div>
          }
        </div>
      )}
      {field.type === 'long_answer' && (
        <div className="form-result-component-container">
          <div className="form-result-component-value">
            {
              fieldValue && fieldValue.result ? fieldValue.result
              : fieldValue && !fieldValue.result ? fieldValue
              : ''
            }
          </div>
        </div>
      )}
      {field.type === 'radio' && (
        <div className="form-result-component-container">
          <div className="form-component-container">
            {
            fieldValue && fieldValue.result ? 
              <>
                <label className={`form-component-radio-container ${field.layout}`}>
                  <input type="radio" 
                    name={fieldValue.result} 
                    checked
                    disabled={true}/>
                  <span className="form-component-radiomark"></span>
                  {fieldValue.result}
                </label>
                {
                  fieldValue.correctiveActionData &&
                  <div className="field-result-option-corrective-action-box">
                    Corrective action: {fieldValue.correctiveActionData.text}
                  </div>
                }
              </>
            : fieldValue ? 
            <label className={`form-component-radio-container ${field.layout}`}>
              <input type="radio" 
                name={fieldValue} 
                checked
                disabled={true}/>
              <span className="form-component-radiomark"></span>
              {fieldValue}
            </label>
            : 'No selection'}
          </div>
        </div>
      )}

      {field.type === 'checkbox' && (
        <div className="form-result-component-container">
            <div className={`form-component-container ${field.layout}`}>
              { fieldValue && fieldValue.length !== 0 ?
               fieldValue.map((value, index)=> (
                value.result ?
                <>
                  <label key={index} className={`form-component-checkbox-container ${field.layout}`}>
                    <input type="checkbox" 
                      name={value.result} 
                      checked={true}
                      disabled={true}/>
                    <span className="form-component-checkmark"></span>
                    {value.result}
                  </label>
                  {
                    value.correctiveActionData &&
                    <div className="field-result-option-corrective-action-box">
                      Corrective action: {value.correctiveActionData.text}
                    </div>
                  }
                </>
                : value.result !== '' ?
                <label key={index} className={`form-component-checkbox-container ${field.layout}`}>
                  <input type="checkbox" 
                    name={value} 
                    checked={true}
                    disabled={true}/>
                  <span className="form-component-checkmark"></span>
                  {value}
                </label>
                : <></>
                ))
                :
                <div className="form-result-component-value">
                  No selection
                </div>
              }
            </div>
        </div>
      )}

      {field.type === 'name' && fieldValue && (
        <div className="form-result-component-container">
          <div className="form-result-component-value">
            {fieldValue.first_name} {fieldValue.last_name}
          </div>
        </div>
      )}

      {field.type === 'date_time' && fieldValue && (
        <div className="form-result-component-container">
          <div className="form-result-component-value">
            {fieldValue.date} {fieldValue.time}
          </div>
        </div>
      )}
      {field.type === 'dropdown' && (
        <div className="form-result-component-container">
          <div className="form-live-component-dropdown-value">
            {/* Show the selected dropdown option and color */}
            {
              fieldValue && fieldValue.result  ? 
                <>
                  <div className="form-result-component-value"
                    style={{
                      backgroundColor: field.options?.find(option => option.title === fieldValue.result)?.color || '#fff',
                      borderRadius: '5px',
                      color: '#000'
                    }}
                  >
                    {fieldValue.result}
                  </div>
                  {
                    fieldValue.correctiveActionData &&
                    <div className="field-result-option-corrective-action">
                      Corrective action: {fieldValue.correctiveActionData.text}
                    </div>
                  }
                </>
              : fieldValue && !Object.hasOwn(fieldValue, 'result')?
                <div className="form-result-component-value"
                style={{
                  backgroundColor: field.options?.find(option => option.title === fieldValue)?.color || '#fff',
                  padding: '5px',
                  borderRadius: '5px',
                  color: '#000'
                }}
              >
                {fieldValue}
              </div>
              : 'No selection'
            }
          </div>
        </div>
      )}
    </>
   );
}
 
export default UltimateResultColumnComponent;