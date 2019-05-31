import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spinner } from '../../components/Spinner';

import {
  getAllMyOpenJobs,
  cancelJobById,
  getAllMyAwardedJobs,
  getAllMyRequests,
} from '../../app-state/actions/jobActions';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

class MyRequestsPage extends React.Component {
  componentDidMount() {
    this.props.getAllMyRequests();
  }

  render() {
    const { allMyRequests, isLoading } = this.props;

    const areThereAnyJobsToView = allMyRequests && allMyRequests.length > 0;
    let myRequestsSummaryCards = areThereAnyJobsToView
      ? allMyRequests.map((job) => {
          return (
            <div key={job._id} className="column">
              {getMeTheRightRequestCard({
                job,
                isSummaryView: true,
                pointOfView: POINT_OF_VIEW.REQUESTER,
              })}
            </div>
          );
        })
      : null;

    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">My Requests</h1>
            </div>
          </div>
        </section>
        <hr className="divider" />
        <FloatingAddNewRequestButton />
        <Spinner renderLabel={'Getting all your requests'} isLoading={isLoading} size={'large'} />
        {!isLoading && <div className="columns is-multiline is-centered">{myRequestsSummaryCards}</div>}

        {!isLoading&&!areThereAnyJobsToView && <EmptyStateComponent />}
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    myOpenJobsList: jobsReducer.myOpenJobsList,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    allMyRequests: jobsReducer.allMyRequests,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    notificationFeed: uiReducer.notificationFeed,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getAllMyOpenJobs: bindActionCreators(getAllMyOpenJobs, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
    getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
    getAllMyRequests: bindActionCreators(getAllMyRequests, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyRequestsPage);

const FloatingAddNewRequestButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.PROPOSER.root);
      }}
      className="button is-success bdbFloatingButtonText"
    >
      +
    </a>
  );
};

const EmptyStateComponent = () => (
  <div className="has-text-centered">
    <div style={{ maxWidth: 'unset' }} className="card">
      <div className="card-content VerticalAligner ">
        <div className="content has-text-centered ">
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
