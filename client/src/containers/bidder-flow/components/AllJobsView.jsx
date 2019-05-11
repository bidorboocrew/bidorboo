import React from 'react';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';
import { TAB_IDS } from './helperComponents';

import getBidOnSummaryCardByTemplateJobId from '../../../bdb-tasks/getBidOnSummaryCardByTemplateJobId';

export default class AllJobsView extends React.Component {
  render() {
    const { jobsList, activeTab } = this.props;

    return jobsList && jobsList.length > 0 ? (
      <React.Fragment>
        <div className="columns forJobSummary is-multiline is-centered is-mobile">
          {activeTab === TAB_IDS.openRequests && <OtherPeoplesJobs {...this.props} />}
        </div>
      </React.Fragment>
    ) : (
      <EmptyStateComponent />
    );
  }
}

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">No Jobs Found. please check again later!</div>
            <br />
            <a
              className="button is-success "
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              Request a new Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const OtherPeoplesJobs = (props) => {
  const { isLoggedIn, userDetails, showLoginDialog, selectJobToBidOn, jobsList } = props;
  const currentUserId = userDetails && userDetails._id ? userDetails._id : '';

  const components = jobsList
    .filter((job) => job._ownerRef._id !== currentUserId)
    .map((job) => {
      return (
        <div key={job._id} className="column limitMaxdWidth">
          {getBidOnSummaryCardByTemplateJobId(job, {
            onClickHandler: () => {
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                selectJobToBidOn(job);
              }
            },
            userDetails: userDetails,
          })}
        </div>
      );
    });

  return components && components.length > 0 ? components : null;
};
