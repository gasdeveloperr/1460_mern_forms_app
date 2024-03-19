import { useState } from "react";
import DraggableComponent from "./DraggableComponent";

const FormBuilderSideBar = ({setIsDragging, setDropAreaPositions, editorMode}) => {

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
        editorMode !== '' ? 
        <></>
        :
        <div className="form-builder-components">
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('basic')}>
              <h3>Basic Fields</h3>
              <span className={`toggle-icon ${showBasicFields ? 'open' : 'closed'}`}>&#9660;</span>
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
                {/* <DraggableComponent type="address" title="Address" />
                <DraggableComponent type="email" title="Email Address" />
                <DraggableComponent type="phone" title="Phone Number" />
                <DraggableComponent type="number" title="Number" />
                <DraggableComponent type="dropdown" title="Dropdown List" />
                <DraggableComponent type="radio" title="Radio Button" />
                <DraggableComponent type="checkbox" title="Checkbox" /> */}
              </div>
            )}
          </div>
  
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('advanced')}>
              <h3>Advanced Fields</h3>
              <span className={`toggle-icon ${showAdvancedFields ? 'open' : 'closed'}`}>&#9660;</span>
            </div>
            {showAdvancedFields && (
              <div className="section-content">
                <DraggableComponent type="credit_card" title="Credit Card" 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}/>
                {/* <DraggableComponent type="date_time" title="Date/Time" />
                <DraggableComponent type="file_upload" title="File Upload" />
                <DraggableComponent type="matrix" title="Matrix" />
                <DraggableComponent type="description" title="Description Area" />
                <DraggableComponent type="embed_code" title="Embed Code" />
                <DraggableComponent type="event_product" title="Event/Product" />
                <DraggableComponent type="signature" title="Signature" />
                <DraggableComponent type="rating" title="Rating" /> */}
              </div>
            )}
          </div>
  
          <div className="section-group">
            <div className="section-header" onClick={() => toggleSection('layout')}>
              <h3>Layout and Sections</h3>
              <span className={`toggle-icon ${showLayoutAndSections ? 'open' : 'closed'}`}>&#9660;</span>
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