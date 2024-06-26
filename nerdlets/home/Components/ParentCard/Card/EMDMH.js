import React, { useEffect, useRef, useState } from "react";
import { Button, Container, ListGroup, ProgressBar } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

// fontawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

// nerdGraph
import { NerdGraphQuery } from "nr1";
import AlertTable from "./Alert/AlertTable";
import Modalbox from "../../Modal/Modalbox";

const EMDMH = ({
    cardName,
    timeUpdater,
    guid,
    metrics,
    headingColor,
    hyperlink,
}) => {
    const [userData, setUserData] = useState({
        progressCountStatus: [],
    });

    const [queryTimestamp, setQueryTimestamp] = useState(Date.now());
    const [userData_Custom_Metric, setUserData_Custom_Metric] = useState({});
    const queryInProgress = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setQueryTimestamp(Date.now());
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        query_Metrices();
    }, [queryTimestamp]);



    const formatValue = (value) => {
        return typeof value === "number" ? value.toFixed(3) : value;
    };


    const query_Metrices = async () => {

        queryInProgress.current = true;

        for (const [metricKey, metricVal] of Object.entries(metrics)) {
            try {
                let parseValue, results, parse_warning, result_warning, previousResults;

                if (metricVal.query && metricVal.name !== "WorkLoad") {
                    parseValue = await fetch_NerdGraph_Query_Result(metricVal.query, metricVal.accountId);
                    results =
                        parseValue.actor.account.nrql.rawResponse.current.results[0].latest ??
                        parseValue.actor.account.nrql.rawResponse.current.results[0].average ??
                        parseValue.actor.account.nrql.rawResponse.current.results[0].result ??
                        parseValue.actor.account.nrql.rawResponse.current.results[0].score ??
                        parseValue.actor.account.nrql.rawResponse.current.results[0].count;

                    previousResults =
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].latest ??
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].average ??
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].result ??
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].score ??
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].count;

                    setUserData_Custom_Metric((prevState) => ({
                        ...prevState,
                        [metricKey]: {
                            name: metricVal.name,
                            current: formatValue(results),
                            previous: formatValue(previousResults),
                            critical_val: metricVal.critical_val,
                            warning_val: metricVal.warning_val,
                            comparison: metricVal.comparison,
                        },
                    }));
                }
                if (metricKey === 'metric8') {
                    parseValue = await fetch_NerdGraph_Query_Result(
                        metricVal.criticalAlert, metricVal.accountId
                    );
                    parse_warning = await fetch_NerdGraph_Query_Result(
                        metricVal.warningAlert, metricVal.accountId
                    );

                    results =
                        parseValue.actor.account.nrql.rawResponse.current.results[0].count;
                    previousResults =
                        parseValue.actor.account.nrql.rawResponse.previous.results[0].count;

                    result_warning =
                        parse_warning.actor.account.nrql.rawResponse.current.results[0]
                            .count;
                    const previous_warning =
                        parse_warning.actor.account.nrql.rawResponse.previous.results[0]
                            .count;

                    setUserData_Custom_Metric((prevState) => ({
                        ...prevState,
                        [metricKey]: {
                            name: metricVal.name,
                            critical: {
                                current: results,
                                previous: previousResults,
                            },
                            warning: {
                                current: result_warning,
                                previous: previous_warning,
                            },
                            critical_val: metricVal.critical_val,
                            warning_val: metricVal.warning_val,
                            comparison: metricVal.comparison,
                            ticketTable: metricVal.ticketTable,
                            accountId: metricVal.accountId
                        },
                    }));
                }
                if (metricKey === 'metric1') {
                    const regex = /'([^']+)'/g;

                    const entityNames = [];
                    let match;

                    // Extract entity names from the query string
                    while ((match = regex.exec(metricVal.query)) !== null) {
                        entityNames.push(match[1]);
                    }

                    const resolvedProgress = await fetch_NerdGraph_Query_Progress(entityNames, metricVal.accountId)

                    let progressCountOccurance = getOccuranceObject(resolvedProgress);
                    let progressCount = formatObject(progressCountOccurance);
                    setUserData({
                        progressCountStatus: progressCount,
                    });
                }
            } catch (error) {
                console.error(`Error processing metric ${metricKey}: ${error.message}`);
            }

            queryInProgress.current = false;
        }
    };

    const fetch_NerdGraph_Query_Result = async (customQuery, account_id) => {
        try {
            const response = await fetchNerdGraphQuery(`{
        actor {
          account(id: ${account_id}) {
            nrql(query: "${customQuery} SINCE ${timeUpdater} AGO COMPARE WITH ${timeUpdater} AGO") {
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
            return response;
        } catch (error) {
            throw new Error(`Error fetching end user performance: ${error.message}`);
        }
    };
    const fetch_NerdGraph_Query_Progress = async (infraName, account_id) => {

        try {
            const response = await fetchNerdGraphQuery(`{
        actor {
          account(id: ${account_id}) {
            nrql(query: "FROM WorkloadStatus SELECT count(*) SINCE 3 HOURS AGO WHERE entity.name In (${infraName.map(infra => `'${infra}'`).join(',')}) FACET statusValue TIMESERIES 18 MINUTES") {
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
            return response;
        } catch (error) {
            throw new Error(`Error fetching end user performance: ${error.message}`);
        }
    };

    let deafultHeadingColor = "grayBackground";

    if (headingColor === "OPERATIONAL") {
        deafultHeadingColor = "lightGreenBackground";
    } else if (headingColor === "DEGRADED") {
        deafultHeadingColor = "yellowBackground";
    } else if (headingColor === "DISRUPTED") {
        deafultHeadingColor = "redBackground";
    }

    // Progress bar UI
    const progressBarUI = userData.progressCountStatus.map((key) => {
        let variant;
        switch (key) {
            case "DEGRADED":
                variant = "warning";
                break;
            case "DISRUPTED":
                variant = "danger";
                break;
            case "OPERATIONAL":
                variant = "success";
                break;
            case "UNKNOWN":
                variant = "secondary";
                break;
            default:
                variant = "info";
                break;
        }
        return <ProgressBar variant={variant} now={10} key={key} />;
    });

    const getClassNameForPages = (metricObject) => {
        if (metricObject.comparison === "G") {

            if (
                metricObject?.current >
                metricObject.critical_val
            ) {
                return "red";
            }
            if (
                metricObject?.current >=
                metricObject?.warning_val &&
                metricObject?.current <
                metricObject.critical_val
            ) {
                return "yellow";
            }
            return "green";
        }
        if (metricObject.comparison === "L") {
            if (
                metricObject?.current <
                metricObject.critical_val
            ) {
                return "red";
            }
            if (
                metricObject?.current <
                metricObject?.warning_val &&
                metricObject?.current >
                metricObject.critical_val
            ) {
                return "yellow";
            }
            return "green";
        }
    };

    const alertModalHandler = () => {
        setIsModalOpen(!isModalOpen)
    }


    return (
        <>
            <Card style={{ maxHeight: "100%" }} border="dark">
                <Card.Header className={`${deafultHeadingColor} smaller-font`}>
                    <a
                        href={hyperlink}
                        target="_blank"
                    >
                        {cardName}
                    </a>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <ProgressBar style={{ width: "60%" }}>
                                {progressBarUI}
                            </ProgressBar>
                            <p style={{ marginLeft: "10px", marginBottom: "0px" }}>
                                {" "}
                                Host Status for 3h{" "}
                            </p>
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <ListGroup variant="flush">
                            {Object.entries(userData_Custom_Metric).map(
                                ([metricKey, metricVal]) => (
                                    <ListGroup.Item
                                        className="listItemCustomPadding"
                                        key={metricKey}
                                    >
                                        <Row>
                                            <Col sm={7} style={metricVal.name.length > 35 ? { fontSize: "0.8rem" } : metricVal.name.length > 27 ? { fontSize: "0.9rem" } : {}}> {metricVal.name} </Col>
                                            <Col sm={1}>
                                                <FontAwesomeIcon
                                                    icon={(metricKey === 'metric1' || metricKey === 'metric8') ? faCaretUp : metricVal.current > metricVal.previous ? faCaretUp : faCaretDown}
                                                    size="2x"
                                                    className={(metricKey === 'metric1' || metricKey === 'metric8') ? 'green' : getClassNameForPages(metricVal)}
                                                />
                                            </Col>
                                            <Col sm={4} className="text-center">
                                                {metricKey === "metric8" ? (
                                                    <>
                                                        <AlertTable isOpen={isModalOpen} handleClose={alertModalHandler} alertData={metricVal} timeSeries={timeUpdater} />
                                                        <span style={{ cursor: "pointer", textDecoration: "underline"}} onClick={alertModalHandler}>
                                                            {(metricVal?.critical?.current !== 0 || metricVal?.warning?.current !== 0) ?
                                                                (metricVal?.critical?.current + metricVal?.warning?.current).toFixed(0) : 'NA'}
                                                        </span>
                                                    </>
                                                ) : metricKey === "metric1" ? (
                                                    <span style={{ cursor: "pointer" }}>
                                                        {metricVal?.current}
                                                    </span>
                                                ) : (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip>
                                                                {
                                                                    <div>
                                                                        Warning : {metricVal?.current ? metricVal?.warning_val : 0}
                                                                        <br />
                                                                        Critical : {metricVal?.current ? metricVal?.critical_val : 0}
                                                                    </div>
                                                                }
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <span style={{ cursor: "pointer" }} >
                                                            {metricVal ? (metricVal.current ? metricVal.current : "NA") : "Loading..."}
                                                        </span>
                                                    </OverlayTrigger>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ),
                            )}
                        </ListGroup>
                    </Card.Text>
                </Card.Body>
            </Card>

        </>
    );
};

export default EMDMH;

// Function to make a NerdGraph query
const fetchNerdGraphQuery = async (query) => {
    const response = await NerdGraphQuery.query({ query });
    return response.data;
};

const getOccuranceObject = (data) => {
    var statusOccurances = {};
    const timesliceData = data.actor.account.nrql.rawResponse.facets;

    for (var i = 0; i < timesliceData.length; i++) {
        if (timesliceData[i].name == "UNKNOWN") {
            statusOccurances["unknown"] = [];
            for (var j = 0; j < timesliceData[i].timeSeries.length; j++) {
                statusOccurances["unknown"].push(
                    timesliceData[i].timeSeries[j].inspectedCount,
                );
            }
        } else if (timesliceData[i].name == "OPERATIONAL") {
            statusOccurances["operational"] = [];
            for (var j = 0; j < timesliceData[i].timeSeries.length; j++) {
                statusOccurances["operational"].push(
                    timesliceData[i].timeSeries[j].inspectedCount,
                );
            }
        } else if (timesliceData[i].name == "DISRUPTED") {
            statusOccurances["disrupted"] = [];
            for (var j = 0; j < timesliceData[i].timeSeries.length; j++) {
                statusOccurances["disrupted"].push(
                    timesliceData[i].timeSeries[j].inspectedCount,
                );
            }
        } else if (timesliceData[i].name == "DEGRADED") {
            statusOccurances["degraded"] = [];
            for (var j = 0; j < timesliceData[i].timeSeries.length; j++) {
                statusOccurances["degraded"].push(
                    timesliceData[i].timeSeries[j].inspectedCount,
                );
            }
        } else {
            statusOccurances["unknown"].push(0);
            statusOccurances["operational"].push(0);
            statusOccurances["disrupted"].push(0);
            statusOccurances["degraded"].push(0);
        }
    }

    return statusOccurances;
};

const formatObject = (obj) => {
    const keys = Object.keys(obj);

    if (!keys.includes("unknown")) {
        obj["unknown"] = [];
        for (var i = 0; i < obj[Object.keys(obj)[0]].length; i++) {
            obj["unknown"].push(0);
        }
    }

    if (!keys.includes("operational")) {
        obj["operational"] = [];
        for (var i = 0; i < obj[Object.keys(obj)[0]].length; i++) {
            obj["operational"].push(0);
        }
    }

    if (!keys.includes("degraded")) {
        obj["degraded"] = [];
        for (var i = 0; i < obj[Object.keys(obj)[0]].length; i++) {
            obj["degraded"].push(0);
        }
    }

    if (!keys.includes("disrupted")) {
        obj["disrupted"] = [];
        for (var i = 0; i < obj[Object.keys(obj)[0]].length; i++) {
            obj["disrupted"].push(0);
        }
    }

    const result = [];
    var output = [];
    const maxLength = Math.max(...Object.values(obj).map((arr) => arr.length));

    for (let i = 0; i < maxLength; i++) {
        const formattedEntry = {};

        for (const key in obj) {
            formattedEntry[key] = obj[key][i] !== undefined ? obj[key][i] : null;
        }

        result.push(formattedEntry);
    }

    for (var i = 0; i < result.length; i++) {
        if (result[i].unknown != 0) {
            output.push("UNKNOWN");
        } else if (result[i].degraded != 0) {
            output.push("DEGRADED");
        } else if (result[i].disrupted != 0) {
            output.push("DISRUPTED");
        } else {
            output.push("OPERATIONAL");
        }
    }
    return output;
};

function HelloWorld({
    greeting = "hello",
    greeted = '"World"',
    silent = false,
    onMouseOver,
}) {
    if (!greeting) {
        return null;
    }

    // TODO: Don't use random in render
    let num = Math.floor(Math.random() * 1e7)
        .toString()
        .replace(/\.\d+/gi, "");

    return (
        <div
            className="HelloWorld"
            title={`You are visitor number ${num}`}
            onMouseOver={onMouseOver}
        >
            <strong>
                {greeting.slice(0, 1).toUpperCase() + greeting.slice(1).toLowerCase()}
            </strong>
            {greeting.endsWith(",") ? (
                " "
            ) : (
                <span style={{ color: "grey" }}>", "</span>
            )}
            <em>{greeted}</em>
            {silent ? "." : "!"}
        </div>
    );
}
