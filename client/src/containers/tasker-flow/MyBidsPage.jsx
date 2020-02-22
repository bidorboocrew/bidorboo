import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';
import TaskerVerificationBanner from './TaskerVerificationBanner';
import { getMyPostedBidsSummary } from '../../app-state/actions/bidsActions';
import { deleteOpenBid, updateBid } from '../../app-state/actions/bidsActions';
import { REQUEST_STATES } from '../../bdb-tasks/index';
import { getMeTheRightBidCard } from '../../bdb-tasks/getMeTheRightCard';
import NoBidsFound from '../../assets/images/NoBidsFound.png';

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
    const { isLoading, postedBidsSummary, deleteOpenBid, updateBid } = this.props;
    const { selectedTab } = this.state;
    const areThereAnyBidsToView = postedBidsSummary && postedBidsSummary.length > 0;

    let pastBids = areThereAnyBidsToView
      ? postedBidsSummary
          .filter((bid) => {
            const { _requestRef: request } = bid;
            return [
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_TASKER_SEEN,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.AWARDED_REQUEST_CANCELED_BY_REQUESTER_SEEN,
              REQUEST_STATES.DISPUTE_RESOLVED,
              REQUEST_STATES.ARCHIVE,
            ].includes(request.state);
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
      ? postedBidsSummary
          .filter((bid) => {
            const { _requestRef: request } = bid;
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

        {/* <section className="hero is-white is-small">
          <div className="hero-body  has-text-centered">
            <div className="container">
              <h1 className="subtitle">Check Bids' status</h1>
            </div>
          </div>
        </section> */}
        <div className="tabs is-centered">
          <ul style={{ background: '#eee', paddingTop: '1rem' }}>
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
        {isLoading && <Spinner renderLabel="getting your bids..." isLoading size={'large'} />}
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
    postedBidsSummary: bidsReducer.postedBidsSummary,
    isLoading: bidsReducer.isLoadingBids,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getMyPostedBidsSummary: bindActionCreators(getMyPostedBidsSummary, dispatch),
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
    updateBid: bindActionCreators(updateBid, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyBidsPage);

const EmptyStateComponent = () => (
  <>
    <div className="HorizontalAligner-center column fade-in">
      <div className="is-fullwidth">
        <div>
          <div className="card-content VerticalAligner">
            <div className="has-text-centered">
              <div className="is-size-4">
                You don't have any bids here. Start bidding to earn money!
              </div>
              <section style={{ padding: 0 }} className="hero is-small has-text-centered fade-in">
                <div style={{ padding: 0 }} className="hero-body">
                  <div className="container has-text-centered">
                    <img style={{ width: 280 }} src={NoBidsFound} alt="Placeholder" />
                  </div>
                </div>
              </section>
              <a
                className="button is-success"
                onClick={(e) => {
                  e.preventDefault();
                  switchRoute(ROUTES.CLIENT.TASKER.root);
                }}
              >
                Explore Tasks In Your Area
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
