import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modalbox from '../Modal/Modalbox';
import Toaster from '../Toaster/Toaster';

function TopBar({ onOptionChange }) {

    const handleRefreshTimeChange = (event) => {
        onOptionChange(event.target.value);
    };

    return (
        <>
            <Toaster />
            <Navbar bg="light" data-bs-theme="light" sticky='top'>
                <Container fluid className='margin-left-right'>
                    <Navbar.Brand style={{ fontWeight: "800", lineHeight: "3rem" }}>GCC Monitor 3 - Tier 1 Apps & User Journey</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <div className='d-inline nav-bar-text rounded'>
                                <label>
                                    Refresh Rate :
                                    <select name="selectedFruit" onChange={handleRefreshTimeChange}>
                                        <option value="10000">10 Seconds</option>
                                        <option value="20000">20 Seconds</option>
                                        <option value="30000">30 Seconds</option>
                                        <option value="60000">60 Seconds</option>
                                    </select>
                                </label>
                            </div>
                            <Modalbox />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default TopBar;

{/*   <p className='text-nowrap d-inline '>
                                   Refresh Rate : 30 seconds
                                </p> */}