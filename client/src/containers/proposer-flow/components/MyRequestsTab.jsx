import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import JobSummaryForPostedJobs from './JobSummaryForPostedJobs';

class MyRequestsTab extends React.Component {
  render() {
    const { jobsList } = this.props;

    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-centered is-mobile">
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
  const { jobsList } = props;

  const jobCards = jobsList.map((job) => {
    return (
      <div key={job._id} className="column">
        <JobSummaryForPostedJobs {...props} job={job} />
      </div>
    );
  });
  return jobCards;
};
