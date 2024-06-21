import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Modalbox from './Modal/Modalbox';
import Toaster from './Toaster/Toaster';

function TopBar() {
    return (
        <>
            <Toaster />
            <Navbar bg="light" data-bs-theme="light" sticky='top'>
                <Container fluid className='margin-left-right'>
                    <Navbar.Brand style={{ fontWeight: "800", lineHeight: "3rem" }}>GCC Monitor 3 - Tier 1 Apps & User Journey</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <div className='d-inline nav-bar-text rounded'>
                                <p className='text-nowrap d-inline '>
                                    Data Refresh Rate 10 seconds
                                </p>
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