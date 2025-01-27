import React, { useState, useEffect, useRef } from 'react';
import './CustomSelector.css';
import dropdown_icon from '../icons/dropdown-icon.svg';

const CustomSelector = ({ options, selectedValue, isTabular, setSelectorValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const initialSelectedOption = options.find(option => option.title === selectedValue);
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption);
    }
  }, [options, selectedValue]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSelectorValue({
      value: option.title,
      correctiveAction: {
        text: option.correctiveAction?.text || '',
        _id: option.correctiveAction?._id || '',
      },
    }); // Pass the selected value back to the parent
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
    <div
      ref={selectRef}
      className="custom-select-container"
      style={{ height: isTabular ? '100%' : '' }}
    >
      <div
        className="custom-select-display"
        style={{
          borderRadius: isTabular ? '0px' : '',
          border: isTabular ? 'none' : '',
          backgroundColor: selectedOption ? selectedOption.color : '#fff',
        }}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.title : 'Select an option'}
        <img src={dropdown_icon} alt="⯆" />
      </div>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option, index) => (
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
