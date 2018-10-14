/**
 * This will handle showing details of the bid when user
 * - selects 1 bid
 * - posts a new bid
 */

import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../../constants/frontend-route-consts';

import { switchRoute } from '../../utils';

import JobAndBidsDetailView from '../../components/JobAndBidsDetailView';

class CurrentPostedBid extends React.Component {
  render() {
    const { recentlyUpdatedBid, currentUserDetails } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav style={{ marginLeft: '1rem' }} className="breadcrumb" aria-label="breadcrumbs">
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
          <JobAndBidsDetailView currentUser={currentUserDetails} job={recentlyUpdatedBid} />
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ bidsReducer, userModelReducer }) => {
  return {
    recentlyUpdatedBid: bidsReducer.recentlyUpdatedBid,
    isLoading: bidsReducer.isLoadingBids,
    currentUserDetails: userModelReducer.userDetails,
  };
};

export default connect(
  mapStateToProps,
  null
)(CurrentPostedBid);
