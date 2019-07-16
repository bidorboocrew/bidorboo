import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';

import { allMyPostedBids } from '../../app-state/actions/bidsActions';
import { updateBidState, deleteOpenBid, updateBid } from '../../app-state/actions/bidsActions';

import { getMeTheRightBidCard, POINT_OF_VIEW } from '../../bdb-tasks/getMeTheRightCard';

class MyBidsPage extends React.Component {
  componentDidMount() {
    // get all posted bids
    this.props.allMyPostedBids();
  }

  render() {
    const {
      isLoading,
      openBidsList,
      deleteOpenBid,
      updateBid,
      userDetails,
      isLoggedIn,
    } = this.props;

    const areThereAnyBidsToView = openBidsList && openBidsList.length > 0;

    const didUserSetupABankAccount =
      userDetails.stripeConnect && userDetails.stripeConnect.last4BankAcc;
    const isBankVerified =
      userDetails.stripeConnect &&
      userDetails.stripeConnect.last4BankAcc &&
      userDetails.stripeConnect.isVerified;

    let myBidsSummaryCards = areThereAnyBidsToView
      ? openBidsList.map((bid) => {
          return (
            <div key={bid._id} className="column">
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
        <div
          style={{ background: 'transparent', marginBottom: 0 }}
          className="tabs is-large is-centered"
        >
          <ul style={{ borderBottom: 'none', paddingTop: '2rem' }}>
            <li>
              <a>
                {/* <span className="icon is-large">
                  <i className="fas fa-money-check-alt" aria-hidden="true" />
                </span> */}
                <span>MY BIDS</span>
              </a>
            </li>
          </ul>
        </div>
        {/* {isLoggedIn && !didUserSetupABankAccount && !isBankVerified && (
                <div>
                  <div
                    style={{ marginBottom: 4 }}
                    className="subtitle has-text-weight-bold has-text-link"
                  >
                    Setup your payout banking info to get your payments on time
                  </div>
                  <a
                    className="button is-link"
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                    }}
                  >
                    Add Banking Info
                  </a>
                </div>
              )}
              {isLoggedIn && didUserSetupABankAccount && !isBankVerified && (
                <div>
                  <h3 className="subtitle has-text-weight-bold">
                    Check on your verification status to get your payments on time
                  </h3>
                  <a
                    className="button is-link"
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.MY_PROFILE.paymentSettings);
                    }}
                  >
                    Payment Settings
                  </a>
                </div>
              )} */}

        {/* <FloatingAddNewBidButton /> */}

        <Spinner renderLabel="getting your bids..." isLoading={isLoading} size={'large'} />

        {!isLoading && (
          <div className="columns forJobSummary is-multiline is-centered">{myBidsSummaryCards}</div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyBidsPage);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content VerticalAligner">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no bids. Start bidding to earn money!</div>
            <br />
            <a
              className="button is-success is-outlined"
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
