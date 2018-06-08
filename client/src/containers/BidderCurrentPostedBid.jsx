import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Spinner } from '../components/Spinner';
import { switchRoute } from '../app-state/actions/routerActions';

import { getAllMyBids } from '../app-state/actions/bidsActions';
import { Proptypes_bidModel } from '../client-server-interfaces';
import MyBidsCard from '../components/MyBidsCard'
class BidderCurrentPostedBid extends React.Component {
  static propTypes = {
    s_isLoading: PropTypes.bool,
    s_bidsList: PropTypes.arrayOf(Proptypes_bidModel)
  };
  componentDidMount() {
    window.scrollTo(0, 0);
    // get all posted bids
    this.props.a_getAllPostedBids();
  }

  render() {
    const { s_isLoading, s_bidsList } = this.props;

    const bidsList =
      s_bidsList && s_bidsList.length > 0 ? (
        s_bidsList.map(bidDetails => {
          return <MyBidsCard key={bidDetails._id} bidDetails={bidDetails} />;
        })
      ) : (
        <div>You have not bid yet click here to start bidding</div>
      );

    return (
      <div className="slide-in-left" id="bdb-bidder-my-bids">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#c786f8' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Bids
              </h1>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          {s_isLoading && (
            <div className="container">
              <Spinner isLoading={s_isLoading} size={'large'} />
            </div>
          )}
          {!s_isLoading && <div className="container">{bidsList}</div>}
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ bidsReducer }) => {
  return {
    s_bidsList: bidsReducer.bidsList,
    s_isLoading: bidsReducer.isLoadingBids
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_getAllPostedBids: bindActionCreators(getAllMyBids, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BidderCurrentPostedBid);
