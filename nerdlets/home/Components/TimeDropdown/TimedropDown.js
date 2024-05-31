import React, { useState } from 'react';

const TimeDropdown = ({ timeCollector }) => {
    const [selectedTime, setSelectedTime] = useState('5 MINUTES');

    // Function to handle the change in selected time
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
        timeCollector(event.target.value)
    };


    //all the time options
    const timeOptions = [
        { value: '5 MINUTES', label: '5 Minutes' },
        { value: '30 MINUTES', label: '30 Minutes' },
        { value: '60 MINUTES', label: '60 Minutes' },
        { value: '3 HOUR', label: '3 Hours' },
        { value: '6 HOUR', label: '6 Hours' },
        { value: '12 HOUR', label: '12 Hours' },
        { value: '24 HOUR', label: '24 Hours' },
        { value: '3 DAYS', label: '3 Days' },
        { value: '7 DAYS', label: '7 Days' },
    ];


    return (
        <div>
            <label htmlFor="timeSelect">Select Time:</label>
            <select
                id="timeSelect"
                value={selectedTime}
                onChange={handleTimeChange}
            >
                <option value="" disabled>Select a time</option>
                {
                    timeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default TimeDropdown;
