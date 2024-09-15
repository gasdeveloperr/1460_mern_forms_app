import React, { useState, useEffect, useRef } from 'react';
import './CustomSelector.css';
import dropdown_icon from '../icons/dropdown-icon.svg'

const CustomSelector = ({ field }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    // Find the initial selected option from field.value
    const initialSelectedOption = field.dropdown.find(option => option.title === field.value);
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption);
    }
  }, [field.dropdown, field.value]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={selectRef} className="custom-select-container">
      <div 
        className="custom-select-display" 
        style={{ backgroundColor: selectedOption ? selectedOption.color : '#fff' }} 
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.title : 'Select an option'} 
        <img src={dropdown_icon} alt='⯆'/>
      </div>
      {isOpen && (
        <ul className="custom-select-options">
          {field.dropdown.map((option, index) => (
            <li 
              key={index} 
              className="custom-select-option"
              style={{ backgroundColor: option.color || '#fff' }}
              onClick={() => handleOptionClick(option)}
            >
              {option.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelector;
