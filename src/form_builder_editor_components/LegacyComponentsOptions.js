const LegacyComponentsOptions = ({editingField, changeFieldListOptionHandlerNew, addFieldListOptionHandlerNew,
  deleteFieldListOptionHandlerNew, changeSectionFieldPreFilledHandler  } ) => {
  return ( 
    <div>
      {
        editingField.type === 'double_section' && (
          <div className="option-content">
            {editingField.value.map((dropdown, dropdownIndex) => (
              <div key={dropdownIndex} className="option-group">
                <label>{`OPTIONS for ${['first', 'second'][dropdownIndex]} dropdown`}</label>
                {dropdown.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, optionIndex, dropdownIndex)}
                      value={option.title}
                    />
                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(optionIndex, dropdownIndex)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(optionIndex, dropdownIndex)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      }
      {
        editingField.type === 'triple_section' && (
          <div className="option-content">
            {editingField.value.map((dropdown, dropdownIndex) => (
              <div key={dropdownIndex} className="option-group">
                <label>{`OPTIONS for ${['first', 'second', 'third'][dropdownIndex]} dropdown`}</label>
                {dropdown.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, optionIndex, dropdownIndex)}
                      value={option.title}
                    />
                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(optionIndex, dropdownIndex)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(optionIndex, dropdownIndex)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      }
      {
        editingField.type === 'multi_section' && (
          <div className="option-content">
            <div className="option-group">
              <label>Pre-filled value for First input</label>
              <div className="option-input">
                <input type="text" onChange={(e) => changeSectionFieldPreFilledHandler(e,0)} value={editingField.value[0]}/>
              </div>
            </div>
            <div className="option-group">
              <label>OPTIONS for dropdown</label>
              {editingField.value[1].options.map((option, optionIndex) => (
                <div key={optionIndex} className="option-input">
                  <input
                    type="text"
                    onChange={(e) => changeFieldListOptionHandlerNew(e, optionIndex, 1)}
                    value={option.title}
                  />

                  <div className="option-buttons">
                    <button
                      className="field-editor-add-button"
                      onClick={() => addFieldListOptionHandlerNew(optionIndex, 1)}
                    >
                      +
                    </button>
                    <button
                      className="field-editor-remove-button"
                      onClick={() => deleteFieldListOptionHandlerNew(optionIndex, 1)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="option-group">
              <label>Pre-filled value for Third input</label>
              <div className="option-input">
                <input type="text" onChange={(e) => changeSectionFieldPreFilledHandler(e,2)} value={editingField.value[2]}/>
              </div>
            </div>
          </div>
        )
      }
    </div>
   );
}
 
export default LegacyComponentsOptions;