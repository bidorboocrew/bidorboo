import React from 'react';
import * as ROUTES from '../../constants/frontend-route-consts';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';

import { getMyOpenBids } from '../../app-state/actions/bidsActions';
import OpenBidDetailsCard from '../../components/bidder-components/OpenBidDetailsCard';
import { switchRoute } from '../../utils';

class MyBids extends React.Component {
  componentDidMount() {
    // get all posted bids
    this.props.a_getAllPostedBids();
  }

  render() {
    const { isLoading, openBidsList } = this.props;

    const bidsListComponent =
      openBidsList && openBidsList.length > 0 ? (
        openBidsList.map((bidDetails) => {
          return (
            <OpenBidDetailsCard
              key={bidDetails._id}
              bidDetails={bidDetails}
            />
          );
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div className="slide-in-left" id="bdb-bidder-my-bids">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#F0A6CA' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Posted Offers
              </h1>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
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

const mapStateToProps = ({ bidsReducer }) => {
  return {
    openBidsList: bidsReducer.openBidsList,
    isLoading: bidsReducer.isLoadingBids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllPostedBids: bindActionCreators(getMyOpenBids, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
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
              className="button is-primary is-large"
              onClick={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            >
              Offer A Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
