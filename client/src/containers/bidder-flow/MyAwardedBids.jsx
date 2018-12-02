import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';
import AwardedBidDetailsCard from '../../components/bidder-components/AwardedBidDetailsCard';

import { getMyAwardedBids, updateBidState } from '../../app-state/actions/bidsActions';
import { switchRoute } from '../../utils';
class MyAwardedBids extends React.Component {
  componentDidMount() {
    this.props.a_getMyAwardedBids();
  }

  render() {
    const { isLoading, awardedBidsList, notificationFeed, a_updateBidState } = this.props;

    const bidsListComponent =
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
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Scheduled Work
              </h1>
            </div>
          </div>
        </section>
        <section className="bdbPage">
          {isLoading && (
            <div className="container">
              <Spinner isLoading={isLoading} size={'large'} />
            </div>
          )}
          {!isLoading && <div className="container">{bidsListComponent}</div>}
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ bidsReducer, uiReducer }) => {
  return {
    awardedBidsList: bidsReducer.awardedBidsList,
    isLoading: bidsReducer.isLoadingBids,
    notificationFeed: uiReducer.notificationFeed,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
    a_updateBidState: bindActionCreators(updateBidState, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyAwardedBids);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no scheduled work. start bidding!</div>
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
