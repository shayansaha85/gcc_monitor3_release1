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

            <Modal show={show} onHide={handleClose} size="lg" className='custom-modal'>
                <Modal.Header closeButton>
                    <Modal.Title>About Attributes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{ fontWeight: 'bold' }}>About Attributes</h5>
                    <br></br>
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
                    </p><br></br>
                    <h5 style={{ fontWeight: 'bold' }} >Other Information</h5>
                    <p><strong>About Status:</strong> The color of the widget title bar is determined by the most recent status of the master workload associated with the specific application or user journey.</p>

                    <p><strong>Host Status for 3h:</strong> This status remains static and is calculated from the present time, representing the status of the infrastructure workload for the specified application or user journey over the past three hours.</p>

                    <p><strong>Arrow Direction and Arrow Color: </strong>
                        The <strong>Arrow Direction</strong> is based on a comparison of the attribute values within the selected time range, as chosen by the user through the embedded timepicker, and the <strong>Arrow Color</strong> is determined by whether the attribute values exceed the predefined critical or warning thresholds. These thresholds can be viewed by hovering the mouse over the values in each widget, where applicable.</p>


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