import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function Modalbox() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <FontAwesomeIcon icon={faCircleInfo} style={{ fontSize: '20px', cursor: 'pointer' }} onClick={handleShow} />

            <Modal show={show} onHide={handleClose} className='custom-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>About Attributes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>Infrastructure Health:</strong>   Latest status value of the workload where all infrastructure hosts are added for each application/user journey.
                    </p>
                    <p>
                        <strong>  Response Time: </strong> Overall response time of the application/user journey in seconds.
                    </p>
                    <p>
                        <strong>   Synthetic Availability:</strong> Percentage of synthetic check passed for the synthetic scripts allotted for each application/user journey.
                    </p>
                    <p>
                        <strong>  End User Performance (Also known as “apdex”):</strong> Apdex value for each application/user journey taken from Browser data.
                    </p>
                    <p>
                        <strong>  Custom Metrics #1:</strong> Custom metrics based on client requirement. It can be either response time (in seconds) for any API or any specific synthetic script availability.
                    </p>
                    <p>
                        <strong>  Custom Metrics #2:</strong> Custom metrics based on client requirement. It can be either response time (in seconds) for any API or any specific synthetic script availability.
                    </p>
                    <p>
                        <strong>  Custom Metrics #3:</strong> Custom metrics based on client requirement. It can be either response time (in seconds) for any API or any specific synthetic script availability.
                    </p>
                    <p>
                        <strong>  Alerts:</strong> Total number of open alerts for the application/user journey.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Modalbox;