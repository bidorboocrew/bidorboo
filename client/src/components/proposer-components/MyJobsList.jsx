import React from 'react';

import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import JobSummaryView from '../JobSummaryView';

class MyJobsList extends React.Component {


  render() {
    const { jobsList } = this.props;
    const MyJobsList =
      jobsList && jobsList.map && jobsList.length > 0 ? (
        jobsList.map(job => {
          const areThereAnyBidders =
            job._bidsListRef && job._bidsListRef.map && job._bidsListRef.length > 0;

          let specialBorder = areThereAnyBidders
            ? { border: '1px solid #00d1b2' }
            : {};
          return (
            <div key={job._id} className="column is-one-third">
              {!areThereAnyBidders && (
                <a
                  disabled
                  style={{ borderRadius: 0, backgroundColor: '#bdbdbd' }}
                  className="button is-fullwidth is-large"
                >
                  <span style={{ marginLeft: 4 }}>
                    <i className="fa fa-hand-paper" /> No Bids Yet
                  </span>
                </a>
              )}
              {/* show as enabled cuz there is bidders */}
              {areThereAnyBidders && (
                <a
                  style={{ borderRadius: 0 }}
                  className="button is-primary is-fullwidth is-large"
                  onClick={e => {
                    e.preventDefault();
                    switchRoute(ROUTES.CLIENT.PROPOSER.root);
                  }}
                >
                  <span style={{ marginLeft: 4 }}>
                    <i className="fa fa-hand-paper" /> Review Bids
                  </span>
                </a>
              )}
              <JobSummaryView specialStyle={specialBorder} job={job} />
            </div>
          );
        })
      ) : (
        <React.Fragment>
          <div>Sorry you have not posted any jobs</div>
          <div>
            <a
              className="button is-primary"
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              post jobs
            </a>
          </div>
        </React.Fragment>
      );
    return (
      <section className="section">
        <div className="container">
          <div
            // style={{ alignItems: 'flex-end' }}
            className="columns is-multiline"
          >
            {MyJobsList}
          </div>
        </div>
      </section>
    );
  }
}

export default MyJobsList;
