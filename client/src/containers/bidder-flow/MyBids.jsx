import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../../components/Spinner';

import { getAllMyBids, updateRecentBid } from '../../app-state/actions/bidsActions';
import BidDetailsCard from '../../components/bidder-components/BidDetailsCard';

class MyBids extends React.Component {
  componentDidMount() {
    // get all posted bids
    this.props.a_getAllPostedBids();
  }

  render() {
    const { isLoading, bidsList, a_updateRecentBid } = this.props;

    const bidsListComponent =
      bidsList && bidsList.length > 0 ? (
        bidsList.map((bidDetails) => {
          return (
            <BidDetailsCard
              onShowFullDetails={a_updateRecentBid}
              key={bidDetails._id}
              bidDetails={bidDetails}
            />
          );
        })
      ) : (
        <div>You have not bid yet click here to start bidding</div>
      );

    return (
      <div className="slide-in-left" id="bdb-bidder-my-bids">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#F0A6CA' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Bids
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
    bidsList: bidsReducer.bidsList,
    isLoading: bidsReducer.isLoadingBids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllPostedBids: bindActionCreators(getAllMyBids, dispatch),
    a_updateRecentBid: bindActionCreators(updateRecentBid, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyBids);
