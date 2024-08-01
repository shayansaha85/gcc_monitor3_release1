import React, { useState } from "react";
import TopBar from "./Navbar/Navbar.js";
import ParentCard from "./ParentCard/ParentCard.js";


function App() {


    const [selectedOption, setSelectedOption] = useState('10000');

    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <React.Fragment>
            <TopBar onOptionChange={handleOptionChange} />
            <ParentCard selectedOption={selectedOption} />
        </React.Fragment>
    );
}

export default App;