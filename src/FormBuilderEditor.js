import { useContext } from 'react';
import './FieldBuilderEditor.css';
import { OutsideClickContext } from './OutsideClickContext';

const FieldBuilderEditor = ({editingField, setEditingField}) => {

  const { fieldEditorRef } = useContext(OutsideClickContext);
  return (
    <div className="field-editor" ref={fieldEditorRef}>
    { editingField && editingField.id !== '' ?
    <>
      <div className="field-editor__header">
        <span>{editingField.title}</span>
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
          <input type="text" placeholder={editingField.title} className="field-editor__input" />
        </div>
        <div className="field-editor__checkbox-group">
          <div className="field-editor__checkbox">
            <input type="checkbox" id="required" />
            <label htmlFor="required">Required</label>
          </div>
          <div className="field-editor__checkbox">
            <input type="checkbox" id="read-only" />
            <label htmlFor="read-only">Read-only</label>
          </div>
          <div className="field-editor__checkbox">
            <input type="checkbox" id="hidden" />
            <label htmlFor="hidden">Hidden</label>
          </div>
          <div className="field-editor__checkbox">
            <input type="checkbox" id="hide-label" />
            <label htmlFor="hide-label">Hide Label</label>
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