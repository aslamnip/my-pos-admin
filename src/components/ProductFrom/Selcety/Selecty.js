/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronDown, CheckCircle, Circle, XCircle } from 'lucide-react';
import './Dropdown.css'; // Import the custom CSS file

function Dropdown({
    options,
    onSelect,
    placeholder = 'Select an option',
    defaultValue,
    required = false,
    errorMessage = 'Please select an option',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isTouched, setIsTouched] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find((option) => option.value === selectedValue);

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsTouched(true);
        }
        setSearchQuery('');
    };

    const handleOptionClick = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
        onSelect(value);
        setIsTouched(true);
    };

    const clearSelection = () => {
        setSelectedValue(null);
        onSelect('');
        setIsTouched(true);
    };

    const isValid = !required || !!selectedValue;
    const showErrorMessage = isTouched && !isValid;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const buttonClassName = `dropdown-button ${!isTouched
        ? 'dropdown-button-placeholder'
        : isValid
            ? selectedValue
                ? 'dropdown-button-selected'
                : 'dropdown-button-default'
            : 'dropdown-button-error'} flex items-center`;

    const chevronClassName = `dropdown-chevron transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`;
console.log(chevronClassName);
    const listItemClassName = (optionValue) => `dropdown-list-item rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between ${selectedValue === optionValue ? 'dropdown-list-item-selected' : 'dropdown-list-item-default'}`;

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button
                className={buttonClassName}
                onClick={toggleDropdown}
            >
                <div className="dropdown-button-label truncate">
                    {selectedValue ? selectedOption.label : placeholder}
                </div>
                {selectedValue && (
                    <button
                        className="dropdown-button-clear ml-2 mr-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearSelection();
                        }}
                     />
                )}
              
            </button>

         
                {isOpen && (
                    <ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="dropdown-list"
                    >
                        <div className="dropdown-search-container">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="dropdown-search-input"
                            />
                        </div>
                        {filteredOptions.length === 0 && (
                            <li className="dropdown-no-options">No options found</li>
                        )}
                        {filteredOptions.map((option) => (
                            <li
                                key={option.value}
                                className={listItemClassName(option.value)}
                                onClick={() => handleOptionClick(option.value)}
                            >
                                <span>{option.label}</span>
                                {selectedValue === option.value ? (
                                    <div className="dropdown-list-item-selected-icon" />
                                ) : (
                                    <div className="dropdown-list-item-default-icon" />
                                )}
                            </li>
                        ))}
                    </ul>
                )}
           
            {showErrorMessage && (
                <p className="dropdown-error-message">{errorMessage}</p>
            )}
        </div>
    );
}

function App() {
    const cityOptions = [
        { label: 'Chandpur', value: 'chandpur' },
        { label: 'Cumilla', value: 'cumilla' },
        { label: 'Dhaka City', value: 'dhaka-city' },
        { label: 'Dhaka Sub-Urban', value: 'dhaka-suburban' },
        { label: 'Dinajpur', value: 'dinajpur' },
        { label: 'Faridpur', value: 'faridpur' },
        { label: 'Feni', value: 'feni' },
        { label: 'Gaibandha', value: 'gaibandha' },
        { label: 'Gazipur', value: 'gazipur' },
        { label: 'Gopalganj', value: 'gopalganj' },
        { label: 'Barishal', value: 'barishal' },
        { label: 'Khulna', value: 'khulna' },
        { label: 'Sylhet', value: 'sylhet' },
        { label: 'Rajshahi', value: 'rajshahi' },
    ];

    const handleCitySelect = (selectedCity) => {
        console.log('Selected city:', selectedCity);
        // Do something with the selected city
    };

    const [selectedDefaultCity, setSelectedDefaultCity] = useState('dhaka-city');

    const handleDefaultCitySelect = (selectedCity) => {
        setSelectedDefaultCity(selectedCity);
        console.log("default city", selectedCity)
    }

    return (
        <div className="app-container">
            <div className="app-content">
                <div>
                    <h1 className="app-heading">City Selector</h1>
                    <Dropdown
                        options={cityOptions}
                        onSelect={handleCitySelect}
                        placeholder="Select a City"
                        required
                        errorMessage="Please select a city from the list."
                    />
                </div>
                <div>
                    <h1 className="app-heading"> City Selector With Default Value</h1>
                    <Dropdown
                        options={cityOptions}
                        onSelect={handleDefaultCitySelect}
                        placeholder="Select a City"
                        defaultValue={selectedDefaultCity}
                        required
                        errorMessage="You must select a city"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;