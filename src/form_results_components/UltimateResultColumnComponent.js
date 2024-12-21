const UltimateResultColumnComponent = ({fieldValue, field}) => {

  return ( 
    <>
      { 
       field.type === 'checkbox' ? (
        <div className={`form-component-container ${field.layout}`}>
          { fieldValue.length !== 0 ?
          fieldValue?.map((value, index)=> (
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
      )
      : field.type === 'name' ? (
        <div className="form-live-component-value">
          {fieldValue?.first_name} {fieldValue?.last_name}
        </div>
      )
      : field.type === 'date_time' ? (
        <div className="form-live-component-value">
          {fieldValue?.date} {fieldValue?.time}
        </div>
      )
      : field.type === 'dropdown' ? (
        <div className="form-live-component-dropdown-value">
          {/* Show the selected dropdown option and color */}
          {fieldValue ? (
            <div
              className="form-live-component-selected-option"
              style={{
                backgroundColor: field.dropdown.find(option => option.title === fieldValue)?.color || '#fff',
                padding: '5px',
                borderRadius: '5px',
                color: '#000'
              }}
            >
              {fieldValue}
            </div>
          ) : (
            'No selection'
          )}
        </div>
      )
      :
      fieldValue
    }
    </>
   );
}
 
export default UltimateResultColumnComponent;