import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import JobSummaryCard from './JobSummaryCard';

class MyRequestsTab extends React.Component {
  render() {
    const { jobsList } = this.props;

    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-mobile">
        <MyRequests {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent />
    );
  }
}

export default MyRequestsTab;

const EmptyStateComponent = () => (
  <div className="column">
    <div className="card is-fullwidth">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">Sorry you have not posted any jobs.</div>
          <br />
          <a
            className="button is-primary "
            onClick={(e) => {
              e.preventDefault();
              switchRoute(ROUTES.CLIENT.PROPOSER.root);
            }}
          >
            Request a Service
          </a>
        </div>
      </div>
    </div>
  </div>
);

const MyRequests = (props) => {
  const { jobsList, notificationFeed } = props;

  const jobCards = jobsList.map((job) => {
    let areThereAnyBidders = job._bidsListRef && job._bidsListRef.length > 0;
    let doesthisJobHaveNewBids = false;
    let numberOfNewBids = 0;

    if (notificationFeed.jobIdsWithNewBids) {
      for (let i = 0; i < notificationFeed.jobIdsWithNewBids.length; i++) {
        if (notificationFeed.jobIdsWithNewBids[i]._id === job._id) {
          doesthisJobHaveNewBids = true;
          numberOfNewBids = notificationFeed.jobIdsWithNewBids[i]._bidsListRef.length;
          break;
        }
      }
    }

    let renderFooter = () => (
      <footer className="card-footer">
        <div className="card-footer-item">
          {!areThereAnyBidders && (
            <a disabled className="button is-outlined is-fullwidth ">
              <span style={{ marginLeft: 4 }}>
                <i className="fa fa-hand-paper" /> No Bids Yet
              </span>
            </a>
          )}

          {areThereAnyBidders && (
            <a
              className="button is-fullwidth is-danger"
              onClick={(e) => {
                e.preventDefault();
                switchRoute(`${ROUTES.CLIENT.PROPOSER.reviewRequestAndBidsPage}/${job._id}`);
              }}
            >
              <span className="icon">
                <i className="fa fa-hand-paper" />
              </span>
              <span style={{ marginLeft: 4 }}>Review Bids</span>
              {areThereAnyBidders && doesthisJobHaveNewBids && (
                <span style={{ marginLeft: 4 }} className="tag is-dark">
                  +{numberOfNewBids}
                </span>
              )}
            </a>
          )}
        </div>
      </footer>
    );
    return (
      <div key={job._id} className="column">
        <JobSummaryCard
          cardClassName={`card bidderRootSpecial is-clipped ${
            areThereAnyBidders ? null : 'disabled'
          }`}
          {...props}
          job={job}
          areThereAnyBidders={areThereAnyBidders}
          renderFooter={renderFooter}
        />
      </div>
    );
  });
  return jobCards;
};
