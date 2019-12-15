import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';
import { getMyRequestsSummary, cancelJobById } from '../../app-state/actions/jobActions';
import { REQUEST_STATES } from '../../bdb-tasks/index';

import { getMeTheRightRequestCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import ShareButtons from '../ShareButtons.jsx';
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
    this.props.getMyRequestsSummary();
  }

  render() {
    const { myRequestsSummary, isLoading } = this.props;
    const { selectedTab } = this.state;

    if (isLoading) {
      return <Spinner renderLabel={'Getting your requests'} isLoading={isLoading} size={'large'} />;
    }

    const areThereAnyJobsToView = myRequestsSummary && myRequestsSummary.length > 0;
    let myRequestsSummaryCards = areThereAnyJobsToView
      ? myRequestsSummary
          .filter((job) => {
            if (selectedTab === MY_REQUESTS_TABS.pastRequests) {
              return [
                REQUEST_STATES.DISPUTE_RESOLVED,
                REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN,
                REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN,
                REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN,
                REQUEST_STATES.DISPUTE_RESOLVED,
                REQUEST_STATES.ARCHIVE,
              ].includes(job.state);
            }
            return [
              REQUEST_STATES.OPEN,
              REQUEST_STATES.AWARDED,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER,
              REQUEST_STATES.DISPUTED,
              REQUEST_STATES.DONE,
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

        <div className="tabs is-centered is-fullwidth">
          <ul>
            <li className={`${selectedTab === MY_REQUESTS_TABS.activeRequests ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.activeRequests })}>
                Active Requests
              </a>
            </li>
            <li className={`${selectedTab === MY_REQUESTS_TABS.pastRequests ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.pastRequests })}>
                Past Requests
              </a>
            </li>
          </ul>
        </div>
        {myRequestsSummaryCards && myRequestsSummaryCards.length > 0 ? (
          <div className="columns is-multiline is-centered is-mobile">{myRequestsSummaryCards}</div>
        ) : (
          <EmptyStateComponent />
        )}
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userReducer, uiReducer }) => {
  return {
    myRequestsSummary: jobsReducer.myRequestsSummary,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getMyRequestsSummary: bindActionCreators(getMyRequestsSummary, dispatch),
    cancelJobById: bindActionCreators(cancelJobById, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestsPage);

const EmptyStateComponent = () => (
  <div className="HorizontalAligner-center column">
    <div className="is-fullwidth">
      <div className="card">
        <div className="card-content VerticalAligner">
          <div className="has-text-centered">
            <div className="is-size-6">No requests found.</div>
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
            <br></br>
            <br></br>
            <br></br>
            <div className="is-size-6">Help us spread BidOrBoo in your area</div>
            <ShareButtons shareUrl={'/'}></ShareButtons>
          </div>
        </div>
      </div>
    </div>
  </div>
);
