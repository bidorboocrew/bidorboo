import React from 'react';
import * as ROUTES from '../../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import OpenBidDetailsCard from '../../components/bidder-components/OpenBidDetailsCard';
import { switchRoute } from '../../utils';
import AwardedBidDetailsCard from '../../components/bidder-components/AwardedBidDetailsCard';
import { getMyAwardedBids, updateBidState } from '../../app-state/actions/bidsActions';

class MyBids extends React.Component {
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
          return <OpenBidDetailsCard key={bidDetails._id} bidDetails={bidDetails} />;
        })
      ) : (
        <EmptyStateComponent />
      );

    const awardedBidsListComponent =
      awardedBidsList && awardedBidsList.length > 0 ? (
        awardedBidsList.map((bidDetails) => {
          return (
            <AwardedBidDetailsCard
              key={bidDetails._id}
              bidDetails={bidDetails}
              notificationFeed={notificationFeed}
              updateBidState={a_updateBidState}
            />
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div id="bdb-bidder-my-bids">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Bids
              </h1>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container is-fluid">
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>Awarded Bids</a>
                </li>
              </ul>
            </div>

            {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
            {!isLoading && <React.Fragment>{awardedBidsListComponent}</React.Fragment>}
          </div>
        </section>

        <section className="section">
          <div className="container is-fluid">
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>Pending</a>
                </li>
              </ul>
            </div>
            {isLoading && <Spinner isLoading={isLoading} size={'large'} />}
            {!isLoading && <React.Fragment>{pendingBidsList}</React.Fragment>}
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
)(MyBids);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">You have not bid yet click here to start bidding!</div>
            <br />
            <a
              className="button is-primary "
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
