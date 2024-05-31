import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function TopBar() {
    return (
        <Navbar bg="light" data-bs-theme="light" sticky='top'>
            <Container>
                <Navbar.Brand style={{ fontWeight: "800", lineHeight: "3rem" }}>GCC Monitor 3 - User Journeys and Tier 1 App</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default TopBar;