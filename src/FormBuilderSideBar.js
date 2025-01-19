import { useEffect, useState } from "react";
import DraggableComponent from "./DraggableComponent";
import FieldBuilderEditor from "./FormBuilderEditor";
import FormBuilderSectionComponentEditor from "./form_builder_editor_components/FormBuilderSectionComponentEditor";
import { getAuthToken } from "./utils";
import Spinner from "./Spinner";
import { backend_point } from "./consts";
import axios from "axios";

const FormBuilderSideBar = ({setIsDragging, updateFormField, 
    removeFormField, removeFormSectionField, duplicateField,
    updateFormTypeHandler, formType,
    editingField, setEditingField, editingSectionField, setEditingSectionField,
    handleOptionsSaving, chooseOptionsToChange, chooseOptionToAddCorrectiveAction, chooseOptionToRemoveCorrectiveAction,
    setIsCustomFieldSavingWindow}) => {

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const [sections, setSections] = useState({
    basic: true,
    advanced: true,
    layout: true,
    custom_fields: false,
    formSettings: false,
  });

  const [customFields, setCustomFields] = useState([])
  const [customFieldsLoader, setCustomFieldsLoader] = useState(false)

  useEffect(() => {
    fetchCustomFields();
  },[])

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const fetchCustomFields = async () => {
    const token = getAuthToken();
    const config = {
      headers: {
        Authorization: `${token}`,
      },
    };

    setCustomFieldsLoader(true);
    try {
      const response = await axios.get(`${backend_point}/api/customFields/all`, config);
      setCustomFields(response.data);
      console.log('customFields : ', customFields)
      setCustomFieldsLoader(false);
    } catch (error) {
      if (error.response) {
        console.error('Error saving action:', error.response.data);
      } else if (error.request) {
        console.error('No response received from the server');
      } else {
        console.error('Error:', error.message);
      }
    } finally {
      setCustomFieldsLoader(false);
    }
  };

  return (
    <div className='left-bar'>
      {
        editingField && editingField.id !== '' && editingSectionField.id === '' ? 
        <FieldBuilderEditor updateFormField={updateFormField} removeFormField={removeFormField} duplicateField={duplicateField}
        editingField={editingField} setEditingField={setEditingField}
        editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField}
        handleOptionsSaving={handleOptionsSaving} 
        chooseOptionsToChange={chooseOptionsToChange} 
        chooseOptionToAddCorrectiveAction={chooseOptionToAddCorrectiveAction} chooseOptionToRemoveCorrectiveAction={chooseOptionToRemoveCorrectiveAction}
        setIsCustomFieldSavingWindow={setIsCustomFieldSavingWindow}/>
        : editingSectionField && editingSectionField.id !== '' ?
        <FormBuilderSectionComponentEditor updateFormFieldsFromSection={updateFormField}
        removeFormSectionField={removeFormSectionField} duplicateField={duplicateField}
        editingField={editingField} setEditingField={setEditingField}
        editingSectionField={editingSectionField} setEditingSectionField={setEditingSectionField}
        handleOptionsSaving={handleOptionsSaving} 
        chooseOptionsToChange={chooseOptionsToChange} 
        chooseOptionToAddCorrectiveAction={chooseOptionToAddCorrectiveAction} chooseOptionToRemoveCorrectiveAction={chooseOptionToRemoveCorrectiveAction}
        setIsCustomFieldSavingWindow={setIsCustomFieldSavingWindow}/>
        :
        <div className="form-builder-components">
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('basic')}>
              <span className={`toggle-icon ${sections.basic ? 'open' : 'closed'}`}>&#9660;</span>
              Basic Fields
            </div>
            {sections.basic && (
              <div className="section-content">
                <DraggableComponent type="short_answer" title="Short Answer"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="long_answer" title="Long Answer"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="title" title="Title"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="name" title="Name"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="address" title="Address" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="email" title="Email Address" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="phone" title="Phone Number" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="number" title="Number" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="dropdown" title="Dropdown List" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="radio" title="Radio Button" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="checkbox" title="Checkbox" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
              </div>
            )}
          </div>
  
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('advanced')}>
              <span className={`toggle-icon ${sections.advanced ? 'open' : 'closed'}`}>&#9660;</span>
              Advanced Fields
            </div>
            {sections.advanced && (
              <div className="section-content">
                <DraggableComponent type="date_time" title="Date/Time" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="file_upload" title="File Upload" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} />
                <DraggableComponent type="columns" title="Columns"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
                <DraggableComponent type="add_component_button" title="Add component button"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
              </div>
            )}
          </div>
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('layout')}>
              <span className={`toggle-icon ${sections.layout ? 'open' : 'closed'}`}>&#9660;</span>
              Layout and Sections
            </div>
            {sections.layout && (
              <div className="section-content">
                <DraggableComponent type="section" title="Section"
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
              </div>
            )}
          </div>
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('custom_fields')}>
              <span className={`toggle-icon ${sections.custom_fields ? 'open' : 'closed'}`}>&#9660;</span>
              Custom fields
            </div>
            {sections.custom_fields && (
              <div className="section-content">
                {
                  customFieldsLoader ?
                  <Spinner/>
                  : customFields && customFields.length !== 0 ?
                  customFields.map((field, fieldIndex) => (
                    <DraggableComponent key={fieldIndex} type={field.type} title={field.title} fieldData={field}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}/>
                  ))
                  : <></>
                }
              </div>
            )}
          </div>
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('formSettings')}>
              <span className={`toggle-icon ${sections.formSettings ? 'open' : 'closed'}`}>&#9660;</span>
              Form Settings
            </div>
            {sections.formSettings && (
              <div className="section-chooser-container">
                <div className="section-chooser-title">
                  Choose Form Type
                </div>
                <div className="section-chooser-options">
                  <div
                    className={`section-chooser-option ${formType === 'blank' ? 'selected' : ''}`}
                    onClick={() => updateFormTypeHandler('blank')}
                  >
                    Blank Form
                  </div>
                  <div
                    className={`section-chooser-option ${formType === 'scored' ? 'selected' : ''}`}
                    onClick={() => updateFormTypeHandler('scored')}
                  >
                    Scored Form
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  )

}


export default FormBuilderSideBar;