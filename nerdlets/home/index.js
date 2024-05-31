import React from 'react';


// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './Components/App';

const HomeNerdlet = () => {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>

  );
};

export default HomeNerdlet;


/* 
{
  actor {
    user {
      name
    }
    account(id: 2781667) {
      nrql(
        query: "SELECT average(duration) as  '' from Transaction where appName = '210135-Partner Ready Portal (PRP)-Production' SINCE 5 MINUTES AGO"
        timeout: 5
      ) {
        embeddedChartUrl
        nrql
        otherResult
        rawResponse
        staticChartUrl
        totalResult
      }
    }
  }
}

*/