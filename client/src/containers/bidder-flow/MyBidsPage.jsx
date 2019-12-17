import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';
import TaskerVerificationBanner from './TaskerVerificationBanner.jsx';
import { getMyPostedBidsSummary } from '../../app-state/actions/bidsActions';
import { deleteOpenBid, updateBid } from '../../app-state/actions/bidsActions';
import { REQUEST_STATES } from '../../bdb-tasks/index';
import { getMeTheRightBidCard } from '../../bdb-tasks/getMeTheRightCard';
const MY_BIDS_TABS = {
  activeBids: 'activeBids',
  pastBids: 'pastBids',
};
class MyBidsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: MY_BIDS_TABS.activeBids,
    };
  }
  componentDidMount() {
    // get all posted bids
    this.props.getMyPostedBidsSummary();
  }

  render() {
    const { isLoading, openBidsList, deleteOpenBid, updateBid } = this.props;
    const { selectedTab } = this.state;
    const areThereAnyBidsToView = openBidsList && openBidsList.length > 0;

    let pastBids = areThereAnyBidsToView
      ? openBidsList
          .filter((bid) => {
            const { _jobRef: job } = bid;
            return [
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER_SEEN,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.ARCHIVE,
            ].includes(job.state);
          })
          .map((bid) => {
            return (
              <div key={bid._id} className="column is-narrow isforCards slide-in-bottom-small">
                {getMeTheRightBidCard({
                  bid: bid,
                  isSummaryView: true,
                  updateBid,
                  deleteOpenBid,
                })}
              </div>
            );
          })
      : null;

    let activeBids = areThereAnyBidsToView
      ? openBidsList
          .filter((bid) => {
            const { _jobRef: job } = bid;
            return [
              REQUEST_STATES.OPEN,
              REQUEST_STATES.AWARDED,
              REQUEST_STATES.AWARDED_SEEN,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_BIDDER,
              REQUEST_STATES.AWARDED_JOB_CANCELED_BY_REQUESTER,
              REQUEST_STATES.DISPUTED,
              REQUEST_STATES.DONE,
            ].includes(job.state);
          })
          .map((bid) => {
            return (
              <div key={bid._id} className="column is-narrow isforCards slide-in-bottom-small">
                {getMeTheRightBidCard({
                  bid: bid,
                  isSummaryView: true,
                  updateBid,
                  deleteOpenBid,
                })}
              </div>
            );
          })
      : null;

    let myBidsSummaryCards = null;
    if (areThereAnyBidsToView) {
      if (selectedTab === MY_BIDS_TABS.pastBids) {
        myBidsSummaryCards = pastBids;
      } else {
        myBidsSummaryCards = activeBids;
      }
    }

    return (
      <div>
        <TaskerVerificationBanner></TaskerVerificationBanner>

        <section className="hero is-dark is-bold">
          <div className="hero-body  has-text-centered">
            <div className="container">
              <h1 style={{ marginBottom: 0 }} className="has-text-white title">
                Bids Inbox
              </h1>
            </div>
          </div>
        </section>
        <div className="tabs is-centered is-fullwidth">
          <ul>
            <li className={`${selectedTab === MY_BIDS_TABS.activeBids ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_BIDS_TABS.activeBids })}>
                {`Active Bids (${activeBids ? activeBids.length : 0})`}
              </a>
            </li>
            <li className={`${selectedTab === MY_BIDS_TABS.pastBids ? 'is-active' : ''}`}>
              <a onClick={() => this.setState({ selectedTab: MY_BIDS_TABS.pastBids })}>
                {`Past Bids (${pastBids ? pastBids.length : 0})`}
              </a>
            </li>
          </ul>
        </div>
        {isLoading && (
          <Spinner renderLabel="getting your bids..." isLoading={isLoading} size={'large'} />
        )}
        {!isLoading &&
          areThereAnyBidsToView &&
          myBidsSummaryCards &&
          myBidsSummaryCards.length > 0 && (
            <div className="columns is-multiline is-centered is-mobile">{myBidsSummaryCards}</div>
          )}
        {!isLoading &&
          (!areThereAnyBidsToView || !myBidsSummaryCards || !(myBidsSummaryCards.length > 0)) && (
            <EmptyStateComponent />
          )}
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, uiReducer, userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
    openBidsList: bidsReducer.openBidsList,
    isLoading: bidsReducer.isLoadingBids,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMyPostedBidsSummary: bindActionCreators(getMyPostedBidsSummary, dispatch),
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyBidsPage);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content VerticalAligner">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no bids. Start bidding to earn money!</div>
            <br />
            <a
              className="button is-success"
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              View Requested Tasks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingAddNewBidButton = () => {
  return (
    <a
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        switchRoute(ROUTES.CLIENT.BIDDER.root);
      }}
      className="button is-success bdbFloatingButtonText"
    >
      <span style={{ fontSize: 24 }} className="icon">
        <i className="fas fa-search-dollar" />
      </span>
    </a>
  );
};
