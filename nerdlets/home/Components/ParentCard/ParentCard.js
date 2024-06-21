import React, { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap';
import TimeDropdown from '../TimeDropdown/TimedropDown';
import Searchbar from '../Searchbar/SearchBar';

// nerdGraph
import { NerdGraphQuery } from 'nr1';

import EMDMH from './Card/EMDMH';

import appsList from "../../../app_data.json";

const ParentCard = () => {

    const [timeUpdater, setTimeUpdater] = useState('5 Minutes')
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCardList_custom_state, setFilteredList_Custom] = useState()

    let list_of_sortedCards;

    useEffect(async () => {

        const filteredCardList_custom = Object.keys(appsList).filter((metricKey) =>
            metricKey.toLowerCase().includes(searchTerm.toLowerCase())
        ).reduce((obj, key) => {
            obj[key] = appsList[key];
            return obj;
        }, {});

        const statusOrder = { "DISRUPTED": 4, "DEGRADED": 3, "UNKNOWN": 2, "OPERATIONAL": 1 };
        const sorted = await Promise.all(Object.entries(filteredCardList_custom).map(async ([project, metrics]) => {
            const workloadQuery = metrics.metric9.query;
            const workload_account_Id = metrics.metric9.accountId;
            const workloadData = await fetch_NerdGraph_Query_Result(workloadQuery, workload_account_Id);
            const workloadValue = workloadData?.actor?.account?.nrql?.rawResponse?.results[0]?.latest ?? null;
            const workloadUrl = metrics.metric9.url;
            return { project, metrics, workloadValue, workloadUrl };
        }));

        const sortedCards = sorted.sort((a, b) => {
            const statusA = a.workloadValue?.toUpperCase() ?? null;
            const statusB = b.workloadValue?.toUpperCase() ?? null;

            if (statusA === statusB) return 0;
            if (statusA === null) return 1;
            if (statusB === null) return -1;
            return (statusOrder[statusA] || 0) > (statusOrder[statusB] || 0) ? -1 : 1;
        });

        setFilteredList_Custom(sortedCards)

    }, [searchTerm, timeUpdater]);


    // const filteredCardList = Object.keys(appsList).filter((metricKey) =>
    //     metricKey.toLowerCase().includes(searchTerm.toLowerCase())
    // ).reduce((obj, key) => {
    //     obj[key] = appsList[key];
    //     return obj;
    // }, {});

    const fetch_NerdGraph_Query_Result = async (customQuery, account_id) => {
        try {
            const response = await fetchNerdGraphQuery(`{
        actor {
          account(id: ${account_id}) {
            nrql(query: "${customQuery}") {
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


    const timeCollector = (time) => {
        setTimeUpdater(time)
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };


    return (
        <div style={{ maxWidth: "100%" }}>
            <div style={{ maxWidth: "95%", margin: "auto" }}>
                <div>
                    <Row >
                        <Col>
                            <Searchbar setSearchTerm={setSearchTerm} />
                        </Col>
                        <Col md={{ offset: 5 }} >
                            <TimeDropdown timeCollector={timeCollector} />
                        </Col>
                    </Row>
                </div>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill,minmax(440px,1fr))', justifyContent: 'center' }}>
                    {

                        filteredCardList_custom_state?.map(e =>
                            <EMDMH
                                key={e.project}
                                cardName={e.project}
                                timeUpdater={timeUpdater}
                                guid={'Mjc4MTY2N3xOUjF8V09SS0xPQUR8MjE1MzQw'}
                                metrics={e.metrics}
                                headingColor={e.workloadValue}
                                hyperlink={e.workloadUrl}
                            />
                        )
                    }

                </div>
            </div>
        </div>
    );
};

export default ParentCard;



// Function to make a NerdGraph query
const fetchNerdGraphQuery = async (query) => {
    const response = await NerdGraphQuery.query({ query });
    return response.data;
};

