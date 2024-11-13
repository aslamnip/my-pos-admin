/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.css'; // Add your styling in this file

function CustomSelect({ options, handleSelectChange, defaultOption, isDisable, noSelectValue, setCustomIsValid, required, notshowValidText }) {
  const [selectedOption, setSelectedOption] = useState(defaultOption); // Default selected option
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const selectRef = useRef(null);
  const [inputValue, setInputValue] = useState(defaultOption)

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setInputValue('');
    }
    else {
      setInputValue(selectedOption)
    }
  };

  useEffect(() => {
    setSelectedOption(defaultOption);
    setInputValue(defaultOption);  // Update input value when editing
  }, [defaultOption]);

  // Handle selecting an option
  const handleOptionClick = (option) => {
    setSelectedOption(option.name);
    setIsOpen(false);
    if (handleSelectChange) {
      handleSelectChange(option.name); // Call onChange prop with the selected value
      setInputValue(option.name);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setIsOpen(false);

    }
  };

  // Add event listener to detect clicks outside the dropdown
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const defautlData = {
    name: noSelectValue
  }
  const handleInput = (e) => {
    setInputValue(e.target.value)
  }

  const [filterOptions, setFilterOptions] = useState([])
  useEffect(() => {
    const x = options && options.filter(data => data.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1)
    setFilterOptions(x)
  }, [inputValue, options])

  useEffect(() => {
    if (inputValue === noSelectValue) {
      if (required) {
        setIsValid(false);

      }
      else {
        setIsValid(true)
      }
    }
    else {
      setIsValid(options && options.find(data => data.name === inputValue))
    }
  }, [defaultOption, required, inputValue, options, noSelectValue])
  useEffect(() => {
    if (setCustomIsValid) {
      setCustomIsValid(isValid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid])
  return (
    <div>
      <div>
        {
          !isValid && !notshowValidText ?
            <small className='text-danger  '>Please select a valid option</small>
            : <span>{!notshowValidText ? <small style={{ visibility: 'hidden' }} >No Error</small> : null}</span>
        }
      </div>
      <div className="select-wrapper" ref={selectRef}>
        <div className="" onClick={toggleDropdown}>
            {/* <span className="dropdown-arrow">&#9662;</span> */}
          <input style={{ background: isDisable ? '#e9ecef' : null }} className='styledSelect' type="text" onChange={handleInput} value={inputValue} disabled={isDisable} />
        
        </div>
        {isOpen && (
          <ul className="options">
            <li onClick={() => handleOptionClick(defautlData)}>
              {noSelectValue}
            </li>
            {options && filterOptions && filterOptions.map((option) => (
              <li key={option.id} onClick={() => handleOptionClick(option)}>
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CustomSelect;
