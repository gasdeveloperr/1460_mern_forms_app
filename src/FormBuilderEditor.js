import { useContext, useState } from 'react';
import './FormBuilderEditor.css';
import { OutsideClickContext } from './OutsideClickContext';
import { titles_to_types_object } from './consts';
import trash_icon from './icons/trash-can.svg'
import duplicate_icon from './icons/duplicate-icon.svg'
import { RgbaColorPicker } from "react-colorful";

const FieldBuilderEditor = ({removeFormField, duplicateField, editingField, setEditingField, handleDuplicateClick}) => {

  const changeFieldTitleHandler = (e) => {
    setEditingField({...editingField, title: e.target.value})
    //console.log('change editingField : ', editingField)
  }
  const changeFieldLabelHandler = (e, index) => {
    const updatedLabels = [...editingField.labels];
    updatedLabels[index] = e.target.value;
    setEditingField({ ...editingField, labels: updatedLabels });
  };
  const changeFieldRequiredHandler = (e) => {
    setEditingField({...editingField, required: !editingField.required})
    //console.log('change editingField : ', editingField)
  }  
  const changeFieldReadOnlyHandler = (e) => {
    setEditingField({...editingField, read_only: !editingField.read_only})
    //console.log('change editingField : ', editingField)
  }  


  const addFieldCheckOptionHandler = (index) => {
    const newCheckboxes = [...editingField.checkbox.slice(0, index+1),{title: 'Option', checked: false}, ...editingField.checkbox.slice(index+1, editingField.checkbox.length+1)]
    setEditingField({...editingField, checkbox: newCheckboxes})
  } 
  const deleteFieldCheckOptionHandler = (index) => {
    const newCheckboxes = [...editingField.checkbox.slice(0, index), ...editingField.checkbox.slice(index+1, editingField.checkbox.length+1)]
    setEditingField({...editingField, checkbox: newCheckboxes})
  } 
  const changeFieldCheckOptionHandler = (e, index) => {
    const newCheckboxes = editingField.checkbox.map((option, opt_index) => {
      if(opt_index === index){
        option.title = e.target.value
        return option
      }else{
        return option
      }
    })
    setEditingField({...editingField, checkbox: newCheckboxes})
  } 
  const changeFieldCheckboxLayoutHandler = (e) => {
    setEditingField({...editingField, layout: e.target.value})
    //console.log('change editingField : ', editingField)
  } 

  const addFieldRadioOptionHandler = (index) => {
    const newRadio = [...editingField.radio.slice(0, index+1),{title: 'Option', checked: false}, ...editingField.radio.slice(index+1, editingField.radio.length+1)]
    setEditingField({...editingField, radio: newRadio})
  } 
  const deleteFieldRadioOptionHandler = (index) => {
    const newRadio = [...editingField.radio.slice(0, index), ...editingField.radio.slice(index+1, editingField.radio.length+1)]
    setEditingField({...editingField, radio: newRadio})
  } 
  const changeFieldRadioOptionHandler = (e, index) => {
    const newRadio = editingField.radio.map((option, opt_index) => {
      if(opt_index === index){
        option.title = e.target.value
        return option
      }else{
        return option
      }
    })
    setEditingField({...editingField, radio: newRadio})
  } 
  const changeFieldRadioLayoutHandler = (e) => {
    setEditingField({...editingField, layout: e.target.value})
    //console.log('change editingField : ', editingField)
  } 

  const addFieldListOptionHandler = (index) => {
    const newOptions = [...editingField.dropdown.slice(0, index+1),{title: 'Option', checked: false}, ...editingField.dropdown.slice(index+1, editingField.dropdown.length+1)]
    setEditingField({...editingField, dropdown: newOptions})
  } 
  const deleteFieldListOptionHandler = (index) => {
    const newOptions = [...editingField.dropdown.slice(0, index), ...editingField.dropdown.slice(index+1, editingField.dropdown.length+1)]
    setEditingField({...editingField, dropdown: newOptions})
  } 
  const changeFieldListOptionHandler = (e, index) => {
    const newOptions = editingField.dropdown.map((option, opt_index) => {
      if(opt_index === index){
        option.title = e.target.value
        return option
      }else{
        return option
      }
    })
    setEditingField({...editingField, dropdown: newOptions})
  } 
  const addFieldListOptionHandlerNew = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options.slice(0, index + 1),
      { title: 'Option', selected: false }, // Default new option
      ...editingField.value[sectionIndex].options.slice(index + 1),
    ];
  
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
  };
  const deleteFieldListOptionHandlerNew = (index, sectionIndex) => {
    const newOptions = [
      ...editingField.value[sectionIndex].options.slice(0, index),
      ...editingField.value[sectionIndex].options.slice(index + 1),
    ];
  
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
  };
  const changeFieldListOptionHandlerNew = (e, index, sectionIndex) => {
    const newOptions = editingField.value[sectionIndex].options.map((option, opt_index) => {
      if (opt_index === index) {
        return { ...option, title: e.target.value };
      }
      return option;
    });
  
    const newValue = [...editingField.value];
    newValue[sectionIndex].options = newOptions;
  
    setEditingField({ ...editingField, value: newValue });
  };
  

  // State to manage which color picker is visible
  const [colorPickerVisible, setColorPickerVisible] = useState(null);
  const [color, setColor] = useState({ r: 200, g: 150, b: 35, a: 0.5 });

  // Toggle visibility of the color picker
  const toggleColorPicker = (index) => {
    setColorPickerVisible(colorPickerVisible === index ? null : index);
  };

  // Handler for changing the color of the option
  const changeOptionColorHandler = (color, index, options_index) => {
    setColor(color);
    const newOptions = editingField.dropdown.map((option, opt_index) => {
      if(opt_index === index){
        option.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`; // Update the color property
      }
      return option;
    });
    setEditingField({...editingField, dropdown: newOptions});
  };

  const changeDateFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, dateFormat: selectedFormat})
  };
  
  const changeTimeFormatHandler = (selectedFormat) => {
    setEditingField({...editingField, timeFormat: selectedFormat})
  };

  const [showLogic, setShowLogic] = useState(false);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showSpecific, setShowSpecific] = useState(false);

  const toggleSection = (section) => {
    if (section === 'logic') {
      setShowLogic(!showLogic);
    } else if (section === 'general') {
      setShowGeneral(!showGeneral);
    } else if (section === 'specific') {
      setShowSpecific(!showSpecific);
    }
  };

  const handleRemoveClick = (fieldId) => {
    removeFormField(fieldId)
    setEditingField({ id: '' });
  }

  
  const dateFormatOptions=  [
    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  ]
  const timeFormatOptions=  [
    { label: '12 Hour', value: '12' },
    { label: '24 Hour', value: '24' },
  ]

  const { fieldEditorRef } = useContext(OutsideClickContext);
  return (
    <div className="field-editor" ref={fieldEditorRef}>
    { editingField && editingField.id !== '' ?
    <>
      <div className='field-editor-container'>
        <div className="field-editor__header">
          {titles_to_types_object[editingField.type]}
          <div className="field-editor__actions">
            <button className="field-editor-remove-field" id="remove_icon" help-title="remove" 
            onClick={() => handleRemoveClick(editingField.id)}>
              <img src={trash_icon} className="remove-icon"/>
            </button>
            <button className="field-editor-remove-field" id="duplicate_icon" help-title="duplicate" 
            onClick={() => duplicateField(editingField.id)}>
              <img src={duplicate_icon} className="remove-icon"/>
            </button>
          </div>
        </div>
      </div>
      {/* <div className="section-group">
        <div className="field-editor__section">
          <div className="section-header" onClick={() => toggleSection('logic')}>
            <span className={`toggle-icon ${showLogic ? 'open' : 'closed'}`}>&#9660;</span>
            <h3>Logic</h3>
          </div>
        </div>
      </div> */}
      <div className="section-group">
        <div className="field-editor__section">
          <div className="section-header" onClick={() => toggleSection('general')}>
            <span className={`toggle-icon ${showGeneral ? 'open' : 'closed'}`}>&#9660;</span>
            General
          </div>
          {showGeneral && (
            <div className="option-content">
              <div className="field-editor__field">
                <label className="field-editor__label">FIELD LABEL</label>
                <input type="text" value={editingField.title} onChange={e => changeFieldTitleHandler(e)} className="field-editor__input" />
              </div>
              {
                editingField.type == 'double_section' ?
                <>
                  <div className="field-editor__field">
                    <label className="field-editor__label">First label</label>
                    <input type="text" value={editingField.labels[0]} onChange={e => changeFieldLabelHandler(e, 0)} className="field-editor__input" />
                  </div>
                  <div className="field-editor__field">
                    <label className="field-editor__label">Second label</label>
                    <input type="text" value={editingField.labels[1]} onChange={e => changeFieldLabelHandler(e, 1)} className="field-editor__input" />
                  </div>
                </>
                : editingField.type == 'triple_section' ?
                <>
                  <div className="field-editor__field">
                    <label className="field-editor__label">First label</label>
                    <input type="text" value={editingField.labels[0]} onChange={e => changeFieldLabelHandler(e, 0)} className="field-editor__input" />
                  </div>
                  <div className="field-editor__field">
                    <label className="field-editor__label">Second label</label>
                    <input type="text" value={editingField.labels[1]} onChange={e => changeFieldLabelHandler(e, 1)} className="field-editor__input" />
                  </div>
                  <div className="field-editor__field">
                    <label className="field-editor__label">Third label</label>
                    <input type="text" value={editingField.labels[2]} onChange={e => changeFieldLabelHandler(e, 2)} className="field-editor__input" />
                  </div>
                </>
                : <></>
              }
              <div className="field-editor_checkbox-group">
                <div className='field-editor_checkbox_container'>
                  <label htmlFor="required" className="field-editor-label">
                    <input type="checkbox" id="required" className='field-editor_checkbox' 
                    checked={editingField.required} onChange={changeFieldRequiredHandler}/>
                    Required
                  </label>
                </div>
                <div className='field-editor_checkbox_container'>
                  <label className="field-editor-label">
                    <input type="checkbox" id="read-only" className='field-editor_checkbox' 
                    checked={editingField.read_only} onChange={changeFieldReadOnlyHandler}/>
                    <label htmlFor="read-only">Read-only</label>
                  </label>
                </div>
                {/* <div className='field-editor_checkbox_container'>
                  <label className="field-editor-label">
                    <input type="checkbox" id="hide-label" className='field-editor_checkbox' />
                    <label htmlFor="hide-label">Hide Label</label>
                  </label>
                </div> */}
              </div>
            </div>)
            }
        </div>
      </div>
      <div className="section-group">
      <div className="field-editor__section">
        <div className="section-header" onClick={() => toggleSection('specific')}>
          <span className={`toggle-icon ${showSpecific ? 'open' : 'closed'}`}>&#9660;</span>
          Field-Specific
        </div>
        {showSpecific ? 
          <>
          { editingField.checkbox && 
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS</label>
                  {editingField.checkbox.map((option, index)=> (
                    <div key={index} className="option-input">
                      <input type="text" onChange={(e) => changeFieldCheckOptionHandler(e, index)} value={option.title}/>
                      <div className="option-buttons">
                        <button className="field-editor-add-button" onClick={() => addFieldCheckOptionHandler(index)}>+</button>
                        <button className="field-editor-remove-button" onClick={() => deleteFieldCheckOptionHandler(index)}>-</button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="layout-group">
                <label>LAYOUT</label>
                <div className="field-editor-radio-group">
                  <label>
                    <input type="radio" name="layout" value="vertical" 
                    onChange={changeFieldCheckboxLayoutHandler} checked={editingField.layout == 'vertical'} />
                    Vertical
                  </label>
                  <label>
                    <input type="radio" name="layout" value="horizontal" 
                    onChange={changeFieldCheckboxLayoutHandler} checked={editingField.layout == 'horizontal'}/>
                    Horizontal
                  </label>
                </div>
              </div>
              {/* <div className="default-value-group">
                <label>DEFAULT VALUE</label>
                <input type="text" />
              </div> */}
            </div>
          }
          { editingField.radio && 
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS</label>
                  {editingField.radio.map((option, index)=> (
                    <div key={index} className="option-input">
                      <input type="text" onChange={(e) => changeFieldRadioOptionHandler(e, index)} value={option.title}/>
                      <div className="option-buttons">
                        <button className="field-editor-add-button" onClick={() => addFieldRadioOptionHandler(index)}>+</button>
                        <button className="field-editor-remove-button" onClick={() => deleteFieldRadioOptionHandler(index)}>-</button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="layout-group">
                <label>LAYOUT</label>
                <div className="field-editor-radio-group">
                  <label>
                    <input type="radio" name="layout" value="vertical" 
                    onChange={changeFieldRadioLayoutHandler} checked={editingField.layout == 'vertical'} />
                    Vertical
                  </label>
                  <label>
                    <input type="radio" name="layout" value="horizontal" 
                    onChange={changeFieldRadioLayoutHandler} checked={editingField.layout == 'horizontal'}/>
                    Horizontal
                  </label>
                </div>
              </div>
            </div>
          }
          { editingField.type === 'date_time' && 
            <div className="option-content">
              <div className="option-group">
                <label>Date Format</label>
                <select
                  value={editingField.dateFormat}
                  onChange={changeDateFormatHandler}
                >
                  <option value="MMM D, YYYY">MMM D, YYYY</option>
                  <option value="D/M/YYYY">D/M/YYYY</option>
                  <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            
              <div className="option-group">
                <label>Time Format</label>
                <select
                  value={editingField.timeFormat}
                  onChange={changeTimeFormatHandler}
                >
                  <option value="h:mm A">12 Hour (h:mm A)</option>
                  <option value="HH:mm">24 Hour (HH:mm)</option>
                </select>
              </div>
            </div>
          }
          {editingField.dropdown && 
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS</label>
                  {editingField.dropdown.map((option, index)=> (
                    <div key={index} className="option-input">
                      <input type="text" onChange={(e) => changeFieldListOptionHandler(e, index)} value={option.title}/>
                      <div className="color-picker-container">
                        <div 
                          className="color-preview" 
                          onClick={() => toggleColorPicker(index)}
                          style={{ backgroundColor: option.color || color }}
                        />
                        <div className="color-preview-container" >
                          {colorPickerVisible === index && (
                            <RgbaColorPicker 
                              color={color} 
                              onChange={(color) => changeOptionColorHandler(color, index)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="option-buttons">
                        <button className="field-editor-add-button" onClick={() => addFieldListOptionHandler(index)}>+</button>
                        <button className="field-editor-remove-button" onClick={() => deleteFieldListOptionHandler(index)}>-</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          }
          {
            editingField.type == 'double_section' ?
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS for first dropdown</label>
                {editingField.value[0].options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, index, 0)}
                      value={option.title}
                    />

                    {/* Color Picker or Other UI for Option (if needed) */}

                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(index, 0)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(index, 0)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* OPTIONS for second dropdown */}
              <div className="option-group">
                <label>OPTIONS for second dropdown</label>
                {editingField.value[1].options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, index, 1)}
                      value={option.title}
                    />

                    {/* Color Picker or Other UI for Option (if needed) */}

                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(index, 1)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(index, 1)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                : <></>
          }
          {
            editingField.type == 'triple_section' ?
            <div className="option-content">
              <div className="option-group">
                <label>OPTIONS for first dropdown</label>
                {editingField.value[0].options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, index, 0)}
                      value={option.title}
                    />

                    {/* Color Picker or Other UI for Option (if needed) */}

                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(index, 0)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(index, 0)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="option-group">
                <label>OPTIONS for second dropdown</label>
                {editingField.value[1].options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, index, 1)}
                      value={option.title}
                    />

                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(index, 1)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(index, 1)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="option-group">
                <label>OPTIONS for third dropdown</label>
                {editingField.value[2].options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      onChange={(e) => changeFieldListOptionHandlerNew(e, index, 2)}
                      value={option.title}
                    />

                    <div className="option-buttons">
                      <button
                        className="field-editor-add-button"
                        onClick={() => addFieldListOptionHandlerNew(index, 2)}
                      >
                        +
                      </button>
                      <button
                        className="field-editor-remove-button"
                        onClick={() => deleteFieldListOptionHandlerNew(index, 2)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            : <></>
          }
          </>
          :
          <></>
        }
      </div>
    </div>
      </>
      : <></>
    }
    </div>
  );
};

export default FieldBuilderEditor;