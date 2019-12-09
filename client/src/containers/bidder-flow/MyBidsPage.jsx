import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';
import TaskerVerificationBanner from './TaskerVerificationBanner.jsx';
import { allMyPostedBids } from '../../app-state/actions/bidsActions';
import { updateBidState, deleteOpenBid, updateBid } from '../../app-state/actions/bidsActions';
import { BID_STATES } from '../../bdb-tasks/index';
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
    this.props.allMyPostedBids();
  }
  // OPEN: 'OPEN',
  // AWARDED: 'AWARDED',
  // AWARDED_SEEN: 'AWARDED_SEEN',
  // AWARDED_BID_CANCELED_BY_TASKER: 'AWARDED_BID_CANCELED_BY_TASKER',
  // DISPUTED: 'DISPUTED',
  // AWARDED_BID_CANCELED_BY_REQUESTER: 'AWARDED_BID_CANCELED_BY_REQUESTER',
  // AWARDED_BID_CANCELED_BY_REQUESTER_SEEN: 'AWARDED_BID_CANCELED_BY_REQUESTER_SEEN',
  // DONE: 'DONE',
  // PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  // PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  // ARCHIVE: 'ARCHIVE',
  // DISPUTE_RESOLVED: 'DISPUTE_RESOLVED',

  render() {
    const { isLoading, openBidsList, deleteOpenBid, updateBid } = this.props;
    const { selectedTab } = this.state;
    const areThereAnyBidsToView = openBidsList && openBidsList.length > 0;

    let myBidsSummaryCards = areThereAnyBidsToView
      ? openBidsList
          .filter((bid) => {
            if (selectedTab === MY_BIDS_TABS.pastBids) {
              return [
                BID_STATES.PAYMENT_RELEASED,
                BID_STATES.ARCHIVE,
                BID_STATES.DISPUTE_RESOLVED,
                BID_STATES.AWARDED_BID_CANCELED_BY_REQUESTER_SEEN,
                BID_STATES.AWARDED_BID_CANCELED_BY_TASKER,
                BID_STATES.DONE,
              ].includes(bid.state);
            }
            return [
              BID_STATES.OPEN,
              BID_STATES.AWARDED,
              BID_STATES.AWARDED_SEEN,
              BID_STATES.DISPUTED,
              BID_STATES.AWARDED_BID_CANCELED_BY_REQUESTER,
              BID_STATES.PAYMENT_TO_BANK_FAILED,
            ].includes(bid.state);
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
        <Spinner renderLabel="getting your bids..." isLoading={isLoading} size={'large'} />

        {!isLoading && (
          <>
            <div className="tabs is-centered is-fullwidth">
              <ul>
                <li className={`${selectedTab === MY_BIDS_TABS.activeBids ? 'is-active' : ''}`}>
                  <a onClick={() => this.setState({ selectedTab: MY_BIDS_TABS.activeBids })}>
                    Active Bids
                  </a>
                </li>
                <li className={`${selectedTab === MY_BIDS_TABS.pastBids ? 'is-active' : ''}`}>
                  <a onClick={() => this.setState({ selectedTab: MY_BIDS_TABS.pastBids })}>
                    Past Bids
                  </a>
                </li>
              </ul>
            </div>
            <div className="columns is-multiline is-centered is-mobile">{myBidsSummaryCards}</div>
          </>
        )}

        {!isLoading && !areThereAnyBidsToView && <EmptyStateComponent />}
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
    allMyPostedBids: bindActionCreators(allMyPostedBids, dispatch),
    updateBidState: bindActionCreators(updateBidState, dispatch),
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
