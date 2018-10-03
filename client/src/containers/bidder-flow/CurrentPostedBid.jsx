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
// import { Proptypes_bidModel } from '../../client-server-interfaces';

class CurrentPostedBid extends React.Component {


  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { s_recentlyUpdatedBid, s_currentUserDetails } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav
            style={{ marginLeft: '1rem' }}
            className="breadcrumb"
            aria-label="breadcrumbs"
          >
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
            <JobAndBidsDetailView
              currentUser={s_currentUserDetails}
              job={s_recentlyUpdatedBid._job}
            />
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ bidsReducer, userModelReducer }) => {
  return {
    s_recentlyUpdatedBid: bidsReducer.recentlyUpdatedBid,
    s_isLoading: bidsReducer.isLoadingBids,
    s_currentUserDetails: userModelReducer.userDetails
  };
};

export default connect(
  mapStateToProps,
  null
)(CurrentPostedBid);
