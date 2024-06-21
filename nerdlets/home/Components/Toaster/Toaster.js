import React, { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';
function Toaster() {

    const [showToaster, setShowToaster] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowToaster(true);
            setTimeout(() => setShowToaster(false), 2000);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            aria-live="polite"
            aria-atomic="true"
            style={{
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: '46%',
                    zIndex: 1050,
                   
                }}
            >
                <Toast show={showToaster} animation={true} style={{ minWidth: '250px' }} className="toast-custom">
                    {/* <Toast.Header closeButton={false}>
                        <strong className="me-auto"> </strong>
                    </Toast.Header> */}
                    <Toast.Body><strong>Refreshing...</strong></Toast.Body>
                </Toast>
            </div>
        </div>
    );
}

export default Toaster;

