import { useState } from "react";
import DraggableComponent from "./DraggableComponent";
import FieldBuilderEditor from "./FormBuilderEditor";

const FormBuilderSideBar = ({setIsDragging, setDropAreaPositions, editingField, setEditingField}) => {

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDropAreaPositions([]);
  };

  
  const [showBasicFields, setShowBasicFields] = useState(true);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [showLayoutAndSections, setShowLayoutAndSections] = useState(false);

  const toggleSection = (section) => {
    if (section === 'basic') {
      setShowBasicFields(!showBasicFields);
    } else if (section === 'advanced') {
      setShowAdvancedFields(!showAdvancedFields);
    } else if (section === 'layout') {
      setShowLayoutAndSections(!showLayoutAndSections);
    }
  };

  return (
    <div className='left-bar'>
      {
        editingField && editingField.id !== '' ? 
        <FieldBuilderEditor editingField={editingField} setEditingField={setEditingField}/>
        :
        <div className="form-builder-components">
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('basic')}>
              <span className={`toggle-icon ${showBasicFields ? 'open' : 'closed'}`}>&#9660;</span>
              <h3>Basic Fields</h3>
            </div>
            {showBasicFields && (
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
                {/* <DraggableComponent type="dropdown" title="Dropdown List" />
                <DraggableComponent type="radio" title="Radio Button" />
                <DraggableComponent type="checkbox" title="Checkbox" /> */}
              </div>
            )}
          </div>
  
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('advanced')}>
              <span className={`toggle-icon ${showAdvancedFields ? 'open' : 'closed'}`}>&#9660;</span>
              <h3>Advanced Fields</h3>
            </div>
            {showAdvancedFields && (
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
            <div className="section-header" onClick={() => toggleSection('layout')}>
              <span className={`toggle-icon ${showLayoutAndSections ? 'open' : 'closed'}`}>&#9660;</span>
              <h3>Layout and Sections</h3>
            </div>
            {showLayoutAndSections && (
              <div className="section-content">
                <DraggableComponent type="section" title="Section" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
              </div>
            )}
          </div>
        </div>
      }
    </div>
  )

}


export default FormBuilderSideBar;