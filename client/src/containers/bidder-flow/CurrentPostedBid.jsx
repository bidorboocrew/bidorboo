/**
 * This will handle showing details of the bid when user
 * - selects 1 bid
 * - posts a new bid
 */

import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../../constants/frontend-route-consts';

import { switchRoute } from '../../utils';

import PostedBidConfirmationCard from '../../components/bidder-components/PostedBidConfirmationCard';
import { Proptypes_bidModel } from '../../client-server-interfaces';

class CurrentPostedBid extends React.Component {
  static propTypes = {
    s_recentlyUpdatedBid: Proptypes_bidModel
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { s_recentlyUpdatedBid } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.mybids);
                  }}
                >
                  My Bids
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Current Bid</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer slide-in-left">
          <div className="container" id="bdb-proposer-content">
            <div className="columns">
              <div className="column is-8 is-offset-2">
                <PostedBidConfirmationCard bidDetails={s_recentlyUpdatedBid} />
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ bidsReducer }) => {
  return {
    s_recentlyUpdatedBid: bidsReducer.recentlyUpdatedBid,
    s_isLoading: bidsReducer.isLoadingBids
  };
};

export default connect(
  mapStateToProps,
  null
)(CurrentPostedBid);
