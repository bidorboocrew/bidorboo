import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../app-state/actions/routerActions';

import { bindActionCreators } from 'redux';

import MyCurrentBidCardWithDetails from '../../components/bidder-components/MyCurrentBidCardWithDetails';
import { Proptypes_bidModel } from '../../client-server-interfaces';

class CurrentPostedBid extends React.Component {
  static propTypes = {
    s_recentlyUpdatedBid: Proptypes_bidModel
  };
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const { a_switchRoute, s_recentlyUpdatedBid } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    a_switchRoute(ROUTES.CLIENT.BIDDER.mybids);
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
                <MyCurrentBidCardWithDetails bidDetails={s_recentlyUpdatedBid} />
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

const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentPostedBid);
