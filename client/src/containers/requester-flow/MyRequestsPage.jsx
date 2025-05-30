import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';
import { getMyRequestsSummary, cancelRequestById } from '../../app-state/actions/requestActions';
import { REQUEST_STATES } from '../../bdb-tasks/index';
import NoRequetsFound from '../../assets/images/NoRequetsFound.png';

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
    this.props.getMyRequestsSummary();
  }

  render() {
    const { myRequestsSummary, isLoading } = this.props;
    const { selectedTab } = this.state;

    if (isLoading) {
      return <Spinner renderLabel={'Getting your requests'} isLoading size={'large'} />;
    }

    const areThereAnyRequestsToView = myRequestsSummary && myRequestsSummary.length > 0;

    let pastRequests = areThereAnyRequestsToView
      ? myRequestsSummary
          .filter((request) => {
            return [
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.ARCHIVE,
            ].includes(request.state);
          })
          .map((request) => {
            return (
              <div key={request._id} className="column is-narrow isforCards slide-in-bottom-small">
                {getMeTheRightRequestCard({
                  request,
                  isSummaryView: true,
                  pointOfView: POINT_OF_VIEW.REQUESTER,
                })}
              </div>
            );
          })
      : null;

    let activeRequests = areThereAnyRequestsToView
      ? myRequestsSummary
          .filter((request) => {
            return [
              REQUEST_STATES.OPEN,
              REQUEST_STATES.AWARDED,
              REQUEST_STATES.AWARDED_SEEN,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER,
              REQUEST_STATES.DISPUTED,
              REQUEST_STATES.DONE,
              REQUEST_STATES.DONE_SEEN,
            ].includes(request.state);
          })
          .map((request) => {
            return (
              <div key={request._id} className="column is-narrow isforCards slide-in-bottom-small">
                {getMeTheRightRequestCard({
                  request,
                  isSummaryView: true,
                  pointOfView: POINT_OF_VIEW.REQUESTER,
                })}
              </div>
            );
          })
      : null;

    let myRequestsSummaryCards = null;
    if (areThereAnyRequestsToView) {
      if (selectedTab === MY_REQUESTS_TABS.pastRequests) {
        myRequestsSummaryCards = pastRequests;
      } else {
        myRequestsSummaryCards = activeRequests;
      }
    }

    return (
      <div>
        {/* <section className="hero has-text-centered is-white is-small">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="subtitle">Check the status of your requests</h1>
            </div>
          </div>
        </section> */}

        <div className="tabs is-centered">
          <ul style={{ background: '#eee', paddingTop: '1rem' }}>
            <li className={`${selectedTab === MY_REQUESTS_TABS.activeRequests ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.activeRequests })}>
                {`Active Requests (${activeRequests ? activeRequests.length : 0})`}
              </a>
            </li>
            <li className={`${selectedTab === MY_REQUESTS_TABS.pastRequests ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_REQUESTS_TABS.pastRequests })}>
                {`Past Requests (${pastRequests ? pastRequests.length : 0})`}
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
const mapStateToProps = ({ requestsReducer, userReducer }) => {
  return {
    myRequestsSummary: requestsReducer.myRequestsSummary,
    isLoading: requestsReducer.isLoading,
    userDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getMyRequestsSummary: bindActionCreators(getMyRequestsSummary, dispatch),
    cancelRequestById: bindActionCreators(cancelRequestById, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestsPage);

const EmptyStateComponent = () => (
  <>
    <div className="HorizontalAligner-center column fade-in">
      <div className="is-fullwidth">
        <div>
          <div className="card-content VerticalAligner">
            <div className="has-text-centered">
              <div className="is-size-4">Get your chores done, Request a Service!</div>
              <section style={{ padding: 0 }} className="hero is-small has-text-centered fade-in">
                <div style={{ padding: 0 }} className="hero-body">
                  <div className="container has-text-centered">
                    <img style={{ width: 280 }} src={NoRequetsFound} alt="Placeholder" />
                  </div>
                </div>
              </section>
              <a
                className="button is-success"
                onClick={(e) => {
                  e.preventDefault();
                  switchRoute(ROUTES.CLIENT.REQUESTER.root);
                }}
              >
                Browse Our Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
