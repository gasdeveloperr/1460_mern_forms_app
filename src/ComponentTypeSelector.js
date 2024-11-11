import React, { useState } from 'react';
import { component_types_array } from './consts';
import selector_icon from './icons/selector-icon.svg'


const ComponentTypeSelector = ({ selectedType, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type) => {
    onChange(type);
    setIsOpen(false);
  };

  return (
    <div className="form-editor-custom-selector">
      <div
        className="form-editor-custom-selector-title"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedType ? selectedType.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : 'Select a component'}
        <img src={selector_icon} alt="Selector icon" className="dropdown-icon" />
      </div>
      {isOpen && (
        <div className="custom-dropdown-options">
          {component_types_array.map((type) => (
            <div
              key={type}
              className="custom-dropdown-option"
              onClick={() => handleSelect(type)}
            >
              {type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentTypeSelector;