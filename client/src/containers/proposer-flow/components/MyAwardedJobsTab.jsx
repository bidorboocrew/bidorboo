import React from 'react';

import JobSummaryForAwarded from './JobSummaryForAwarded';
import { TAB_IDS } from './helperComponents';

class MyAwardedJobsTab extends React.Component {
  render() {
    const { jobsList } = this.props;
    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-mobile is-centered">
        <AwardedRequests {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent {...this.props} />
    );
  }
}

export default MyAwardedJobsTab;

const EmptyStateComponent = (props) => (
  <div className="has-text-centered">
    <div style={{ maxWidth: 'unset' }} className="card">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">You have no awarded Jobs.</div>
          <div className="help">Go to your requests tab, review the bids and select a Tasker.</div>
          <br />
          <a
            className="button is-success "
            onClick={(e) => {
              e.preventDefault();
              props.changeActiveTab(TAB_IDS.myRequests);
            }}
          >
            My Requests
          </a>
        </div>
      </div>
    </div>
  </div>
);

const AwardedRequests = (props) => {
  const { jobsList } = props;
  const myAwardedJobs = jobsList.map((job) => {
    return (
      <div key={job._id} className="column is-one-quarter">
        <JobSummaryForAwarded showBidCount={false} job={job} />
      </div>
    );
  });
  return myAwardedJobs;
};
