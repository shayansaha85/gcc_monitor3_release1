import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { NerdGraphQuery } from "nr1";


function AlertTable({ isOpen, handleClose, alertData }) {

    const [tableData, setTableData] = useState(null)
    const [columnWidths, setColumnWidths] = useState([100, 100, 100, 100, 100]);
    const tableRef = useRef(null);

    useEffect(() => {
        fetch_NerdGraph_Query_Result()
    }, [isOpen])



    const fetch_NerdGraph_Query_Result = async () => {
        try {
            const response = await fetchNerdGraphQuery(`{
         actor {
           account(id: 2781667) {
             nrql(query: "FROM NrAiIncident SELECT title, priority, incidentLink WHERE entity.name = '210135-Partner Ready Portal (PRP)-Production' SINCE 7 DAYS AGO") {
               embeddedChartUrl
               nrql
               otherResult
               rawResponse
               staticChartUrl
               totalResult
             }
           }
         }
        }`);
            setTableData(response.actor.account.nrql.rawResponse.results[0].events)

            return response;
        } catch (error) {
            throw new Error(`Error fetching end user performance: ${error.message}`);
        }
    };



    const handleMouseDown = (index, event) => {
        const startX = event.clientX;
        const startWidth = columnWidths[index];

        const handleMouseMove = (e) => {
            const newWidth = startWidth + (e.clientX - startX);
            setColumnWidths((prevWidths) => {
                const newWidths = [...prevWidths];
                newWidths[index] = newWidth;
                return newWidths;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <Modal show={isOpen} onHide={handleClose} size="lg">
            <Container fluid className="alert-container">
                <Row className='m-0'>
                    <Col xs={12} md={6} className="p-2 alert-box critical-alert">
                        <div>
                            Critical Alert : {alertData?.critical?.current}
                        </div>
                    </Col>
                    <Col xs={12} md={6} className="p-2 alert-box warning-alert">
                        <div>
                            Warning Alert : {alertData?.warning?.current}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Modal.Body>
                    <table className="table table-bordered" ref={tableRef}>
                        <thead>
                            <tr>
                                {['Title', 'Priority', 'Date', 'Ticket Link'].map((header, index) => (
                                    <th key={index} style={{ width: columnWidths[index] }}>
                                        {header}
                                        <div
                                            className="resize-handle"
                                            onMouseDown={(e) => handleMouseDown(index, e)}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData?.map((e, index) => (
                                    <tr key={index}>
                                        <td>{e.title}</td>
                                        <td className={e.priority === 'warning' ? 'warning-alert warning-font' : 'critical-alert critical-font'}>{e.priority}</td>
                                        <td>{new Date(e.timestamp).toLocaleString()}</td>
                                        <td><a href={e.incidentLink} target="_blank" rel="noopener noreferrer">{e.incidentLink}</a></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
            </Container>
        </Modal>

    );
}

export default AlertTable;

// Function to make a NerdGraph query
const fetchNerdGraphQuery = async (query) => {
    const response = await NerdGraphQuery.query({ query });
    return response.data;
};

