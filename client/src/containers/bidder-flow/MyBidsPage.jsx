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
    const { isLoading, openBidsList, deleteOpenBid, updateBid } = this.props;

    const areThereAnyBidsToView = openBidsList && openBidsList.length > 0;

    // const awardedBidsListComponent =
    //   awardedBidsList && awardedBidsList.length > 0 ? (
    //     awardedBidsList.map((bidDetails) => {
    //       return (
    //         <div key={bidDetails._id} className="column">
    //           <MyBidsAwardedBid
    //             bidDetails={bidDetails}
    //             notificationFeed={notificationFeed}
    //             updateBidState={updateBidState}
    //           />
    //         </div>
    //       );
    //     })
    //   ) : (
    //     <EmptyStateComponent />
    //   );

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
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">My Bids</h1>
            </div>
          </div>
        </section>
        <hr className="divider" />
        <FloatingAddNewBidButton />

        <Spinner renderLabel="getting your bids..." isLoading={isLoading} size={'large'} />

        {!isLoading && (
          <div className="columns forJobSummary is-multiline is-centered">{myBidsSummaryCards}</div>
        )}

        {!isLoading && !areThereAnyBidsToView && <EmptyStateComponent />}
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, uiReducer }) => {
  return {
    openBidsList: bidsReducer.openBidsList,
    isLoading: bidsReducer.isLoadingBids,
    // awardedBidsList: bidsReducer.awardedBidsList,
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
