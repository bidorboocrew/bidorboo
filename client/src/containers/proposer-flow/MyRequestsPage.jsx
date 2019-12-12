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
import { REQUEST_STATES } from '../../bdb-tasks/index';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

const MY_REQUESTS_TABS = {
  activeRequests: 'activeRequests',
  pastRequests: 'pastRequests',
};
class MyRequestsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: MY_REQUESTS_TABS.activeRequests,
    };
  }
  componentDidMount() {
    this.props.getAllMyRequests();
  }

  render() {
    const { allMyRequests, isLoading } = this.props;
    const { selectedTab } = this.state;

    const areThereAnyJobsToView = allMyRequests && allMyRequests.length > 0;
    let myRequestsSummaryCards = areThereAnyJobsToView
      ? allMyRequests
          .filter((job) => {
            if (selectedTab === MY_REQUESTS_TABS.pastRequests) {
              return [
                REQUEST_STATES.DISPUTE_RESOLVED,
                REQUEST_STATES.ARCHIVE,
                REQUEST_STATES.PAYMENT_RELEASED,
                REQUEST_STATES.CANCELED_OPEN,
                REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN,
                REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER,
                REQUEST_STATES.DONE,
                REQUEST_STATES.PAIDOUT,
                REQUEST_STATES.PAYMENT_TO_BANK_FAILED,
              ].includes(job.state);
            }
            return [
              REQUEST_STATES.OPEN,
              REQUEST_STATES.AWARDED,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER,
              REQUEST_STATES.DISPUTED,
            ].includes(job.state);
          })
          .map((job) => {
            return (
              <div key={job._id} className="column is-narrow isforCards slide-in-bottom-small">
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
      <div>
        <section className="hero is-white">
          <div className="hero-body  has-text-centered">
            <div className="container">
              <h1 style={{ marginBottom: 0 }} className="has-text-dark title">
                Requests Inbox
              </h1>
            </div>
          </div>
        </section>

        <Spinner renderLabel={'Getting all your requests'} isLoading={isLoading} size={'large'} />
        {!isLoading && (
          <React.Fragment>
            <div className="tabs is-centered is-fullwidth">
              <ul>
                <li
                  className={`${
                    selectedTab === MY_REQUESTS_TABS.activeRequests ? 'is-active' : ''
                  }`}
                >
                  <a
                    onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.activeRequests })}
                  >
                    Active Requests
                  </a>
                </li>
                <li
                  className={`${selectedTab === MY_REQUESTS_TABS.pastRequests ? 'is-active' : ''}`}
                >
                  <a onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.pastRequests })}>
                    Past Requests
                  </a>
                </li>
              </ul>
            </div>
            <div className="columns is-multiline is-centered is-mobile">
              {myRequestsSummaryCards}
            </div>
          </React.Fragment>
        )}

        {!isLoading && !areThereAnyJobsToView && <EmptyStateComponent />}
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

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestsPage);

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
  <div className="HorizontalAligner-center column">
    <div className="is-fullwidth">
      <div className="card">
        <div className="card-content VerticalAligner">
          <div className="has-text-centered">
            <div className="is-size-6">You have not requested any services yet</div>
            <br />
            <a
              className="button is-success "
              onClick={(e) => {
                e.preventDefault();
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            >
              REQUEST A SERVICE
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
