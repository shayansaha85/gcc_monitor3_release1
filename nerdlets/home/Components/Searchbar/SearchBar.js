import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Searchbar = ({ setSearchTerm }) => {

    const [name, setName] = useState('')

    const onevenetChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <InputGroup className="mb-3 mt-3"  >
            <FormControl
                placeholder="Search..."
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={onevenetChange}
            />
            <InputGroup.Text id="basic-addon1">
                <FontAwesomeIcon
                    icon={faSearch} size='2x' />
            </InputGroup.Text>
        </InputGroup>
    );
};

export default Searchbar;