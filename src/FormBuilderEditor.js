import { useContext, useState } from 'react';
import './FormBuilderEditor.css';
import { OutsideClickContext } from './OutsideClickContext';
import { titles_to_types_object } from './consts';
import trash_icon from './icons/trash-can.svg'

const FieldBuilderEditor = ({removeFormField, editingField, setEditingField}) => {

  const changeFieldTitleHandler = (e) => {
    setEditingField({...editingField, title: e.target.value})
    //console.log('change editingField : ', editingField)
  }
  const changeFieldRequiredHandler = (e) => {
    setEditingField({...editingField, required: !editingField.required})
    //console.log('change editingField : ', editingField)
  }  

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

  const { fieldEditorRef } = useContext(OutsideClickContext);
  return (
    <div className="field-editor" ref={fieldEditorRef}>
    { editingField && editingField.id !== '' ?
    <>
      <div className='field-editor-container'>
        <div className="field-editor__header">
          {titles_to_types_object[editingField.type]}
          <div className="field-editor__actions">
            <button className="field-editor-remove-field" onClick={() => handleRemoveClick(editingField.id)}>
              <img src={trash_icon} className="remove-icon"/>
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
                    <input type="checkbox" id="read-only" className='field-editor_checkbox' />
                    <label htmlFor="read-only">Read-only</label>
                  </label>
                </div>
                <div className='field-editor_checkbox_container'>
                  <label className="field-editor-label">
                    <input type="checkbox" id="hide-label" className='field-editor_checkbox' />
                    <label htmlFor="hide-label">Hide Label</label>
                  </label>
                </div>
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
        {showSpecific && (
          <div className="option-content">
            <div className="option-group">
              <label>OPTIONS</label>
              <div className="option-input">
                <input type="text" placeholder="Option1" />
                <div className="option-buttons">
                  <button className="field-editor-add-button">+</button>
                  <button className="field-editor-remove-button">-</button>
                </div>
              </div>
              <div className="option-input">
                <input type="text" placeholder="Option2" />
                <div className="option-buttons">
                  <button className="field-editor-add-button">+</button>
                  <button className="field-editor-remove-button">-</button>
                </div>
              </div>
              <div className="option-input">
                <input type="text" placeholder="Option3" />
                <div className="option-buttons">
                  <button className="field-editor-add-button">+</button>
                  <button className="field-editor-remove-button">-</button>
                </div>
              </div>
              <div className="field-editor-checkbox-options">
                <label>
                  <input type="checkbox" />
                  Add "Other"
                </label>
                <label>
                  <input type="checkbox" />
                  Randomize options
                </label>
                <label>
                  <input type="checkbox" />
                  Add "Check All"
                </label>
              </div>
            </div>
            <div className="layout-group">
              <label>LAYOUT</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="layout" value="vertical" />
                  Vertical
                </label>
                <label>
                  <input type="radio" name="layout" value="horizontal" />
                  Horizontal
                </label>
              </div>
            </div>
            <div className="default-value-group">
              <label>DEFAULT VALUE</label>
              <input type="text" />
            </div>
          </div>
        )}
      </div>
    </div>
      </>
      : <></>
    }
    </div>
  );
};

export default FieldBuilderEditor;