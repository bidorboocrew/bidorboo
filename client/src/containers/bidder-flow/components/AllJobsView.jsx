import React from 'react';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../../bdb-tasks/getMeTheRightCard';

export default class AllJobsView extends React.Component {
  render() {
    const { jobsList } = this.props;
    return jobsList && jobsList.length > 0 ? (
      <div className="columns is-multiline is-centered is-mobile">
        <OtherPeoplesJobs {...this.props} />
      </div>
    ) : (
      <EmptyStateComponent />
    );
  }
}

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content VerticalAligner">
          <div className="content has-text-centered">
            <div className="is-size-5">No Open Requests. please check again soon!</div>
            <br />
            <a
              className="button is-success "
              onClick={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              Post Requests
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const OtherPeoplesJobs = (props) => {
  const { userDetails, jobsList, showMapView } = props;

  const currentUserId = userDetails && userDetails._id ? userDetails._id : '';
  const components = jobsList
    .filter((job) => job._ownerRef._id !== currentUserId)
    .map((job) => {
      return (
        <div key={job._id} className="column is-narrow isforCards slide-in-bottom-small">
          {getMeTheRightRequestCard({
            job,
            isSummaryView: true,
            pointOfView: POINT_OF_VIEW.TASKER,
            userDetails: userDetails,
            showMapView: showMapView,
          })}
        </div>
      );
    });

  return components && components.length > 0 ? components : null;
};
