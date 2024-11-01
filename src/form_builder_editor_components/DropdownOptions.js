import { HexColorPicker } from "react-colorful";

const DropdownOptions = ({editingField, changeListOptionHandler, 
  handleColorChange, toggleColorPicker, 
  colorPickerVisible,
  hexColor, rgbColor, cmykColor,
  handleRgbChange, handleHexChange, handleCmykChange,
  addListOptionHandler, deleteListOptionHandler  } ) => {
  return ( 
    <div className="option-content">
      <div className="option-group">
        <label>OPTIONS</label>
          {editingField.dropdown.map((option, index)=> (
            <div key={index} className="option-input">
              <input type="text" onChange={(e) => changeListOptionHandler(e, index)} value={option.title}/>
              <div className="color-picker-container">
                <div
                  className="color-preview"
                  onClick={() => toggleColorPicker(index, option.color || '#FFFFFF')}
                  style={ !option.color ? {backgroundColor: '#FFFFFF'} : option.color.includes('rgba') ? 
                  {backgroundColor: '#FFFFFF'} : {backgroundColor: option.color}}
                />
                { (hexColor && rgbColor && cmykColor) && colorPickerVisible === index && (
                  <div className="color-preview-container">
                    <HexColorPicker  color={option.color} onChange={(color) => handleColorChange(color, index)} />
                    <div className="color-format-inputs">
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">HEX</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={hexColor}
                          onChange={e => handleHexChange(e, index)}
                          placeholder="HEX"
                        />
                      </div>
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">RGB</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={rgbColor.join(',')}
                          onChange={e => handleRgbChange(e, index)}
                          placeholder="RGB (r,g,b)"
                        />
                      </div>
                      <div className="rgb-input-container">
                        <label htmlFor="rgb-input">CMYK</label>
                        <input
                          type="text"
                          className="color-preview-input"
                          value={cmykColor.join(',')}
                          onChange={e => handleCmykChange(e, index)}
                          placeholder="CMYK (c,m,y,k)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="option-buttons">
                <button className="field-editor-add-button" onClick={() => addListOptionHandler(index)}>+</button>
                <button className="field-editor-remove-button" onClick={() => deleteListOptionHandler(index)}>-</button>
              </div>
            </div>
          ))}
      </div>
    </div>
   );
}
 
export default DropdownOptions;