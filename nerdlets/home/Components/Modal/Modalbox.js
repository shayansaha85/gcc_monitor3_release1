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
                        <strong>  Metric #1 Infrastructure Health:</strong> Latest status value of the workload where all infrastructure hosts are added for each application/user journey.
                    </p>
                    <p>
                        <strong>  Metric #2 Response Time:</strong> Overall response time of the application/user journey in seconds.
                    </p>
                    <p>
                        <strong>  Metric #3 Synthetic Availability:</strong> Percentage of synthetic check passed for the synthetic scripts allotted for each application/user journey.
                    </p>
                    <p>
                        <strong>  Metric #4 End User Performance (Also known as “apdex”):</strong> Apdex is a simplified Service Level Agreement (SLA) solution that helps you see how satisfied users are with your application. An Apdex score varies from 0 to 1, with 0 as the worst possible score (100% of response times were Frustrated), and 1 as the best possible score (100% of response times were Satisfied).
                    </p>
                    <p>
                        <strong> Metric #5:</strong>This metric varies application to application and is configurable as per requirements like response time (sec) for critical transactions/API or URL availability (%).
                    </p>
                    <p>
                        <strong>  Metric #6:</strong> This metric varies application to application and is configurable as per requirements like response time (sec) for critical transactions/API or URL availability (%).
                    </p>
                    <p>
                        <strong>  Metric #7:</strong> This metric varies application to application and is configurable as per requirements like response time (sec) for critical transactions/API or URL availability (%).
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