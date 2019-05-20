import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import { updateBidState, deleteOpenBid } from '../../app-state/actions/bidsActions';

import MyBidsOpenBid from './components/MyBidsOpenBid';
import MyBidsAwardedBid from './components/MyBidsAwardedBid';

class MyBidsPage extends React.Component {
  componentDidMount() {
    // get all posted bids
    this.props.getMyOpenBids();
  }

  render() {
    const {
      isLoading,
      openBidsList,
      awardedBidsList,
      notificationFeed,
      updateBidState,
      deleteOpenBid,
    } = this.props;

    const pendingBidsList =
      openBidsList && openBidsList.length > 0 ? (
        openBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column limitMaxdWidth">
              <MyBidsOpenBid
                deleteOpenBid={deleteOpenBid}
                key={bidDetails._id}
                bidDetails={bidDetails}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    const awardedBidsListComponent =
      awardedBidsList && awardedBidsList.length > 0 ? (
        awardedBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column limitMaxdWidth">
              <MyBidsAwardedBid
                bidDetails={bidDetails}
                notificationFeed={notificationFeed}
                updateBidState={updateBidState}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div className="container is-widescreen">
        <FloatingAddNewBidButton />

        <div className="container is-widescreen">
          <Spinner isLoading={isLoading} size={'large'} />
          {!isLoading && (
            <div className="columns is-multiline is-centered">{awardedBidsListComponent}</div>
          )}
        </div>
        <br />
        <div className="container is-widescreen">
          <Spinner isLoading={isLoading} size={'large'} />
          {!isLoading && <div className="columns is-multiline is-centered">{pendingBidsList}</div>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer, uiReducer }) => {
  return {
    openBidsList: bidsReducer.openBidsList,
    isLoading: bidsReducer.isLoadingBids,
    awardedBidsList: bidsReducer.awardedBidsList,
    notificationFeed: uiReducer.notificationFeed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getMyOpenBids: bindActionCreators(getMyOpenBids, dispatch),
    updateBidState: bindActionCreators(updateBidState, dispatch),
    deleteOpenBid: bindActionCreators(deleteOpenBid, dispatch),
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
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no bids. Start bidding to earn money!</div>
            <br />
            <a
              className="button is-success "
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              Bid
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
      <span className="icon">+ </span>
    </a>
  );
};
