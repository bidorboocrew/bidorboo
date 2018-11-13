import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { Spinner } from '../../components/Spinner';
import AwardedBidDetailsCard from '../../components/bidder-components/AwardedBidDetailsCard';

import { getMyAwardedBids } from '../../app-state/actions/bidsActions';
import { switchRoute } from '../../utils';
class MyAwardedBids extends React.Component {
  componentDidMount() {
    this.props.a_getMyAwardedBids();
  }

  render() {
    const { isLoading, awardedBidsList } = this.props;

    const bidsListComponent =
      awardedBidsList && awardedBidsList.length > 0 ? (
        awardedBidsList.map((bidDetails) => {
          return <AwardedBidDetailsCard key={bidDetails._id} bidDetails={bidDetails} />;
        })
      ) : (
        <EmptyStateComponent />
      );

    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#F0A6CA' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Upcoming Appointments
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
    awardedBidsList: bidsReducer.awardedBidsList,
    isLoading: bidsReducer.isLoadingBids,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getMyAwardedBids: bindActionCreators(getMyAwardedBids, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAwardedBids);

const EmptyStateComponent = () => {
  return (
    <div className="HorizontalAligner-center column">
      <div className="card is-fullwidth">
        <div className="card-content">
          <div className="content has-text-centered">
            <div className="is-size-5">You have no upcoming appointments. start bidding!</div>
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
