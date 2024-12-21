import { HexColorPicker } from "react-colorful";
import save_icon from '../icons/save-icon.svg';
import chooser_options_icon from '../icons/chooser-options.svg'

const DropdownOptions = ({editingField, changeListOptionHandler, 
  handleColorChange, toggleColorPicker, 
  colorPickerVisible, hexColor, rgbColor, cmykColor,
  handleRgbChange, handleHexChange, handleCmykChange,
  addListOptionHandler, deleteListOptionHandler, handleOptionsSaving,
  chooseOptionsToChange, chooseOptionToAddCorrectiveAction, chooseOptionToRemoveCorrectiveAction  } ) => {

  return ( 
    <div className="option-content">
      <div className="option-group">
        <label>
          OPTIONS
          <div className="option-group-features">
            <div className='choose-option-button' onClick={() => chooseOptionsToChange(editingField.id)}>
              <img className="option-group-img" src={chooser_options_icon} alt='choose'/>
            </div>
            <img className="option-group-img" src={save_icon} 
            onClick={()=> handleOptionsSaving(editingField.dropdown)} alt='save'/>
          </div>
        </label>
          {editingField.dropdown.map((option, optionIndex)=> (
            <div key={optionIndex} className="option-input">
              <input type="text" onChange={(e) => changeListOptionHandler(e, optionIndex)} value={option.title}/>
              <div className="option-buttons">
              <div className="color-picker-container">
                <div
                  className="color-preview"
                  onClick={() => toggleColorPicker(optionIndex, option.color || '#FFFFFF')}
                  style={ !option.color ? {backgroundColor: '#FFFFFF'} : option.color.includes('rgba') ? 
                  {backgroundColor: '#FFFFFF'} : {backgroundColor: option.color}}
                />
                { (hexColor && rgbColor && cmykColor) && colorPickerVisible === optionIndex && (
                  <div className="color-preview-container">
                    <HexColorPicker  color={option.color} onChange={(color) => handleColorChange(color, optionIndex)} />
                    <div className="color-format-inputs">
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">HEX</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={hexColor}
                          onChange={e => handleHexChange(e, optionIndex)}
                          placeholder="HEX"
                        />
                      </div>
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">RGB</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={rgbColor.join(',')}
                          onChange={e => handleRgbChange(e, optionIndex)}
                          placeholder="RGB (r,g,b)"
                        />
                      </div>
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">CMYK</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={cmykColor.join(',')}
                          onChange={e => handleCmykChange(e, optionIndex)}
                          placeholder="CMYK (c,m,y,k)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
                <button className="field-editor-add-button" onClick={() => addListOptionHandler(optionIndex)}>+</button>
                <button className="field-editor-remove-button" onClick={() => deleteListOptionHandler(optionIndex)}>-</button>
              </div>
              {
                option.correctiveAction && option.correctiveAction.text ?
                <>
                  <div className="field-editor-option-corrective-action">
                    Corrective action: {option.correctiveAction.text}
                    <button className="field-editor-option-corrective-action-remove" 
                    onClick={() => chooseOptionToRemoveCorrectiveAction(editingField.id, "", optionIndex)}>-</button>
                  </div>
                </>
                :
                <div className="field-editor-add-corrective-action-button" 
                onClick={() => chooseOptionToAddCorrectiveAction(editingField.id, "", optionIndex)}>
                  {/* <img className='size20-icon' src={add_corrective_action_icon} alt='+'/> */}
                  Add corrective action
                </div>
              }
            </div>
          ))}
      </div>
    </div>
   );
}
 
export default DropdownOptions;