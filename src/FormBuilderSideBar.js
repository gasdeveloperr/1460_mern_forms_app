import { useState } from "react";
import DraggableComponent from "./DraggableComponent";
import FieldBuilderEditor from "./FormBuilderEditor";

const FormBuilderSideBar = ({setIsDragging, setDropAreaPositions, removeFormField,
    updateFormTypeHandler, formType, editingField, setEditingField}) => {

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropAreaPositions([]);
  };

  const [sections, setSections] = useState({
    basic: true,
    advanced: false,
    layout: false,
    formSettings: false,
  });

  const toggleSection = (section) => {
    setSections((prevSections) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  return (
    <div className='left-bar'>
      {
        editingField && editingField.id !== '' ? 
        <FieldBuilderEditor removeFormField={removeFormField} editingField={editingField} setEditingField={setEditingField}/>
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
  
          {/* <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('layout')}>
              <span className={`toggle-icon ${showLayoutAndSections ? 'open' : 'closed'}`}>&#9660;</span>
              Layout and Sections
            </div>
            {showLayoutAndSections && (
              <div className="section-content">
                <DraggableComponent type="section" title="Section" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
              </div>
            )}
          </div> */}
        </div>
      }
    </div>
  )

}


export default FormBuilderSideBar;