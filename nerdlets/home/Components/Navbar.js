import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modalbox from './Modal/Modalbox';

function TopBar() {
    return (
        <Navbar bg="light" data-bs-theme="light" sticky='top'>
            <Container fluid className='margin-left-right'>
                <Navbar.Brand style={{ fontWeight: "800", lineHeight: "3rem" }}>GCC Monitor 3 - User Journeys and Tier 1 App</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text >
                        <Modalbox />
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default TopBar;