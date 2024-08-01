import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FormControl, InputGroup, ListGroup } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Searchbar = ({ onHandleSearchChange, appTitles }) => {

    const [name, setName] = useState('')
    const [filteredTitles, setFilteredTitles] = useState([]);
    const onevenetChange = (e) => {
        const value = e.target.value
        setName(value);
        onHandleSearchChange(value)


        // Filter the titles based on the input value
        if (value) {
            const filtered = appTitles.filter(title =>
                title.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTitles(filtered);
        } else {
            setFilteredTitles([]);
        }
    }

    const handleSelect = (val) => {
        setName(val);
        setFilteredTitles([]);
        onHandleSearchChange(val);
    };

    const handleFocus = () => {
        setFilteredTitles(appTitles);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setFilteredTitles([]);
        }, 100);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
    };

    return (
        <InputGroup className="mb-3 mt-3"  >
            <FormControl
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="basic-addon1"
                value={name}
                onChange={onevenetChange}
                onFocus={handleFocus}
                onBlur={handleBlur}

            />
            <InputGroup.Text id="basic-addon1">
                <FontAwesomeIcon
                    icon={faSearch} size='2x' />
            </InputGroup.Text>
            {filteredTitles.length > 0 && (
                <ListGroup className="autocomplete-items">
                    {
                        filteredTitles.map((item, index) => (
                            <ListGroup.Item
                                key={index}
                                onMouseDown={handleMouseDown}
                                onClick={() => handleSelect(item)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item}
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            )}
        </InputGroup>
    );
};

export default Searchbar;
