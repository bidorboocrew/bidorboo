import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { switchRoute } from '../../utils';
import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import { getMyAwardedBids, updateBidState } from '../../app-state/actions/bidsActions';

import MyBidsOpenBid from './components/MyBidsOpenBid';
import MyBidsAwardedBid from './components/MyBidsAwardedBid';

class MyBidsPage extends React.Component {
  componentDidMount() {
    // get all posted bids
    this.props.a_getAllPostedBids();
    this.props.a_getMyAwardedBids();
  }

  render() {
    const {
      isLoading,
      openBidsList,
      awardedBidsList,
      notificationFeed,
      a_updateBidState,
    } = this.props;

    const pendingBidsList =
      openBidsList && openBidsList.length > 0 ? (
        openBidsList.map((bidDetails) => {
          return (
            <div key={bidDetails._id} className="column">
              <MyBidsOpenBid key={bidDetails._id} bidDetails={bidDetails} />
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
            <div key={bidDetails._id} className="column">
              <MyBidsAwardedBid
                bidDetails={bidDetails}
                notificationFeed={notificationFeed}
                updateBidState={a_updateBidState}
              />
            </div>
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div id="bdb-bidder-my-bids">
        <section className="section">
          <div className="container">
            <div style={{ background: '#23d160' }} className="tabs is-medium is-centered">
              <ul>
                <li>
                  <a className="has-text-white has-text-weight-bold">
                    {`Awarded Bids  (${(awardedBidsList && awardedBidsList.length) || 0})`}
                  </a>
                </li>
              </ul>
            </div>

            {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
            {!isLoading && (
              <div className="columns is-multiline is-mobile is-centered">
                {awardedBidsListComponent}
              </div>
            )}
          </div>
        </section>

        <section style={{ paddingTop: 0 }} className="section">
          <div className="container">
            <div style={{ background: '#ffdd57' }} className="tabs is-medium is-centered">
              <ul>
                <li>
                  <a className="has-text-dark has-text-weight-bold">
                    {`Pending Bids  (${(pendingBidsList && pendingBidsList.length) || 0})`}
                  </a>
                </li>
              </ul>
            </div>
            {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
            {!isLoading && (
              <div className="columns is-multiline is-mobile is-centered">{pendingBidsList} </div>
            )}
          </div>
        </section>
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
    a_getAllPostedBids: bindActionCreators(getMyOpenBids, dispatch),
    a_getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
    a_updateBidState: bindActionCreators(updateBidState, dispatch),
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
