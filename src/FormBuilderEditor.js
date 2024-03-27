import { useContext } from 'react';
import './FormBuilderEditor.css';
import { OutsideClickContext } from './OutsideClickContext';
import { titles_to_types_object } from './consts';

const FieldBuilderEditor = ({editingField, setEditingField}) => {

  const changeFieldTitleHandler = (e) => {
    setEditingField({...editingField, title: e.target.value})
    //console.log('change editingField : ', editingField)
  }
  const changeFieldRequiredHandler = (e) => {
    setEditingField({...editingField, required: !editingField.required})
    console.log('change editingField : ', editingField)
  }

  const { fieldEditorRef } = useContext(OutsideClickContext);
  return (
    <div className="field-editor" ref={fieldEditorRef}>
    { editingField && editingField.id !== '' ?
    <>
      <div className="field-editor__header">
        <span>{titles_to_types_object[editingField.type]}</span>
        <div className="field-editor__actions">
          <button className="field-editor__action-btn">
            <i className="fas fa-edit"></i>
          </button>
          <button className="field-editor__action-btn">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="field-editor__section">
        <span className="field-editor__section-title">Logic</span>
      </div>
      <div className="field-editor__section">
        <span className="field-editor__section-title">General</span>
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
      </div>
      </>
      : <></>
    }
    </div>
  );
};

export default FieldBuilderEditor;