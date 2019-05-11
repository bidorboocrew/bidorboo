import React from 'react';

import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import getSummaryCardByTemplateJobId from '../../../bdb-tasks/getSummaryCardByTemplateJobId';
class MyRequestsTab extends React.Component {
  render() {
    const { jobsList } = this.props;

    const userHasPostedJobs = jobsList && jobsList.map && jobsList.length > 0;

    return userHasPostedJobs ? (
      <div className="columns is-multiline is-centered">
        <MyRequests {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent />
    );
  }
}

export default MyRequestsTab;

const EmptyStateComponent = () => (
  <div className="has-text-centered">
    <div style={{ maxWidth: 'unset' }} className="card">
      <div className="card-content">
        <div className="content has-text-centered">
          <div className="is-size-5">You have not requested any services yet</div>
          <br />
          <a
            className="button is-success "
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
      <div key={job._id} className="column is-one-quarter">
        {getSummaryCardByTemplateJobId(job, props)}
      </div>
    );
  });
  return jobCards;
};
